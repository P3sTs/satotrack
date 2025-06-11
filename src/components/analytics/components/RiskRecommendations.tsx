
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

const RiskRecommendations: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-dashboard-dark to-dashboard-medium border-satotrack-neon/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-satotrack-neon" />
          Recomendações de Otimização
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <h4 className="font-medium text-green-400 mb-2">✅ Para Reduzir Riscos</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Consolide pequenas transações em horários de taxa baixa</li>
              <li>• Evite movimentações frequentes em períodos de alta volatilidade</li>
              <li>• Use carteiras com histórico de estabilidade para valores maiores</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <h4 className="font-medium text-blue-400 mb-2">🎯 Para Otimizar Custos</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Monitore taxas da rede antes de grandes movimentações</li>
              <li>• Configure alertas para taxas abaixo de 20 sat/vB</li>
              <li>• Agrupe transações menores quando possível</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskRecommendations;
