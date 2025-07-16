import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, RefreshCw, ShoppingCart } from 'lucide-react';

interface CoinActionsProps {
  onSend: () => void;
  onReceive: () => void;
  onSwap: () => void;
  onBuy: () => void;
}

export const CoinActions: React.FC<CoinActionsProps> = ({ onSend, onReceive, onSwap, onBuy }) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      <Button
        variant="outline"
        className="flex flex-col h-16 bg-background text-foreground"
        onClick={onSend}
      >
        <ArrowUp className="h-5 w-5 mb-1" />
        <span className="text-xs">Enviar</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col h-16 bg-background text-foreground"
        onClick={onReceive}
      >
        <ArrowDown className="h-5 w-5 mb-1" />
        <span className="text-xs">Receber</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col h-16 bg-background text-foreground"
        onClick={onSwap}
      >
        <RefreshCw className="h-5 w-5 mb-1" />
        <span className="text-xs">Swap</span>
      </Button>
      
      <Button
        className="flex flex-col h-16 bg-green-500 hover:bg-green-600 text-white"
        onClick={onBuy}
      >
        <ShoppingCart className="h-5 w-5 mb-1" />
        <span className="text-xs">Comprar</span>
      </Button>
    </div>
  );
};