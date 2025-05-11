
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import HeroBitcoinSection from '@/components/home/HeroBitcoinSection';
import MarketSummary from '@/components/home/MarketSummary';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, TrendingUp } from 'lucide-react';

const Home = () => {
  const { bitcoinData, previousPrice, isLoading, isRefreshing, refreshData } = useBitcoinPrice();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-dashboard-dark">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
      
      <HeroBitcoinSection />
      
      <div id="main-content" className="page-transition">
        <MarketSummary 
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          bitcoinData={bitcoinData}
          previousPrice={previousPrice}
          onRefresh={refreshData}
        />
        
        {/* Call to Action Section */}
        {!user && (
          <section className="container mx-auto px-4 py-12 mb-10">
            <div className="tech-panel p-6 md:p-10 rounded-xl relative overflow-hidden">
              <div className="grid-pattern absolute inset-0 opacity-25"></div>
              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-orbitron mb-4 satotrack-gradient-text">
                  Monitore suas carteiras Bitcoin com precisão
                </h2>
                <p className="text-satotrack-text mb-8 text-lg">
                  Acompanhe suas carteiras Bitcoin, analise transações e tenha insights avançados sobre seu portfólio. 
                  Tudo isso com a segurança e anonimato que você precisa.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    variant="neon" 
                    size="lg"
                    onClick={() => navigate('/auth')}
                    className="group"
                  >
                    Começar a Monitorar
                    <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/auth')}
                  >
                    Saiba Mais
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Features Overview */}
        <section className="container mx-auto px-4 py-10 mb-10">
          <h2 className="text-2xl md:text-3xl font-orbitron mb-6 text-center">Recursos do <span className="satotrack-gradient-text">SatoTrack</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            <div className="hacker-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="p-3 bg-satotrack-neon/10 rounded-full w-14 h-14 flex items-center justify-center mb-4 border border-satotrack-neon/30">
                <TrendingUp className="h-7 w-7 text-satotrack-neon" />
              </div>
              <h3 className="text-xl font-orbitron mb-3">Monitoramento em Tempo Real</h3>
              <p className="text-satotrack-text">Acompanhe suas carteiras Bitcoin com atualizações em tempo real. Visualize transações assim que ocorrem na blockchain.</p>
            </div>
            
            <div className="hacker-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="p-3 bg-satotrack-neon/10 rounded-full w-14 h-14 flex items-center justify-center mb-4 border border-satotrack-neon/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-satotrack-neon">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-orbitron mb-3">Acompanhamento de Saldo</h3>
              <p className="text-satotrack-text">Visualize o valor total de suas carteiras em BTC, USD e BRL. Acompanhe a variação histórica do seu portfolio.</p>
            </div>
            
            <div className="hacker-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="p-3 bg-satotrack-neon/10 rounded-full w-14 h-14 flex items-center justify-center mb-4 border border-satotrack-neon/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-satotrack-neon">
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M12 8v8"></path>
                  <path d="m8.5 14 7-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-orbitron mb-3">Análise Detalhada</h3>
              <p className="text-satotrack-text">Acesse métricas avançadas sobre suas transações. Identifique padrões e otimize sua estratégia no mercado de criptomoedas.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
