
import React from 'react';
import { formatarData } from '@/utils/formatters';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { Bitcoin, TrendingUp, TrendingDown } from 'lucide-react';

interface BitcoinHeaderProps {
  bitcoinData: BitcoinPriceData;
}

const BitcoinHeader = ({ bitcoinData }: BitcoinHeaderProps) => {
  const isPositive = bitcoinData.price_change_percentage_24h >= 0;
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-dashboard-medium/30 border border-satotrack-neon/20 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-bitcoin to-bitcoin/80 p-3 rounded-full border border-satotrack-neon/20 relative overflow-hidden">
          <Bitcoin className="h-6 w-6 text-black" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 rounded-full"></div>
        </div>
        <div>
          <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
            Bitcoin
            <span className="text-sm font-mono text-satotrack-text">BTC</span>
          </h2>
          <p className="text-sm text-satotrack-text flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-satotrack-neon animate-pulse"></span>
            Atualizado: {formatarData(bitcoinData.last_updated)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Preço Principal */}
        <div className="text-right">
          <div className="text-2xl font-orbitron font-bold text-white">
            ${bitcoinData.price_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-satotrack-text">
            R$ {bitcoinData.price_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
        
        {/* Variação 24h */}
        <div className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium ${
          isPositive 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>
            {isPositive ? '+' : ''}
            {bitcoinData.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default BitcoinHeader;
