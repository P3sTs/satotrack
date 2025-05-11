
import React from 'react';
import { Link } from 'react-router-dom';
import { Bitcoin, ArrowRight, RefreshCw } from 'lucide-react';
import { CarteiraBTC } from '../types/types';
import { formatarBTC, formatarData } from '../utils/formatters';
import { Button } from '@/components/ui/button';
import { useCarteiras } from '../contexts/CarteirasContext';

interface CarteiraCardProps {
  carteira: CarteiraBTC;
}

const CarteiraCard: React.FC<CarteiraCardProps> = ({ carteira }) => {
  const { atualizarCarteira, isUpdating } = useCarteiras();

  const handleAtualizar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await atualizarCarteira(carteira.id);
  };

  return (
    <div className="bitcoin-card">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <Bitcoin className="h-5 w-5 text-bitcoin" />
            <h3 className="font-semibold text-lg">{carteira.nome}</h3>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-1">Endereço</p>
          <p className="text-sm font-mono truncate">{carteira.endereco}</p>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Saldo</p>
            <p className="text-2xl font-bold bitcoin-gradient-text">{formatarBTC(carteira.saldo)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Última atualização</p>
            <p className="text-sm">{formatarData(carteira.ultimo_update)}</p>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-muted/30 border-t border-border/50 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          disabled={!!isUpdating[carteira.id]}
          onClick={handleAtualizar}
        >
          {isUpdating[carteira.id] ? (
            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="mr-1 h-3 w-3" />
          )}
          Atualizar
        </Button>
        
        <Link to={`/carteira/${carteira.id}`}>
          <Button variant="ghost" size="sm" className="text-xs">
            Ver detalhes
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CarteiraCard;
