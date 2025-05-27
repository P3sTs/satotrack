
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/auth';
import { CarteirasProvider } from './contexts/carteiras';
import { ViewModeProvider } from './contexts/ViewModeContext';
import Dashboard from './pages/Dashboard';
import WalletsManager from './pages/WalletsManager';
import Mercado from './pages/Mercado';
import Crypto from './pages/Crypto';
import ProjecaoLucros from './pages/ProjecaoLucros';
import Historico from './pages/Historico';
import Notificacoes from './pages/Notificacoes';
import Sobre from './pages/Sobre';
import Auth from './pages/Auth';
import PlanosPage from './pages/PlanosPage';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from './pages/LandingPage';
import ReferralProgram from './pages/ReferralProgram';
import GrowthDashboard from './pages/GrowthDashboard';
import CouponManager from './components/monetization/CouponManager';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <AuthProvider>
      <CarteirasProvider>
        <ViewModeProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/planos" element={<PlanosPage />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/referral" element={<AppLayout><ProtectedRoute><ReferralProgram /></ProtectedRoute></AppLayout>} />
            <Route path="/growth" element={<AppLayout><ProtectedRoute><GrowthDashboard /></ProtectedRoute></AppLayout>} />
            <Route path="/dashboard" element={<AppLayout><ProtectedRoute><Dashboard /></ProtectedRoute></AppLayout>} />
            <Route path="/carteiras" element={<AppLayout><ProtectedRoute><WalletsManager /></ProtectedRoute></AppLayout>} />
            <Route path="/mercado" element={<AppLayout><ProtectedRoute><Mercado /></ProtectedRoute></AppLayout>} />
            <Route path="/crypto" element={<AppLayout><ProtectedRoute><Crypto /></ProtectedRoute></AppLayout>} />
            <Route path="/projecao-lucros" element={<AppLayout><ProtectedRoute><ProjecaoLucros /></ProtectedRoute></AppLayout>} />
            <Route path="/historico" element={<AppLayout><ProtectedRoute><Historico /></ProtectedRoute></AppLayout>} />
            <Route path="/notificacoes" element={<AppLayout><ProtectedRoute><Notificacoes /></ProtectedRoute></AppLayout>} />
            <Route path="/cupons" element={<AppLayout><ProtectedRoute><CouponManager /></ProtectedRoute></AppLayout>} />
            <Route path="/politica-privacidade" element={<AppLayout><PoliticaPrivacidade /></AppLayout>} />
            <Route path="/termos-de-uso" element={<AppLayout><TermosDeUso /></AppLayout>} />
            <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
          </Routes>
          <Toaster />
        </ViewModeProvider>
      </CarteirasProvider>
    </AuthProvider>
  );
}

function Index() {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/landing" replace />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children;
}

function PoliticaPrivacidade() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
      <div className="prose max-w-none">
        <p>Esta é a política de privacidade do SatoTrack...</p>
      </div>
    </div>
  );
}

function TermosDeUso() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
      <div className="prose max-w-none">
        <p>Estes são os termos de uso do SatoTrack...</p>
      </div>
    </div>
  );
}

export default App;
