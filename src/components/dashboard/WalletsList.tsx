
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, Plus, RefreshCw, Wallet } from 'lucide-react';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { useCarteiras } from '@/contexts/carteiras';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth';
import WalletCard3D from '@/components/wallet/WalletCard3D';
import WalletBubbleView from '@/components/wallet/WalletBubbleView';
import { toast } from 'sonner';

interface WalletsListProps {
  onNewWallet?: () => void;
}

const WalletsList: React.FC<WalletsListProps> = ({ onNewWallet }) => {
  const { carteiras, isLoading, carteiraPrincipal, ordenarCarteiras } = useCarteiras();
  const [view, setView] = useState<'cards' | 'bubbles'>('cards');
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  const reachedLimit = !isPremium && carteiras.length >= 1;
  const [walletToDelete, setWalletToDelete] = useState<CarteiraBTC | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { removerCarteira } = useCarteiras();
  
  const handleSort = (option: string) => {
    switch(option) {
      case 'balance-highest':
        ordenarCarteiras('saldo', 'desc');
        break;
      case 'balance-lowest':
        ordenarCarteiras('saldo', 'asc');
        break;
      case 'newest':
        ordenarCarteiras('ultimo_update', 'desc');
        break;
      case 'oldest':
        ordenarCarteiras('ultimo_update', 'asc');
        break;
    }
  };
  
  const handleOpenDelete = (carteira: CarteiraBTC) => {
    setWalletToDelete(carteira);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!walletToDelete) return;
    
    try {
      await removerCarteira(walletToDelete.id);
      toast.success('Carteira removida com sucesso');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao remover carteira:', error);
      toast.error('Erro ao remover carteira');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Minhas Carteiras
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Carregando carteiras...</p>
        </CardContent>
      </Card>
    );
  }

  if (carteiras.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Minhas Carteiras
          </CardTitle>
          <CardDescription>
            Você ainda não possui carteiras cadastradas.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <Button onClick={onNewWallet} className="bg-satotrack-neon hover:bg-satotrack-neon/80">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Carteira
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5" />
              Minhas Carteiras ({carteiras.length})
            </CardTitle>
            <CardDescription>
              {isPremium 
                ? 'Gerencie suas carteiras Bitcoin com facilidade.' 
                : `Limite: ${carteiras.length}/1 carteiras no plano gratuito.`
              }
            </CardDescription>
          </div>
          
          <div className="flex gap-2 mt-2 md:mt-0">
            {!reachedLimit && (
              <Button 
                onClick={onNewWallet}
                className="bg-satotrack-neon hover:bg-satotrack-neon/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Carteira
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="cards" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-muted/30">
              <TabsTrigger 
                value="cards" 
                onClick={() => setView('cards')}
                className="data-[state=active]:bg-satotrack-neon/20 data-[state=active]:text-satotrack-neon"
              >
                Cartões
              </TabsTrigger>
              <TabsTrigger 
                value="bubbles" 
                onClick={() => setView('bubbles')}
                className="data-[state=active]:bg-satotrack-neon/20 data-[state=active]:text-satotrack-neon"
              >
                Visualização 3D
              </TabsTrigger>
            </TabsList>
            
            <select
              className="bg-muted/30 border border-muted p-2 rounded-md text-sm"
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="balance-highest">Maior saldo</option>
              <option value="balance-lowest">Menor saldo</option>
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigas</option>
            </select>
          </div>
          
          <TabsContent value="cards" className="m-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {carteiras.map((carteira) => (
                <WalletCard3D 
                  key={carteira.id}
                  carteira={carteira}
                  isPrimary={carteira.id === carteiraPrincipal}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="bubbles" className="m-0">
            <WalletBubbleView />
          </TabsContent>
        </Tabs>
        
        {!isPremium && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-900/30 to-purple-600/20 rounded-lg border border-purple-500/30">
            <p className="text-purple-300 mb-2">
              <span className="font-semibold">Assine o Premium</span> e adicione carteiras ilimitadas!
            </p>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
            >
              Assinar Premium
            </Button>
          </div>
        )}
      </CardContent>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="p-4 text-center">
            <h3 className="text-lg font-medium mb-2">Confirmar exclusão</h3>
            <p className="text-muted-foreground mb-4">
              Tem certeza que deseja remover a carteira "{walletToDelete?.nome}"?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Remover Carteira
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WalletsList;
