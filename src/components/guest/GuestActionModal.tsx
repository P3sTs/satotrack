import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Timer, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GuestActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionName: string;
}

export const GuestActionModal: React.FC<GuestActionModalProps> = ({
  isOpen,
  onClose,
  actionName
}) => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    sessionStorage.setItem('continue_from', window.location.pathname);
    sessionStorage.setItem('pending_action', actionName);
    navigate('/auth');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-dashboard-medium border-satotrack-neon/30">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-satotrack-neon/20 rounded-full">
              <Lock className="h-8 w-8 text-satotrack-neon" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl text-white">
            Ação Restrita
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center">
            <Badge variant="outline" className="border-orange-500/30 text-orange-400 mb-3">
              <Timer className="h-3 w-3 mr-1" />
              Modo Visitante
            </Badge>
            <p className="text-muted-foreground">
              Para <span className="text-satotrack-neon font-semibold">{actionName}</span>, 
              você precisa criar uma conta no SatoTracker.
            </p>
          </div>

          <div className="bg-dashboard-dark/50 p-4 rounded-lg border border-satotrack-neon/20">
            <h4 className="font-semibold text-white mb-2">Com sua conta você pode:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Criar carteiras reais</li>
              <li>• Enviar e receber criptomoedas</li>
              <li>• Comprar e vender ativos</li>
              <li>• Acesso ilimitado à plataforma</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-muted-foreground/30 text-muted-foreground hover:bg-muted-foreground/10"
            >
              Continuar Explorando
            </Button>
            <Button
              onClick={handleCreateAccount}
              className="flex-1 bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Criar Conta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};