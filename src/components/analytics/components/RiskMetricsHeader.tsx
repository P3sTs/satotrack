
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Zap, AlertTriangle, Clock } from 'lucide-react';

interface RiskMetricsHeaderProps {
  averageRisk: number;
  networkFeeRate: number;
  totalAlerts: number;
  selectedTimeframe: string;
}

const RiskMetricsHeader: React.FC<RiskMetricsHeaderProps> = ({
  averageRisk,
  networkFeeRate,
  totalAlerts,
  selectedTimeframe
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-dashboard-dark border-satotrack-neon/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-satotrack-neon" />
            <span className="text-sm font-medium">Risco Médio</span>
          </div>
          <div className="text-2xl font-bold text-satotrack-neon">
            {averageRisk.toFixed(0)}%
          </div>
        </CardContent>
      </Card>

      <Card className="bg-dashboard-dark border-yellow-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Taxa Rede</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            {networkFeeRate} sat/vB
          </div>
        </CardContent>
      </Card>

      <Card className="bg-dashboard-dark border-orange-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium">Alertas Ativos</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">
            {totalAlerts}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-dashboard-dark border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium">Período</span>
          </div>
          <div className="text-lg font-bold text-blue-400">
            {selectedTimeframe}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskMetricsHeader;
