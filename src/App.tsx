
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CarteirasProvider } from "./contexts/CarteirasContext";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import CarteiraDetalhes from "./pages/CarteiraDetalhes";
import NovaCarteira from "./pages/NovaCarteira";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CarteirasProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <NavBar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/carteira/:id" element={<CarteiraDetalhes />} />
                <Route path="/nova-carteira" element={<NovaCarteira />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CarteirasProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
