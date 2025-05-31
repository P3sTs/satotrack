
import React from 'react';
import BitcoinWalletLookup from '@/components/bitcoin/BitcoinWalletLookup';

const BitcoinLookup: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          🔍 Consultar Carteira Bitcoin
        </h1>
        <p className="text-muted-foreground">
          Rastreie qualquer endereço Bitcoin em tempo real. Obtenha informações completas sobre saldo, 
          transações e histórico da carteira.
        </p>
      </div>
      
      <BitcoinWalletLookup />
    </div>
  );
};

export default BitcoinLookup;
