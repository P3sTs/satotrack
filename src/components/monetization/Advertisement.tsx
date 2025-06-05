
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdvertisementProps {
  position: 'sidebar' | 'footer' | 'panel';
  className?: string;
}

const advertisements = [
  {
    id: 1,
    title: 'Segurança para seus Bitcoins',
    description: 'Proteja seus ativos com a melhor hardware wallet do mercado!',
    cta: 'Comprar Agora',
    link: '#',
  },
  {
    id: 2,
    title: 'Curso de Trading Bitcoin',
    description: 'Aprenda estratégias avançadas para maximizar seus ganhos',
    cta: 'Conhecer Curso',
    link: '#',
  },
  {
    id: 3,
    title: 'Exchange com Baixas Taxas',
    description: 'Negocie Bitcoin com as menores taxas do mercado',
    cta: 'Criar Conta',
    link: '#',
  }
];

export const Advertisement: React.FC<AdvertisementProps> = ({ position, className = '' }) => {
  const { userPlan, upgradeUserPlan } = useAuth();
  const [visible, setVisible] = React.useState(true);
  const [adIndex, setAdIndex] = React.useState(Math.floor(Math.random() * advertisements.length));
  
  // Don't show ads for premium users
  if (userPlan === 'premium' || !visible) return null;
  
  const ad = advertisements[adIndex];
  
  const handleClose = () => {
    setVisible(false);
  };
  
  const handleUpgrade = () => {
    upgradeUserPlan();
  };
  
  if (position === 'footer') {
    return (
      <div className={`fixed bottom-0 left-0 right-0 bg-card p-3 border-t border-border z-30 ${className}`}>
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center text-xs">
            <AlertCircle className="h-3 w-3 mr-2 text-muted-foreground" />
            <span>Anúncio</span>
          </div>
          <div className="flex-1 text-center text-sm py-1">
            {ad.title} - <a href={ad.link} className="text-bitcoin hover:underline">{ad.cta}</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleUpgrade}>
              Remover anúncios
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (position === 'sidebar') {
    return (
      <div className={`relative border rounded-lg p-4 bg-card mb-4 ${className}`}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleClose}
          className="absolute top-1 right-1 h-6 w-6"
        >
          <X className="h-3 w-3" />
        </Button>
        <div className="flex items-center text-xs mb-2">
          <AlertCircle className="h-3 w-3 mr-1 text-muted-foreground" />
          <span>Anúncio</span>
        </div>
        <h4 className="font-medium text-sm mb-2">{ad.title}</h4>
        <p className="text-xs text-muted-foreground mb-3">{ad.description}</p>
        <div className="flex justify-between items-center">
          <a 
            href={ad.link}
            className="text-xs text-bitcoin hover:underline"
          >
            {ad.cta}
          </a>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-7"
            onClick={handleUpgrade}
          >
            Remover anúncios
          </Button>
        </div>
      </div>
    );
  }
  
  // Panel ad (default)
  return (
    <div className={`relative border rounded-lg p-4 bg-card ${className}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleClose}
        className="absolute top-2 right-2 h-6 w-6"
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="flex items-center text-xs mb-2">
        <AlertCircle className="h-3 w-3 mr-1 text-muted-foreground" />
        <span>Anúncio</span>
      </div>
      <h4 className="font-medium mb-2">{ad.title}</h4>
      <p className="text-sm text-muted-foreground mb-4">{ad.description}</p>
      <div className="flex justify-between items-center">
        <a 
          href={ad.link}
          className="text-bitcoin hover:underline"
        >
          {ad.cta}
        </a>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleUpgrade}
        >
          Remover anúncios
        </Button>
      </div>
    </div>
  );
};
