
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface SupportResistanceLevel {
  level: number;
  type: 'support' | 'resistance';
  strength: 'weak' | 'moderate' | 'strong';
  distance: number; // percentage from current price
}

interface SupportResistanceAlertsProps {
  currentPrice: number;
  levels: SupportResistanceLevel[];
}

const SupportResistanceAlerts: React.FC<SupportResistanceAlertsProps> = ({
  currentPrice,
  levels
}) => {
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-red-500';
      case 'moderate': return 'bg-yellow-500';
      case 'weak': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'resistance' ? TrendingUp : TrendingDown;
  };

  const nearbyLevels = levels.filter(level => Math.abs(level.distance) <= 5);

  return (
    <Card className="bg-card/95 border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          Níveis de Suporte/Resistência
        </CardTitle>
      </CardHeader>
      <CardContent>
        {nearbyLevels.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            Nenhum nível próximo identificado
          </p>
        ) : (
          <div className="space-y-2">
            {nearbyLevels.map((level, index) => {
              const Icon = getTypeIcon(level.type);
              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${level.type === 'resistance' ? 'text-red-500' : 'text-green-500'}`} />
                    <div>
                      <div className="text-sm font-medium">
                        ${level.level.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {level.type === 'resistance' ? 'Resistência' : 'Suporte'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStrengthColor(level.strength)} text-white border-none`}
                    >
                      {level.strength}
                    </Badge>
                    <span className={`text-xs ${level.distance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {level.distance > 0 ? '+' : ''}{level.distance.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-4 text-xs text-muted-foreground">
          💡 Níveis calculados com base nos últimos 30 dias de negociação
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportResistanceAlerts;
