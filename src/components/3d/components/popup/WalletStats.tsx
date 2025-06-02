
import React from 'react';
import { formatBitcoinValue } from '@/utils/formatters';
import { WalletNode } from '../../types/WalletNode';

interface WalletStatsProps {
  wallet: WalletNode;
}

const WalletStats: React.FC<WalletStatsProps> = ({ wallet }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-black/30 p-3 rounded-lg border border-green-500/30">
        <div className="text-xs text-gray-400 mb-1">
          {wallet.type === 'transaction' ? 'Valor' : 'Saldo Atual'}
        </div>
        <div className="text-lg font-bold text-green-400">
          {formatBitcoinValue(wallet.balance)}
        </div>
        {wallet.balance > 0 && (
          <div className="text-xs text-green-300 mt-1">
            ≈ {(wallet.balance * 100000000).toLocaleString()} sats
          </div>
        )}
      </div>
      
      <div className="bg-black/30 p-3 rounded-lg border border-blue-500/30">
        <div className="text-xs text-gray-400 mb-1">Transações</div>
        <div className="text-lg font-bold text-blue-400">
          {wallet.transactionCount.toLocaleString()}
        </div>
        {wallet.transactionCount > 0 && (
          <div className="text-xs text-blue-300 mt-1">
            Total de operações
          </div>
        )}
      </div>
      
      {wallet.type !== 'transaction' && (
        <>
          <div className="bg-black/30 p-3 rounded-lg border border-purple-500/30">
            <div className="text-xs text-gray-400 mb-1">Total Recebido</div>
            <div className="text-sm font-bold text-purple-400">
              {formatBitcoinValue(wallet.totalReceived)}
            </div>
          </div>
          
          <div className="bg-black/30 p-3 rounded-lg border border-orange-500/30">
            <div className="text-xs text-gray-400 mb-1">Total Enviado</div>
            <div className="text-sm font-bold text-orange-400">
              {formatBitcoinValue(wallet.totalSent)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletStats;
