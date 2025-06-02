
import { useMemo } from 'react';
import { WalletNode } from '../types/WalletNode';

export const useWalletVisualProps = (node: WalletNode) => {
  return useMemo(() => {
    const getColor = () => {
      if (node.type === 'main') return '#06b6d4';
      if (node.type === 'transaction') return '#8b5cf6';
      return '#10b981';
    };

    const getSize = () => {
      const baseSize = 1;
      const balance = typeof node.balance === 'number' ? node.balance : 0;
      const balanceScale = Math.min(Math.log10(balance + 1) * 0.3, 1.5);
      const finalSize = Math.max(baseSize, baseSize + balanceScale);
      
      // Garantir que retornamos um número válido
      return isNaN(finalSize) ? baseSize : finalSize;
    };

    const size = getSize();
    return { 
      color: getColor(), 
      size: size,
      // Pré-calcular valores para evitar cálculos no render
      innerRadius: size * 1.3,
      outerRadius: size * 1.5,
      glowSize: size * 1.15
    };
  }, [node.type, node.balance]);
};
