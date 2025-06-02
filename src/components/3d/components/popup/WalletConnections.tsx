
import React from 'react';
import { WalletNode } from '../../types/WalletNode';

interface WalletConnectionsProps {
  wallet: WalletNode;
}

const WalletConnections: React.FC<WalletConnectionsProps> = ({ wallet }) => {
  const formatAddressDisplay = (address: string, type: 'main' | 'transaction' | 'connected') => {
    if (type === 'transaction') {
      return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
    }
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  if (wallet.connections.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <label className="text-xs text-gray-400 uppercase tracking-wide">
        Conexões Ativas ({wallet.connections.length})
      </label>
      <div className="mt-2 space-y-1">
        {wallet.connections.slice(0, 3).map((connection, index) => (
          <div key={index} className="text-xs text-gray-300 font-mono flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            {formatAddressDisplay(connection, 'connected')}
          </div>
        ))}
        {wallet.connections.length > 3 && (
          <div className="text-xs text-gray-500 pl-4">
            +{wallet.connections.length - 3} conexões a mais...
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnections;
