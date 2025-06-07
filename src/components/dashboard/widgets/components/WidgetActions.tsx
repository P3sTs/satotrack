
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Expand,
  Save,
  Share,
  Download
} from 'lucide-react';
import { Widget } from '../types';

interface WidgetActionsProps {
  widget: Widget;
  isSaved: boolean;
  onExpand: (widget: Widget) => void;
  onExport: (widget: Widget) => void;
  onShare: (widget: Widget) => void;
  onSave: (widgetId: string) => void;
}

const WidgetActions: React.FC<WidgetActionsProps> = ({
  widget,
  isSaved,
  onExpand,
  onExport,
  onShare,
  onSave
}) => {
  return (
    <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 px-2 text-xs"
        onClick={() => onExpand(widget)}
      >
        <Expand className="h-3 w-3 mr-1" />
        Expandir
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 px-2 text-xs"
        onClick={() => onExport(widget)}
      >
        <Download className="h-3 w-3 mr-1" />
        Exportar
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 px-2 text-xs"
        onClick={() => onShare(widget)}
      >
        <Share className="h-3 w-3 mr-1" />
        Compartilhar
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={`h-6 px-2 text-xs ${isSaved ? 'text-satotrack-neon' : ''}`}
        onClick={() => onSave(widget.id)}
      >
        <Save className="h-3 w-3 mr-1" />
        {isSaved ? 'Salvo' : 'Salvar'}
      </Button>
    </div>
  );
};

export default WidgetActions;
