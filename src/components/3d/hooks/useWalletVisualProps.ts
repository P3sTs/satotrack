
import { useMemo } from 'react';
import { WalletNode } from '../types/WalletNode';

export const useWalletVisualProps = (node: WalletNode) => {
  return useMemo(() => {
    // Validações de segurança
    if (!node) {
      return {
        color: '#06b6d4',
        size: 1,
        innerRadius: 1.3,
        outerRadius: 1.5,
        glowSize: 1.15
      };
    }

    const getColor = () => {
      if (node.type === 'main') return '#06b6d4';
      if (node.type === 'transaction') return '#8b5cf6';
      return '#10b981';
    };

    const getSize = () => {
      const baseSize = 1;
      const balance = typeof node.balance === 'number' && !isNaN(node.balance) ? node.balance : 0;
      const balanceScale = Math.min(Math.log10(Math.abs(balance) + 1) * 0.3, 1.5);
      const finalSize = Math.max(baseSize, baseSize + balanceScale);
      
      // Garantir que retornamos um número válido dentro de limites seguros
      return Math.max(0.5, Math.min(3, isNaN(finalSize) ? baseSize : finalSize));
    };

    const size = getSize();
    const color = getColor();
    
    return { 
      color: color,
      size: size,
      // Pré-calcular valores para evitar cálculos no render
      innerRadius: Math.max(0.7, Math.min(4, size * 1.3)),
      outerRadius: Math.max(0.8, Math.min(5, size * 1.5)),
      glowSize: Math.max(0.6, Math.min(4, size * 1.15))
    };
  }, [node?.type, node?.balance]);
};
