
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CarteirasProvider } from "./contexts/CarteirasContext";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CarteiraDetalhes from "./pages/CarteiraDetalhes";
import NovaCarteira from "./pages/NovaCarteira";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Sobre from "./pages/Sobre";
import Privacidade from "./pages/Privacidade";
import WalletsManager from "./pages/WalletsManager";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <CarteirasProvider>
            <Toaster />
            <Sonner />
            <div className="min-h-screen flex flex-col bg-background text-foreground">
              <Routes>
                <Route path="/" element={
                  <>
                    <NavBar />
                    <main className="flex-grow">
                      <Home />
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/auth" element={<Auth />} />
                
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/privacidade" element={<Privacidade />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={
                    <>
                      <NavBar />
                      <main className="flex-grow">
                        <Dashboard />
                      </main>
                      <Footer />
                    </>
                  } />
                  
                  <Route path="/carteiras" element={
                    <>
                      <NavBar />
                      <main className="flex-grow">
                        <WalletsManager />
                      </main>
                      <Footer />
                    </>
                  } />
                  
                  <Route path="/carteira/:id" element={
                    <>
                      <NavBar />
                      <main className="flex-grow">
                        <CarteiraDetalhes />
                      </main>
                      <Footer />
                    </>
                  } />
                  
                  <Route path="/nova-carteira" element={
                    <>
                      <NavBar />
                      <main className="flex-grow">
                        <NovaCarteira />
                      </main>
                      <Footer />
                    </>
                  } />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </CarteirasProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
