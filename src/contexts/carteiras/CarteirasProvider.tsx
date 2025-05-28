
import React, { useState, useEffect, useCallback } from 'react';
import { SortOption, SortDirection } from '../../types/types';
import { CarteiraBTC, TransacaoBTC } from '../types/CarteirasTypes';
import { CarteirasContext } from './CarteirasContext';
import { STORAGE_KEY_PRIMARY, CarteirasProviderProps } from './types';
import { checkAuthentication, setupAuthListener } from './auth/walletAuthUtils';
import { 
  loadUserWallets, 
  addNewWallet, 
  updateWalletData,
  loadWalletTransactions,
  removeUserWallet,
  updateWalletNameOp
} from './operations/walletOperations';
import { 
  getPrimaryWalletFromStorage, 
  setPrimaryWalletInStorage 
} from './storage/primaryWalletStorage';

export const CarteirasProvider: React.FC<CarteirasProviderProps> = ({ children }) => {
  const [carteiras, setCarteiras] = useState<CarteiraBTC[]>([]);
  const [transacoes, setTransacoes] = useState<Record<string, TransacaoBTC[]>>({});
  const [sortOption, setSortOption] = useState<SortOption>('saldo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [carteiraPrincipal, setCarteiraPrincipal] = useState<string | null>(
    getPrimaryWalletFromStorage()
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Check authentication status only once
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const isAuthd = await checkAuthentication();
        if (isMounted) {
          setIsAuthenticated(isAuthd);
          setAuthChecked(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          setAuthChecked(true);
        }
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const subscription = setupAuthListener((isAuthd) => {
      if (isMounted) {
        setIsAuthenticated(isAuthd);
        if (!authChecked) {
          setAuthChecked(true);
        }
      }
    });
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);
  
  // Carregar todas as carteiras do usuário
  useEffect(() => {
    if (!authChecked) return;
    
    async function carregarCarteiras() {
      setIsLoading(true);
      try {
        const data = await loadUserWallets(sortOption, sortDirection, isAuthenticated);
        setCarteiras(data);
      } finally {
        setIsLoading(false);
      }
    }

    carregarCarteiras();
  }, [sortOption, sortDirection, isAuthenticated, authChecked]);

  const adicionarCarteira = useCallback(async (nome: string, endereco: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }
    
    setIsLoading(true);
    try {
      const novaCarteira = await addNewWallet(nome, endereco, isAuthenticated);
      setCarteiras(prevCarteiras => [...prevCarteiras, novaCarteira]);
      
      // Carregar transações iniciais
      try {
        const txs = await loadWalletTransactions(novaCarteira.id, isAuthenticated);
        setTransacoes(prev => ({...prev, [novaCarteira.id]: txs}));
      } catch (txError) {
        console.error('Error loading transactions:', txError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const atualizarCarteira = useCallback(async (id: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }
    
    const carteira = carteiras.find(c => c.id === id);
    if (!carteira) return;

    setIsUpdating(prev => ({ ...prev, [id]: true }));
    try {
      // Atualizar carteira usando o serviço
      const carteiraAtualizada = await updateWalletData(carteira, isAuthenticated);
      
      // Atualizar carteira localmente
      setCarteiras(prevCarteiras => 
        prevCarteiras.map(c => c.id === id ? carteiraAtualizada : c)
      );
      
      // Buscar transações atualizadas
      const txs = await loadWalletTransactions(id, isAuthenticated);
      setTransacoes(prev => ({...prev, [id]: txs}));
    } finally {
      setIsUpdating(prev => ({ ...prev, [id]: false }));
    }
  }, [carteiras, isAuthenticated]);

  const carregarTransacoes = useCallback(async (id: string): Promise<TransacaoBTC[]> => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }
    
    const carteira = carteiras.find(c => c.id === id);
    if (!carteira) return [];

    if (transacoes[id]) {
      return transacoes[id];
    }

    const txs = await loadWalletTransactions(id, isAuthenticated);
    setTransacoes(prev => ({...prev, [id]: txs}));
    return txs;
  }, [carteiras, transacoes, isAuthenticated]);

  const removerCarteira = useCallback(async (id: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }
    
    try {
      await removeUserWallet(id, isAuthenticated);
      
      // Se a carteira removida era a principal, limpar a configuração
      if (carteiraPrincipal === id) {
        setCarteiraPrincipal(null);
        setPrimaryWalletInStorage(null);
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
  }, [carteiraPrincipal, isAuthenticated]);

  const atualizarNomeCarteira = useCallback(async (id: string, nome: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }
    
    try {
      await updateWalletNameOp(id, nome, isAuthenticated);
      
      // Atualizar carteira localmente
      setCarteiras(prevCarteiras => 
        prevCarteiras.map(c => c.id === id ? { ...c, nome } : c)
      );
    } catch (error) {
      console.error('Error updating wallet name:', error);
      throw error;
    }
  }, [isAuthenticated]);

  const ordenarCarteiras = useCallback((opcao: SortOption, direcao: SortDirection): void => {
    setSortOption(opcao);
    setSortDirection(direcao);
  }, []);
  
  const definirCarteiraPrincipal = useCallback((id: string | null): void => {
    if (!isAuthenticated && id) {
      throw new Error('Usuário não autenticado');
    }
    
    setCarteiraPrincipal(id);
    setPrimaryWalletInStorage(id);
  }, [isAuthenticated]);

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
      atualizarNomeCarteira,
      sortOption,
      sortDirection,
      isLoading,
      isUpdating
    }}>
      {children}
    </CarteirasContext.Provider>
  );
};
