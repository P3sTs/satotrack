
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Cores customizadas para o tema SatoTrack
  const satoTrackGradient = [
    "#0A0A0A",           // Dashboard dark
    "#00FFC6",           // SatoTrack neon
    "#06B6D4",           // Cyan-500
    "#3B82F6",           // Blue-500  
    "#8B5CF6",           // Violet-500
    "#10B981",           // Emerald-500
    "#F59E0B"            // Amber-500
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient Animado */}
      <AnimatedGradientBackground
        Breathing={true}
        gradientColors={satoTrackGradient}
        gradientStops={[25, 40, 55, 70, 80, 90, 100]}
        startingGap={110}
        breathingRange={6}
        animationSpeed={0.018}
        topOffset={15}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-md border border-border/30 rounded-full px-4 py-2 mb-8">
            <span className="text-sm font-medium text-satotrack-neon">SatoTracker</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Sua carteira </span>
            <span className="text-satotrack-neon">multichain</span>
            <br />
            <span className="text-foreground">segura e sem complicações</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Com a SatoTrack você envia, recebe e acompanha seus ativos em tempo real
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {!user ? (
              <>
                <Button 
                  size="lg" 
                  className="group bg-satotrack-neon text-black hover:bg-satotrack-neon/90 text-lg px-8 py-6 rounded-2xl font-semibold w-full sm:w-auto"
                  onClick={() => navigate('/auth?mode=signup')}
                >
                  🚀 Criar Conta Grátis
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 p-4 bg-card/50 backdrop-blur-md rounded-xl border border-border/20">
              <Shield className="h-5 w-5 text-satotrack-neon" />
              <span className="text-sm text-foreground font-medium">KMS Seguro</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 p-4 bg-card/50 backdrop-blur-md rounded-xl border border-border/20">
              <Zap className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-foreground font-medium">50+ Networks</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 p-4 bg-card/50 backdrop-blur-md rounded-xl border border-border/20">
              <Globe className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-foreground font-medium">Global Access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
