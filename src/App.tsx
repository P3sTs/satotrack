import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './contexts/auth';
import { CarteirasProvider } from './contexts/CarteirasContext';
import { ViewModeProvider } from './contexts/ViewModeContext';
import { ReferralProvider } from './contexts/referral/ReferralContext';
import { I18nProvider } from './contexts/i18n/I18nContext';
import { GamificationProvider } from './contexts/gamification/GamificationContext';
import { Web3Provider } from './contexts/web3/Web3Context';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Pages
import Index from './pages/Index';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import WalletsManager from './pages/WalletsManager';
import CarteiraDetalhes from './pages/CarteiraDetalhes';
import Auth from './pages/Auth';
import Configuracoes from './pages/Configuracoes';
import Mercado from './pages/Mercado';
import Historico from './pages/Historico';
import ProjecaoLucros from './pages/ProjecaoLucros';
import NotFound from './pages/NotFound';
import Alerts from './pages/Alerts';
import Projections from './pages/Projections';
import Achievements from './pages/Achievements';
import WalletComparisonPage from './pages/WalletComparison';
import Web3Dashboard from './pages/Web3Dashboard';
import PlanosPage from './pages/PlanosPage';
import NovaCarteira from './pages/NovaCarteira';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="satotrack-theme">
        <BrowserRouter>
          <AuthProvider>
            <Web3Provider>
              <GamificationProvider>
                <CarteirasProvider>
                  <ViewModeProvider>
                    <ReferralProvider>
                      <I18nProvider>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/home" element={<Home />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/planos" element={<PlanosPage />} />
                          
                          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/carteiras" element={<WalletsManager />} />
                            <Route path="/nova-carteira" element={<NovaCarteira />} />
                            <Route path="/carteira/:id" element={<CarteiraDetalhes />} />
                            <Route path="/configuracoes" element={<Configuracoes />} />
                            <Route path="/mercado" element={<Mercado />} />
                            <Route path="/historico" element={<Historico />} />
                            <Route path="/projecao" element={<ProjecaoLucros />} />
                            <Route path="/web3" element={<Web3Dashboard />} />
                          </Route>
                          
                          <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
                          <Route path="/projections" element={<ProtectedRoute><Projections /></ProtectedRoute>} />
                          <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
                          <Route path="/comparison" element={<ProtectedRoute><WalletComparisonPage /></ProtectedRoute>} />
                          
                          <Route path="/404" element={<NotFound />} />
                          <Route path="*" element={<Navigate to="/404" replace />} />
                        </Routes>
                        <Toaster />
                      </I18nProvider>
                    </ReferralProvider>
                  </ViewModeProvider>
                </CarteirasProvider>
              </GamificationProvider>
            </Web3Provider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
