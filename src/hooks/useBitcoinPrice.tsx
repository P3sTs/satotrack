
import React, { createContext, useContext, ReactNode } from 'react';
import { useBitcoinPrice, BitcoinPriceData } from './useBitcoinPrice';

interface BitcoinPriceContextType {
  data: BitcoinPriceData | null;
  loading: boolean;
  error: string | null;
  previousPrice: number | null;
  isRefreshing: boolean;
  refresh: () => void;
}

const BitcoinPriceContext = createContext<BitcoinPriceContextType | undefined>(undefined);

export const BitcoinPriceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const bitcoinPriceData = useBitcoinPrice();

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
