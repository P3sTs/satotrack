
import React, { useState } from 'react';
import { CarteiraBTC } from '../../types/types';
import { formatBitcoinValue, formatDate } from '../../utils/formatters';
import { Button } from '@/components/ui/button';
import { Pencil, RefreshCw, Star } from 'lucide-react';
import { useCarteiras } from '../../contexts/carteiras';
import { toast } from '@/components/ui/sonner';
import WalletEditor from './WalletEditor';
import DeleteWalletDialog from './DeleteWalletDialog';

interface WalletCardProps {
  carteira: CarteiraBTC;
}

const WalletCard: React.FC<WalletCardProps> = ({ carteira }) => {
  const { 
    removerCarteira, 
    atualizarNomeCarteira, 
    atualizarCarteira, 
    isUpdating, 
    definirCarteiraPrincipal, 
    carteiraPrincipal 
  } = useCarteiras();
  
  const [editingWallet, setEditingWallet] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleStartEdit = () => {
    setEditingWallet(true);
  };

  const handleCancelEdit = () => {
    setEditingWallet(false);
  };

  const handleSaveEdit = async (newName: string) => {
    if (!newName.trim()) {
      toast.error('O nome da carteira não pode ficar em branco');
      return;
    }

    try {
      await atualizarNomeCarteira(carteira.id, newName.trim());
      setEditingWallet(false);
      toast.success('Nome da carteira atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar o nome da carteira');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await removerCarteira(carteira.id);
      toast.success('Carteira removida com sucesso');
    } catch (error) {
      toast.error('Erro ao remover a carteira');
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await atualizarCarteira(carteira.id);
      toast.success('Carteira atualizada com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar a carteira');
      console.error(error);
    }
  };

  const togglePrimaryWallet = () => {
    if (carteiraPrincipal === carteira.id) {
      definirCarteiraPrincipal(null);
      toast.success('Carteira principal removida');
    } else {
      definirCarteiraPrincipal(carteira.id);
      toast.success('Carteira definida como principal');
    }
  };

  const isPrimary = carteiraPrincipal === carteira.id;

  return (
    <div className={`border rounded-lg p-6 bg-card ${isPrimary ? 'ring-2 ring-bitcoin' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-2/3">
          {editingWallet ? (
            <WalletEditor 
              initialName={carteira.nome}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <div className="flex items-center mb-3">
              <h3 className="text-xl font-semibold mr-2">{carteira.nome}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={handleStartEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">Endereço</p>
            <p className="text-sm font-mono break-all">{carteira.endereco}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total recebido</p>
              <p className="font-medium">{formatBitcoinValue(carteira.total_entradas)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total enviado</p>
              <p className="font-medium">{formatBitcoinValue(carteira.total_saidas)}</p>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/3 md:border-l md:pl-6 pt-4 md:pt-0">
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">Saldo atual</p>
            <p className="text-2xl font-bold bitcoin-gradient-text">{formatBitcoinValue(carteira.saldo)}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">Última atualização</p>
            <p>{formatDate(carteira.ultimo_update)}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">Número de transações</p>
            <p>{carteira.qtde_transacoes}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUpdate}
              disabled={!!isUpdating[carteira.id]}
              className="w-full"
            >
              {isUpdating[carteira.id] ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Atualizar
            </Button>
            
            <Button 
              variant={isPrimary ? "neon" : "outline"}
              size="sm"
              onClick={togglePrimaryWallet}
              className="w-full"
            >
              <Star className="h-4 w-4 mr-2" />
              {isPrimary ? "Principal" : "Favoritar"}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = `/carteira/${carteira.id}`}
              className="w-full"
            >
              Ver detalhes
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full"
            >
              Remover
            </Button>
          </div>
        </div>
      </div>

      <DeleteWalletDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default WalletCard;
