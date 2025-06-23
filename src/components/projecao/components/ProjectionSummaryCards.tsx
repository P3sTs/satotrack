
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, Calculator } from 'lucide-react';
import { ProjectionDataPoint, TimeframeType } from '../types/projectionTypes';

interface ProjectionSummaryCardsProps {
  projectionData: ProjectionDataPoint[];
  timeframe: TimeframeType;
}

const ProjectionSummaryCards: React.FC<ProjectionSummaryCardsProps> = ({
  projectionData,
  timeframe
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatBTC = (value: number) => {
    return `${value.toFixed(6)} BTC`;
  };

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case '3m': return '3 meses';
      case '6m': return '6 meses';
      case '12m': return '1 ano';
      default: return timeframe;
    }
  };

  if (projectionData.length === 0) return null;

  const currentValue = projectionData[0]?.value || 0;
  const finalValue = projectionData[projectionData.length - 1]?.value || 0;
  const currentBTC = projectionData[0]?.btc || 0;
  const finalBTC = projectionData[projectionData.length - 1]?.btc || 0;
  const percentageChange = currentValue > 0 ? ((finalValue / currentValue - 1) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-sm text-muted-foreground">Valor Atual</p>
              <p className="text-xl font-bold text-green-400">
                {formatCurrency(currentValue)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatBTC(currentBTC)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-sm text-muted-foreground">Projeção Final</p>
              <p className="text-xl font-bold text-blue-400">
                {formatCurrency(finalValue)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatBTC(finalBTC)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="text-sm text-muted-foreground">Crescimento</p>
              <p className="text-xl font-bold text-yellow-400">
                +{percentageChange.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">
                Em {getTimeframeLabel()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectionSummaryCards;
