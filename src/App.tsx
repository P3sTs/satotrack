
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/auth";
import { I18nProvider } from "./contexts/i18n/I18nContext";
import { CarteirasProvider } from "./contexts/carteiras/CarteirasProvider";
import { GamificationProvider } from "./contexts/gamification/GamificationContext";
import { ReferralProvider } from "./contexts/referral/ReferralContext";
import { Web3Provider } from "./contexts/web3/Web3Context";
import { ViewModeProvider } from "./contexts/ViewModeContext";
import { GlobalErrorBoundary } from "./components/error/GlobalErrorBoundary";
import { RouteValidator } from "./components/validation/RouteValidator";
import { SecurityIndicator } from "./components/SecurityIndicator";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { NavigationAudit } from "./components/navigation/NavigationAudit";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Wallets from "./pages/Wallets";
import WalletsManager from "./pages/WalletsManager";
import NovaCarteira from "./pages/NovaCarteira";
import CarteiraDetalhes from "./pages/CarteiraDetalhes";
import Configuracoes from "./pages/Configuracoes";
import Mercado from "./pages/Mercado";
import Historico from "./pages/Historico";
import HistoricoPremium from "./pages/HistoricoPremium";
import Alerts from "./pages/Alerts";
import Notificacoes from "./pages/Notificacoes";
import NotificacoesPremium from "./pages/NotificacoesPremium";
import ProjecaoLucros from "./pages/ProjecaoLucros";
import ProjecaoLucrosPremium from "./pages/ProjecaoLucrosPremium";
import Projections from "./pages/Projections";
import ReferralProgram from "./pages/ReferralProgram";
import Achievements from "./pages/Achievements";
import Auth from "./pages/Auth";
import Sobre from "./pages/Sobre";
import Privacidade from "./pages/Privacidade";
import TermosUso from "./pages/TermosUso";
import PlanosPage from "./pages/PlanosPage";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import NotFound from "./pages/NotFound";
import Crypto from "./pages/Crypto";
import CryptoVisualization3D from "./pages/CryptoVisualization3D";
import Web3Dashboard from "./pages/Web3Dashboard";
import BitcoinLookup from "./pages/BitcoinLookup";
import WalletComparison from "./pages/WalletComparison";
import OnChainDashboard from "./pages/OnChainDashboard";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import ApiDashboard from "./pages/ApiDashboard";
import ApiDocs from "./pages/ApiDocs";
import GrowthDashboard from "./pages/GrowthDashboard";
import LandingPage from "./pages/LandingPage";
import "./styles/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <BrowserRouter>
              <I18nProvider>
                <AuthProvider>
                  <CarteirasProvider>
                    <GamificationProvider>
                      <ReferralProvider>
                        <Web3Provider>
                          <ViewModeProvider>
                            <NavigationAudit />
                            <SecurityIndicator />
                            <Routes>
                              <Route path="/" element={<Index />} />
                              <Route path="/home" element={<Home />} />
                              <Route path="/auth" element={<Auth />} />
                              <Route path="/sobre" element={<Sobre />} />
                              <Route path="/privacidade" element={<Privacidade />} />
                              <Route path="/termos" element={<TermosUso />} />
                              <Route path="/planos" element={<PlanosPage />} />
                              <Route path="/success" element={<CheckoutSuccess />} />
                              <Route path="/landing" element={<LandingPage />} />
                              
                              <Route element={<ProtectedRoute />}>
                                <Route element={<AppLayout />}>
                                  <Route path="/dashboard" element={<Dashboard />} />
                                  <Route path="/wallets" element={<Wallets />} />
                                  <Route path="/carteiras" element={<WalletsManager />} />
                                  <Route path="/nova-carteira" element={<NovaCarteira />} />
                                  <Route path="/carteira/:id" element={<CarteiraDetalhes />} />
                                  <Route path="/configuracoes" element={<Configuracoes />} />
                                  <Route path="/mercado" element={<Mercado />} />
                                  <Route path="/historico" element={<Historico />} />
                                  <Route path="/historico-premium" element={<HistoricoPremium />} />
                                  <Route path="/alerts" element={<Alerts />} />
                                  <Route path="/notificacoes" element={<Notificacoes />} />
                                  <Route path="/notificacoes-premium" element={<NotificacoesPremium />} />
                                  <Route path="/projecao" element={<ProjecaoLucros />} />
                                  <Route path="/projecao-premium" element={<ProjecaoLucrosPremium />} />
                                  <Route path="/projections" element={<Projections />} />
                                  <Route path="/referral" element={<ReferralProgram />} />
                                  <Route path="/achievements" element={<Achievements />} />
                                  <Route path="/crypto" element={<Crypto />} />
                                  <Route path="/crypto-3d" element={<CryptoVisualization3D />} />
                                  <Route path="/web3" element={<Web3Dashboard />} />
                                  <Route path="/bitcoin-lookup" element={<BitcoinLookup />} />
                                  <Route path="/wallet-comparison" element={<WalletComparison />} />
                                  <Route path="/onchain" element={<OnChainDashboard />} />
                                  <Route path="/analytics" element={<PerformanceAnalytics />} />
                                  <Route path="/api" element={<ApiDashboard />} />
                                  <Route path="/api-docs" element={<ApiDocs />} />
                                  <Route path="/growth" element={<GrowthDashboard />} />
                                </Route>
                              </Route>
                              
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                            <RouteValidator />
                          </ViewModeProvider>
                        </Web3Provider>
                      </ReferralProvider>
                    </GamificationProvider>
                  </CarteirasProvider>
                </AuthProvider>
              </I18nProvider>
            </BrowserRouter>
            <Toaster />
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
