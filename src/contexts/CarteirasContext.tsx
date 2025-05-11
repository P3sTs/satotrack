
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CarteiraBTC, TransacaoBTC, SortOption, SortDirection } from '../types/types';
import { mockFetchCarteiraDados, mockFetchTransacoes } from '../services/api';
import { toast } from '@/components/ui/sonner';

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

const carteirasIniciais: CarteiraBTC[] = [
  {
    id: '1',
    nome: 'Carteira Principal',
    endereco: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    saldo: 12.5634,
    ultimo_update: new Date().toISOString(),
    total_entradas: 15.2,
    total_saidas: 2.6366,
    qtde_transacoes: 47
  },
  {
    id: '2',
    nome: 'Investimentos',
    endereco: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    saldo: 5.1245,
    ultimo_update: new Date(Date.now() - 86400000).toISOString(),
    total_entradas: 8.5,
    total_saidas: 3.3755,
    qtde_transacoes: 23
  }
];

export const CarteirasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [carteiras, setCarteiras] = useState<CarteiraBTC[]>(carteirasIniciais);
  const [transacoes, setTransacoes] = useState<Record<string, TransacaoBTC[]>>({});
  const [sortOption, setSortOption] = useState<SortOption>('saldo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const validarEnderecoBitcoin = (endereco: string): boolean => {
    // Implementação simplificada para validar endereço Bitcoin
    // Em produção, deve-se usar uma biblioteca especializada
    return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(endereco);
  };

  const adicionarCarteira = useCallback(async (nome: string, endereco: string): Promise<void> => {
    if (!validarEnderecoBitcoin(endereco)) {
      throw new Error('Endereço Bitcoin inválido');
    }

    // Verificar se o endereço já existe
    if (carteiras.some(c => c.endereco === endereco)) {
      throw new Error('Este endereço já está sendo monitorado');
    }

    setIsLoading(true);
    try {
      const dados = await mockFetchCarteiraDados(endereco);
      const novaCarteira: CarteiraBTC = {
        id: Date.now().toString(),
        nome,
        endereco,
        saldo: dados.saldo,
        ultimo_update: new Date().toISOString(),
        total_entradas: dados.total_entradas,
        total_saidas: dados.total_saidas,
        qtde_transacoes: dados.qtde_transacoes
      };
      
      setCarteiras(prevCarteiras => [...prevCarteiras, novaCarteira]);
      toast.success(`Carteira "${nome}" adicionada com sucesso!`);
      
      // Carregar transações iniciais
      const txs = await mockFetchTransacoes(endereco);
      setTransacoes(prev => ({...prev, [novaCarteira.id]: txs}));
      
    } catch (error) {
      toast.error('Erro ao adicionar carteira: ' + (error instanceof Error ? error.message : String(error)));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [carteiras]);

  const atualizarCarteira = useCallback(async (id: string): Promise<void> => {
    const carteira = carteiras.find(c => c.id === id);
    if (!carteira) return;

    setIsUpdating(prev => ({ ...prev, [id]: true }));
    try {
      const dados = await mockFetchCarteiraDados(carteira.endereco);
      const txs = await mockFetchTransacoes(carteira.endereco);
      
      setCarteiras(prevCarteiras => 
        prevCarteiras.map(c => c.id === id ? {
          ...c,
          saldo: dados.saldo,
          ultimo_update: new Date().toISOString(),
          total_entradas: dados.total_entradas,
          total_saidas: dados.total_saidas,
          qtde_transacoes: dados.qtde_transacoes
        } : c)
      );
      
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
      const txs = await mockFetchTransacoes(carteira.endereco);
      setTransacoes(prev => ({...prev, [id]: txs}));
      return txs;
    } catch (error) {
      toast.error('Erro ao carregar transações: ' + (error instanceof Error ? error.message : String(error)));
      return [];
    }
  }, [carteiras, transacoes]);

  const removerCarteira = useCallback((id: string): void => {
    setCarteiras(prevCarteiras => prevCarteiras.filter(c => c.id !== id));
    setTransacoes(prev => {
      const newTransacoes = {...prev};
      delete newTransacoes[id];
      return newTransacoes;
    });
    toast.info('Carteira removida do monitoramento');
  }, []);

  const ordenarCarteiras = useCallback((opcao: SortOption, direcao: SortDirection): void => {
    setSortOption(opcao);
    setSortDirection(direcao);
    
    setCarteiras(prevCarteiras => [...prevCarteiras].sort((a, b) => {
      let comparacao: number;
      
      if (opcao === 'saldo') {
        comparacao = a.saldo - b.saldo;
      } else {
        comparacao = new Date(a.ultimo_update).getTime() - new Date(b.ultimo_update).getTime();
      }
      
      return direcao === 'asc' ? comparacao : -comparacao;
    }));
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
