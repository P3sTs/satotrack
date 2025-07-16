import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import NotFound from '@/pages/NotFound';

// 🔗 Landing & Apresentação
import Index from '@/pages/Index';
import LandingPage from '@/pages/LandingPage';
import Home from '@/pages/Home';
import Sobre from '@/pages/Sobre';

// 🔒 Autenticação & Segurança
import Auth from '@/pages/Auth';
import SecuritySettings from '@/pages/SecuritySettings';
import Privacidade from '@/pages/Privacidade';
import TermosUso from '@/pages/TermosUso';

// 📊 Painéis & Dashboards
import Dashboard from '@/pages/Dashboard';
import GrowthDashboard from '@/pages/GrowthDashboard';
import OnChainDashboard from '@/pages/OnChainDashboard';
import Web3Dashboard from '@/pages/Web3Dashboard';

// 💼 Carteiras & Gestão
import Wallets from '@/pages/Wallets';
import WalletsManager from '@/pages/WalletsManager';
import NovaCarteira from '@/pages/NovaCarteira';
import CarteiraDetalhes from '@/pages/CarteiraDetalhes';
import CoinDetail from '@/pages/CoinDetail';
import WalletComparison from '@/pages/WalletComparison';

// 📈 Financeiro & Projeções
import ProjecaoLucros from '@/pages/ProjecaoLucros';
import ProjecaoLucrosPremium from '@/pages/ProjecaoLucrosPremium';
import Projections from '@/pages/Projections';
import PerformanceAnalytics from '@/pages/PerformanceAnalytics';
import PerformanceAnalyticsDetailed from '@/pages/PerformanceAnalyticsDetailed';
import Historico from '@/pages/Historico';
import HistoricoPremium from '@/pages/HistoricoPremium';
import Security from '@/pages/Security';

// 💳 Pagamento & Checkout
import PlanosPage from '@/pages/PlanosPage';
import CheckoutSuccess from '@/pages/CheckoutSuccess';

// 🔔 Alertas & Notificações
import Alerts from '@/pages/Alerts';
import Notificacoes from '@/pages/Notificacoes';
import NotificacoesPremium from '@/pages/NotificacoesPremium';

// 💬 API e Integrações
import ApiDashboard from '@/pages/ApiDashboard';
import ApiDocs from '@/pages/ApiDocs';

// 💡 Ferramentas Avançadas
import BitcoinLookup from '@/pages/BitcoinLookup';
import Crypto from '@/pages/Crypto';
import CryptoVisualization3D from '@/pages/CryptoVisualization3D';
import CurrencyConverter from '@/pages/CurrencyConverter';
import Mercado from '@/pages/Mercado';

