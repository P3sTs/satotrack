
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const HeroBitcoinSection = () => {
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
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png" 
              alt="SatoTrack Logo" 
              className="h-16 w-16 object-contain"
            />
            <h1 className="text-3xl md:text-5xl font-extrabold">
              SatoTrack
            </h1>
          </div>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Rastreie o mercado e suas carteiras em tempo real
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {!user && (
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-bitcoin hover:bg-bitcoin/80 text-white font-bold"
              >
                Começar a Monitorar
              </Button>
            )}
            {user ? (
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                Ir para Dashboard
              </Button>
            ) : (
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

export default HeroBitcoinSection;
