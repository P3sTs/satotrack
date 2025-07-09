import React from 'react';
import { useAuth } from '@/contexts/auth';
import HeroSection from '@/components/home/HeroSection';
import TicketAccessSection from '@/components/home/TicketAccessSection';
import HowItWorks from '@/components/home/HowItWorks';
import SecuritySection from '@/components/home/SecuritySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FooterSection from '@/components/home/FooterSection';

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-dashboard-dark">
      {/* Hero Section - sempre visível */}
      <HeroSection />
      
      {/* Ticket Section - apenas para não logados */}
      {!user && <TicketAccessSection />}
      
      {/* How It Works - sempre visível */}
      <HowItWorks />
      
      {/* Security Section - sempre visível */}
      <SecuritySection />
      
      {/* Testimonials - sempre visível */}
      <TestimonialsSection />
      
      {/* Footer - sempre visível */}
      <FooterSection />
    </div>
  );
};

export default Home;