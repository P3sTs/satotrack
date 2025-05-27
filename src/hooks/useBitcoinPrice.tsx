
import React, { createContext, useContext, ReactNode } from 'react';
import { useBitcoinPrice as useOriginalBitcoinPrice, BitcoinPriceData } from './useBitcoinPrice';

interface BitcoinPriceContextType {
  data: BitcoinPriceData | null;
  loading: boolean;
  error: string | null;
  previousPrice: number | null;
  isRefreshing: boolean;
  refresh: () => void;
}

const BitcoinPriceContext = createContext<BitcoinPriceContextType | undefined>(undefined);

interface BitcoinPriceProviderProps {
  children: ReactNode;
}

export const BitcoinPriceProvider: React.FC<BitcoinPriceProviderProps> = ({ children }) => {
  const bitcoinPriceData = useOriginalBitcoinPrice();

  return (
    <BitcoinPriceContext.Provider value={bitcoinPriceData}>
      {children}
    </BitcoinPriceContext.Provider>
  );
};

export const useBitcoinPriceContext = (): BitcoinPriceContextType => {
  const context = useContext(BitcoinPriceContext);
  if (!context) {
    throw new Error('useBitcoinPriceContext must be used within a BitcoinPriceProvider');
  }
  return context;
};

// Re-export the original hook and types
export * from './useBitcoinPrice';
