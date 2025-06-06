
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Zap,
  X
} from 'lucide-react';

interface Widget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'alert' | 'goal';
  isMinimized: boolean;
  isFavorite: boolean;
  value?: number;
  target?: number;
  trend?: 'up' | 'down' | 'neutral';
}

interface WidgetExpansionModalProps {
  widget: Widget | null;
  isOpen: boolean;
  onClose: () => void;
  likesCount: number;
}

const WidgetExpansionModal: React.FC<WidgetExpansionModalProps> = ({
  widget,
  isOpen,
  onClose,
  likesCount
}) => {
  if (!widget) return null;

  const getWidgetIcon = (type: string, trend?: string) => {
    switch (type) {
      case 'metric':
        return trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;
      case 'goal':
        return Target;
      case 'alert':
        return Zap;
      default:
        return Activity;
    }
  };

  const Icon = getWidgetIcon(widget.type, widget.trend);

  const renderExpandedContent = () => {
    switch (widget.type) {
      case 'metric':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">
                {widget.value}%
              </div>
              <Badge variant={widget.trend === 'up' ? 'default' : 'destructive'} className="text-lg px-4 py-2">
                {widget.trend === 'up' ? '+' : widget.trend === 'down' ? '-' : ''}
                {Math.abs(widget.value || 0)}%
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Progresso Atual</label>
                <Progress value={Math.abs(widget.value || 0)} className="h-4 mt-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">24h</div>
                  <div className="text-sm text-muted-foreground">Período</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{Math.abs(widget.value || 0)}%</div>
                  <div className="text-sm text-muted-foreground">Variação</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{likesCount}</div>
                  <div className="text-sm text-muted-foreground">Curtidas</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'goal':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">
                {((widget.value || 0) / (widget.target || 100) * 100).toFixed(0)}%
              </div>
              <div className="text-lg text-muted-foreground">
                {widget.value}% de {widget.target}% atingido
              </div>
            </div>
            
            <Progress 
              value={(widget.value || 0) / (widget.target || 100) * 100} 
              className="h-6"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-2xl font-bold text-green-500">{widget.value}%</div>
                <div className="text-sm text-muted-foreground">Atual</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-2xl font-bold">{widget.target}%</div>
                <div className="text-sm text-muted-foreground">Meta</div>
              </div>
            </div>
          </div>
        );
        
      case 'alert':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">
                {widget.value}
              </div>
              <div className="text-lg text-muted-foreground">
                Alertas Ativos
              </div>
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: widget.value || 0 }, (_, i) => (
                <div key={i} className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Alerta #{i + 1}</span>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      Ativo
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Configurado para variação de ±5%
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              Conteúdo expandido não disponível para este tipo de widget.
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${
              widget.trend === 'up' ? 'text-green-500' : 
              widget.trend === 'down' ? 'text-red-500' : 'text-satotrack-neon'
            }`} />
            {widget.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          {renderExpandedContent()}
        </div>
        
        <div className="flex justify-center pt-6">
          <Button onClick={onClose} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WidgetExpansionModal;
