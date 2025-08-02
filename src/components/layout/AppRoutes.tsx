
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import Carteiras from '@/pages/Carteiras';
import Staking from '@/pages/Staking';
import TatumTools from '@/pages/TatumTools';
import Web3Dashboard from '@/components/web3/Web3Dashboard';
import NFTSystem from '@/pages/NFTSystem';
import { useAuth } from '@/contexts/auth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    window.location.href = '/auth';
    return null;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/carteiras" element={
        <ProtectedRoute>
          <Carteiras />
        </ProtectedRoute>
      } />
      <Route path="/staking" element={
        <ProtectedRoute>
          <Staking />
        </ProtectedRoute>
      } />
      <Route path="/tatum-tools" element={
        <ProtectedRoute>
          <TatumTools />
        </ProtectedRoute>
      } />
      <Route path="/web3" element={
        <ProtectedRoute>
          <Web3Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/nft" element={
        <ProtectedRoute>
          <NFTSystem />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
