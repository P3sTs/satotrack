
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import { RiskMetrics } from '../types/riskTypes';
import { getRiskColor } from '../utils/riskCalculations';

interface WalletRiskAnalysisProps {
  riskMetrics: RiskMetrics[];
}

const WalletRiskAnalysis: React.FC<WalletRiskAnalysisProps> = ({ riskMetrics }) => {
  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Activity className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-dashboard-dark border-satotrack-neon/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-satotrack-neon" />
          Análise de Risco por Carteira
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {riskMetrics.map(metric => (
            <div key={metric.walletId} className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-medium">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{metric.walletName}</h3>
                <Badge className={getRiskColor(metric.riskLevel)}>
                  {getRiskIcon(metric.riskLevel)}
                  <span className="ml-1 capitalize">{metric.riskLevel}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Volatilidade</div>
                  <div className="text-lg font-semibold text-satotrack-neon">
                    {metric.volatilityScore.toFixed(0)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Freq. Movimentação</div>
                  <div className="text-lg font-semibold">
                    {metric.movementFrequency}/dia
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Impacto Taxa</div>
                  <div className="text-lg font-semibold text-yellow-400">
                    {(metric.networkFeeImpact * 100000).toFixed(0)} sats
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Estabilidade</div>
                  <div className="text-lg font-semibold text-green-400">
                    {metric.balanceStability.toFixed(0)}%
                  </div>
                </div>
              </div>

              {metric.alerts.length > 0 && (
                <div className="space-y-2">
                  {metric.alerts.map((alert, index) => (
                    <Alert key={index} className="border-orange-500/30 bg-orange-500/10">
                      <AlertTriangle className="h-4 w-4 text-orange-400" />
                      <AlertDescription className="text-orange-200">
                        {alert}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletRiskAnalysis;
