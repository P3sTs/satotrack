
import React from 'react';
import { formatBitcoinValue, formatDate } from '@/utils/formatters';
import { WalletNode } from '../../hooks/useWalletNodes';

interface TransactionsListProps {
  wallet: WalletNode;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ wallet }) => {
  if (!wallet.transactions || wallet.transactions.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
        Transações Recentes ({wallet.transactions.length})
      </label>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {wallet.transactions.slice(0, 5).map((tx, index) => (
          <div key={index} className="bg-black/30 p-2 rounded border border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-xs flex-1">
                <div className="text-gray-300 font-mono">
                  {tx.hash.substring(0, 12)}...{tx.hash.substring(tx.hash.length - 8)}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {formatDate(tx.transaction_date)}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${
                  tx.transaction_type === 'entrada' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {tx.transaction_type === 'entrada' ? '+' : '-'}{formatBitcoinValue(tx.amount)}
                </div>
                <div className="text-xs text-gray-400">
                  {tx.transaction_type === 'entrada' ? 'Recebido' : 'Enviado'}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {wallet.transactions.length > 5 && (
          <div className="text-xs text-gray-500 text-center py-1">
            +{wallet.transactions.length - 5} transações a mais...
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;
