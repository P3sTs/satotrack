
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { UpgradeButton } from '@/components/monetization/PlanDisplay';

interface PremiumChartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PremiumChartModal: React.FC<PremiumChartModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recursos Premium</DialogTitle>
          <DialogDescription>
            Exportação de dados históricos completos (6 meses e 1 ano) está disponível apenas para assinantes Premium.
            <br /><br />
            No plano gratuito, você pode exportar dados de até 30 dias.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <UpgradeButton />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumChartModal;
