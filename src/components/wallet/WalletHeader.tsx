
import React from 'react';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { Star, Wallet } from 'lucide-react';
import { useCarteiras } from '@/contexts/CarteirasContext';
import WalletEditor from './WalletEditor';

interface WalletHeaderProps {
  carteira: CarteiraBTC;
  className?: string;
  extraElement?: React.ReactNode;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ carteira, className, extraElement }) => {
  const { carteiraPrincipal, definirCarteiraPrincipal } = useCarteiras();
  const isPrimary = carteiraPrincipal === carteira.id;

  const togglePrimary = () => {
    if (isPrimary) {
      definirCarteiraPrincipal(null);
    } else {
      definirCarteiraPrincipal(carteira.id);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between w-full ${className}`}>
      <div className="flex items-start sm:items-center gap-2 mb-2 sm:mb-0">
        <div className="bg-dashboard-medium p-2 rounded-lg">
          <Wallet className="h-5 w-5 text-satotrack-neon" />
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{carteira.nome}</h1>
            <WalletEditor initialName={carteira.nome} />
            <button
              onClick={togglePrimary}
              className="focus:outline-none"
              title={isPrimary ? "Remover como principal" : "Definir como principal"}
            >
              <Star
                className={`h-5 w-5 ${
                  isPrimary ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                } transition-colors`}
              />
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground font-mono truncate">
            {carteira.endereco}
          </p>
        </div>
      </div>
      
      {extraElement && (
        <div className="ml-auto mt-2 sm:mt-0">
          {extraElement}
        </div>
      )}
    </div>
  );
};

export default WalletHeader;
