
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import SecuritySection from '@/components/home/SecuritySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { EnhancedFeaturesSection } from '@/components/home/EnhancedFeaturesSection';
import { SatoTrackFooter } from '@/components/ui/footer-section';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Enhanced Features Section */}
      <EnhancedFeaturesSection />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Security Section */}
      <SecuritySection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Footer */}
      <SatoTrackFooter />
    </div>
  );
};

export default Home;
