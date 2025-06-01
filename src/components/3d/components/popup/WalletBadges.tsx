
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { WalletNode } from '../../hooks/useWalletNodes';

interface WalletBadgesProps {
  wallet: WalletNode;
}

const WalletBadges: React.FC<WalletBadgesProps> = ({ wallet }) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Badge 
        variant="outline" 
        className={`
          ${wallet.type === 'main' ? 'border-cyan-500/50 text-cyan-400' : ''}
          ${wallet.type === 'transaction' ? 'border-purple-500/50 text-purple-400' : ''}
          ${wallet.type === 'connected' ? 'border-green-500/50 text-green-400' : ''}
        `}
      >
        {wallet.type === 'main' && '🏦 Principal'}
        {wallet.type === 'transaction' && '⚡ Transação'}
        {wallet.type === 'connected' && '🔗 Conectada'}
      </Badge>
      
      {wallet.isLocked && (
        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
          🔒 Travada
        </Badge>
      )}

      {wallet.balance === 0 && wallet.type === 'main' && (
        <Badge variant="outline" className="border-gray-500/50 text-gray-400">
          💸 Vazia
        </Badge>
      )}
    </div>
  );
};

export default WalletBadges;
