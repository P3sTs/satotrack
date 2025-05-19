
export interface CarteiraContextType {
  carteiras: CarteiraBTC[];
  carteiraPrincipal: string | null;
  isLoading: boolean;
  isUpdating: { [walletId: string]: boolean };
  sortOption: string;
  sortDirection: 'asc' | 'desc';
  adicionarCarteira: (nome: string, endereco: string) => Promise<void>;
  removerCarteira: (id: string) => Promise<void>;
  atualizarNomeCarteira: (id: string, novoNome: string) => Promise<void>;
  atualizarCarteira: (id: string) => Promise<void>;
  definirCarteiraPrincipal: (id: string | null) => void;
  ordenarCarteiras: (option: string, direcao: 'asc' | 'desc') => void;
  transacoes: Record<string, TransacaoBTC[]>;
  carregarTransacoes: (id: string) => Promise<TransacaoBTC[]>;
}

// Export the CarteiraBTC interface
export interface CarteiraBTC {
  id: string;
  nome: string;
  endereco: string;
  saldo: number;
  total_recebido?: number;
  total_enviado?: number;
  transacoes?: number;
  data_criacao?: string;
  ultima_atualizacao?: string;
  preco_medio_compra?: number;
  isPrimary?: boolean;
  
  // Add properties to match the CarteiraBTC in types/types.ts
  total_entradas: number;
  total_saidas: number;
  qtde_transacoes: number;
  ultimo_update: Date | string;
}

export interface TransacaoBTC {
  hash: string; // Transaction hash
  txid: string; // Same as hash, needed for compatibility
  valor: number; // Value in BTC
  tipo: 'entrada' | 'saida'; // Type: received or sent
  data: Date | string; // Date of the transaction
  endereco: string; // Address involved in the transaction
}

export interface CarteiraProviderProps {
  children: React.ReactNode;
}

// Adding the missing constant
export const STORAGE_KEY_PRIMARY = 'satotrack_carteira_principal';
