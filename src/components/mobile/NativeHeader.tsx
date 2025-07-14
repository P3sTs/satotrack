import React, { useState } from 'react';
import { Search, ChevronDown, Camera } from 'lucide-react';
import { WalletInfoModal } from '@/components/modals/WalletInfoModal';

interface NativeHeaderProps {
  title: string;
  subtitle?: string;
  onTitleClick?: () => void;
}

const NativeHeader: React.FC<NativeHeaderProps> = ({ title, subtitle, onTitleClick }) => {
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleTitleClick = () => {
    if (onTitleClick) {
      onTitleClick();
    } else {
      setShowWalletModal(true);
    }
  };

  // Mock wallet data - this would come from your wallet context
  const walletData = {
    name: title,
    address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
    network: 'Bitcoin',
    balance: '0.00135',
    currency: 'BTC'
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-dashboard-dark/95 backdrop-blur-lg border-b border-dashboard-medium/30 z-50">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left side - Camera */}
          <div className="w-10 h-10 rounded-lg bg-dashboard-medium/50 flex items-center justify-center">
            <Camera className="h-5 w-5 text-satotrack-text" />
          </div>

          {/* Center - Title with dropdown */}
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleTitleClick}
            >
              <span className="text-white font-medium">
                {title}
              </span>
              <ChevronDown className="h-4 w-4 text-satotrack-text" />
            </div>
          </div>

          {/* Right side - Search */}
          <div className="w-10 h-10 rounded-lg bg-dashboard-medium/50 flex items-center justify-center">
            <Search className="h-5 w-5 text-satotrack-text" />
          </div>
        </div>
        
        {subtitle && (
          <div className="px-4 py-2 border-b border-dashboard-medium/20">
            <p className="text-xs text-satotrack-text">{subtitle}</p>
          </div>
        )}
      </div>

      {/* Wallet Info Modal */}
      <WalletInfoModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        walletData={walletData}
      />
    </>
  );
};

export default NativeHeader;