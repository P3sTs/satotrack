
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth";
import { CarteirasProvider } from "@/contexts/CarteirasContext";
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

// Components
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Advertisement } from "@/components/monetization/Advertisement";
import { useAuth } from "./contexts/auth";

// Create a client
const queryClient = new QueryClient();

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
  const { userPlan } = useAuth();
  const showAds = userPlan === 'free';
  
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/planos" element={<PlanosPage />} />
        <Route
          path="/api"
          element={
            <ProtectedRoute>
              <ApiDocs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carteiras"
          element={
            <ProtectedRoute>
              <WalletsManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carteira/:id"
          element={
            <ProtectedRoute>
              <CarteiraDetalhes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nova-carteira"
          element={
            <ProtectedRoute>
              <NovaCarteira />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toaster />
      {showAds && <Advertisement position="footer" />}
    </>
  );
}

export default App;
