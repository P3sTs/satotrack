
import React from 'react';
import { WalletNode } from '../hooks/useWalletNodes';

interface SceneStatusProps {
  walletNodes: WalletNode[];
}

const SceneStatus: React.FC<SceneStatusProps> = ({ walletNodes }) => {
  if (walletNodes.length === 0) return null;

  const totalBalance = walletNodes.reduce((sum, node) => sum + node.balance, 0);

  return (
    <div className="absolute top-20 left-4 z-40 bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg border border-cyan-500/50">
      <div className="text-sm">
        <div className="text-cyan-400 font-semibold">
          📊 {walletNodes.length} carteira{walletNodes.length > 1 ? 's' : ''} ativa{walletNodes.length > 1 ? 's' : ''}
        </div>
        <div className="text-gray-300 text-xs mt-1">
          💰 Total: {totalBalance.toFixed(8)} BTC
        </div>
      </div>
    </div>
  );
};

export default SceneStatus;
