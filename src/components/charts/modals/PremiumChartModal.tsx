
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DownloadCloud, Lock } from 'lucide-react';

interface PremiumChartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PremiumChartModal: React.FC<PremiumChartModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-satotrack-neon" />
            Recurso Premium
          </DialogTitle>
          <DialogDescription>
            Este recurso está disponível apenas para usuários com plano Premium.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center py-4">
          <div className="p-3 bg-satotrack-neon/10 rounded-full">
            <DownloadCloud className="h-8 w-8 text-satotrack-neon" />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm">
            Com o plano Premium você pode:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Exportar dados para qualquer período</li>
            <li>Baixar relatórios avançados</li>
            <li>Acessar métricas históricas</li>
            <li>E muito mais!</li>
          </ul>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:w-auto w-full"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => navigate('/planos')}
            className="sm:w-auto w-full"
          >
            Conhecer Planos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumChartModal;
