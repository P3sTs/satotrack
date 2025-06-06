
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Download, 
  Share2,
  Bookmark,
  Heart,
  Star,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity
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

const InteractiveWidgets: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: 'profit-loss',
      title: 'Lucro/Prejuízo 24h',
      type: 'metric',
      isMinimized: false,
      isFavorite: true,
      value: 2.5,
      trend: 'up'
    },
    {
      id: 'portfolio-goal',
      title: 'Meta do Portfólio',
      type: 'goal',
      isMinimized: false,
      isFavorite: false,
      value: 75,
      target: 100
    },
    {
      id: 'market-sentiment',
      title: 'Sentimento do Mercado',
      type: 'metric',
      isMinimized: false,
      isFavorite: true,
      value: 68,
      trend: 'up'
    },
    {
      id: 'price-alert',
      title: 'Alertas de Preço',
      type: 'alert',
      isMinimized: false,
      isFavorite: false,
      value: 3
    }
  ]);

  const toggleMinimize = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, isMinimized: !widget.isMinimized } : widget
    ));
  };

  const toggleFavorite = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, isFavorite: !widget.isFavorite } : widget
    ));
  };

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

  const renderWidget = (widget: Widget) => {
    const Icon = getWidgetIcon(widget.type, widget.trend);
    
    return (
      <Card 
        key={widget.id} 
        className={`bg-gradient-to-br from-dashboard-dark to-dashboard-darker border-satotrack-neon/20 transition-all duration-300 hover:border-satotrack-neon/40 ${
          widget.isMinimized ? 'h-20' : 'h-auto'
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Icon className={`h-4 w-4 ${
                widget.trend === 'up' ? 'text-green-500' : 
                widget.trend === 'down' ? 'text-red-500' : 'text-satotrack-neon'
              }`} />
              {widget.title}
              {widget.isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
            </CardTitle>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => toggleFavorite(widget.id)}
              >
                <Heart className={`h-3 w-3 ${widget.isFavorite ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => toggleMinimize(widget.id)}
              >
                {widget.isMinimized ? 
                  <Maximize2 className="h-3 w-3" /> : 
                  <Minimize2 className="h-3 w-3" />
                }
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!widget.isMinimized && (
          <CardContent className="pt-0">
            {widget.type === 'metric' && (
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
            )}
            
            {widget.type === 'goal' && (
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
            )}
            
            {widget.type === 'alert' && (
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
            )}
            
            <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Download className="h-3 w-3 mr-1" />
                Exportar
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Share2 className="h-3 w-3 mr-1" />
                Compartilhar
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Bookmark className="h-3 w-3 mr-1" />
                Salvar
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {widgets.map(renderWidget)}
    </div>
  );
};

export default InteractiveWidgets;
