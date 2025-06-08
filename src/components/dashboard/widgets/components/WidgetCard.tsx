
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGamification } from '@/contexts/gamification/GamificationContext';
import { Widget } from '../types';
import WidgetHeader from './WidgetHeader';
import WidgetContent from './WidgetContent';
import WidgetActions from './WidgetActions';

interface WidgetCardProps {
  widget: Widget;
  savedWidgets: string[];
  onToggleMinimize: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onLike: (widgetId: string) => void;
  onExpand: (widget: Widget) => void;
  onExport: (widget: Widget) => void;
  onShare: (widget: Widget) => void;
  onSave: (widgetId: string) => void;
}

const WidgetCard: React.FC<WidgetCardProps> = ({
  widget,
  savedWidgets,
  onToggleMinimize,
  onToggleFavorite,
  onLike,
  onExpand,
  onExport,
  onShare,
  onSave
}) => {
  const { widgetLikes, isWidgetLiked } = useGamification();
  
  const likesCount = widgetLikes[widget.id] || 0;
  const isLiked = isWidgetLiked(widget.id);
  const isSaved = savedWidgets.includes(widget.id);
  
  return (
    <Card 
      className={`bg-gradient-to-br from-dashboard-dark to-dashboard-darker border-satotrack-neon/20 transition-all duration-300 hover:border-satotrack-neon/40 ${
        widget.isMinimized ? 'h-20' : 'h-auto'
      }`}
    >
      <CardHeader className="pb-2">
        <WidgetHeader
          widget={widget}
          likesCount={likesCount}
          isLiked={isLiked}
          onLike={onLike}
          onToggleFavorite={onToggleFavorite}
          onToggleMinimize={onToggleMinimize}
        />
      </CardHeader>
      
      {!widget.isMinimized && (
        <CardContent className="pt-0">
          <WidgetContent widget={widget} />
          
          <WidgetActions
            widget={widget}
            isSaved={isSaved}
            onExpand={onExpand}
            onExport={onExport}
            onShare={onShare}
            onSave={onSave}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default WidgetCard;
