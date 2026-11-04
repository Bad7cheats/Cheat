# Anti-Detection — práticas e setup

## O que o hub já faz

1. **Nome aleatório do ScreenGui** — a cada execução, o `Root.Name` é um número random. Scanners de GUI procurando por "Bad" ou "BadGui" não acham.
2. **gethui()** — quando o executor suporta, coloca o GUI num container escondido do Workspace do jogo.
3. **syn.protect_gui()** — fallback pra quem usa Synapse.
4. **DisplayOrder 999999** — fica acima de qualquer CoreGui do jogo, incluindo detectores visuais.
5. **IgnoreGuiInset** — não respeita margens, evita que códigos de anti-cheat que verificam elementos UI em posições específicas detectem.
6. **Hooks lazy** — Silent Aim SÓ cria o hook quando toggle liga. Sem detecção de __index modificado quando desligado.
7. **Loop de pull defensivo** — cheques anti-duplicata, evita que anti-cheats detectem tools com nomes duplicados.
8. **HWID único** — gravado em `Bad/hwid.txt`, 32 chars hex random.

## O que você deve fazer (opcional avançado)

### 1. Obfuscação Lua

Após editar `bad_v9.lua`, passe por:
- https://luaobfuscator.com (grátis, output pesado)
- https://moonsec.com (pago, mais forte)

Upload o arquivo → baixa versão ofuscada → cola no gist. Quem abrir o raw vê gibberish.

### 2. Mirrors rotativos

O arquivo `loader_rotativo.lua` tenta 3 mirrors em sequência.
Hospede em:
- **Gist** (principal)
- **GitHub repo** (backup — mais estável)
- **Catbox.moe** (anônimo, backup final)

Se um cair, os outros assumem.

### 3. Cache buster

O loader rotativo já adiciona `?t=TICK` em cada URL. Força o executor a buscar versão nova, nunca cache antigo.

### 4. Mudar nomes de função/variável

Antes de ofuscar, considere renomear:
- `State` → `_s`
- `pullAllWeapons` → `_pa`
- `getTarget` → `_gt`

Scanners estáticos procuram essas strings.

### 5. Backend HWID lock (já implementado)

No `server.js` função `/login`, há check de HWID. Para ativar bloqueio:
- Descomente a linha: `// return res.status(403).json({ error: 'HWID diferente — key ligada a outro PC' });`
- Agora cada key fica trancada ao PC que registrou primeiro.

### 6. Rate limiting (opcional avançado)

Adicione ao `server.js`:
```bash
npm install express-rate-limit
```

```js
const rateLimit = require('express-rate-limit');
app.use('/login', rateLimit({ windowMs: 60*1000, max: 10 })); // 10 tentativas/min
app.use('/register', rateLimit({ windowMs: 60*60*1000, max: 3 }));
```

### 7. HTTPS obrigatório

Railway já serve HTTPS por padrão. Sempre use URL com `https://` no hub.

### 8. Discord webhook separado

Crie um webhook PRIVADO (não o mesmo que você usa publicamente) pra receber logs sensíveis:
- vendas
- logins suspeitos (HWID mismatch)
- bans aplicados

## O que você NÃO pode fazer com Lua

- **Bypassar Hyperion/Byfron** — isso é nível de kernel driver, fora do escopo de executores Lua.
- **Esconder o cheat de anticheat server-side do jogo** — se o jogo tem checks (velocidade, teleport, hits impossíveis), o anticheat vê. Único mitigador: mudanças sutis (WalkSpeed 30 ao invés de 500, teleport curto ao invés de longo).
- **Esconder do próprio executor logs** — logs do executor são compartilhados, não dependem do hub.

## Realidade

Sua "indetecção" é por conta do executor (Solara, Xeno). O hub colabora sendo discreto. Mas nenhum cheat Lua Roblox é 100% indetectável — é sobre reduzir a superfície de detecção.
