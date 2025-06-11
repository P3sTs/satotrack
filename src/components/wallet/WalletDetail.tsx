import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCarteiras } from '@/contexts/carteiras';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import WalletBalanceSummary from '@/components/wallet/WalletBalanceSummary';
import WalletAnalytics from '@/components/wallet/WalletAnalytics';
import TransactionList from '@/components/TransacoesList';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import WalletBalanceInsights from '@/components/wallet/WalletBalanceInsights';
import WalletAdvancedMetrics from '@/components/wallet/WalletAdvancedMetrics';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const WalletDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { carteiras, isLoading, carregarTransacoes, transacoes, removerCarteira } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const carteira = carteiras.find(c => c.id === id);

  useEffect(() => {
    const loadTransactions = async () => {
      if (id && !transacoes[id]) {
        await carregarTransacoes(id);
      }
    };

    loadTransactions();
  }, [id, carregarTransacoes, transacoes]);

  const handleDelete = async () => {
    if (!carteira || !window.confirm('Tem certeza que deseja remover esta carteira?')) return;
    
    setIsDeleting(true);
    
    try {
      await removerCarteira(carteira.id);
      toast.success('Carteira removida com sucesso');
      setTimeout(() => {
        window.location.href = '/carteiras';
      }, 1500);
    } catch (error) {
      console.error('Erro ao remover carteira:', error);
      toast.error('Erro ao remover carteira');
      setIsDeleting(false);
    }
  };

  if (isLoading || !carteira) {
    return (
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full mr-3" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header com Navegação e Ações */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="mr-3"
                  asChild
                >
                  <Link to="/carteiras">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voltar para carteiras</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <h1 className="text-2xl font-bold">{carteira.nome}</h1>
        </div>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  className="h-9"
                  asChild
                >
                  <Link to={`/carteira/${carteira.id}/editar`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar informações da carteira</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="destructive"
                  className="h-9"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Removendo..." : "Remover"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remover esta carteira</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Resumo de Saldo */}
      <WalletBalanceSummary carteira={carteira} bitcoinData={bitcoinData} />
      
      {/* Métricas Avançadas */}
      <WalletAdvancedMetrics wallet={carteira} bitcoinData={bitcoinData} />
      
      {/* Insights de Saldo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WalletAnalytics bitcoinData={bitcoinData} walletId={carteira.id} />
        </div>
        <div>
          <div className="bitcoin-card p-6">
            <h2 className="text-xl font-semibold mb-4">Insights</h2>
            <WalletBalanceInsights walletId={carteira.id} bitcoinData={bitcoinData} />
          </div>
        </div>
      </div>

      {/* Transações */}
      <Tabs defaultValue="all" className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Transações</h2>
          <TabsList className="bg-muted/30">
            <TabsTrigger value="all" className="data-[state=active]:bg-satotrack-neon/20 data-[state=active]:text-satotrack-neon">
              Todas
            </TabsTrigger>
            <TabsTrigger value="received" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500">
              Recebidas
            </TabsTrigger>
            <TabsTrigger value="sent" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500">
              Enviadas
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="bg-dashboard-medium border border-dashboard-light rounded-lg mt-2">
          <TabsContent value="all" className="m-0 py-1">
            <TransactionList transacoes={transacoes[carteira.id] || []} />
          </TabsContent>
          
          <TabsContent value="received" className="m-0 py-1">
            <TransactionList 
              transacoes={(transacoes[carteira.id] || []).filter(tx => tx.tipo === 'entrada')} 
            />
          </TabsContent>
          
          <TabsContent value="sent" className="m-0 py-1">
            <TransactionList 
              transacoes={(transacoes[carteira.id] || []).filter(tx => tx.tipo === 'saida')} 
            />
          </TabsContent>
        </div>
      </Tabs>
      
      {/* Aviso para usuários */}
      <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mt-6">
        <AlertCircle className="h-6 w-6 text-yellow-500" />
        <div>
          <h3 className="font-medium text-yellow-500">Detecção automática</h3>
          <p className="text-sm text-muted-foreground">
            O SatoTrack monitora automaticamente esta carteira em busca de novas transações a cada hora.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletDetail;
