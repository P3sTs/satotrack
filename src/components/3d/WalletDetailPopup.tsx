
import React from 'react';
import WalletHeader from './components/popup/WalletHeader';
import WalletAddress from './components/popup/WalletAddress';
import WalletStats from './components/popup/WalletStats';
import WalletBadges from './components/popup/WalletBadges';
import TransactionsList from './components/popup/TransactionsList';
import WalletActions from './components/popup/WalletActions';
import WalletConnections from './components/popup/WalletConnections';
import PopupFooter from './components/popup/PopupFooter';

interface WalletNode {
  id: string;
  address: string;
  position: any;
  balance: number;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  isLocked: boolean;
  connections: string[];
  type: 'main' | 'transaction' | 'connected';
  transactions?: Array<{
    hash: string;
    amount: number;
    transaction_type: string;
    transaction_date: string;
  }>;
}

interface WalletDetailPopupProps {
  wallet: WalletNode;
  onClose: () => void;
  onAddConnection: (address: string) => void;
  onExpandConnections?: () => void;
}

const WalletDetailPopup: React.FC<WalletDetailPopupProps> = ({
  wallet,
  onClose,
  onAddConnection,
  onExpandConnections
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-black border border-cyan-500/50 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <WalletHeader wallet={wallet} onClose={onClose} />
        <WalletAddress wallet={wallet} />
        <WalletStats wallet={wallet} />
        <WalletBadges wallet={wallet} />
        <TransactionsList wallet={wallet} />
        <WalletActions 
          wallet={wallet}
          onAddConnection={onAddConnection}
          onExpandConnections={onExpandConnections}
        />
        <WalletConnections wallet={wallet} />
        <PopupFooter />
      </div>
    </div>
  );
};

export default WalletDetailPopup;