// 🎯 Extra & Gamificação
import Achievements from '@/pages/Achievements';
import ReferralProgram from '@/pages/ReferralProgram';
import Configuracoes from '@/pages/Configuracoes';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 🔗 Landing & Apresentação - Rotas Públicas */}
      <Route path="/" element={<Index />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/privacidade" element={<Privacidade />} />
      
      {/* 🔒 Autenticação & Segurança - Rotas Públicas */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/termos" element={<TermosUso />} />
      
      {/* 📊 Painéis & Dashboards - Rotas Protegidas */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/growth" element={
        <ProtectedRoute>
          <GrowthDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/onchain" element={
        <ProtectedRoute>
          <OnChainDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/web3" element={
        <ProtectedRoute>
          <Web3Dashboard />
        </ProtectedRoute>
      } />
      
      {/* 💼 Carteiras & Gestão - Rotas Protegidas */}
      <Route path="/carteiras" element={
        <ProtectedRoute>
          <Wallets />
        </ProtectedRoute>
      } />
      
      <Route path="/wallets" element={
        <ProtectedRoute>
          <WalletsManager />
        </ProtectedRoute>
      } />
      
      <Route path="/nova-carteira" element={
        <ProtectedRoute>
          <NovaCarteira />
        </ProtectedRoute>
      } />
      
      <Route path="/carteira/:id" element={
        <ProtectedRoute>
          <CarteiraDetalhes />
        </ProtectedRoute>
      } />
      
      <Route path="/coin/:symbol" element={
        <ProtectedRoute>
          <CoinDetail />
        </ProtectedRoute>
      } />
      
      <Route path="/wallet-comparison" element={
        <ProtectedRoute>
          <WalletComparison />
        </ProtectedRoute>
      } />
      
      {/* 📈 Financeiro & Projeções - Rotas Protegidas */}
      <Route path="/projecao" element={
        <ProtectedRoute>
          <ProjecaoLucros />
        </ProtectedRoute>
      } />
      
      <Route path="/projecao-premium" element={
        <ProtectedRoute>
          <ProjecaoLucrosPremium />
        </ProtectedRoute>
      } />
      
      <Route path="/projections" element={
        <ProtectedRoute>
          <Projections />
        </ProtectedRoute>
      } />
      
      <Route path="/performance" element={
        <ProtectedRoute>
          <PerformanceAnalytics />
        </ProtectedRoute>
      } />
      
      <Route path="/performance-analytics" element={
        <ProtectedRoute>
          <PerformanceAnalyticsDetailed />
        </ProtectedRoute>
      } />
      
      <Route path="/security" element={
        <ProtectedRoute>
          <Security />
        </ProtectedRoute>
      } />
      
      <Route path="/historico" element={
        <ProtectedRoute>
          <Historico />
        </ProtectedRoute>
      } />
      
      <Route path="/historico-premium" element={
        <ProtectedRoute>
          <HistoricoPremium />
        </ProtectedRoute>
      } />
      
      {/* 💳 Pagamento & Checkout - Rotas Protegidas */}
      <Route path="/planos" element={
        <ProtectedRoute>
          <PlanosPage />
        </ProtectedRoute>
      } />
      
      <Route path="/checkout-success" element={
        <ProtectedRoute>
          <CheckoutSuccess />
        </ProtectedRoute>
      } />
      
      {/* 🔔 Alertas & Notificações - Rotas Protegidas */}
      <Route path="/alerts" element={
        <ProtectedRoute>
          <Alerts />
        </ProtectedRoute>
      } />
      
      <Route path="/notificacoes" element={
        <ProtectedRoute>
          <Notificacoes />
        </ProtectedRoute>
      } />
      
      <Route path="/notificacoes-premium" element={
        <ProtectedRoute>
          <NotificacoesPremium />
        </ProtectedRoute>
      } />
      
      {/* 💬 API e Integrações - Rotas Protegidas */}
      <Route path="/api" element={
        <ProtectedRoute>
          <ApiDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/api-docs" element={
        <ProtectedRoute>
          <ApiDocs />
        </ProtectedRoute>
      } />
      
      {/* 💡 Ferramentas Avançadas - Rotas Protegidas */}
      <Route path="/bitcoin-lookup" element={
        <ProtectedRoute>
          <BitcoinLookup />
        </ProtectedRoute>
      } />
      
      <Route path="/crypto" element={
        <ProtectedRoute>
          <Crypto />
        </ProtectedRoute>
      } />
      
      <Route path="/crypto-security" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/crypto-3d" element={
        <ProtectedRoute>
          <CryptoVisualization3D />
        </ProtectedRoute>
      } />
      
      <Route path="/currency-converter" element={
        <ProtectedRoute>
          <CurrencyConverter />
        </ProtectedRoute>
      } />
      
      <Route path="/mercado" element={
        <ProtectedRoute>
          <Mercado />
        </ProtectedRoute>
      } />
      
      {/* 🎯 Extra & Gamificação - Rotas Protegidas */}
      <Route path="/achievements" element={
        <ProtectedRoute>
          <Achievements />
        </ProtectedRoute>
      } />
      
      <Route path="/referral" element={
        <ProtectedRoute>
          <ReferralProgram />
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes" element={
        <ProtectedRoute>
          <Configuracoes />
        </ProtectedRoute>
      } />
      
      <Route path="/security-settings" element={
        <ProtectedRoute>
          <SecuritySettings />
        </ProtectedRoute>
      } />
      
      
      {/* ⚠️ Fallback - 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
