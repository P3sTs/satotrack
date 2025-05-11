
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCarteiras } from '../contexts/CarteirasContext';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { TransacaoBTC } from '../types/types';
import { loadTransacoes } from '../services/carteiras/transacoesService';
import DeleteWalletDialog from '../components/wallet/DeleteWalletDialog';
import WalletHeader from '../components/wallet/WalletHeader';
import WalletBalanceSummary from '../components/wallet/WalletBalanceSummary';
import WalletAnalytics from '../components/wallet/WalletAnalytics';
import WalletTransactions from '../components/wallet/WalletTransactions';

const CarteiraDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { carteiras, isLoading, removerCarteira, atualizarNomeCarteira, definirCarteiraPrincipal, carteiraPrincipal } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const [transacoes, setTransacoes] = useState<TransacaoBTC[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const carteira = carteiras.find(c => c.id === id);

  useEffect(() => {
    if (id) {
      const carregarTransacoes = async () => {
        const txs = await loadTransacoes(id);
        setTransacoes(txs);
      };
      
      carregarTransacoes();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-satotrack-neon"></div>
        </div>
      </div>
    );
  }

  if (!carteira) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Carteira não encontrada</h2>
          <button onClick={() => navigate('/carteiras')} className="px-4 py-2 bg-primary text-white rounded">
            Voltar para Carteiras
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteWallet = async () => {
    await removerCarteira(id!);
    navigate('/carteiras');
  };

  const handleUpdateName = async (newName: string) => {
    await atualizarNomeCarteira(id!, newName);
  };

  const handleSetAsPrimary = async () => {
    await definirCarteiraPrincipal(id!);
  };

  const isPrincipal = carteiraPrincipal === carteira.id;

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <WalletHeader 
        carteira={carteira}
        isPrincipal={isPrincipal}
        onSetAsPrimary={handleSetAsPrimary}
        onUpdateName={handleUpdateName}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />
      
      <WalletBalanceSummary 
        carteira={carteira}
        bitcoinData={bitcoinData}
      />

      <WalletAnalytics 
        bitcoinData={bitcoinData}
        walletId={id!}
      />
      
      <WalletTransactions transacoes={transacoes} />
      
      <DeleteWalletDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
        onDelete={handleDeleteWallet}
        walletName={carteira.nome}
      />
    </div>
  );
};

export default CarteiraDetalhes;
