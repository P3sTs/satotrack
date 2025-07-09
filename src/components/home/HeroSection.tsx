
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useAnimations } from '@/hooks/useAnimations';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { animateIn, animateFloat, animateGlow } = useAnimations();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Delay para garantir que os elementos estejam montados
    const timer = setTimeout(() => {
      try {
        // Animate hero content on mount
        animateIn('.hero-title', { delay: 200 });
        animateIn('.hero-subtitle', { delay: 400 });
        animateIn('.hero-buttons', { delay: 600 });
        animateIn('.trust-indicators', { delay: 800 });
        
        // Floating animation for background elements
        animateFloat('.floating-element');
        animateGlow('.glow-element');
      } catch (error) {
        console.error('🎬 Animation error in HeroSection:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [animateIn, animateFloat, animateGlow, isClient]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="floating-element glow-element absolute top-1/4 left-1/4 w-32 h-32 bg-satotrack-neon/20 rounded-full blur-3xl"></div>
        <div className="floating-element absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div>
            <h1 className="hero-title opacity-0 text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="satotrack-gradient-text">
                Sua carteira multichain,
              </span>
              <br />
              <span className="text-foreground">segura e sem complicações</span>
            </h1>
            
            <p className="hero-subtitle opacity-0 text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Com a SatoTrack você <span className="text-satotrack-neon">envia</span>, <span className="text-blue-400">recebe</span> e <span className="text-purple-400">acompanha</span> seus ativos em tempo real
            </p>

            {/* CTA Buttons */}
            <div className="hero-buttons opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              {!user ? (
                <>
                  <Button 
                    size="lg" 
                    className="group bg-satotrack-neon text-black hover:bg-satotrack-neon/90 text-lg px-8 py-6 rounded-2xl font-semibold w-full sm:w-auto"
                    onClick={() => navigate('/auth?action=register')}
                  >
                    🎫 Criar ticket de acesso gratuito
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10 text-lg px-8 py-6 rounded-2xl font-semibold w-full sm:w-auto"
                    onClick={() => navigate('/auth')}
                  >
                    🔐 Fazer Login
                  </Button>
                </>
              ) : (
                <Button 
                  size="lg" 
                  className="group bg-satotrack-neon text-black hover:bg-satotrack-neon/90 text-lg px-8 py-6 rounded-2xl font-semibold"
                  onClick={() => navigate('/dashboard')}
                >
                  🚀 Acessar Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="trust-indicators opacity-0 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 p-4 bg-card/50 rounded-xl border border-border/20">
                <Shield className="h-5 w-5 text-satotrack-neon" />
                <span className="text-sm text-foreground font-medium">KMS Seguro</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 p-4 bg-card/50 rounded-xl border border-border/20">
                <Zap className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-foreground font-medium">50+ Networks</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 p-4 bg-card/50 rounded-xl border border-border/20">
                <Globe className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-foreground font-medium">Global Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
