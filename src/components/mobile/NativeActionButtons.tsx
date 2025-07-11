import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Zap, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { SendCryptoModal } from '@/components/modals/SendCryptoModal';
import { ReceiveCryptoModal } from '@/components/modals/ReceiveCryptoModal';
import { BuyCryptoModal } from '@/components/modals/BuyCryptoModal';
import { GuestActionModal } from '@/components/guest/GuestActionModal';
import { useRealTimePrices } from '@/hooks/useRealTimePrices';

interface ActionButton {
  icon: React.ReactNode;
  label: string;
  variant?: 'default' | 'primary';
  onClick?: () => void;
}

const NativeActionButtons: React.FC = () => {
  const { isGuestMode, user, interceptAction } = useAuth();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  
  const { prices } = useRealTimePrices();

  const handleAction = (actionName: string, callback: () => void) => {
    // Se for modo convidado, interceptar e mostrar modal
    if (isGuestMode) {
      setCurrentAction(actionName);
      setGuestModalOpen(true);
      return;
    }
    
    // Se usuário está autenticado, executar ação normal
    if (user) {
      callback();
      return;
    }
    
    // Se não tem usuário nem é convidado, mostrar erro
    setCurrentAction('fazer login');
    setGuestModalOpen(true);
  };

  // Mock wallet data - this would come from your wallet context
  const mockWallets = [
    {
      id: '1',
      name: 'Bitcoin Wallet',
      currency: 'BTC',
      balance: 0.00135,
      network: 'Bitcoin',
      address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
    },
    {
      id: '2',
      name: 'Ethereum Wallet',
      currency: 'ETH',
      balance: 0.15,
      network: 'Ethereum',
      address: '0x742d35Cc9C66C4B3B4568de8476FdBC43E87C4Ea'
    },
    {
      id: '3',
      name: 'Solana Wallet',
      currency: 'SOL',
      balance: 2.5,
      network: 'Solana',
      address: '8UvwdMKHaZQ6r3AqhM7L3fQhD2G7C4YnKsVePP9LJBu9'
    }
  ];

  // Convert price data to supported cryptos for buy modal
  const supportedCryptos = Object.entries(prices || {}).map(([key, data]) => ({
    symbol: key.toUpperCase(),
    name: key.charAt(0).toUpperCase() + key.slice(1),
    currentPrice: data.brl
  }));

  const actions: ActionButton[] = [
    {
      icon: <ArrowUp className="h-5 w-5" />,
      label: 'Enviar',
      variant: 'default',
      onClick: () => handleAction('enviar criptomoedas', () => setShowSendModal(true))
    },
    {
      icon: <ArrowDown className="h-5 w-5" />,
      label: 'Receber',
      variant: 'default',
      onClick: () => handleAction('receber criptomoedas', () => setShowReceiveModal(true))
    },
    {
      icon: <Zap className="h-5 w-5" />,
      label: 'Comprar',
      variant: 'primary',
      onClick: () => handleAction('comprar criptomoedas', () => setShowBuyModal(true))
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      label: 'Vender',
      variant: 'default',
      onClick: () => handleAction('vender criptomoedas', () => setShowSellModal(true))
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center px-6 py-4 gap-4">
        {actions.map((action, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={action.onClick}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              action.variant === 'primary' 
                ? 'bg-satotrack-neon text-black' 
                : 'bg-dashboard-medium/50 text-satotrack-text'
            }`}>
              {action.icon}
            </div>
            <span className="text-xs text-satotrack-text">{action.label}</span>
          </div>
        ))}
      </div>

      {/* Modals - Só aparecem para usuários autenticados */}
      {user && !isGuestMode && (
        <>
          <SendCryptoModal
            isOpen={showSendModal}
            onClose={() => setShowSendModal(false)}
            wallets={mockWallets}
          />
          
          <ReceiveCryptoModal
            isOpen={showReceiveModal}
            onClose={() => setShowReceiveModal(false)}
            wallets={mockWallets}
          />
          
          <BuyCryptoModal
            isOpen={showBuyModal}
            onClose={() => setShowBuyModal(false)}
            supportedCryptos={supportedCryptos}
          />
        </>
      )}

      {/* Modal para convidados ou não autenticados */}
      <GuestActionModal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        actionName={currentAction}
      />
      
      {/* Sell Modal - Só para usuários autenticados */}
      {user && !isGuestMode && showSellModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Vender Criptomoeda</h3>
            <p className="text-muted-foreground mb-4">
              Funcionalidade de venda será implementada em breve.
            </p>
            <button 
              onClick={() => setShowSellModal(false)}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NativeActionButtons;