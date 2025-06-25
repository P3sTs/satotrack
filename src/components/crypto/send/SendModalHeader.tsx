
import React from 'react';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
}

interface SendModalHeaderProps {
  wallet: CryptoWallet;
}

export const SendModalHeader: React.FC<SendModalHeaderProps> = ({ wallet }) => {
  return (
    <div className="p-3 bg-muted/30 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Carteira:</span>
        <span className="font-medium">{wallet.name}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Saldo disponível:</span>
        <span className="font-medium">{wallet.balance} {wallet.currency}</span>
      </div>
    </div>
  );
};
