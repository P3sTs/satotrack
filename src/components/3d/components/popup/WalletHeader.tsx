
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Wallet, Hash, Plus } from 'lucide-react';
import { WalletNode } from '../../hooks/useWalletNodes';

interface WalletHeaderProps {
  wallet: WalletNode;
  onClose: () => void;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ wallet, onClose }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {wallet.type === 'main' && <Wallet className="h-5 w-5 text-cyan-400" />}
        {wallet.type === 'transaction' && <Hash className="h-5 w-5 text-purple-400" />}
        {wallet.type === 'connected' && <Plus className="h-5 w-5 text-green-400" />}
        
        <h3 className="text-xl font-bold text-cyan-400">
          {wallet.type === 'main' && 'Carteira Bitcoin'}
          {wallet.type === 'transaction' && 'Transação'}
          {wallet.type === 'connected' && 'Carteira Conectada'}
        </h3>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="text-gray-400 hover:text-white"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WalletHeader;
