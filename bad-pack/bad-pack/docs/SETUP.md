# Bad Hub — Setup Completo

## Passo 1 — Deploy do backend no Railway (5 min, grátis)

1. Crie uma conta em https://railway.app (login com GitHub).
2. Crie um repositório no GitHub com os arquivos da pasta `backend/`:
   - `package.json`
   - `server.js`
   - `railway.json`
   - `.env.example` (renomeie `.env` só em desenvolvimento local; no Railway as vars vão em outra tela)
   - `.gitignore`
3. No Railway: **New Project → Deploy from GitHub repo** → selecione o repo.
4. Em **Variables** adicione:
   - `ADMIN_TOKEN` = uma string longa e secreta (ex: `d93hd93h2093h203hd092hd092hd09`)
   - `WEBHOOK_URL` = seu webhook do Discord
   - `PORT` = `3000`
5. Em **Settings → Networking → Generate Domain** → ganha URL tipo:
   `https://bad-production-abc1.up.railway.app`
6. **Guarde essa URL.** É o seu `API_BASE`.

## Passo 2 — Configurar o hub `bad_v9.lua`

1. Abra `hub/bad_v9.lua`.
2. Na linha 10 troque:
   ```lua
   local API_BASE = "https://SEU_BACKEND.up.railway.app"
   ```
   pela URL do seu Railway.
3. Suba o arquivo editado no gist/github raw/catbox.
4. O loader fica:
   ```lua
   loadstring(game:HttpGet("https://SEU_GIST/raw/bad_v9.lua"))()
   ```

## Passo 3 — Vender keys (Sellix)

Veja `SELLIX.md` para instruções detalhadas.

## Passo 4 — Primeiro teste

1. Abra o Solara (ou outro executor).
2. Entre num jogo FPS Roblox.
3. Cole o loader e execute.
4. Aba **ADMIN** → usuário `bad7` / senha `1986rkrk` → entra direto (bypass offline).
5. Vá na aba **Gerar Key**:
   - Cole o `ADMIN_TOKEN` do seu `.env`.
   - Escolha duração.
   - Clique **GERAR KEY**.
6. A key cai no Discord + no clipboard.
7. Teste o fluxo de usuário: aba **REGISTRAR** → cola a key → cria user/senha → entra.

## Passo 5 — Monitorar

- Keys ativas: `GET https://seu-backend/key/list` (header `x-admin-token`)
- Usuários: `GET https://seu-backend/user/list`
- Banir: `POST https://seu-backend/user/ban` body `{"u":"nomedousuario"}`

## Segurança

- NUNCA commita o `.env` no github — está no `.gitignore`.
- O `ADMIN_TOKEN` dá controle total: troque se vazar.
- Backup do banco: `bad.db` é SQLite. No Railway usa Volume Persistente nas Settings pra não perder keys/users em redeploy.

## Suporte

- Discord: discord.gg/ojailbreaks
