
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onDelete?: () => void; // Added to match the usage in CarteiraDetalhes
  walletName?: string; // Added to match the usage in CarteiraDetalhes
}

const DeleteWalletDialog: React.FC<DeleteWalletDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  onDelete,
  walletName = 'esta carteira'
}) => {
  // Use onDelete if provided, otherwise fall back to onConfirm
  const handleConfirm = () => {
    if (onDelete) {
      onDelete();
    } else if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover {walletName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Esta carteira será removida do seu monitoramento.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground">
            Sim, remover carteira
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWalletDialog;
