
import React from 'react';
import { TaxTransaction } from '../types';

interface TransactionsDisplayProps {
  transactions: TaxTransaction[];
}

const TransactionsDisplay: React.FC<TransactionsDisplayProps> = ({ transactions }) => {
  return (
    <div>
      <h5 className="font-medium mb-3">Suas Transações (Simuladas)</h5>
      <div className="space-y-2">
        {transactions.map((tx, index) => (
          <div key={index} className="p-3 rounded-lg bg-muted/50 border border-yellow-500/20 flex justify-between items-center">
            <div>
              <span className={`px-2 py-1 rounded text-xs ${
                tx.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {tx.type === 'buy' ? 'COMPRA' : 'VENDA'}
              </span>
              <span className="ml-2">{tx.date}</span>
            </div>
            <div className="text-right">
              <div>R$ {tx.amount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">@ R$ {tx.price.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsDisplay;
