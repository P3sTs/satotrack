
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { useCarteiras } from '@/contexts/carteiras';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  BarChart3,
  LineChart,
  RefreshCw,
  DollarSign,
  Bitcoin
} from 'lucide-react';
import { formatBitcoinValue, formatCurrency } from '@/utils/formatters';
import { useWalletMetrics } from '@/hooks/useWalletMetrics';
import { Button } from '@/components/ui/button';

interface WalletAdvancedMetricsProps {
  wallet: CarteiraBTC;
  bitcoinData?: BitcoinPriceData | null;
}

const WalletAdvancedMetrics: React.FC<WalletAdvancedMetricsProps> = ({ 
  wallet, 
  bitcoinData 
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [currency, setCurrency] = useState<'BTC' | 'USD' | 'BRL'>('BTC');
  const { isUpdating, atualizarCarteira } = useCarteiras();
  const { 
    variations,
    averageInflow,
    projectedBalance,
    isLoading,
    refreshMetrics
  } = useWalletMetrics(wallet.id, timeRange);

  const btcPrice = {
    usd: bitcoinData?.price_usd || 0,
    brl: bitcoinData?.price_brl || 0
  };

  const handleUpdate = async () => {
    await atualizarCarteira(wallet.id);
    refreshMetrics();
  };

  const getDateRangeText = () => {
    const today = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '7d':
        startDate = subDays(today, 7);
        break;
      case '30d':
        startDate = subDays(today, 30);
        break;
      case '90d':
        startDate = subDays(today, 90);
        break;
    }
    
    return `${format(startDate, 'PP', { locale: ptBR })} - ${format(today, 'PP', { locale: ptBR })}`;
  };

  const formatValue = (value: number) => {
    switch (currency) {
      case 'BTC':
        return formatBitcoinValue(value);
      case 'USD':
        return formatCurrency(value * btcPrice.usd, 'USD');
      case 'BRL':
        return formatCurrency(value * btcPrice.brl, 'BRL');
    }
  };

  const getVariationIcon = (variation: number) => {
    if (variation > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (variation < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getVariationColor = (variation: number) => {
    if (variation > 0) return "text-green-500";
    if (variation < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <Card className="bg-dashboard-dark border-satotrack-neon/20 w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap justify-between items-center">
          <CardTitle className="text-lg font-medium">Métricas Avançadas</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleUpdate}
            disabled={isUpdating[wallet.id]}
            className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
          >
            <RefreshCw 
              className={`h-4 w-4 mr-2 ${isUpdating[wallet.id] ? 'animate-spin' : ''}`} 
            />
            Atualizar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{getDateRangeText()}</span>
          </div>
          
          <div className="flex gap-2">
            <div className="bg-muted/30 rounded-lg p-1">
              <TabsList className="h-8">
                <TabsTrigger 
                  value="7d" 
                  onClick={() => setTimeRange('7d')}
                  className={timeRange === '7d' ? 'bg-satotrack-neon/20 text-satotrack-neon' : ''}
                >
                  7D
                </TabsTrigger>
                <TabsTrigger 
                  value="30d"
                  onClick={() => setTimeRange('30d')}
                  className={timeRange === '30d' ? 'bg-satotrack-neon/20 text-satotrack-neon' : ''}
                >
                  30D
                </TabsTrigger>
                <TabsTrigger 
                  value="90d"
                  onClick={() => setTimeRange('90d')}
                  className={timeRange === '90d' ? 'bg-satotrack-neon/20 text-satotrack-neon' : ''}
                >
                  90D
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-1">
              <TabsList className="h-8">
                <TabsTrigger 
                  value="BTC"
                  onClick={() => setCurrency('BTC')}
                  className={currency === 'BTC' ? 'bg-bitcoin/20 text-bitcoin' : ''}
                >
                  <Bitcoin className="h-3 w-3 mr-1" />
                </TabsTrigger>
                <TabsTrigger 
                  value="USD"
                  onClick={() => setCurrency('USD')}
                  className={currency === 'USD' ? 'bg-green-500/20 text-green-500' : ''}
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  USD
                </TabsTrigger>
                <TabsTrigger 
                  value="BRL"
                  onClick={() => setCurrency('BRL')}
                  className={currency === 'BRL' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                >
                  <span className="mr-1">R$</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Variação do Saldo */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Variação do Saldo</p>
              {getVariationIcon(variations.balance)}
            </div>
            <div className={`flex items-baseline ${getVariationColor(variations.balance)}`}>
              <span className="text-xl font-bold">{formatPercentage(variations.balance)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Saldo atual: {formatValue(wallet.saldo)}
            </p>
          </div>
          
          {/* Variação de Entradas */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Var. de Recebimentos</p>
              {getVariationIcon(variations.inflow)}
            </div>
            <div className={`flex items-baseline ${getVariationColor(variations.inflow)}`}>
              <span className="text-xl font-bold">{formatPercentage(variations.inflow)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total recebido: {formatValue(wallet.total_entradas)}
            </p>
          </div>
          
          {/* Média de Entradas */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Média por Semana</p>
              <BarChart3 className="h-4 w-4 text-satotrack-neon" />
            </div>
            <div className="flex items-baseline text-satotrack-neon">
              <span className="text-xl font-bold">{formatValue(averageInflow)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Recebimentos semanais
            </p>
          </div>
          
          {/* Projeção de Saldo */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Saldo Projetado</p>
              <LineChart className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline text-cyan-400">
              <span className="text-xl font-bold">{formatValue(projectedBalance)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Projeção para fim do mês
            </p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border mt-4">
          <p className="text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 bg-green-500 rounded-full mr-1"></span>
            Saldo atualizado automaticamente 
            {isUpdating[wallet.id] ? '...' : '🟢'}
          </p>
          <p className="text-sm">
            Recebimentos totais: {formatBitcoinValue(wallet.total_entradas)} 
            {bitcoinData && ` (${formatCurrency(wallet.total_entradas * bitcoinData.price_brl, 'BRL')})`}
          </p>
          {variations.inflow > 0 && (
            <p className="text-sm text-green-500">
              Você recebeu {formatValue(variations.inflowAmount)} nos últimos {timeRange === '7d' ? '7 dias' : timeRange === '30d' ? '30 dias' : '90 dias'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletAdvancedMetrics;
