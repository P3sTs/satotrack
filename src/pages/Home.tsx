
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, TrendingUp, Wallet, Eye } from 'lucide-react';
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
    <div className="min-h-screen bg-dashboard-dark">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-dashboard-dark via-dashboard-medium/20 to-dashboard-dark"></div>
        <div className="absolute inset-0 bg-gradient-radial from-satotrack-neon/5 via-transparent to-transparent blur-3xl"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-satotrack-neon/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 border-2 border-satotrack-neon/10 rounded-lg rotate-45 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-satotrack-neon/20 to-transparent rounded-full blur-xl"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Logo e Badge */}
          <div className="flex flex-col items-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dashboard-medium/30 border border-satotrack-neon/20 mb-4">
              <div className="h-2 w-2 rounded-full bg-satotrack-neon animate-pulse"></div>
              <span className="text-sm text-satotrack-text tracking-wide font-inter">
                SatoTracker v2.0
              </span>
            </div>
            
            {/* Logo Principal */}
            <div className="relative group">
              <img 
                src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
                alt="SatoTrack Logo" 
                className="h-24 w-24 object-contain animate-glow transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-satotrack-neon/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            {/* Título Principal */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-white leading-tight tracking-tight">
                <span className="satotrack-gradient-text block">SatoTrack</span>
                <span className="text-3xl md:text-5xl text-satotrack-text font-normal block mt-2">
                  Monitore. Analise. Otimize.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-satotrack-text max-w-3xl mx-auto leading-relaxed font-inter">
                A plataforma mais avançada para monitoramento e análise de criptoativos. 
                Transforme dados blockchain em insights acionáveis.
              </p>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={() => navigate('/auth?mode=signup')}
              size="lg"
              className="group bg-gradient-to-r from-satotrack-neon to-satotrack-neon/80 text-black hover:from-satotrack-neon/90 hover:to-satotrack-neon/70 font-semibold px-8 py-4 text-lg rounded-xl font-inter transition-all duration-300 shadow-lg hover:shadow-satotrack-neon/25"
            >
              <Eye className="mr-2 h-5 w-5" />
              Começar Monitoramento
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              size="lg"
              className="border-satotrack-neon/50 text-satotrack-neon hover:bg-satotrack-neon/10 hover:border-satotrack-neon px-8 py-4 text-lg rounded-xl font-inter transition-all duration-300"
            >
              Fazer Login
            </Button>
          </div>

          {/* Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="cyberpunk-card p-6 text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-satotrack-neon/20 to-satotrack-neon/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-satotrack-neon/30 transition-colors">
                <Shield className="h-8 w-8 text-satotrack-neon" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-orbitron">Segurança Total</h3>
              <p className="text-satotrack-text font-inter">
                Monitoramento em tempo real com IA avançada para detectar ameaças e oportunidades
              </p>
            </div>

            <div className="cyberpunk-card p-6 text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-satotrack-neon/20 to-satotrack-neon/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-satotrack-neon/30 transition-colors">
                <TrendingUp className="h-8 w-8 text-satotrack-neon" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-orbitron">Análise Inteligente</h3>
              <p className="text-satotrack-text font-inter">
                Relatórios avançados e projeções baseadas em machine learning
              </p>
            </div>

            <div className="cyberpunk-card p-6 text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-satotrack-neon/20 to-satotrack-neon/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-satotrack-neon/30 transition-colors">
                <Wallet className="h-8 w-8 text-satotrack-neon" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-orbitron">Multi-Portfolio</h3>
              <p className="text-satotrack-text font-inter">
                Gerencie múltiplas carteiras e redes blockchain em uma única plataforma
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-satotrack-neon rounded-full flex justify-center opacity-60">
            <div className="w-2 h-2 bg-satotrack-neon rounded-full mt-2 animate-pulse"></div>
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
