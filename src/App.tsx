import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/auth';
import { CarteirasProvider } from './contexts/carteiras';
import { ViewModeProvider } from './contexts/ViewModeContext';
import { ReferralProvider } from './contexts/referral/ReferralContext';
import { I18nProvider } from './contexts/i18n/I18nContext';
import { ThemeProvider } from './components/theme-provider';
import Dashboard from './pages/Dashboard';
import WalletsManager from './pages/WalletsManager';
import NovaCarteira from './pages/NovaCarteira';
import Configuracoes from './pages/Configuracoes';
import Mercado from './pages/Mercado';
import Crypto from './pages/Crypto';
import ProjecaoLucrosPremium from './pages/ProjecaoLucrosPremium';
import HistoricoPremium from './pages/HistoricoPremium';
import NotificacoesPremium from './pages/NotificacoesPremium';
import Sobre from './pages/Sobre';
import Auth from './pages/Auth';
import PlanosPage from './pages/PlanosPage';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import BitcoinLookup from './pages/BitcoinLookup';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from './pages/LandingPage';
import ReferralProgram from './pages/ReferralProgram';
import GrowthDashboard from './pages/GrowthDashboard';
import AppLayout from './components/layout/AppLayout';
import CarteiraDetalhes from './pages/CarteiraDetalhes';
import ApiDashboard from './pages/ApiDashboard';
import Privacidade from './pages/Privacidade';
import TermosUso from './pages/TermosUso';
import ProtectedRoute from './components/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <CarteirasProvider>
              <ReferralProvider>
                <I18nProvider>
                  <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-darker to-black">
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/landing" element={<LandingPage />} />
                        <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
                        <Route path="/planos" element={<PlanosPage />} />
                        <Route path="/sobre" element={<Sobre />} />
                        <Route path="/privacidade" element={<Privacidade />} />
                        <Route path="/termos-uso" element={<TermosUso />} />
                        <Route path="/referral" element={<AppLayout><ProtectedRoute><ReferralProgram /></ProtectedRoute></AppLayout>} />
                        <Route path="/growth" element={<AppLayout><ProtectedRoute><GrowthDashboard /></ProtectedRoute></AppLayout>} />
                        <Route path="/dashboard" element={<AppLayout><ProtectedRoute><Dashboard /></ProtectedRoute></AppLayout>} />
                        <Route path="/bitcoin-lookup" element={<AppLayout><ProtectedRoute><BitcoinLookup /></ProtectedRoute></AppLayout>} />
                        <Route path="/carteiras" element={<AppLayout><ProtectedRoute><WalletsManager /></ProtectedRoute></AppLayout>} />
                        <Route path="/carteira/:id" element={<AppLayout><ProtectedRoute><CarteiraDetalhes /></ProtectedRoute></AppLayout>} />
                        <Route path="/nova-carteira" element={<AppLayout><ProtectedRoute><NovaCarteira /></ProtectedRoute></AppLayout>} />
                        <Route path="/configuracoes" element={<AppLayout><ProtectedRoute><Configuracoes /></ProtectedRoute></AppLayout>} />
                        <Route path="/mercado" element={<AppLayout><ProtectedRoute><Mercado /></ProtectedRoute></AppLayout>} />
                        <Route path="/crypto" element={<AppLayout><ProtectedRoute><Crypto /></ProtectedRoute></AppLayout>} />
                        <Route path="/projecao-lucros" element={<AppLayout><ProtectedRoute><ProjecaoLucrosPremium /></ProtectedRoute></AppLayout>} />
                        <Route path="/historico" element={<AppLayout><ProtectedRoute><HistoricoPremium /></ProtectedRoute></AppLayout>} />
                        <Route path="/notificacoes" element={<AppLayout><ProtectedRoute><NotificacoesPremium /></ProtectedRoute></AppLayout>} />
                        <Route path="/api" element={<AppLayout><ProtectedRoute><ApiDashboard /></ProtectedRoute></AppLayout>} />
                        <Route path="/politica-privacidade" element={<AppLayout><PoliticaPrivacidade /></AppLayout>} />
                        <Route path="/termos-de-uso" element={<AppLayout><TermosDeUso /></AppLayout>} />
                        <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
                      </Routes>
                    </AppLayout>
                    <Toaster />
                  </div>
                </I18nProvider>
              </ReferralProvider>
            </CarteirasProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function Index() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dashboard-dark">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-satotrack-neon"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/landing" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-satotrack-neon"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
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
