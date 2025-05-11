
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatBitcoinValue } from '../utils/ChartFormatters';

interface BalanceTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const BalanceTooltip: React.FC<BalanceTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-dashboard-dark border border-dashboard-medium/50 p-2 rounded shadow-md">
        <p className="text-xs">{format(data.timestamp, 'PPpp', { locale: ptBR })}</p>
        <p className="text-sm font-semibold text-satotrack-neon">
          {formatBitcoinValue(data.balance)}
        </p>
      </div>
    );
  }
  return null;
};

export default BalanceTooltip;
