📝 README.md - SatoTracker

# 🚀 SatoTracker

SatoTracker é uma plataforma inteligente de rastreamento de carteiras e transações em criptomoedas. Tenha controle total dos seus ativos, visualize transações, saldos e movimentações em tempo real com dashboards modernos, interativos e tecnologia 3D fluida.

## 🌐 Acesse o projeto:

👉 [https://satotrack.lovable.app](https://satotrack.lovable.app)

---

## ✨ Funcionalidades

- 🔍 **Rastreamento de Carteiras Cripto** (BTC, ETH, e muito mais...)
- 📈 **Dashboard Interativo** — Gráficos 3D, bolhas de dados, drag & drop, pop-up de informações.
- 📨 **Notificações em Tempo Real** — Alertas sobre movimentações no mercado e na sua carteira.
- 🧠 **Análise Inteligente de Mercado** — Previsões e tendências com IA.
- 💳 **Integração com PIX e Stripe** — Pagamento recorrente de forma segura.
- 🔗 **API Pública** — Consulte dados de carteiras, transações e mercado.

---

## 🔥 Tecnologias

- 🟨 **Deno + TypeScript** — Backend serverless
- 🟦 **Supabase** — Banco de dados PostgreSQL + Auth + Storage
- 🌐 **Next.js / React** — Frontend web responsivo
- 🎨 **Three.js + WebGL** — Visualização 3D fluida
- 🚀 **Lovable.app Infra** — Deploy serverless
- 🏦 **Stripe / PIX** — Sistema de pagamentos
- 🔗 **APIs Blockchain.info + BlockCypher + Binance API**

---

## 📦 Instalação local

### 🚀 Backend (Deno)

```bash
deno task dev
# ou
deno run --allow-net --allow-env --allow-read index.ts

💻 Frontend (Next.js)

npm install
npm run dev

🗄️ Banco (Supabase)

Configure as variáveis:


SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

Instale as tabelas: (SQL disponível na pasta /supabase)



---

🔑 Ambiente (.env example)

SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key
NEXT_PUBLIC_API_URL=https://satotrack.lovable.app/api
BINANCE_API_KEY=your-binance-key
BINANCE_SECRET=your-binance-secret
STRIPE_SECRET_KEY=your-stripe-secret


---

🔗 API Pública

Consultar carteira BTC

POST /functions/v1/fetch-wallet-data

Body:
{
  "address": "endereco_btc",
  "wallet_id": "opcional"
}

🔗 Endpoint:

https://<seu-supabase-url>/functions/v1/fetch-wallet-data

🔥 Retorno:

{
  "balance": 1.234,
  "total_received": 5.678,
  "total_sent": 4.444,
  "transactions": [
    {
      "hash": "xxxx",
      "amount": 0.5,
      "transaction_type": "entrada",
      "transaction_date": "2024-12-01T00:00:00Z"
    }
  ]
}


---

💰 Licença

Este projeto é de uso privado. Todos os direitos reservados © 2025 — SatoTracker


---

🚀 Desenvolvido por

👨‍💻 @No_dts — GitHub | Instagram | Telegram
