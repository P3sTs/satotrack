
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCarteiras } from '@/contexts/carteiras';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { WalletDetailHeader } from './detail/WalletDetailHeader';
import { WalletDetailContent } from './detail/WalletDetailContent';
import { WalletDetailFooter } from './detail/WalletDetailFooter';

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
      <WalletDetailHeader 
        carteira={carteira}
        isDeleting={isDeleting}
        onDelete={handleDelete}
      />
      
      <WalletDetailContent
        carteira={carteira}
        bitcoinData={bitcoinData}
        transacoes={transacoes[carteira.id] || []}
      />

      <WalletDetailFooter />
    </div>
  );
};

export default WalletDetail;
