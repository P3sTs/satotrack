export interface CarteiraContextType {
  carteiras: CarteiraBTC[];
  carteiraPrincipal: string | null;
  isLoading: boolean;
  isUpdating: { [walletId: string]: boolean };
  sortOption: string;
  sortDirection: 'asc' | 'desc';
  adicionarCarteira: (carteira: Omit<CarteiraBTC, 'id'>) => Promise<void>;
  removerCarteira: (id: string) => Promise<void>;
  atualizarNomeCarteira: (id: string, novoNome: string) => Promise<void>;
  atualizarCarteira: (id: string) => Promise<void>;
  definirCarteiraPrincipal: (id: string | null) => void;
  ordenarCarteiras: (option: string) => void;
}

// Export the CarteiraBTC interface
export interface CarteiraBTC {
  id: string;
  nome: string;
  endereco: string;
  saldo: number;
  total_entradas: number;
  total_saidas: number;
  qtde_transacoes: number;
  ultimo_update: Date | string;
}

export interface CarteiraProviderProps {
  children: React.ReactNode;
}
