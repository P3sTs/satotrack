
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletNode } from '../../types/WalletNode';

interface WalletHeaderProps {
  wallet: WalletNode;
  onClose: () => void;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ wallet, onClose }) => {
  const getTypeIcon = () => {
    switch (wallet.type) {
      case 'main':
        return '💰';
      case 'transaction':
        return '🔄';
      case 'connected':
        return '🔗';
      default:
        return '📍';
    }
  };

  const getTypeLabel = () => {
    switch (wallet.type) {
      case 'main':
        return 'Carteira Principal';
      case 'transaction':
        return 'Transação';
      case 'connected':
        return 'Carteira Conectada';
      default:
        return 'Carteira';
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{getTypeIcon()}</div>
        <div>
          <h3 className="text-lg font-bold text-white">
            {getTypeLabel()}
          </h3>
          <div className="text-sm text-gray-400">
            ID: {wallet.id.substring(0, 8)}...
          </div>
        </div>
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
