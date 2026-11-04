require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const db = new Database('bad.db');
db.exec(`
CREATE TABLE IF NOT EXISTS keys (
  k TEXT PRIMARY KEY,
  dur TEXT,
  exp INTEGER,
  used_by TEXT,
  created INTEGER,
  hwid TEXT
);
CREATE TABLE IF NOT EXISTS users (
  u TEXT PRIMARY KEY,
  pass TEXT,
  key TEXT,
  exp INTEGER,
  created INTEGER,
  banned INTEGER DEFAULT 0,
  hwid TEXT
);
`);

const ADMIN = process.env.ADMIN_TOKEN;
const HOOK  = process.env.WEBHOOK_URL;

function hash(s){ return crypto.createHash('sha256').update(s).digest('hex'); }
function genKey(){
  const alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'BAD';
  for (let g=0;g<4;g++){ out += '-'; for (let i=0;i<5;i++) out += alpha[Math.floor(Math.random()*alpha.length)]; }
  return out;
}
const DURS = { '24h':86400, '3d':259200, '7d':604800, '1mes':2592000 };

function admin(req){ return req.headers['x-admin-token'] === ADMIN; }

async function sendWebhook(embed){
  if (!HOOK) return;
  try {
    await fetch(HOOK, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ embeds:[embed] })
    });
  } catch(e){ console.error('webhook fail', e.message); }
}

// ================== KEY ROUTES ==================
app.post('/key/gen', async (req, res) => {
  if (!admin(req)) return res.status(401).json({ error: 'unauthorized' });
  const { dur='24h' } = req.body || {};
  const secs = DURS[dur]; if (!secs) return res.status(400).json({ error: 'duracao invalida' });
  const k = genKey();
  const exp = Math.floor(Date.now()/1000) + secs;
  db.prepare('INSERT INTO keys (k, dur, exp, created) VALUES (?, ?, ?, ?)').run(k, dur, exp, Math.floor(Date.now()/1000));
  await sendWebhook({
    title: 'Nova KEY gerada',
    color: 15094296,
    fields: [
      { name:'Key', value:'```'+k+'```' },
      { name:'Duracao', value:dur, inline:true },
      { name:'Expira', value:'<t:'+exp+':R>', inline:true },
    ],
    timestamp: new Date().toISOString(),
  });
  res.json({ ok:true, key:k, exp });
});

app.get('/key/list', (req, res) => {
  if (!admin(req)) return res.status(401).json({ error: 'unauthorized' });
  res.json(db.prepare('SELECT * FROM keys ORDER BY created DESC LIMIT 500').all());
});

app.delete('/key/:k', (req, res) => {
  if (!admin(req)) return res.status(401).json({ error: 'unauthorized' });
  db.prepare('DELETE FROM keys WHERE k = ?').run(req.params.k);
  res.json({ ok:true });
});

// ================== REGISTER ==================
app.post('/register', (req, res) => {
  const { u, p, k, hwid } = req.body || {};
  if (!u || !p || !k) return res.status(400).json({ error: 'preencha u, p, k' });
  if (u.length < 3 || u.length > 16) return res.status(400).json({ error: 'usuario 3-16 chars' });
  if (p.length < 6) return res.status(400).json({ error: 'senha 6+ chars' });
  if (db.prepare('SELECT u FROM users WHERE u = ?').get(u)) return res.status(400).json({ error: 'usuario existe' });
  const row = db.prepare('SELECT * FROM keys WHERE k = ?').get(k);
  if (!row) return res.status(400).json({ error: 'key invalida' });
  if (row.used_by) return res.status(400).json({ error: 'key ja usada' });
  if (row.exp < Math.floor(Date.now()/1000)) return res.status(400).json({ error: 'key expirada' });
  db.prepare('UPDATE keys SET used_by = ?, hwid = ? WHERE k = ?').run(u, hwid||'', k);
  db.prepare('INSERT INTO users (u, pass, key, exp, created, hwid) VALUES (?, ?, ?, ?, ?, ?)').run(u, hash(p), k, row.exp, Math.floor(Date.now()/1000), hwid||'');
  res.json({ ok:true, user:u, exp:row.exp });
});

