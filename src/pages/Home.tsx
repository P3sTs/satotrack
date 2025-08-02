
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, TrendingUp, Wallet, Eye } from 'lucide-react';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import MarketSummary from '@/components/home/MarketSummary';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';

const Home = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { 
    data: bitcoinData, 
    isLoading: bitcoinLoading, 
    isRefreshing,
    previousPrice,
    refresh 
  } = useBitcoinPrice();

  // Redirecionar usuários autenticados para o dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log('Usuário autenticado, redirecionando para dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative h-16 w-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-t-satotrack-neon border-x-transparent border-b-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
                alt="SatoTrack" 
                className="h-8 w-8 opacity-70"
              />
            </div>
          </div>
          <p className="text-satotrack-text">Carregando SatoTracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-dashboard-dark">
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <HeroGeometric 
          badge="SatoTracker"
          title1="Sua carteira multichain"
          title2="segura e sem complicações"
        />
        
        <div className="text-center space-y-8 max-w-4xl mx-auto relative z-20">
          {/* Logo e Título */}
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="relative">
              <img 
                src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
                alt="SatoTrack Logo" 
                className="h-20 w-20 object-contain animate-pulse"
              />
              <div className="absolute inset-0 bg-satotrack-neon/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white leading-tight">
              Gerencie seus <span className="satotrack-gradient-text">criptoativos</span><br />
              de forma inteligente
            </h1>
            <p className="text-xl text-satotrack-text max-w-2xl mx-auto">
              Acompanhe, analise e otimize seu portfólio de criptomoedas com ferramentas profissionais 
              e segurança de nível institucional.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black hover:from-satotrack-neon/90 hover:to-emerald-400/90 font-semibold px-8 py-3"
            >
              <Eye className="mr-2 h-5 w-5" />
              Começar agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              size="lg"
              className="border-satotrack-neon/50 text-satotrack-neon hover:bg-satotrack-neon/10 px-8 py-3"
            >
              Fazer Login
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-3 bg-dashboard-medium/30 p-6 rounded-xl border border-satotrack-neon/20">
              <div className="mx-auto w-12 h-12 bg-satotrack-neon/20 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-satotrack-neon" />
              </div>
              <h3 className="text-xl font-semibold text-white">Multi-carteira</h3>
              <p className="text-satotrack-text">
                Gerencie múltiplas carteiras de diferentes redes em um só lugar
              </p>
            </div>

            <div className="text-center space-y-3 bg-dashboard-medium/30 p-6 rounded-xl border border-satotrack-neon/20">
              <div className="mx-auto w-12 h-12 bg-satotrack-neon/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-satotrack-neon" />
              </div>
              <h3 className="text-xl font-semibold text-white">Análise Avançada</h3>
              <p className="text-satotrack-text">
                Relatórios detalhados e projeções de performance do seu portfólio
              </p>
            </div>

            <div className="text-center space-y-3 bg-dashboard-medium/30 p-6 rounded-xl border border-satotrack-neon/20">
              <div className="mx-auto w-12 h-12 bg-satotrack-neon/20 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-satotrack-neon" />
              </div>
              <h3 className="text-xl font-semibold text-white">Segurança Total</h3>
              <p className="text-satotrack-text">
                Suas chaves privadas ficam sempre com você, nunca conosco
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Section */}
      <MarketSummary
        isLoading={bitcoinLoading}
        isRefreshing={isRefreshing}
        bitcoinData={bitcoinData}
        previousPrice={previousPrice}
        onRefresh={refresh}
      />
    </div>
  );
};

export default Home;
