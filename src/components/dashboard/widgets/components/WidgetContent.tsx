
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Widget } from '../types';

interface WidgetContentProps {
  widget: Widget;
}

const WidgetContent: React.FC<WidgetContentProps> = ({ widget }) => {
  if (widget.type === 'metric') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {widget.value}%
          </span>
          <Badge variant={widget.trend === 'up' ? 'default' : 'destructive'}>
            {widget.trend === 'up' ? '+' : widget.trend === 'down' ? '-' : ''}
            {Math.abs(widget.value || 0)}%
          </Badge>
        </div>
        <Progress 
          value={Math.abs(widget.value || 0)} 
          className="h-2"
        />
      </div>
    );
  }
  
  if (widget.type === 'goal') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {widget.value}% de {widget.target}%
          </span>
          <Badge variant="outline">
            {((widget.value || 0) / (widget.target || 100) * 100).toFixed(0)}%
          </Badge>
        </div>
        <Progress 
          value={(widget.value || 0) / (widget.target || 100) * 100} 
          className="h-2"
        />
      </div>
    );
  }
  
  if (widget.type === 'alert') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">
            {widget.value} alertas ativos
          </span>
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Ativos
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            Ver Todos
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            Configurar
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default WidgetContent;
