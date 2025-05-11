
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { CarteiraBTC, TransacaoBTC, SortOption, SortDirection } from '../types/types';
import { fetchCarteiraDados, fetchTransacoes, validarEnderecoBitcoin } from '../services/api';
import { toast } from '@/components/ui/sonner';
import { supabase } from '../integrations/supabase/client';

interface CarteirasContextType {
  carteiras: CarteiraBTC[];
  transacoes: Record<string, TransacaoBTC[]>;
  adicionarCarteira: (nome: string, endereco: string) => Promise<void>;
  atualizarCarteira: (id: string) => Promise<void>;
  carregarTransacoes: (id: string) => Promise<TransacaoBTC[]>;
  removerCarteira: (id: string) => void;
  ordenarCarteiras: (opcao: SortOption, direcao: SortDirection) => void;
  sortOption: SortOption;
  sortDirection: SortDirection;
  isLoading: boolean;
  isUpdating: Record<string, boolean>;
}

const CarteirasContext = createContext<CarteirasContextType | undefined>(undefined);

export const useCarteiras = () => {
  const context = useContext(CarteirasContext);
  if (!context) {
    throw new Error('useCarteiras deve ser usado dentro de CarteirasProvider');
  }
  return context;
};

export const CarteirasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [carteiras, setCarteiras] = useState<CarteiraBTC[]>([]);
  const [transacoes, setTransacoes] = useState<Record<string, TransacaoBTC[]>>({});
  const [sortOption, setSortOption] = useState<SortOption>('saldo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  
  // Carregar todas as carteiras do usuário
  useEffect(() => {
    async function carregarCarteiras() {
      try {
        const { data, error } = await supabase
          .from('bitcoin_wallets')
          .select('*')
          .order(sortOption === 'saldo' ? 'balance' : 'last_updated', { ascending: sortDirection === 'asc' });
          
        if (error) {
          throw error;
        }
        
        // Mapear do formato do banco para o formato da aplicação
        const carteirasFormatadas = data.map(c => ({
          id: c.id,
          nome: c.name,
          endereco: c.address,
          saldo: Number(c.balance),
          ultimo_update: c.last_updated,
          total_entradas: Number(c.total_received),
          total_saidas: Number(c.total_sent),
          qtde_transacoes: c.transaction_count
        }));
        
        setCarteiras(carteirasFormatadas);
      } catch (error) {
        console.error('Erro ao carregar carteiras:', error);
        toast.error('Erro ao carregar suas carteiras');
      } finally {
        setIsLoading(false);
      }
    }

    carregarCarteiras();
  }, [sortOption, sortDirection]);

  const adicionarCarteira = useCallback(async (nome: string, endereco: string): Promise<void> => {
    if (!validarEnderecoBitcoin(endereco)) {
      throw new Error('Endereço Bitcoin inválido');
    }

    // Verificar se o endereço já existe
    const { data: existingWallet } = await supabase
      .from('bitcoin_wallets')
      .select('id')
      .eq('address', endereco)
      .maybeSingle();

    if (existingWallet) {
      throw new Error('Este endereço já está sendo monitorado');
    }

    setIsLoading(true);
    try {
      // Buscar dados atualizados da carteira
      const dados = await fetchCarteiraDados(endereco);
      
      // Inserir nova carteira no banco
      const { data, error } = await supabase
        .from('bitcoin_wallets')
        .insert({
          name: nome,
          address: endereco,
          balance: dados.saldo,
          total_received: dados.total_entradas,
          total_sent: dados.total_saidas,
          transaction_count: dados.qtde_transacoes,
          last_updated: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Adicionar a nova carteira ao estado
      const novaCarteira: CarteiraBTC = {
        id: data.id,
        nome: data.name,
        endereco: data.address,
        saldo: Number(data.balance),
        ultimo_update: data.last_updated,
        total_entradas: Number(data.total_received),
        total_saidas: Number(data.total_sent),
        qtde_transacoes: data.transaction_count
      };
      
      setCarteiras(prevCarteiras => [...prevCarteiras, novaCarteira]);
      toast.success(`Carteira "${nome}" adicionada com sucesso!`);
      
      // Carregar transações iniciais
      const txs = await fetchTransacoes(data.id);
      setTransacoes(prev => ({...prev, [data.id]: txs}));
      
    } catch (error) {
      toast.error('Erro ao adicionar carteira: ' + (error instanceof Error ? error.message : String(error)));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const atualizarCarteira = useCallback(async (id: string): Promise<void> => {
    const carteira = carteiras.find(c => c.id === id);
    if (!carteira) return;

    setIsUpdating(prev => ({ ...prev, [id]: true }));
    try {
      // Chamar edge function para atualizar dados na blockchain
      const dados = await fetchCarteiraDados(carteira.endereco, id);
      
      // Atualizar carteira localmente
      setCarteiras(prevCarteiras => 
        prevCarteiras.map(c => c.id === id ? {
          ...c,
          saldo: dados.saldo!,
          ultimo_update: new Date().toISOString(),
          total_entradas: dados.total_entradas!,
          total_saidas: dados.total_saidas!,
          qtde_transacoes: dados.qtde_transacoes!
        } : c)
      );
      
      // Buscar transações atualizadas
      const txs = await fetchTransacoes(id);
      setTransacoes(prev => ({...prev, [id]: txs}));
      
      toast.success(`Dados da carteira "${carteira.nome}" atualizados!`);
    } catch (error) {
      toast.error('Erro ao atualizar carteira: ' + (error instanceof Error ? error.message : String(error)));
      throw error;
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

    try {
      const txs = await fetchTransacoes(id);
      setTransacoes(prev => ({...prev, [id]: txs}));
      return txs;
    } catch (error) {
      toast.error('Erro ao carregar transações: ' + (error instanceof Error ? error.message : String(error)));
      return [];
    }
  }, [carteiras, transacoes]);

  const removerCarteira = useCallback(async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('bitcoin_wallets')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setCarteiras(prevCarteiras => prevCarteiras.filter(c => c.id !== id));
      setTransacoes(prev => {
        const newTransacoes = {...prev};
        delete newTransacoes[id];
        return newTransacoes;
      });
      toast.info('Carteira removida do monitoramento');
    } catch (error) {
      toast.error('Erro ao remover carteira: ' + (error instanceof Error ? error.message : String(error)));
    }
  }, []);

  const ordenarCarteiras = useCallback((opcao: SortOption, direcao: SortDirection): void => {
    setSortOption(opcao);
    setSortDirection(direcao);
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
      sortOption,
      sortDirection,
      isLoading,
      isUpdating
    }}>
      {children}
    </CarteirasContext.Provider>
  );
};
