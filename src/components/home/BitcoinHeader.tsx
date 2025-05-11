
import React from 'react';
import { formatarData } from '@/utils/formatters';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

interface BitcoinHeaderProps {
  bitcoinData: BitcoinPriceData;
}

const BitcoinHeader = ({ bitcoinData }: BitcoinHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="bg-satotrack-neon/10 p-2 rounded-full">
          <img 
            src="/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png" 
            alt="SatoTrack Logo" 
            className="h-8 w-8 object-contain satotrack-logo"
          />
        </div>
        <div>
          <h2 className="text-2xl font-orbitron font-bold">Bitcoin</h2>
          <p className="text-sm text-satotrack-text">
            Atualizado: {formatarData(bitcoinData.last_updated)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BitcoinHeader;
