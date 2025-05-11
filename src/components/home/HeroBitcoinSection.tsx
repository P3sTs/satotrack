
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Eye } from 'lucide-react';

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
    <section className="bg-gradient-to-r from-dashboard-dark to-dashboard-medium py-16 md:py-20 text-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <img 
                src="/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png" 
                alt="SatoTrack Logo" 
                className="h-20 w-20 object-contain satotrack-logo animate-glow"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-orbitron font-extrabold">
              <span className="satotrack-gradient-text">SatoTrack</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl max-w-2xl text-gray-300 font-inter">
            O olho invisível da blockchain
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {!user && (
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-satotrack-neon text-dashboard-dark hover:bg-satotrack-neon/90 font-bold font-inter"
              >
                <Eye className="mr-2 h-5 w-5" />
                Começar a Monitorar
              </Button>
            )}
            {user ? (
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="bg-transparent border-satotrack-neon text-satotrack-neon hover:bg-satotrack-neon/10 font-inter"
              >
                Ir para Dashboard
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-transparent border-satotrack-neon text-satotrack-neon hover:bg-satotrack-neon/10 font-inter"
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
