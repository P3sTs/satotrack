import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Wallets from '@/pages/Wallets';
import WalletsManager from '@/pages/WalletsManager';
import NovaCarteira from '@/pages/NovaCarteira';
import CarteiraDetalhes from '@/pages/CarteiraDetalhes';
import Configuracoes from '@/pages/Configuracoes';
import Mercado from '@/pages/Mercado';
import Historico from '@/pages/Historico';
import HistoricoPremium from '@/pages/HistoricoPremium';
import Alerts from '@/pages/Alerts';
import Notificacoes from '@/pages/Notificacoes';
import NotificacoesPremium from '@/pages/NotificacoesPremium';
import ProjecaoLucros from '@/pages/ProjecaoLucros';
import ProjecaoLucrosPremium from '@/pages/ProjecaoLucrosPremium';
import Projections from '@/pages/Projections';
import ReferralProgram from '@/pages/ReferralProgram';
import Achievements from '@/pages/Achievements';
import Auth from '@/pages/Auth';
import Sobre from '@/pages/Sobre';
import Privacidade from '@/pages/Privacidade';
import TermosUso from '@/pages/TermosUso';
import Web3Dashboard from '@/components/web3/Web3Dashboard';
import CryptoDashboardNew from '@/components/crypto/CryptoDashboardNew';
import CryptoSecurityDashboard from '@/components/crypto/dashboard/CryptoSecurityDashboard';
import KMSDashboard from '@/components/crypto/dashboard/KMSDashboard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/termos" element={<TermosUso />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Crypto Wallet Routes - Unificadas */}
      <Route path="/carteiras" element={
        <ProtectedRoute>
          <Wallets />
        </ProtectedRoute>
      } />
      
      <Route path="/web3" element={
        <ProtectedRoute>
          <Web3Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/crypto" element={
        <ProtectedRoute>
          <CryptoDashboardNew />
        </ProtectedRoute>
      } />
      
      <Route path="/crypto-security" element={
        <ProtectedRoute>
          <CryptoSecurityDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/kms" element={
        <ProtectedRoute>
          <KMSDashboard />
        </ProtectedRoute>
      } />
      
      {/* Legacy Wallet Routes */}
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
      
      {/* Other Protected Routes */}
      <Route path="/configuracoes" element={
        <ProtectedRoute>
          <Configuracoes />
        </ProtectedRoute>
      } />
      
      <Route path="/mercado" element={
        <ProtectedRoute>
          <Mercado />
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
      
      <Route path="/referral" element={
        <ProtectedRoute>
          <ReferralProgram />
        </ProtectedRoute>
      } />
      
      <Route path="/achievements" element={
        <ProtectedRoute>
          <Achievements />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
