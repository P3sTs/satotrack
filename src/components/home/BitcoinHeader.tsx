
import React from 'react';
import { formatarData } from '@/utils/formatters';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { Bitcoin } from 'lucide-react';

interface BitcoinHeaderProps {
  bitcoinData: BitcoinPriceData;
}

const BitcoinHeader = ({ bitcoinData }: BitcoinHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6 bg-dashboard-medium/50 border border-border/50 dark:border-satotrack-neon/10 rounded-lg p-3 md:p-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="bg-dashboard-light/80 p-2 md:p-3 rounded-full border border-satotrack-neon/20 relative overflow-hidden">
          <Bitcoin className="h-5 w-5 md:h-6 md:w-6 text-bitcoin dark:text-bitcoin" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 rounded-full"></div>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">Bitcoin</h2>
          <p className="text-xs md:text-sm text-foreground dark:text-satotrack-text flex items-center">
            <span className="inline-block h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-satotrack-neon mr-1 md:mr-2 animate-pulse"></span>
            Atualizado: {formatarData(bitcoinData.last_updated)}
          </p>
        </div>
      </div>
      
      <div className="hidden md:block px-3 py-1 border border-border/40 dark:border-satotrack-neon/20 rounded bg-dashboard-light/40 text-xs text-satotrack-text font-mono self-start sm:self-auto">
        BTC-USD
      </div>
    </div>
  );
};

export default BitcoinHeader;
