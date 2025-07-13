
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <HeroGeometric 
      badge="SatoTracker"
      title1="Sua carteira multichain"
      title2="segura e sem complicações"
      description="Com a SatoTrack você envia, recebe e acompanha seus ativos em tempo real"
    >
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
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
    </HeroGeometric>
  );
};

export default HeroSection;
