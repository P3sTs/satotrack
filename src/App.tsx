
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { I18nProvider } from "@/contexts/i18n/I18nContext";
import { CarteirasProvider } from "@/contexts/carteiras";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import { GamificationProvider } from "@/contexts/gamification/GamificationContext";
import { ReferralProvider } from "@/contexts/referral/ReferralContext";
import { Web3Provider } from "@/contexts/web3/Web3Context";
import { ActionFeedbackProvider } from "@/components/feedback/ActionFeedback";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NovaCarteira from "./pages/NovaCarteira";
import CarteiraDetalhes from "./pages/CarteiraDetalhes";
import WalletsManager from "./pages/WalletsManager";
import Mercado from "./pages/Mercado";
import Configuracoes from "./pages/Configuracoes";
import Notificacoes from "./pages/Notificacoes";
import NotificacoesPremium from "./pages/NotificacoesPremium";
import Historico from "./pages/Historico";
import HistoricoPremium from "./pages/HistoricoPremium";
import ProjecaoLucros from "./pages/ProjecaoLucros";
import ProjecaoLucrosPremium from "./pages/ProjecaoLucrosPremium";
import Projections from "./pages/Projections";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import WalletComparison from "./pages/WalletComparison";
import Crypto from "./pages/Crypto";
import CryptoVisualization3D from "./pages/CryptoVisualization3D";
import Web3Dashboard from "./pages/Web3Dashboard";
import OnChainDashboard from "./pages/OnChainDashboard";
import BitcoinLookup from "./pages/BitcoinLookup";
import Alerts from "./pages/Alerts";
import ReferralProgram from "./pages/ReferralProgram";
import Achievements from "./pages/Achievements";
import GrowthDashboard from "./pages/GrowthDashboard";
import ApiDashboard from "./pages/ApiDashboard";
import ApiDocs from "./pages/ApiDocs";
import PlanosPage from "./pages/PlanosPage";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Sobre from "./pages/Sobre";
import Privacidade from "./pages/Privacidade";
import TermosUso from "./pages/TermosUso";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import RouteValidator from "./components/validation/RouteValidator";
import GlobalErrorBoundary from "./components/error/GlobalErrorBoundary";

const queryClient = new QueryClient();

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <I18nProvider>
              <AuthProvider>
                <ActionFeedbackProvider>
                  <CarteirasProvider>
                    <ViewModeProvider>
                      <GamificationProvider>
                        <ReferralProvider>
                          <Web3Provider>
                            <RouteValidator />
                            <div className="min-h-screen bg-background font-sans antialiased">
                              <Routes>
                                {/* Rota principal */}
                                <Route path="/" element={<Index />} />
                                
                                {/* Rotas públicas */}
                                <Route path="/home" element={<Home />} />
                                <Route path="/landing" element={<LandingPage />} />
                                <Route path="/auth" element={<Auth />} />
                                <Route path="/planos" element={<PlanosPage />} />
                                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                                <Route path="/sobre" element={<Sobre />} />
                                <Route path="/privacidade" element={<Privacidade />} />
                                <Route path="/termos" element={<TermosUso />} />
                                
                                {/* Rotas do mercado e crypto (públicas) */}
                                <Route path="/mercado" element={<Mercado />} />
                                <Route path="/crypto" element={<Crypto />} />
                                <Route path="/crypto-3d" element={<CryptoVisualization3D />} />
                                <Route path="/bitcoin-lookup" element={<BitcoinLookup />} />
                                <Route path="/api-docs" element={<ApiDocs />} />
                                
                                {/* Rotas protegidas - Dashboard */}
                                <Route path="/dashboard" element={
                                  <ProtectedRoute>
                                    <Dashboard />
                                  </ProtectedRoute>
                                } />
                                
                                {/* Rotas protegidas - Carteiras */}
                                <Route path="/carteiras" element={
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
                                
                                {/* Rotas protegidas - Análises */}
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
                                <Route path="/wallet-comparison" element={
                                  <ProtectedRoute>
                                    <WalletComparison />
                                  </ProtectedRoute>
                                } />
                                <Route path="/projecao-lucros" element={
                                  <ProtectedRoute>
                                    <ProjecaoLucros />
                                  </ProtectedRoute>
                                } />
                                <Route path="/projecao-lucros-premium" element={
                                  <ProtectedRoute>
                                    <ProjecaoLucrosPremium />
                                  </ProtectedRoute>
                                } />
                                
                                {/* Rotas protegidas - Histórico */}
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
                                
                                {/* Rotas protegidas - Notificações e Alertas */}
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
                                <Route path="/alerts" element={
                                  <ProtectedRoute>
                                    <Alerts />
                                  </ProtectedRoute>
                                } />
                                
                                {/* Rotas protegidas - Web3 e OnChain */}
                                <Route path="/web3" element={
                                  <ProtectedRoute>
                                    <Web3Dashboard />
                                  </ProtectedRoute>
                                } />
                                <Route path="/onchain" element={
                                  <ProtectedRoute>
                                    <OnChainDashboard />
                                  </ProtectedRoute>
                                } />
                                
                                {/* Rotas protegidas - Gamificação e Social */}
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
                                <Route path="/growth" element={
                                  <ProtectedRoute>
                                    <GrowthDashboard />
                                  </ProtectedRoute>
                                } />
                                
                                {/* Rotas protegidas - API e Configurações */}
                                <Route path="/api" element={
                                  <ProtectedRoute>
                                    <ApiDashboard />
                                  </ProtectedRoute>
                                } />
                                <Route path="/configuracoes" element={
                                  <ProtectedRoute>
                                    <Configuracoes />
                                  </ProtectedRoute>
                                } />
                                
                                {/* Rota 404 */}
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                              <Toaster />
                              <SonnerToaster />
                            </div>
                          </Web3Provider>
                        </ReferralProvider>
                      </GamificationProvider>
                    </ViewModeProvider>
                  </CarteirasProvider>
                </ActionFeedbackProvider>
              </AuthProvider>
            </I18nProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
