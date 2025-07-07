import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-satotrack-neon/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 satotrack-gradient-text">
              Sua carteira multichain,
              <br />
              <span className="text-foreground">segura e sem complicações</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Com a SatoTrack você <span className="text-satotrack-neon">envia</span>, <span className="text-blue-400">recebe</span> e <span className="text-purple-400">acompanha</span> seus ativos em tempo real
            </p>

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
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;