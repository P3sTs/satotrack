
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary/90 to-bitcoin py-12 text-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Monitor e Analise seus <span className="text-bitcoin">Bitcoins</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Acompanhe suas carteiras de Bitcoin, analise o mercado em tempo real e tome decisões mais informadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-bitcoin hover:bg-bitcoin/80 text-white font-bold"
            >
              {user ? 'Acessar Dashboard' : 'Começar Agora'}
            </Button>
            {!user && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
