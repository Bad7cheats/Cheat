# Bad Hub — Pack Completo

Backend online + hub Roblox + storefront + anti-detect — tudo pronto.

## Estrutura

```
bad-pack/
├── backend/                # Node.js + SQLite (deploy Railway/Vercel)
│   ├── package.json
│   ├── server.js
│   ├── railway.json
│   ├── .env.example
│   └── .gitignore
├── hub/                    # Script Roblox (Lua)
│   ├── bad_v9.lua          # Hub principal com backend online
│   └── loader_rotativo.lua # Loader com mirrors + cache buster
├── docs/
│   ├── SETUP.md            # Passo a passo deploy completo
│   ├── SELLIX.md           # Vender keys automaticamente
│   └── ANTI_DETECT.md      # Práticas de ocultação
└── README.md               # Este arquivo
```

## Início rápido

1. **Backend**: leia `docs/SETUP.md` → deploy no Railway em 5 min.
2. **Hub**: edite `hub/bad_v9.lua` linha 10 com URL do seu backend.
3. **Loader**: suba `bad_v9.lua` no gist.
4. **Vender**: siga `docs/SELLIX.md` pra automatizar entrega de key.
5. **Anti-detect**: leia `docs/ANTI_DETECT.md` pra endurecer.

## Fluxo completo

```
Cliente paga na Sellix
    ↓
Sellix bate webhook do backend
    ↓
Backend gera KEY + manda Discord + email ao cliente
    ↓
Cliente cola loader no Solara
    ↓
Hub pede KEY + user + senha → /register
    ↓
Próximas execuções: hub valida sessão → abre direto
    ↓
Você bana via /user/ban se precisar
```

## Suporte

- discord.gg/ojailbreaks
- Admin: `bad7` / `1986rkrk` (bypass offline — não precisa de key)

## Preços sugeridos

- 24h: R$ 7
- 3d: R$ 15
- 7d: R$ 25
- 1mes: R$ 59

## Stack técnica

- Backend: Node.js 18 + Express + SQLite (better-sqlite3)
- Hub: Pure Lua (Roblox API)
- Deploy: Railway (grátis até $5/mês de uso)
- Storefront: Sellix.io (3% taxa por venda)
- Mirrors: Gist + GitHub raw + Catbox

## Features do Hub v9

- Login/Register online com HWID lock
- Admin bypass offline
- Aimbot + FOV circle + Smooth + Visible check + Team check
- Silent Aim (hook lazy — só quando ativa)
- ESP completo (box, nome, vida, distância, tracer, chams)
- Fly WASD + Space/Ctrl
- Noclip, Infinite Jump, WalkSpeed, JumpPower, Gravity (dirty flag — não quebra ACS)
- Pull weapons de 5 fontes (Workspace, ServerStorage, ReplicatedStorage, Teams, outros players)
- Teleport pra qualquer player + Spy camera
- Fullbright, remover neblina
- UI shark-style com side nav, toggles, sliders, dropdowns
- INS pra mostrar/esconder
- Discord webhook pra logs de key gerada

**absolute ollie, built by olivia**
