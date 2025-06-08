
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { 
  Heart,
  Star,
  Maximize2, 
  Minimize2
} from 'lucide-react';
import { Widget } from '../types';
import { getWidgetIcon } from '../utils/widgetUtils';
import { useGamification } from '@/contexts/gamification/GamificationContext';

interface WidgetHeaderProps {
  widget: Widget;
  likesCount?: number;
  isLiked?: boolean;
  onLike: (widgetId: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleMinimize: (id: string) => void;
}

const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  widget,
  onLike,
  onToggleFavorite,
  onToggleMinimize
}) => {
  const { widgetLikes, isWidgetLiked } = useGamification();
  const Icon = getWidgetIcon(widget.type, widget.trend);
  
  const likesCount = widgetLikes[widget.id] || 0;
  const isLiked = isWidgetLiked(widget.id);

  return (
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
          onClick={() => onLike(widget.id)}
        >
          <Heart className={`h-3 w-3 ${isLiked ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => onToggleFavorite(widget.id)}
        >
          <Star className={`h-3 w-3 ${widget.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => onToggleMinimize(widget.id)}
        >
          {widget.isMinimized ? 
            <Maximize2 className="h-3 w-3" /> : 
            <Minimize2 className="h-3 w-3" />
          }
        </Button>
      </div>
    </div>
  );
};

export default WidgetHeader;
