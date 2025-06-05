
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarteiras } from '../contexts/carteiras';
import { useBitcoinPrice } from '../hooks/useBitcoinPrice';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import WalletDetailCard from '@/components/wallet/WalletDetailCard';
import WalletAnalytics from '@/components/wallet/WalletAnalytics';
import WalletTransactions from '@/components/wallet/WalletTransactions';
import ViewController from '@/components/wallet/ViewController';
import { toast } from '@/hooks/use-toast';

const CarteiraDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { carteiras, atualizarCarteira, carregarTransacoes, transacoes, isUpdating } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const { userPlan } = useAuth();
  
  const carteira = carteiras.find(c => c.id === id);
  const walletTransactions = transacoes[id || ''] || [];
  const isWalletUpdating = isUpdating[id || ''] || false;

  useEffect(() => {
    if (id && carteira) {
      carregarTransacoes(id);
    }
  }, [id, carteira, carregarTransacoes]);

  const handleUpdateWallet = async () => {
    if (!id) return;
    
    try {
      await atualizarCarteira(id);
      toast({
        title: "Carteira atualizada",
        description: "Os dados da carteira foram atualizados com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a carteira",
        variant: "destructive",
      });
    }
  };

  if (!carteira) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Carteira não encontrada</h2>
          <p className="text-muted-foreground mb-6">
            A carteira que você está procurando não existe ou foi removida.
          </p>
          <Button onClick={() => navigate('/carteiras')}>
            Ver Todas as Carteiras
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header with back button and refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {carteira.nome}
          </h1>
        </div>
        
        <Button
          onClick={handleUpdateWallet}
          disabled={isWalletUpdating}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isWalletUpdating ? 'animate-spin' : ''}`} />
          {isWalletUpdating ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {/* Wallet Detail Card */}
      <WalletDetailCard 
        carteira={carteira} 
        bitcoinData={bitcoinData}
      />

      {/* View Controller for different display modes */}
      <ViewController
        wallet={carteira}
        transacoes={walletTransactions}
        bitcoinData={bitcoinData}
      />
    </div>
  );
};

export default CarteiraDetalhes;
