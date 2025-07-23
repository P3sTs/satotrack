
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import SecuritySection from '@/components/home/SecuritySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { EnhancedFeaturesSection } from '@/components/home/EnhancedFeaturesSection';
import { SatoTrackFooter } from '@/components/ui/footer-section';
import EnhancedHeroSection from '@/components/sections/EnhancedHeroSection';
import AnimatedBackground from '@/components/ui/enhanced/AnimatedBackground';
import ParallaxSection from '@/components/ui/enhanced/ParallaxSection';


const Home = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground variant="grid" intensity={0.3} speed={0.5} />
      
      {/* Enhanced Hero Section */}
      <EnhancedHeroSection />
      
      {/* Enhanced Features Section with Parallax */}
      <ParallaxSection speed={0.3}>
        <EnhancedFeaturesSection />
      </ParallaxSection>
      
      {/* How It Works with Parallax */}
      <ParallaxSection speed={0.2} direction="right">
        <HowItWorks />
      </ParallaxSection>
      
      {/* Security Section with Parallax */}
      <ParallaxSection speed={0.4}>
        <SecuritySection />
      </ParallaxSection>
      
      {/* Testimonials with Parallax */}
      <ParallaxSection speed={0.3} direction="left">
        <TestimonialsSection />
      </ParallaxSection>
      
      {/* Footer */}
      <SatoTrackFooter />
    </div>
  );
};

export default Home;
