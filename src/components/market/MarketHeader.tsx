
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface MarketHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const MarketHeader: React.FC<MarketHeaderProps> = ({ isRefreshing, onRefresh }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-orbitron satotrack-gradient-text mb-2">
          Mercado Bitcoin
        </h1>
        <p className="text-muted-foreground">
          Ferramentas avançadas para análise de mercado
        </p>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onRefresh} 
        disabled={isRefreshing}
        className="flex items-center gap-2 mt-2 sm:mt-0 border-satotrack-neon text-satotrack-neon hover:bg-satotrack-neon/10"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        Atualizar Dados
      </Button>
    </div>
  );
};

export default MarketHeader;
