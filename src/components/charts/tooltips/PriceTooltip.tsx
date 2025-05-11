
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrencyValue } from '../utils/ChartFormatters';

interface PriceTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const PriceTooltip: React.FC<PriceTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-dashboard-dark border border-dashboard-medium/50 p-2 rounded shadow-md">
        <p className="text-xs">{format(data.timestamp, 'PPpp', { locale: ptBR })}</p>
        <p className="text-sm font-semibold text-bitcoin">
          {formatCurrencyValue(data.price)}
        </p>
      </div>
    );
  }
  return null;
};

export default PriceTooltip;
