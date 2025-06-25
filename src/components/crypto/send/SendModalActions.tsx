
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';

interface SendModalActionsProps {
  isLoading: boolean;
  canSend: boolean;
  onCancel: () => void;
  onSend: () => void;
}

export const SendModalActions: React.FC<SendModalActionsProps> = ({
  isLoading,
  canSend,
  onCancel,
  onSend
}) => {
  return (
    <div className="flex gap-2 pt-2">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="flex-1"
      >
        Cancelar
      </Button>
      <Button
        onClick={onSend}
        disabled={isLoading || !canSend}
        className="flex-1"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        {isLoading ? 'Enviando...' : 'Enviar'}
      </Button>
    </div>
  );
};
