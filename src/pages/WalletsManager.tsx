
import React, { useState } from 'react';
import { useCarteiras } from '../contexts/CarteirasContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Save, X, Plus, AlertTriangle, RefreshCw, Star } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import NewWalletModal from '../components/NewWalletModal';
import { CarteiraBTC } from '../types/types';
import { formatarBTC, formatarData } from '../utils/formatters';
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

const WalletsManager: React.FC = () => {
  const { carteiras, isLoading, removerCarteira, updateWalletName, atualizarCarteira, isUpdating, definirCarteiraPrincipal, carteiraPrincipal } = useCarteiras();
  const [isNewWalletModalOpen, setIsNewWalletModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [newWalletName, setNewWalletName] = useState('');
  const [walletToDelete, setWalletToDelete] = useState<string | null>(null);

  const handleStartEdit = (carteira: CarteiraBTC) => {
    setEditingWallet(carteira.id);
    setNewWalletName(carteira.nome);
  };

  const handleCancelEdit = () => {
    setEditingWallet(null);
    setNewWalletName('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!newWalletName.trim()) {
      toast.error('O nome da carteira não pode ficar em branco');
      return;
    }

    try {
      await updateWalletName(id, newWalletName.trim());
      setEditingWallet(null);
      setNewWalletName('');
      toast.success('Nome da carteira atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar o nome da carteira');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (walletToDelete) {
      try {
        await removerCarteira(walletToDelete);
        setWalletToDelete(null);
        toast.success('Carteira removida com sucesso');
      } catch (error) {
        toast.error('Erro ao remover a carteira');
        console.error(error);
      }
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await atualizarCarteira(id);
      toast.success('Carteira atualizada com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar a carteira');
      console.error(error);
    }
  };

  const togglePrimaryWallet = (id: string) => {
    if (carteiraPrincipal === id) {
      definirCarteiraPrincipal(null);
      toast.success('Carteira principal removida');
    } else {
      definirCarteiraPrincipal(id);
      toast.success('Carteira definida como principal');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciamento de Carteiras</h1>
          <p className="text-muted-foreground">Gerencie suas carteiras Bitcoin em um só lugar</p>
        </div>
        <Button 
          onClick={() => setIsNewWalletModalOpen(true)}
          variant="bitcoin"
          size="lg"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Carteira
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse p-6 border rounded-lg">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-full mb-6"></div>
              <div className="flex justify-between">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : carteiras.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-border rounded-lg">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">Nenhuma carteira encontrada</h3>
          <p className="text-muted-foreground mb-6">Adicione uma carteira Bitcoin para começar a monitorá-la</p>
          <Button 
            onClick={() => setIsNewWalletModalOpen(true)}
            variant="bitcoin"
            size="lg"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Carteira
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {carteiras.map(carteira => (
            <div key={carteira.id} className={`border rounded-lg p-6 bg-card ${carteiraPrincipal === carteira.id ? 'ring-2 ring-bitcoin' : ''}`}>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-2/3">
                  {editingWallet === carteira.id ? (
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex-grow">
                        <Label htmlFor={`edit-name-${carteira.id}`} className="sr-only">
                          Nome da Carteira
                        </Label>
                        <Input
                          id={`edit-name-${carteira.id}`}
                          value={newWalletName}
                          onChange={(e) => setNewWalletName(e.target.value)}
                          placeholder="Nome da carteira"
                          className="w-full"
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleSaveEdit(carteira.id)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center mb-3">
                      <h3 className="text-xl font-semibold mr-2">{carteira.nome}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleStartEdit(carteira)}
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
                      <p className="font-medium">{formatarBTC(carteira.total_entradas)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total enviado</p>
                      <p className="font-medium">{formatarBTC(carteira.total_saidas)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3 md:border-l md:pl-6 pt-4 md:pt-0">
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Saldo atual</p>
                    <p className="text-2xl font-bold bitcoin-gradient-text">{formatarBTC(carteira.saldo)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Última atualização</p>
                    <p>{formatarData(carteira.ultimo_update)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Número de transações</p>
                    <p>{carteira.qtde_transacoes}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUpdate(carteira.id)}
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
                      variant={carteiraPrincipal === carteira.id ? "neon" : "outline"}
                      size="sm"
                      onClick={() => togglePrimaryWallet(carteira.id)}
                      className="w-full"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {carteiraPrincipal === carteira.id ? "Principal" : "Favoritar"}
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
                      onClick={() => setWalletToDelete(carteira.id)}
                      className="w-full"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <NewWalletModal 
        isOpen={isNewWalletModalOpen}
        onClose={() => setIsNewWalletModalOpen(false)}
      />

      <AlertDialog open={!!walletToDelete} onOpenChange={(open) => !open && setWalletToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover carteira?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Esta carteira será removida do seu monitoramento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Sim, remover carteira
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WalletsManager;
