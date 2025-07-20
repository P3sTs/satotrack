import { useMemo } from 'react';

interface CryptoAsset {
  symbol: string;
  amount: number;
  price: number;
  value: number;
  change24h?: number;
}

interface PortfolioData {
  totalValueNow: number;
  totalValue24hAgo: number;
  percentageChange: number;
  absoluteChange: number;
  isPositive: boolean;
}

export const usePortfolioCalculator = (cryptoAssets: CryptoAsset[]): PortfolioData => {
  return useMemo(() => {
    if (!cryptoAssets || cryptoAssets.length === 0) {
      return {
        totalValueNow: 0,
        totalValue24hAgo: 0,
        percentageChange: 0,
        absoluteChange: 0,
        isPositive: true
      };
    }

    // Calcular valor total atual
    const totalValueNow = cryptoAssets.reduce((sum, asset) => {
      const value = asset.value || (asset.amount * asset.price);
      return sum + (value || 0);
    }, 0);

    // Calcular valor total há 24h baseado na mudança percentual
    const totalValue24hAgo = cryptoAssets.reduce((sum, asset) => {
      const currentValue = asset.value || (asset.amount * asset.price);
      const change24h = asset.change24h || 0;
      
      // Se temos mudança de 24h, calculamos o valor anterior
      if (change24h !== 0) {
        const previousPrice = asset.price / (1 + change24h / 100);
        const previousValue = asset.amount * previousPrice;
        return sum + previousValue;
      }
      
      return sum + currentValue;
    }, 0);

    // Calcular mudança absoluta e percentual
    const absoluteChange = totalValueNow - totalValue24hAgo;
    const percentageChange = totalValue24hAgo > 0 
      ? (absoluteChange / totalValue24hAgo) * 100 
      : 0;

    return {
      totalValueNow: Number(totalValueNow.toFixed(2)),
      totalValue24hAgo: Number(totalValue24hAgo.toFixed(2)),
      percentageChange: Number(percentageChange.toFixed(2)),
      absoluteChange: Number(absoluteChange.toFixed(2)),
      isPositive: absoluteChange >= 0
    };
  }, [cryptoAssets]);
};