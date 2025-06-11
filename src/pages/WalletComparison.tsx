
import React from 'react';
import WalletComparison from '@/components/wallet/WalletComparison';

const WalletComparisonPage = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Comparador de Carteiras</h1>
        <p className="text-muted-foreground">
          Compare o desempenho de suas carteiras e identifique as melhores estratégias.
        </p>
      </div>
      
      <WalletComparison />
    </div>
  );
};

export default WalletComparisonPage;
