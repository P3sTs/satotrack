
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { useCarteiras } from '@/contexts/carteiras';
import { useWalletMetrics } from '@/hooks/useWalletMetrics';
import { WalletMetricsHeader } from './metrics/WalletMetricsHeader';
import { WalletMetricsControls } from './metrics/WalletMetricsControls';
import { WalletMetricsGrid } from './metrics/WalletMetricsGrid';
import { WalletMetricsSummary } from './metrics/WalletMetricsSummary';

interface WalletAdvancedMetricsProps {
  wallet: CarteiraBTC;
  bitcoinData?: BitcoinPriceData | null;
}

const WalletAdvancedMetrics: React.FC<WalletAdvancedMetricsProps> = ({ 
  wallet, 
  bitcoinData 
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [currency, setCurrency] = useState<'BTC' | 'USD' | 'BRL'>('BTC');
  const { isUpdating, atualizarCarteira } = useCarteiras();
  const { 
    variations,
    averageInflow,
    projectedBalance,
    refreshMetrics
  } = useWalletMetrics(wallet.id, timeRange);

  const btcPrice = {
    usd: bitcoinData?.price_usd || 0,
    brl: bitcoinData?.price_brl || 0
  };

  const handleUpdate = async () => {
    await atualizarCarteira(wallet.id);
    refreshMetrics();
  };

  return (
    <Card className="bg-dashboard-dark border-satotrack-neon/20 w-full">
      <CardHeader className="pb-3">
        <WalletMetricsHeader
          timeRange={timeRange}
          currency={currency}
          isUpdating={isUpdating[wallet.id] || false}
          walletId={wallet.id}
          onTimeRangeChange={setTimeRange}
          onCurrencyChange={setCurrency}
          onUpdate={handleUpdate}
        />
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <WalletMetricsControls
          timeRange={timeRange}
          currency={currency}
          onTimeRangeChange={setTimeRange}
          onCurrencyChange={setCurrency}
        />

        <WalletMetricsGrid
          variations={variations}
          averageInflow={averageInflow}
          projectedBalance={projectedBalance}
          wallet={wallet}
          currency={currency}
          btcPrice={btcPrice}
        />
        
        <WalletMetricsSummary
          wallet={wallet}
          bitcoinData={bitcoinData}
          variations={variations}
          timeRange={timeRange}
          isUpdating={isUpdating[wallet.id] || false}
          walletId={wallet.id}
        />
      </CardContent>
    </Card>
  );
};

export default WalletAdvancedMetrics;
