import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/auth';
import { CarteiraProvider } from './contexts/carteiras';
import { ViewModeProvider } from './contexts/ViewModeContext';
import { BitcoinPriceProvider } from './hooks/useBitcoinPrice';
import Dashboard from './pages/Dashboard';
import Carteiras from './pages/Carteiras';
import Mercado from './pages/Mercado';
import Crypto from './pages/Crypto';
import ProjecaoLucros from './pages/ProjecaoLucros';
import Historico from './pages/Historico';
import Notificacoes from './pages/Notificacoes';
import Sobre from './pages/Sobre';
import Auth from './pages/Auth';
import PlanosPage from './pages/PlanosPage';
import PoliticaPrivacidade from './pages/PoliticaPrivacidade';
import TermosDeUso from './pages/TermosDeUso';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Sidebar } from '@/components/layout/sidebar/Sidebar';
import { cn } from '@/lib/utils';
import LandingPage from './pages/LandingPage';
import ReferralProgram from './pages/ReferralProgram';
import GrowthDashboard from './pages/GrowthDashboard';
import CouponManager from './components/monetization/CouponManager';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="satotrack-theme">
      <Router>
        <AuthProvider>
          <BitcoinPriceProvider>
            <CarteiraProvider>
              <ViewModeProvider>
                <div className="flex flex-col min-h-screen">
                  <SiteHeader />
                  
                  <div className="flex-1 container mx-auto px-4 py-4 md:py-8 flex">
                    <Sidebar />
                    
                    <main className="flex-1 page-transition">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/landing" element={<LandingPage />} />
                        <Route path="/referral" element={<ProtectedRoute><ReferralProgram /></ProtectedRoute>} />
                        <Route path="/growth" element={<ProtectedRoute><GrowthDashboard /></ProtectedRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/carteiras" element={<ProtectedRoute><Carteiras /></ProtectedRoute>} />
                        <Route path="/mercado" element={<ProtectedRoute><Mercado /></ProtectedRoute>} />
                        <Route path="/crypto" element={<ProtectedRoute><Crypto /></ProtectedRoute>} />
                        <Route path="/projecao-lucros" element={<ProtectedRoute><ProjecaoLucros /></ProtectedRoute>} />
                        <Route path="/historico" element={<ProtectedRoute><Historico /></ProtectedRoute>} />
                        <Route path="/notificacoes" element={<ProtectedRoute><Notificacoes /></ProtectedRoute>} />
                        <Route path="/sobre" element={<Sobre />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/planos" element={<PlanosPage />} />
                        <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
                        <Route path="/termos-de-uso" element={<TermosDeUso />} />
                        <Route path="/cupons" element={<ProtectedRoute><CouponManager /></ProtectedRoute>} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                  
                  <SiteFooter />
                  <Toaster />
                </div>
              </ViewModeProvider>
            </CarteiraProvider>
          </BitcoinPriceProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

function Index() {
  return <Navigate to="/dashboard" replace />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children;
}

export default App;
