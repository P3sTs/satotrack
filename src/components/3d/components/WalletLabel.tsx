
import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { WalletNode } from '../types/WalletNode';

interface WalletLabelProps {
  node: WalletNode;
  size: number;
  hovered: boolean;
}

const WalletLabel: React.FC<WalletLabelProps> = ({ node, size, hovered }) => {
  const formattedAddress = useMemo(() => 
    `${node.address.substring(0, 8)}...${node.address.substring(node.address.length - 8)}`,
    [node.address]
  );

  if (!hovered) return null;

  return (
    <Html
      position={[0, size + 1, 0]}
      center
      distanceFactor={8}
      occlude
    >
      <div className="bg-black/90 backdrop-blur-sm text-white p-2 rounded-lg border border-cyan-500/50 text-xs pointer-events-none max-w-xs">
        <div className="font-mono text-xs truncate">
          {formattedAddress}
        </div>
        <div className="text-cyan-400">
          💰 {(node.balance || 0).toFixed(4)} BTC
        </div>
        <div className="text-purple-400">
          🔄 {node.transactionCount || 0} tx
        </div>
        {node.isLocked && (
          <div className="text-yellow-400 mt-1">
            🔒 Travada
          </div>
        )}
      </div>
    </Html>
  );
};

export default WalletLabel;
