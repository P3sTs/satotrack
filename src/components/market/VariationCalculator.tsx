
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';

interface VariationPeriod {
  label: string;
  value: number | undefined;
  timeframe: string;
}

const VariationCalculator: React.FC = () => {
  const { data: bitcoinData } = useBitcoinPrice();

  if (!bitcoinData) {
    return (
      <Card className="cyberpunk-card">
        <CardHeader>
          <CardTitle>📈 Variação Percentual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const variations: VariationPeriod[] = [
    {
      label: '24h',
      value: bitcoinData.price_change_percentage_24h,
      timeframe: 'Últimas 24 horas'
    },
    {
      label: '7d',
      value: bitcoinData.price_change_percentage_7d,
      timeframe: 'Última semana'
    },
    {
      label: '30d',
      value: bitcoinData.price_change_percentage_30d,
      timeframe: 'Último mês'
    },
    {
      label: '1a',
      value: bitcoinData.price_change_percentage_1y,
      timeframe: 'Último ano'
    }
  ];

  const getVariationIcon = (value: number | undefined) => {
    if (!value) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getVariationColor = (value: number | undefined) => {
    if (!value) return 'text-muted-foreground';
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  return (
    <Card className="cyberpunk-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📈 Variação Percentual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {variations.map((variation, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getVariationIcon(variation.value)}
                <div>
                  <div className="font-medium">{variation.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {variation.timeframe}
                  </div>
                </div>
              </div>
              <div className={`text-lg font-bold ${getVariationColor(variation.value)}`}>
                {variation.value ? (
                  <>
                    {variation.value > 0 ? '+' : ''}
                    {variation.value.toFixed(2)}%
                  </>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-bitcoin/10 rounded-lg border border-bitcoin/20">
          <div className="text-xs text-muted-foreground mb-1">Preço atual</div>
          <div className="text-xl font-bold text-bitcoin">
            ${bitcoinData.price_usd.toLocaleString('en-US')}
          </div>
          <div className="text-sm text-muted-foreground">
            R$ {bitcoinData.price_brl.toLocaleString('pt-BR')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VariationCalculator;
