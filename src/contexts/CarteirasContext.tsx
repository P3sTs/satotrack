
import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { CarteiraBTC, TransacaoBTC, SortOption, SortDirection } from '../types/types';
import { CarteirasContextType, STORAGE_KEY_PRIMARY } from './types/CarteirasTypes';
import { 
  loadCarteiras, 
  addCarteira, 
  updateCarteira, 
  loadTransacoes, 
  removeCarteira 
} from '../services/carteiras';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const CarteirasContext = createContext<CarteirasContextType | undefined>(undefined);

// Export useCarteiras from the hooks file
export { useCarteiras } from './hooks/useCarteirasContext';

export const CarteirasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [carteiras, setCarteiras] = useState<CarteiraBTC[]>([]);
  const [transacoes, setTransacoes] = useState<Record<string, TransacaoBTC[]>>({});
  const [sortOption, setSortOption] = useState<SortOption>('saldo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [carteiraPrincipal, setCarteiraPrincipal] = useState<string | null>(
    localStorage.getItem(STORAGE_KEY_PRIMARY)
  );
  
  // Carregar todas as carteiras do usuário
  const carregarCarteiras = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadCarteiras(sortOption, sortDirection);
      setCarteiras(data);
    } finally {
      setIsLoading(false);
    }
  }, [sortOption, sortDirection]);

  // Initial load
  useEffect(() => {
    carregarCarteiras();
  }, [carregarCarteiras]);
  
  // Set up realtime subscription
  useEffect(() => {
    // Only subscribe if user is authenticated (we'll check in the component)
    const walletChanges = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bitcoin_wallets'
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            const newWallet = payload.new as any;
            if (newWallet && !carteiras.some(c => c.id === newWallet.id)) {
              // Format the new wallet according to our app's type
              setCarteiras(prev => [...prev, {
                id: newWallet.id,
                nome: newWallet.name,
                endereco: newWallet.address,
                saldo: newWallet.balance || 0,
                ultimo_update: newWallet.last_updated,
                total_entradas: newWallet.total_received || 0,
                total_saidas: newWallet.total_sent || 0,
                qtde_transacoes: newWallet.transaction_count || 0
              }]);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedWallet = payload.new as any;
            setCarteiras(prev => prev.map(wallet => 
              wallet.id === updatedWallet.id ? {
                ...wallet,
                nome: updatedWallet.name,
                endereco: updatedWallet.address,
                saldo: updatedWallet.balance || 0,
                ultimo_update: updatedWallet.last_updated,
                total_entradas: updatedWallet.total_received || 0,
                total_saidas: updatedWallet.total_sent || 0,
                qtde_transacoes: updatedWallet.transaction_count || 0
              } : wallet
            ));
            
            // Show notification if balance changed
            const existingWallet = carteiras.find(w => w.id === updatedWallet.id);
            if (existingWallet && existingWallet.saldo !== updatedWallet.balance) {
              const isIncrease = existingWallet.saldo < updatedWallet.balance;
              toast({
                title: `Saldo da carteira ${updatedWallet.name} ${isIncrease ? 'aumentou' : 'diminuiu'}`,
                description: `${isIncrease ? '+' : '-'} ${Math.abs(updatedWallet.balance - existingWallet.saldo).toFixed(8)} BTC`,
                variant: isIncrease ? "default" : "destructive",
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedWallet = payload.old as any;
            setCarteiras(prev => prev.filter(wallet => wallet.id !== deletedWallet.id));
          }
        }
      )
      .subscribe();
    
    // Transaction changes subscription
    const transactionChanges = supabase
      .channel('transaction-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'wallet_transactions'
        },
        (payload) => {
          const newTx = payload.new as any;
          
          if (newTx && newTx.wallet_id) {
            // Find wallet for this transaction
            const relatedWallet = carteiras.find(w => w.id === newTx.wallet_id);
            
            if (relatedWallet) {
              // Update transactions for this wallet
              setTransacoes(prev => {
                const currentTxs = prev[newTx.wallet_id] || [];
                
                // Check if we already have this transaction
                if (!currentTxs.some(tx => tx.hash === newTx.hash)) {
                  // Add new transaction
                  const newTransaction: TransacaoBTC = {
                    hash: newTx.hash,
                    valor: newTx.amount,
                    tipo: newTx.transaction_type as 'entrada' | 'saida',
                    data: newTx.transaction_date
                  };
                  
                  // Show notification for new transaction
                  toast({
                    title: `Nova transação ${newTx.transaction_type === 'entrada' ? 'recebida' : 'enviada'}`,
                    description: `${newTx.amount} BTC na carteira ${relatedWallet.nome}`,
                    variant: newTx.transaction_type === 'entrada' ? "default" : "destructive",
                  });
                  
                  return {
                    ...prev,
                    [newTx.wallet_id]: [newTransaction, ...currentTxs]
                  };
                }
                return prev;
              });
            }
          }
        }
      )
      .subscribe();
      
    // Auto update wallets every minute
    const updateInterval = setInterval(() => {
      if (carteiras.length > 0) {
        console.log('Auto-updating wallet data...');
        // Update only the principal wallet if defined, otherwise update the first one
        const walletToUpdate = carteiraPrincipal 
          ? carteiras.find(c => c.id === carteiraPrincipal)
          : carteiras[0];
          
        if (walletToUpdate) {
          atualizarCarteira(walletToUpdate.id).catch(console.error);
        }
      }
    }, 60000); // 1 minute
    
    return () => {
      supabase.removeChannel(walletChanges);
      supabase.removeChannel(transactionChanges);
      clearInterval(updateInterval);
    };
  }, [carteiras, carteiraPrincipal]);

  const adicionarCarteira = useCallback(async (nome: string, endereco: string): Promise<void> => {
    setIsLoading(true);
    try {
      const novaCarteira = await addCarteira(nome, endereco);
      setCarteiras(prevCarteiras => [...prevCarteiras, novaCarteira]);
      
      // Carregar transações iniciais
      try {
        const txs = await loadTransacoes(novaCarteira.id);
        setTransacoes(prev => ({...prev, [novaCarteira.id]: txs}));
      } catch (txError) {
        console.error('Error loading transactions:', txError);
        // Don't throw here, just log the error as this is not critical
      }
      
      toast({
        title: "Carteira adicionada com sucesso",
        description: `A carteira ${nome} foi adicionada e está sendo monitorada.`,
      });
    } catch (error) {
      console.error('Error adding wallet:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar carteira",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao adicionar a carteira",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const atualizarCarteira = useCallback(async (id: string): Promise<void> => {
    const carteira = carteiras.find(c => c.id === id);
    if (!carteira) return;

    setIsUpdating(prev => ({ ...prev, [id]: true }));
    try {
      // Atualizar carteira usando o serviço
      const carteiraAtualizada = await updateCarteira(carteira);
      
      // Atualizar carteira localmente
      setCarteiras(prevCarteiras => 
        prevCarteiras.map(c => c.id === id ? carteiraAtualizada : c)
      );
      
      // Buscar transações atualizadas
      const txs = await loadTransacoes(id);
      setTransacoes(prev => ({...prev, [id]: txs}));
    } catch (error) {
      console.error('Error updating wallet:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar carteira",
        description: "Não foi possível obter os dados mais recentes da carteira.",
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [id]: false }));
    }
  }, [carteiras]);

  const carregarTransacoes = useCallback(async (id: string): Promise<TransacaoBTC[]> => {
    const carteira = carteiras.find(c => c.id === id);
    if (!carteira) return [];

    if (transacoes[id]) {
      return transacoes[id];
    }

    const txs = await loadTransacoes(id);
    setTransacoes(prev => ({...prev, [id]: txs}));
    return txs;
  }, [carteiras, transacoes]);

  const removerCarteira = useCallback(async (id: string): Promise<void> => {
    try {
      await removeCarteira(id);
      
      // Se a carteira removida era a principal, limpar a configuração
      if (carteiraPrincipal === id) {
        setCarteiraPrincipal(null);
        localStorage.removeItem(STORAGE_KEY_PRIMARY);
      }
      
      setCarteiras(prevCarteiras => prevCarteiras.filter(c => c.id !== id));
      setTransacoes(prev => {
        const newTransacoes = {...prev};
        delete newTransacoes[id];
        return newTransacoes;
      });
      
      toast({
        title: "Carteira removida com sucesso",
        description: "A carteira foi removida e não será mais monitorada.",
      });
    } catch (error) {
      console.error('Error removing wallet:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover carteira",
        description: "Ocorreu um erro ao remover a carteira.",
      });
    }
  }, [carteiraPrincipal]);

  const ordenarCarteiras = useCallback((opcao: SortOption, direcao: SortDirection): void => {
    setSortOption(opcao);
    setSortDirection(direcao);
  }, []);
  
  const definirCarteiraPrincipal = useCallback((id: string | null): void => {
    setCarteiraPrincipal(id);
    
    if (id) {
      localStorage.setItem(STORAGE_KEY_PRIMARY, id);
      
      // Toast de confirmação
      const carteira = carteiras.find(c => c.id === id);
      if (carteira) {
        toast({
          title: "Carteira principal definida",
          description: `${carteira.nome} agora é sua carteira principal.`,
        });
      }
    } else {
      localStorage.removeItem(STORAGE_KEY_PRIMARY);
    }
  }, [carteiras]);

  return (
    <CarteirasContext.Provider value={{
      carteiras,
      transacoes,
      adicionarCarteira,
      atualizarCarteira,
      carregarTransacoes,
      removerCarteira,
      ordenarCarteiras,
      definirCarteiraPrincipal,
      carteiraPrincipal,
      sortOption,
      sortDirection,
      isLoading,
      isUpdating
    }}>
      {children}
    </CarteirasContext.Provider>
  );
};
