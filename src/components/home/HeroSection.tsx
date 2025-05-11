
import React from 'react';
import { Link } from 'react-router-dom';
import { Bitcoin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-dashboard-dark to-background">
      <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center gap-4">
        <Bitcoin className="h-12 w-12 text-bitcoin animate-pulse-slow" />
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter bitcoin-gradient-text">
          SatoTrack
        </h1>
        <p className="max-w-[700px] text-zinc-200 md:text-xl">
          Monitore o mercado de Bitcoin e suas carteiras em tempo real.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {!user ? (
            <Link to="/auth">
              <Button className="bg-bitcoin hover:bg-bitcoin-dark">
                Monitorar Carteiras BTC
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link to="/dashboard">
              <Button className="bg-bitcoin hover:bg-bitcoin-dark">
                Ir para o Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
