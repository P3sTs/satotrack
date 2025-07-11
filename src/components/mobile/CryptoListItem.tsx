import React from 'react';
import { useRealTimePrices } from '@/hooks/useRealTimePrices';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';

interface CryptoItemProps {
  symbol: string;
  name: string;
  network?: string;
  price: string;
  change: number;
  amount: string;
  value: string;
  icon: string;
}

const CryptoListItem: React.FC<CryptoItemProps> = ({
  symbol,
  name,
  network,
  price,
  change,
  amount,
  value,
  icon
}) => {
  const isPositive = change >= 0;

  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-dashboard-medium/20 transition-colors">
      {/* Left - Icon and Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-dashboard-medium/50 flex items-center justify-center">
          {icon === 'PENGU' && (
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-xs font-bold text-black">🐧</span>
            </div>
          )}
          {icon === 'BNB' && (
            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
              <span className="text-xs font-bold text-black">B</span>
            </div>
          )}
          {icon === 'BTC' && (
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">₿</span>
            </div>
          )}
          {icon === 'DOGE' && (
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-xs font-bold text-black">Ð</span>
            </div>
          )}
          {icon === 'ETH' && (
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-xs font-bold text-white">Ξ</span>
            </div>
          )}
          {icon === 'POL' && (
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">◊</span>
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{symbol}</span>
            <span className="text-xs text-satotrack-text">{name}</span>
          </div>
          {network && (
            <span className="text-xs text-satotrack-text">{network}</span>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-satotrack-text">{price}</span>
            <span className={`text-xs ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}
              <AnimatedNumber value={change} decimals={2} suffix="%" />
            </span>
          </div>
        </div>
      </div>

      {/* Right - Amount and Value */}
      <div className="text-right">
        <div className="text-white font-medium">{amount}</div>
        <div className="text-xs text-satotrack-text">{value}</div>
      </div>
    </div>
  );
};

export default CryptoListItem;