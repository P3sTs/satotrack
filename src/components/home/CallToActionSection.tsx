
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, Shield, Zap } from 'lucide-react';

const CallToActionSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-dashboard-medium/20 to-dashboard-dark">
      <div className="container mx-auto max-w-4xl">
        <Card className="cyberpunk-card overflow-hidden">
          <CardContent className="p-12 text-center">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-satotrack-neon/5 via-transparent to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-satotrack-neon/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-satotrack-neon/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="mb-8">
                <div className="flex justify-center space-x-4 mb-6">
                  <div className="p-3 rounded-xl bg-satotrack-neon/20 border border-satotrack-neon/30">
                    <Eye className="h-6 w-6 text-satotrack-neon" />
                  </div>
                  <div className="p-3 rounded-xl bg-satotrack-neon/20 border border-satotrack-neon/30">
                    <Shield className="h-6 w-6 text-satotrack-neon" />
                  </div>
                  <div className="p-3 rounded-xl bg-satotrack-neon/20 border border-satotrack-neon/30">
                    <Zap className="h-6 w-6 text-satotrack-neon" />
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-4">
                  Pronto para <span className="satotrack-gradient-text">Começar</span>?
                </h2>
                
                <p className="text-xl text-satotrack-text font-inter max-w-2xl mx-auto leading-relaxed">
                  Junte-se a milhares de usuários que já confiam no SatoTracker para 
                  gerenciar seus ativos digitais com segurança e inteligência.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-bold satotrack-gradient-text mb-2">
                    Gratuito
                  </div>
                  <div className="text-satotrack-text font-inter text-sm">
                    Para começar
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-bold satotrack-gradient-text mb-2">
                    Seguro
                  </div>
                  <div className="text-satotrack-text font-inter text-sm">
                    Criptografia bancária
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-bold satotrack-gradient-text mb-2">
                    Completo
                  </div>
                  <div className="text-satotrack-text font-inter text-sm">
                    Todas as ferramentas
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/auth?mode=signup')}
                  size="lg"
                  className="group bg-gradient-to-r from-satotrack-neon to-satotrack-neon/80 text-black hover:from-satotrack-neon/90 hover:to-satotrack-neon/70 font-semibold px-8 py-4 text-lg rounded-xl font-inter transition-all duration-300 shadow-lg hover:shadow-satotrack-neon/25"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Criar Conta Gratuita
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <Button
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  size="lg"
                  className="border-satotrack-neon/50 text-satotrack-neon hover:bg-satotrack-neon/10 hover:border-satotrack-neon px-8 py-4 text-lg rounded-xl font-inter transition-all duration-300"
                >
                  Já Tenho Conta
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-dashboard-light/20">
                <p className="text-sm text-satotrack-text/60 font-inter">
                  ✓ Sem taxas ocultas • ✓ Suporte 24/7 • ✓ Dados protegidos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CallToActionSection;
