
import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { CarteiraBTC, TransacaoBTC, SortOption, SortDirection } from '../types/types';
import { CarteirasContextType, STORAGE_KEY_PRIMARY } from './types/CarteirasTypes';
import { 
  loadCarteiras, 
  addCarteira, 
  updateCarteira, 
  loadTransacoes, 
  removeCarteira,
  updateWalletName 
} from '../services/carteiras';

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
  useEffect(() => {
    async function carregarCarteiras() {
      setIsLoading(true);
      try {
        const data = await loadCarteiras(sortOption, sortDirection);
        setCarteiras(data);
      } finally {
        setIsLoading(false);
      }
    }

    carregarCarteiras();
  }, [sortOption, sortDirection]);

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
    } catch (error) {
      console.error('Error removing wallet:', error);
    }
  }, [carteiraPrincipal]);

  const updateWalletName = useCallback(async (id: string, nome: string): Promise<void> => {
    try {
      await updateWalletName(id, nome);
      
      // Atualizar carteira localmente
      setCarteiras(prevCarteiras => 
        prevCarteiras.map(c => c.id === id ? { ...c, nome } : c)
      );
    } catch (error) {
      console.error('Error updating wallet name:', error);
      throw error;
    }
  }, []);

  const ordenarCarteiras = useCallback((opcao: SortOption, direcao: SortDirection): void => {
    setSortOption(opcao);
    setSortDirection(direcao);
  }, []);
  
  const definirCarteiraPrincipal = useCallback((id: string | null): void => {
    setCarteiraPrincipal(id);
    
    if (id) {
      localStorage.setItem(STORAGE_KEY_PRIMARY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_PRIMARY);
    }
  }, []);

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
      updateWalletName,
      sortOption,
      sortDirection,
      isLoading,
      isUpdating
    }}>
      {children}
    </CarteirasContext.Provider>
  );
};
