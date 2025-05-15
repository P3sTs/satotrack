
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth";
import { CarteirasProvider } from "@/contexts/carteiras";
import { ViewModeProvider } from "@/contexts/ViewModeContext";

// Pages
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import Privacidade from "@/pages/Privacidade";
import Sobre from "@/pages/Sobre";
import NotFound from "@/pages/NotFound";
import NovaCarteira from "@/pages/NovaCarteira";
import CarteiraDetalhes from "@/pages/CarteiraDetalhes";
import WalletsManager from "@/pages/WalletsManager";
import Index from "@/pages/Index";
import ApiDocs from "@/pages/ApiDocs";
import PlanosPage from "@/pages/PlanosPage";
import Historico from "@/pages/Historico";
import Mercado from "@/pages/Mercado";
import Configuracoes from "@/pages/Configuracoes";
import Notificacoes from "@/pages/Notificacoes";

// Components
import AppLayout from "@/components/layout/AppLayout";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Advertisement } from "@/components/monetization/Advertisement";
import { useAuth } from "./contexts/auth";

// Create a client
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
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CarteirasProvider>
            <ViewModeProvider>
              <AppContent />
            </ViewModeProvider>
          </CarteirasProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

// Separate component to use hooks
function AppContent() {
  const { userPlan, user } = useAuth();
  const showAds = userPlan === 'free';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* Public routes with standard layout */}
        <Route path="/" element={<><NavBar /><Index /><Footer />{showAds && <Advertisement position="footer" />}</>} />
        <Route path="/home" element={<><NavBar /><Home /><Footer />{showAds && <Advertisement position="footer" />}</>} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <><NavBar /><Auth /><Footer /></>} />
        <Route path="/sobre" element={<><NavBar /><Sobre /><Footer />{showAds && <Advertisement position="footer" />}</>} />
        <Route path="/privacidade" element={<><NavBar /><Privacidade /><Footer />{showAds && <Advertisement position="footer" />}</>} />
        <Route path="/planos" element={<><NavBar /><PlanosPage /><Footer />{showAds && <Advertisement position="footer" />}</>} />
        
        {/* App routes with sidebar layout */}
        <Route element={<AppLayout />}>
          <Route path="/mercado" element={<Mercado />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/premium-dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/carteiras" element={
            <ProtectedRoute>
              <WalletsManager />
            </ProtectedRoute>
          } />
          
          <Route path="/carteira/:id" element={
            <ProtectedRoute>
              <CarteiraDetalhes />
            </ProtectedRoute>
          } />
          
          <Route path="/nova-carteira" element={
            <ProtectedRoute>
              <NovaCarteira />
            </ProtectedRoute>
          } />
          
          <Route path="/historico" element={
            <ProtectedRoute>
              <Historico />
            </ProtectedRoute>
          } />
          
          <Route path="/notificacoes" element={
            <ProtectedRoute>
              <Notificacoes />
            </ProtectedRoute>
          } />
          
          <Route path="/configuracoes" element={
            <ProtectedRoute>
              <Configuracoes />
            </ProtectedRoute>
          } />
          
          <Route path="/api" element={
            <ProtectedRoute>
              <ApiDocs />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 page */}
        <Route path="*" element={<><NavBar /><NotFound /><Footer /></>} />
      </Routes>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
