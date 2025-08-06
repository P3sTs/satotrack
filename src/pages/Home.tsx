
import React from 'react';
import AnimatedLayout from '@/components/ui/enhanced/AnimatedLayout';
import TrustWalletStyleHero from '@/components/home/TrustWalletStyleHero';
import TrustWalletFeatures from '@/components/home/TrustWalletFeatures';
import TrustWalletProducts from '@/components/home/TrustWalletProducts';
import FooterSection from '@/components/home/FooterSection';

const Home: React.FC = () => {
  return (
    <AnimatedLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <TrustWalletStyleHero />
        
        {/* Features Section */}
        <TrustWalletFeatures />
        
        {/* Products Section */}
        <TrustWalletProducts />
        
        {/* Footer */}
        <FooterSection />
      </div>
    </AnimatedLayout>
  );
};

export default Home;
