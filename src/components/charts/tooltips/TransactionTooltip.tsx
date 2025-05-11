
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatBitcoinValue } from '../utils/ChartFormatters';

interface TransactionTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const TransactionTooltip: React.FC<TransactionTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-dashboard-dark border border-dashboard-medium/50 p-2 rounded shadow-md">
        <p className="text-xs">{format(data.timestamp, 'PPpp', { locale: ptBR })}</p>
        <p className={`text-sm font-semibold ${data.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'}`}>
          {data.tipo === 'entrada' ? '+ ' : '- '}{formatBitcoinValue(Math.abs(data.valor))}
        </p>
      </div>
    );
  }
  return null;
};

export default TransactionTooltip;
