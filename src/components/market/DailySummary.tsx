
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';

const DailySummary: React.FC = () => {
  const { data: bitcoinData } = useBitcoinPrice();

  if (!bitcoinData) {
    return (
      <Card className="cyberpunk-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            📆 Resumo de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Simulando dados de abertura (seria necessário API histórica para dados reais)
  const openingPrice = bitcoinData.price_usd - (bitcoinData.price_change_24h || 0);
  const highPrice = bitcoinData.price_high_24h || bitcoinData.price_usd * 1.02;
  const lowPrice = bitcoinData.price_low_24h || bitcoinData.price_usd * 0.98;

  const summaryItems = [
    {
      label: 'Preço de Abertura',
      value: `$${openingPrice.toLocaleString('en-US')}`,
      subValue: `R$${(openingPrice * (bitcoinData.price_brl / bitcoinData.price_usd)).toLocaleString('pt-BR')}`,
      icon: <Calendar className="h-4 w-4 text-blue-500" />
    },
    {
      label: 'Preço Atual',
      value: `$${bitcoinData.price_usd.toLocaleString('en-US')}`,
      subValue: `R$${bitcoinData.price_brl.toLocaleString('pt-BR')}`,
      icon: <BarChart3 className="h-4 w-4 text-bitcoin" />
    },
    {
      label: 'Máxima do Dia',
      value: `$${highPrice.toLocaleString('en-US')}`,
      subValue: `R$${(highPrice * (bitcoinData.price_brl / bitcoinData.price_usd)).toLocaleString('pt-BR')}`,
      icon: <TrendingUp className="h-4 w-4 text-green-500" />
    },
    {
      label: 'Mínima do Dia',
      value: `$${lowPrice.toLocaleString('en-US')}`,
      subValue: `R$${(lowPrice * (bitcoinData.price_brl / bitcoinData.price_usd)).toLocaleString('pt-BR')}`,
      icon: <TrendingDown className="h-4 w-4 text-red-500" />
    }
  ];

  const changePercentage = bitcoinData.price_change_percentage_24h || 0;
  const isPositive = changePercentage >= 0;

  return (
    <Card className="cyberpunk-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-satotrack-neon" />
          📆 Resumo de Hoje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {summaryItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.subValue}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo da variação */}
        <div className={`p-4 rounded-lg border-2 ${isPositive ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Variação Total</div>
              <div className="text-sm text-muted-foreground">Últimas 24 horas</div>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{changePercentage.toFixed(2)}%
              </div>
              <div className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}${(bitcoinData.price_change_24h || 0).toLocaleString('en-US')}
              </div>
            </div>
          </div>
        </div>

        {/* Volume */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Volume Total 24h</span>
            <div className="text-right">
              <div className="font-bold">${(bitcoinData.volume_24h_usd || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
              <div className="text-xs text-muted-foreground">
                {((bitcoinData.volume_24h_usd || 0) / bitcoinData.price_usd).toFixed(0)} BTC
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Atualizado: {new Date(bitcoinData.last_updated).toLocaleString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySummary;
