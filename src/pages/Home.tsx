
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import PlatformInfo from '@/components/home/PlatformInfo';
import MarketSummary from '@/components/home/MarketSummary';
import CallToActionSection from '@/components/home/CallToActionSection';

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
      <HeroSection />
      
      {/* Platform Information */}
      <PlatformInfo />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Market Summary */}
      <MarketSummary
        isLoading={bitcoinLoading}
        isRefreshing={isRefreshing}
        bitcoinData={bitcoinData}
        previousPrice={previousPrice}
        onRefresh={refresh}
      />
      
      {/* Call to Action */}
      <CallToActionSection />
    </div>
  );
};

export default Home;
