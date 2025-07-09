import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';

// Lazy loading dos componentes para melhor performance
const HeroSection = React.lazy(() => import('@/components/home/HeroSection'));
const TicketAccessSection = React.lazy(() => import('@/components/home/TicketAccessSection'));
const HowItWorks = React.lazy(() => import('@/components/home/HowItWorks'));
const SecuritySection = React.lazy(() => import('@/components/home/SecuritySection'));
const TestimonialsSection = React.lazy(() => import('@/components/home/TestimonialsSection'));
const FooterSection = React.lazy(() => import('@/components/home/FooterSection'));

// Componente de fallback para loading
const SectionSkeleton = () => (
  <div className="h-screen flex items-center justify-center bg-dashboard-dark">
    <div className="animate-pulse text-white">Carregando...</div>
  </div>
);

const Home = () => {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    console.log('🏠 Home component mounted');
  }, []);

  // Evita problemas de hidratação
  if (!isClient) {
    return <SectionSkeleton />;
  }
  
  return (
    <div className="min-h-screen bg-dashboard-dark overflow-x-hidden">
      {/* Hero Section - sempre visível */}
      <React.Suspense fallback={<SectionSkeleton />}>
        <HeroSection />
      </React.Suspense>
      
      {/* Ticket Section - apenas para não logados */}
      {!user && (
        <React.Suspense fallback={<SectionSkeleton />}>
          <TicketAccessSection />
        </React.Suspense>
      )}
      
      {/* How It Works - sempre visível */}
      <React.Suspense fallback={<SectionSkeleton />}>
        <HowItWorks />
      </React.Suspense>
      
      {/* Security Section - sempre visível */}
      <React.Suspense fallback={<SectionSkeleton />}>
        <SecuritySection />
      </React.Suspense>
      
      {/* Testimonials - sempre visível */}
      <React.Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </React.Suspense>
      
      {/* Footer - sempre visível */}
      <React.Suspense fallback={<SectionSkeleton />}>
        <FooterSection />
      </React.Suspense>
    </div>
  );
};

export default Home;