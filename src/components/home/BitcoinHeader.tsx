
import React from 'react';
import { formatarData } from '@/utils/formatters';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { Bitcoin } from 'lucide-react';

interface BitcoinHeaderProps {
  bitcoinData: BitcoinPriceData;
}

const BitcoinHeader = ({ bitcoinData }: BitcoinHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6 bg-dashboard-medium/30 border border-satotrack-neon/10 rounded-lg p-3 md:p-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="bg-satotrack-neon/10 p-2 md:p-3 rounded-full border border-satotrack-neon/20">
          <Bitcoin className="h-5 w-5 md:h-6 md:w-6 text-satotrack-neon" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-orbitron font-bold satotrack-gradient-text">Bitcoin</h2>
          <p className="text-xs md:text-sm text-satotrack-text flex items-center">
            <span className="inline-block h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-satotrack-neon mr-1 md:mr-2 animate-pulse"></span>
            Atualizado: {formatarData(bitcoinData.last_updated)}
          </p>
        </div>
      </div>
      
      <div className="hidden md:block px-3 py-1 border border-satotrack-neon/20 rounded bg-satotrack-neon/5 text-xs text-satotrack-neon font-mono self-start sm:self-auto">
        BTC-USD
      </div>
    </div>
  );
};

export default BitcoinHeader;
