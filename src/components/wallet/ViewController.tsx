
import React from 'react';
import { useViewMode } from '@/contexts/ViewModeContext';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { TransacaoBTC } from '@/types/types';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import ChartView from './views/ChartView';
import ListView from './views/ListView';
import CardView from './views/CardView';
import CompactView from './views/CompactView';

interface ViewControllerProps {
  wallet: CarteiraBTC;
  transacoes: TransacaoBTC[];
  bitcoinData?: BitcoinPriceData | null;
}

const ViewController: React.FC<ViewControllerProps> = ({ 
  wallet,
  transacoes,
  bitcoinData
}) => {
  const { viewMode } = useViewMode();

  // Render the appropriate view based on the selected mode
  switch (viewMode) {
    case 'list':
      return <ListView transacoes={transacoes} />;
    
    case 'card':
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
};

export default ViewController;
