
import { TaxTransaction, TaxCalculation, TAX_CONSTANTS } from '../types';

export const calculateTax = (transactions: TaxTransaction[]): Omit<TaxCalculation, 'aiInsights'> => {
  let totalGains = 0;
  let totalSales = 0;

  // Simular cálculo de ganhos
  transactions.forEach(tx => {
    if (tx.type === 'sell') {
      totalSales += tx.amount;
      // Simular ganho (preço de venda - preço médio de compra)
      totalGains += tx.amount * 0.1; // 10% de ganho simulado
    }
  });

  const exemption = totalSales <= TAX_CONSTANTS.EXEMPT_LIMIT;
  const taxableAmount = exemption ? 0 : Math.max(0, totalGains);
  const taxOwed = taxableAmount * TAX_CONSTANTS.TAX_RATE;

  return {
    totalGains,
    exemptAmount: Math.min(totalSales, TAX_CONSTANTS.EXEMPT_LIMIT),
    taxableAmount,
    taxOwed,
    exemption
  };
};
