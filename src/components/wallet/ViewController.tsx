
import React, { lazy, Suspense } from 'react';
import { useViewMode } from '@/contexts/ViewModeContext';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { TransacaoBTC } from '@/types/types';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy loading for view components
const ChartView = lazy(() => import('./views/ChartView'));
const ListView = lazy(() => import('./views/ListView'));
const CardView = lazy(() => import('./views/CardView'));
const CompactView = lazy(() => import('./views/CompactView'));

interface ViewControllerProps {
  wallet: CarteiraBTC;
  transacoes: TransacaoBTC[];
  bitcoinData?: BitcoinPriceData | null;
}

const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

const ViewController: React.FC<ViewControllerProps> = ({ 
  wallet,
  transacoes,
  bitcoinData
}) => {
  const { viewMode } = useViewMode();

  return (
    <Suspense fallback={<LoadingFallback />}>
      {(() => {
        switch (viewMode) {
          case 'list':
            return <ListView transacoes={transacoes} />;
          
          case 'cards':
            return <CardView transacoes={transacoes} />;
          
          case 'compact':
            return <CompactView 
              wallet={wallet} 
              transacoes={transacoes} 
              bitcoinPrice={bitcoinData?.price_usd} 
            />;
          
          case 'chart':
          default:
            return <ChartView 
              bitcoinData={bitcoinData} 
              walletId={wallet.id} 
              transacoes={transacoes} 
            />;
        }
      })()}
    </Suspense>
  );
};

export default ViewController;
