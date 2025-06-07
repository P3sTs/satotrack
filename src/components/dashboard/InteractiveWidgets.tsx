
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Maximize2, 
  Minimize2, 
  Heart,
  Star,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Expand,
  Save,
  Share,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { useGamification } from '@/contexts/gamification/GamificationContext';
import WidgetExpansionModal from './WidgetExpansionModal';

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
  const { likeWidget, unlikeWidget, isWidgetLiked, userStats, addXP } = useGamification();
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

  const [expandedWidget, setExpandedWidget] = useState<Widget | null>(null);
  const [savedWidgets, setSavedWidgets] = useState<string[]>([]);

  // Load saved widgets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedWidgets');
    if (saved) {
      setSavedWidgets(JSON.parse(saved));
    }
  }, []);

  const toggleMinimize = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, isMinimized: !widget.isMinimized } : widget
    ));
    addXP(5, 'Widget minimizado/expandido');
  };

  const toggleFavorite = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, isFavorite: !widget.isFavorite } : widget
    ));
    addXP(5, 'Widget favoritado');
    toast.success('Widget favoritado!');
  };

  const handleLike = (widgetId: string) => {
    if (isWidgetLiked(widgetId)) {
      unlikeWidget(widgetId);
      toast.info('Curtida removida');
    } else {
      likeWidget(widgetId);
    }
  };

  const handleExpand = (widget: Widget) => {
    setExpandedWidget(widget);
    addXP(5, 'Widget expandido');
    toast.info(`Expandindo ${widget.title}`, {
      description: 'Visualização detalhada carregada'
    });
  };

  const handleSave = (widgetId: string) => {
    const newSaved = savedWidgets.includes(widgetId)
      ? savedWidgets.filter(id => id !== widgetId)
      : [...savedWidgets, widgetId];
    
    setSavedWidgets(newSaved);
    localStorage.setItem('savedWidgets', JSON.stringify(newSaved));
    addXP(5, 'Widget salvo');
    
    toast.success(
      savedWidgets.includes(widgetId) ? 'Widget removido dos salvos' : 'Widget salvo!',
      { description: 'Configuração mantida' }
    );
  };

  const handleShare = (widget: Widget) => {
    const shareData = {
      title: `SatoTrack - ${widget.title}`,
      text: `Confira meus dados: ${widget.title} - ${widget.value}%`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.title}: ${shareData.text}`);
      toast.success('Copiado para área de transferência!');
    }
    
    addXP(10, 'Widget compartilhado');
  };

  const handleExport = (widget: Widget) => {
    const exportData = {
      widget: widget.title,
      value: widget.value,
      type: widget.type,
      trend: widget.trend,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${widget.title.replace(/\s+/g, '_')}_export.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    addXP(15, 'Dados exportados');
    toast.success('Dados exportados!', {
      description: 'Arquivo baixado com sucesso'
    });
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
    const likesCount = userStats.widgetLikes[widget.id] || 0;
    const isLiked = isWidgetLiked(widget.id);
    const isSaved = savedWidgets.includes(widget.id);
    
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
              {likesCount > 0 && (
                <Badge variant="outline" className="text-xs px-1">
                  {likesCount}
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleLike(widget.id)}
              >
                <Heart className={`h-3 w-3 ${isLiked ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => toggleFavorite(widget.id)}
              >
                <Star className={`h-3 w-3 ${widget.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => handleExpand(widget)}
              >
                <Expand className="h-3 w-3 mr-1" />
                Expandir
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => handleExport(widget)}
              >
                <Download className="h-3 w-3 mr-1" />
                Exportar
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => handleShare(widget)}
              >
                <Share className="h-3 w-3 mr-1" />
                Compartilhar
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-6 px-2 text-xs ${isSaved ? 'text-satotrack-neon' : ''}`}
                onClick={() => handleSave(widget.id)}
              >
                <Save className="h-3 w-3 mr-1" />
                {isSaved ? 'Salvo' : 'Salvar'}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map(renderWidget)}
      </div>
      
      <WidgetExpansionModal
        widget={expandedWidget}
        isOpen={!!expandedWidget}
        onClose={() => setExpandedWidget(null)}
        likesCount={expandedWidget ? (userStats.widgetLikes[expandedWidget.id] || 0) : 0}
      />
    </>
  );
};

export default InteractiveWidgets;
