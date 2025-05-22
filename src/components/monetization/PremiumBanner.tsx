
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PremiumBannerProps {
  className?: string;
}

const PremiumBanner: React.FC<PremiumBannerProps> = ({ className }) => {
  return (
    <div className={`relative bg-gradient-to-r from-dashboard-dark via-dashboard-medium to-dashboard-dark border-2 border-primary/30 rounded-lg overflow-hidden ${className}`}>
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary/30 blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-accent/30 blur-xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Star className="h-5 w-5 text-accent" />
            <span className="text-glow-subtle">Liberte o poder do SatoTrack Premium</span>
          </h3>
          <p className="text-sm text-white/90 mt-1">
            Gráficos avançados, histórico completo e alertas inteligentes
          </p>
        </div>
        <Link to="/planos">
          <Button variant="neon" className="border-2 text-primary hover:shadow-neon-lg">
            Conheça o Premium
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PremiumBanner;
