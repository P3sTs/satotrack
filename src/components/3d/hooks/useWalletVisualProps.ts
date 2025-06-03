
import { useMemo } from 'react';
import { WalletNode } from '../types/WalletNode';

export const useWalletVisualProps = (node: WalletNode) => {
  return useMemo(() => {
    // Validações de segurança rigorosas
    if (!node) {
      return {
        color: '#06b6d4',
        size: 1,
        innerRadius: 1.3,
        outerRadius: 1.5,
        glowSize: 1.15
      };
    }

    // Funções puras para cálculos
    const getColor = (nodeType: string) => {
      if (nodeType === 'main') return '#06b6d4';
      if (nodeType === 'transaction') return '#8b5cf6';
      return '#10b981';
    };

    const getSize = (balance: number) => {
      const baseSize = 1;
      const safeBalance = typeof balance === 'number' && !isNaN(balance) ? Math.abs(balance) : 0;
      const balanceScale = Math.min(Math.log10(safeBalance + 1) * 0.3, 1.5);
      const finalSize = baseSize + balanceScale;
      
      // Garantir que retornamos um número válido dentro de limites seguros
      return Math.max(0.5, Math.min(3, isNaN(finalSize) ? baseSize : finalSize));
    };

    const size = getSize(node.balance || 0);
    const color = getColor(node.type || 'main');
    
    // Retornar apenas valores primitivos
    return { 
      color,
      size,
      innerRadius: Math.max(0.7, Math.min(4, size * 1.3)),
      outerRadius: Math.max(0.8, Math.min(5, size * 1.5)),
      glowSize: Math.max(0.6, Math.min(4, size * 1.15))
    };
  }, [node?.type, node?.balance]);
};
