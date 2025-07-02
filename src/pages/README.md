# 📁 Páginas do SatoTrack

Este documento mapeia todas as páginas da aplicação e suas respectivas funcionalidades.

## 🔗 Landing & Apresentação (Públicas)

- **Index.tsx** - Roteador principal e verificação de autenticação
- **LandingPage.tsx** - Primeira tela institucional pública
- **Home.tsx** - Tela principal para usuários logados
- **Sobre.tsx** - Missão, visão e equipe do SatoTrack

## 🔒 Autenticação & Segurança (Públicas)

- **Auth.tsx** - Tela de login/cadastro com autenticação via Supabase
- **Privacidade.tsx** - Política de privacidade da plataforma
- **TermosUso.tsx** - Termos de uso e condições

## 📊 Painéis & Dashboards (Protegidas)

- **Dashboard.tsx** - Dashboard geral com visão consolidada do portfólio
- **GrowthDashboard.tsx** - Análise de crescimento do patrimônio ao longo do tempo
- **OnChainDashboard.tsx** - Métricas blockchain (mempool, taxas, endereços ativos)
- **Web3Dashboard.tsx** - Carteiras Web3 conectadas + histórico de DApps

## 💼 Carteiras & Gestão (Protegidas)

- **Wallets.tsx** - Visão geral de todas as carteiras do usuário
- **WalletsManager.tsx** - Gerenciamento CRUD de carteiras
- **NovaCarteira.tsx** - Formulário de criação com validação e xPub
- **CarteiraDetalhes.tsx** - Página detalhada com transações e gráficos
- **WalletComparison.tsx** - Comparação lado a lado de performance

## 📈 Financeiro & Projeções (Protegidas)

- **ProjecaoLucros.tsx** - Projeção de lucros futuros com aportes fixos
- **ProjecaoLucrosPremium.tsx** - Versão avançada com IA (Premium)
- **Projections.tsx** - Comparativo entre moedas e previsões LSTM
- **PerformanceAnalytics.tsx** - ROI, volatilidade, drawdown
- **Historico.tsx** - Logs de movimentações e histórico de preços
- **HistoricoPremium.tsx** - Versão expandida do histórico (Premium)

## 💳 Pagamento & Checkout (Protegidas)

- **PlanosPage.tsx** - Página com preços e benefícios Premium
- **CheckoutSuccess.tsx** - Confirmação de pagamento com benefícios

## 🔔 Alertas & Notificações (Protegidas)

- **Alerts.tsx** - Gestão de alertas por carteira ou moeda
- **Notificacoes.tsx** - Log de notificações push/email/SMS
- **NotificacoesPremium.tsx** - Versão avançada de notificações

## 💬 API e Integrações (Protegidas)

- **ApiDashboard.tsx** - Gerenciamento de chaves e permissões de API
- **ApiDocs.tsx** - Documentação estilo Swagger dos endpoints

## 💡 Ferramentas Avançadas (Protegidas)

- **BitcoinLookup.tsx** - Consulta por txid/hash/endereços Bitcoin
- **Crypto.tsx** - Lista de moedas suportadas e informações
- **CryptoVisualization3D.tsx** - Visualização 3D com Three.js
- **Mercado.tsx** - Cotações ao vivo com destaque de alta/baixa

## 🎯 Extra & Gamificação (Protegidas)

- **Achievements.tsx** - Sistema de badges e conquistas
- **ReferralProgram.tsx** - Programa de indicação com rewards
- **Configuracoes.tsx** - Preferências gerais do usuário

## ⚠️ Páginas de Fallback

- **NotFound.tsx** - Página 404 customizada

---

## 🛠️ Estrutura de Roteamento

```typescript
// Públicas
/ → Index (roteador)
/landing → LandingPage
/home → Home
/sobre → Sobre
/auth → Auth
/privacidade → Privacidade
/termos → TermosUso

// Protegidas - Dashboards
/dashboard → Dashboard principal
/growth → Crescimento do patrimônio
/onchain → Métricas blockchain
/web3 → Carteiras Web3

// Protegidas - Carteiras
/carteiras → Visão geral
/wallets → Gerenciamento
/nova-carteira → Criar nova
/carteira/:id → Detalhes específicos
/wallet-comparison → Comparação

// Protegidas - Financeiro
/projecao → Projeções básicas
/projecao-premium → Projeções Premium
/projections → Comparativo de moedas
/performance → Analytics avançado
/historico → Histórico básico
/historico-premium → Histórico Premium

// E assim por diante...
```

## 🔐 Proteção de Rotas

- **Públicas**: Acessíveis sem autenticação
- **Protegidas**: Requerem login via `<ProtectedRoute>`
- **Premium**: Verificam plano do usuário

## 📱 Responsividade

Todas as páginas devem ser responsivas e funcionar em:
- Desktop (1920px+)
- Tablet (768px - 1919px)  
- Mobile (até 767px)