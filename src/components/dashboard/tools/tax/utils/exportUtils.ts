
import { TaxTransaction } from '../types';

export const exportTaxReport = (transactions: TaxTransaction[]) => {
  const csvContent = [
    'Data,Tipo,Valor,Preço,Ganho/Perda',
    ...transactions.map(tx => 
      `${tx.date},${tx.type},${tx.amount},${tx.price},${tx.type === 'sell' ? tx.amount * 0.1 : 0}`
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'relatorio-imposto-crypto.csv';
  a.click();
  URL.revokeObjectURL(url);
};