// ================== LOGIN ==================
app.post('/login', (req, res) => {
  const { u, p, hwid } = req.body || {};
  const row = db.prepare('SELECT * FROM users WHERE u = ?').get(u);
  if (!row) return res.status(401).json({ error: 'usuario nao existe' });
  if (row.banned) return res.status(403).json({ error: 'conta banida' });
  if (row.pass !== hash(p)) return res.status(401).json({ error: 'senha errada' });
  if (row.exp < Math.floor(Date.now()/1000)) return res.status(401).json({ error: 'conta expirada' });
  // HWID check (opcional): se diferente, loga mas aceita (ou rejeita, sua escolha)
  if (row.hwid && hwid && row.hwid !== hwid) {
    console.log(`[HWID MISMATCH] user=${u} saved=${row.hwid} got=${hwid}`);
    // comente a linha abaixo se quiser liberar troca de PC:
    // return res.status(403).json({ error: 'HWID diferente — key ligada a outro PC' });
  }
  const token = crypto.createHmac('sha256', ADMIN).update(u+':'+row.exp).digest('hex');
  res.json({ ok:true, user:u, exp:row.exp, token });
});

// ================== VALIDATE ==================
app.post('/validate', (req, res) => {
  const { u, token } = req.body || {};
  const row = db.prepare('SELECT * FROM users WHERE u = ?').get(u);
  if (!row) return res.status(401).json({ error: 'nao existe' });
  if (row.banned) return res.status(403).json({ error: 'banido' });
  const expect = crypto.createHmac('sha256', ADMIN).update(u+':'+row.exp).digest('hex');
  if (expect !== token) return res.status(401).json({ error: 'token invalido' });
  if (row.exp < Math.floor(Date.now()/1000)) return res.status(401).json({ error: 'expirado' });
  res.json({ ok:true, exp:row.exp });
});

// ================== SELLIX WEBHOOK ==================
app.post('/sellix/webhook', async (req, res) => {
  const dur = req.body?.product?.custom_fields?.dur || '24h';
  const email = req.body?.customer_email || 'unknown';
  const k = genKey();
  const exp = Math.floor(Date.now()/1000) + (DURS[dur] || 86400);
  db.prepare('INSERT INTO keys (k, dur, exp, created) VALUES (?, ?, ?, ?)').run(k, dur, exp, Math.floor(Date.now()/1000));
  await sendWebhook({
    title: 'Venda Sellix — key emitida',
    color: 5763719,
    fields: [
      { name:'Cliente', value:email },
      { name:'Key', value:'```'+k+'```' },
      { name:'Duracao', value:dur, inline:true },
    ],
    timestamp: new Date().toISOString(),
  });
  res.json({ ok:true, key:k, exp });
});

// ================== ADMIN TOOLS ==================
app.post('/user/ban', (req, res) => {
  if (!admin(req)) return res.status(401).json({ error: 'unauthorized' });
  db.prepare('UPDATE users SET banned = 1 WHERE u = ?').run(req.body.u);
  res.json({ ok:true });
});

app.post('/user/unban', (req, res) => {
  if (!admin(req)) return res.status(401).json({ error: 'unauthorized' });
  db.prepare('UPDATE users SET banned = 0 WHERE u = ?').run(req.body.u);
  res.json({ ok:true });
});

app.get('/user/list', (req, res) => {
  if (!admin(req)) return res.status(401).json({ error: 'unauthorized' });
  res.json(db.prepare('SELECT u, key, exp, created, banned, hwid FROM users ORDER BY created DESC LIMIT 500').all());
});

app.get('/', (req, res) => res.json({ service:'Bad Hub Backend', version:'1.0.0' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Bad backend listening on', PORT));
