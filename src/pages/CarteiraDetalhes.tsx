
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCarteiras } from '@/contexts/CarteirasContext';
import { useAuth } from '@/contexts/auth';
import { TransacaoBTC } from '@/types/types';
import { ViewModeProvider } from '@/contexts/ViewModeContext';
import ViewModeSelector from '@/components/wallet/ViewModeSelector';
import ViewController from '@/components/wallet/ViewController';
import WalletHeader from '@/components/wallet/WalletHeader';
import WalletBalanceSummary from '@/components/wallet/WalletBalanceSummary';
import EmptyWalletState from '@/components/wallet/EmptyWalletState';
import { loadTransacoes } from '@/services/carteiras/transacoesService';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CarteiraDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { carteiras } = useCarteiras();
  const { bitcoinData } = useBitcoinPrice();
  const [transacoes, setTransacoes] = useState<TransacaoBTC[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Find the wallet with the specified ID
  const carteira = carteiras.find(c => c.id === id);

  useEffect(() => {
    const fetchTransacoes = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const data = await loadTransacoes(id);
          setTransacoes(data);
        } catch (error) {
          console.error('Erro ao carregar transações:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchTransacoes();
    }
  }, [id, user]);

  if (!user) {
    return null;
  }

  if (!carteira) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Carteira não encontrada</h1>
        <Link to="/carteiras">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Carteiras
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <ViewModeProvider>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/carteiras">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <WalletHeader 
            carteira={carteira} 
            extraElement={
              <ViewModeSelector />
            }
          />
        </div>

        <WalletBalanceSummary
          carteira={carteira}
          bitcoinPrice={bitcoinData?.price_usd}
        />

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bitcoin"></div>
            </div>
          ) : transacoes.length === 0 ? (
            <EmptyWalletState />
          ) : (
            <ViewController 
              wallet={carteira}
              transacoes={transacoes}
              bitcoinData={bitcoinData}
            />
          )}
        </div>
      </div>
    </ViewModeProvider>
  );
};

export default CarteiraDetalhes;
