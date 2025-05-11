
import React from 'react';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import InteractiveChart from '@/components/charts/InteractiveChart';

interface WalletAnalyticsProps {
  bitcoinData?: BitcoinPriceData | null;
  walletId: string;
}

const WalletAnalytics: React.FC<WalletAnalyticsProps> = ({ 
  bitcoinData, 
  walletId 
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Análise de Dados</h2>
      <div className="bitcoin-card p-6">
        <InteractiveChart bitcoinData={bitcoinData} walletId={walletId} />
      </div>
    </div>
  );
};

export default WalletAnalytics;
