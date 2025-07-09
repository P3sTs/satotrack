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
  
  console.log('🏠 Home component rendering:', { hasUser: !!user });
  
  return (
    <div className="min-h-screen bg-dashboard-dark overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Ticket Section - apenas para não logados */}
      {!user && <TicketAccessSection />}
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Security Section */}
      <SecuritySection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Home;