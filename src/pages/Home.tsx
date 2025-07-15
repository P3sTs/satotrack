import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import SecuritySection from '@/components/home/SecuritySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { SatoTrackFooter } from '@/components/ui/footer-section';

const Home = () => {
  return (
    <div className="min-h-screen bg-dashboard-dark">
      {/* Hero Section - sempre visível */}
      <HeroSection />
      
      {/* How It Works - sempre visível */}
      <HowItWorks />
      
      {/* Security Section - sempre visível */}
      <SecuritySection />
      
      {/* Testimonials - sempre visível */}
      <TestimonialsSection />
      
      {/* Footer - sempre visível */}
      <SatoTrackFooter />
    </div>
  );
};

export default Home;