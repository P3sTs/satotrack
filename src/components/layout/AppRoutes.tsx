
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Web3Dashboard from '@/pages/Web3Dashboard';
import Auth from '@/pages/Auth';
import Earn from '@/pages/Earn';
import Staking from '@/pages/Staking';
import TatumTools from '@/pages/TatumTools';
import NativeBottomNav from '@/components/mobile/NativeBottomNav';
import LegacyRedirect from '@/components/navigation/LegacyRedirect';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/web3" 
          element={<Web3Dashboard />}
        />
        <Route 
          path="/earn" 
          element={isAuthenticated ? <Earn /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/staking" 
          element={isAuthenticated ? <Staking /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/tools" 
          element={isAuthenticated ? <TatumTools /> : <Navigate to="/auth" />} 
        />
        
        {/* Legacy redirects */}
        <Route path="/wallets" element={<LegacyRedirect from="/wallets" to="/dashboard" />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      {isAuthenticated && <NativeBottomNav />}
    </>
  );
};

export default AppRoutes;
