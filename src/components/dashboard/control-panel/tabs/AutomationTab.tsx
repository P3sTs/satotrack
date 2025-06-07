
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Zap, Activity } from 'lucide-react';

const AutomationTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg bg-muted/50 border border-satotrack-neon/20">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">Auto-Trade (Premium)</span>
          <Badge variant="outline" className="text-xs">Em Breve</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Configure estratégias automáticas baseadas em indicadores técnicos
        </p>
      </div>
      
      <div className="p-3 rounded-lg bg-muted/50 border border-satotrack-neon/20">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Rebalanceamento</span>
          <Badge variant="outline" className="text-xs">Premium</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Rebalanceamento automático do portfólio baseado em regras
        </p>
      </div>
    </div>
  );
};

export default AutomationTab;
