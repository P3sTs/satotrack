
import React from 'react';
import { WalletNode } from '../../types/WalletNode';

interface WalletBadgesProps {
  wallet: WalletNode;
}

const WalletBadges: React.FC<WalletBadgesProps> = ({ wallet }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {wallet.isLocked && (
        <div className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
          🔒 Travada
        </div>
      )}
      
      {wallet.connections && wallet.connections.length > 0 && (
        <div className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
          🔗 {wallet.connections.length} conexões
        </div>
      )}
      
      {wallet.transactions && wallet.transactions.length > 0 && (
        <div className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
          📊 {wallet.transactions.length} transações
        </div>
      )}
      
      {wallet.balance > 0 && (
        <div className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
          💰 Ativa
        </div>
      )}
    </div>
  );
};

export default WalletBadges;
