
import { useGamification } from '@/contexts/gamification/GamificationContext';
import { toast } from 'sonner';
import { Widget } from '../types';

export const useWidgetActions = (
  widgets: Widget[],
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>,
  savedWidgets: string[],
  setSavedWidgets: React.Dispatch<React.SetStateAction<string[]>>,
  setExpandedWidget: React.Dispatch<React.SetStateAction<Widget | null>>
) => {
  const { likeWidget, unlikeWidget, isWidgetLiked, addXP } = useGamification();

  const toggleMinimize = async (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, isMinimized: !widget.isMinimized } : widget
    ));
    await addXP(5, 'Widget minimizado/expandido');
  };

  const toggleFavorite = async (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, isFavorite: !widget.isFavorite } : widget
    ));
    await addXP(5, 'Widget favoritado');
    toast.success('Widget favoritado!');
  };

  const handleLike = async (widgetId: string) => {
    if (isWidgetLiked(widgetId)) {
      await unlikeWidget(widgetId);
    } else {
      await likeWidget(widgetId);
    }
  };

  const handleExpand = async (widget: Widget) => {
    setExpandedWidget(widget);
    await addXP(5, 'Widget expandido');
    toast.info(`Expandindo ${widget.title}`, {
      description: 'Visualização detalhada carregada'
    });
  };

  const handleSave = async (widgetId: string) => {
    const newSaved = savedWidgets.includes(widgetId)
      ? savedWidgets.filter(id => id !== widgetId)
      : [...savedWidgets, widgetId];
    
    setSavedWidgets(newSaved);
    localStorage.setItem('savedWidgets', JSON.stringify(newSaved));
    await addXP(5, 'Widget salvo');
    
    toast.success(
      savedWidgets.includes(widgetId) ? 'Widget removido dos salvos' : 'Widget salvo!',
      { description: 'Configuração mantida' }
    );
  };

  const handleShare = async (widget: Widget) => {
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
    
    await addXP(10, 'Widget compartilhado');
  };

  const handleExport = async (widget: Widget) => {
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
    
    await addXP(15, 'Dados exportados');
    toast.success('Dados exportados!', {
      description: 'Arquivo baixado com sucesso'
    });
  };

  return {
    toggleMinimize,
    toggleFavorite,
    handleLike,
    handleExpand,
    handleSave,
    handleShare,
    handleExport
  };
};
