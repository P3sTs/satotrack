import { useState, useEffect } from 'react';

interface CryptoAsset {
  symbol: string;
  name: string;
  icon: string;
  price?: string | number;
  change: number;
  amount?: string | number;
  value?: string | number;
  network: string;
}

const DEFAULT_ORDER = ['BTC', 'ETH', 'USDT', 'MATIC', 'SOL'];

export const useCryptoCardOrder = (assets: CryptoAsset[]) => {
  const [order, setOrder] = useState<string[]>(() => {
    // Tentar carregar ordem salva do localStorage
    const savedOrder = localStorage.getItem('crypto-card-order');
    if (savedOrder) {
      try {
        return JSON.parse(savedOrder);
      } catch {
        return DEFAULT_ORDER;
      }
    }
    return DEFAULT_ORDER;
  });

  // Salvar ordem no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('crypto-card-order', JSON.stringify(order));
  }, [order]);

  // Ordenar assets baseado na ordem configurada
  const orderedAssets = assets.sort((a, b) => {
    const indexA = order.indexOf(a.symbol);
    const indexB = order.indexOf(b.symbol);
    
    // Se o símbolo não está na ordem, colocar no final
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });

  const reorderCards = (newOrder: string[]) => {
    setOrder(newOrder);
  };

  const resetOrder = () => {
    setOrder(DEFAULT_ORDER);
  };

  return {
    orderedAssets,
    order,
    reorderCards,
    resetOrder
  };
};