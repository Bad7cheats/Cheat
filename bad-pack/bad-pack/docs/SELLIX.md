# Vender keys automaticamente com Sellix

## 1. Criar conta
https://sellix.io → signup → verifica email.

## 2. Configurar métodos de pagamento
Dashboard → **Settings → Payment Methods**:
- PIX (via Mercado Pago ou PIX direto)
- Cartão (Stripe)
- Crypto (BTC, ETH, USDT — Sellix nativo)
- PayPal

## 3. Criar produtos

Dashboard → **Products → New Product**:

### Bad Hub 24h
- Preço: R$ 7
- Delivery type: **Dynamic Webhook**
- Webhook URL: `https://SEU-RAILWAY.up.railway.app/sellix/webhook`
- Custom Fields (HIDDEN):
  - Key: `dur` Value: `24h`

### Bad Hub 3 dias
- Preço: R$ 15
- Custom Field: `dur = 3d`

### Bad Hub 7 dias
- Preço: R$ 25
- Custom Field: `dur = 7d`

### Bad Hub 1 Mês
- Preço: R$ 59
- Custom Field: `dur = 1mes`

## 4. Template de email de entrega

**Settings → Email Templates → Delivery**:

```
Olá!

Obrigado pela compra! Sua chave é:

{{service_text}}

Instruções:
1. Abra seu executor (Solara, Xeno, Wave, Swift, Delta).
2. Entre num jogo FPS Roblox.
3. Cole e execute:
   loadstring(game:HttpGet("https://SEU_GIST/raw/bad_v9.lua"))()
4. Na janela que abrir, clique em REGISTRAR.
5. Cole a chave, escolha usuário e senha.
6. Pronto! Pressione INSERT para abrir/fechar o menu.

Suporte: discord.gg/ojailbreaks
```

Sellix preenche `{{service_text}}` com a key que seu webhook retornou.

## 5. Testar

1. Ative **Sandbox Mode** nas settings da Sellix.
2. Compre seu próprio produto.
3. Verifica:
   - Discord recebe a notificação da venda.
   - Banco (Railway Console) tem a nova key.
   - Email do comprador tem a key.

## 6. Promover

- **Discord Server** próprio com bot de ticket pra suporte.
- **TikTok Shorts** mostrando gameplay com ESP/aimbot ativo.
- **YouTube** tutoriais "melhor hub Roblox FPS 2026".
- **Rentry** paginas com screenshots e link de compra.

## 7. Monitorar vendas

Dashboard Sellix mostra todos os pedidos, taxa de reembolso, chargebacks. Fique de olho em disputes.

## Preços sugeridos de guerra

Comparado à concorrência brasileira:
- Shark Menu: R$ 15 (free versão pobre, paid 30 dias)
- Nexus Hub: R$ 20 / 7d
- Blade Hub: R$ 30 / mes

Seu posicionamento: **menor preço de entrada (24h a R$ 7)** → converte curioso em cliente.
