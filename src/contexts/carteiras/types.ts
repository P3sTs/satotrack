
import { CarteiraBTC, TransacaoBTC, SortOption, SortDirection } from '../../types/types';

export interface CarteirasContextType {
  carteiras: CarteiraBTC[];
  transacoes: Record<string, TransacaoBTC[]>;
  adicionarCarteira: (nome: string, endereco: string) => Promise<void>;
  atualizarCarteira: (id: string) => Promise<void>;
  carregarTransacoes: (id: string) => Promise<TransacaoBTC[]>;
  removerCarteira: (id: string) => void;
  ordenarCarteiras: (opcao: SortOption, direcao: SortDirection) => void;
  definirCarteiraPrincipal: (id: string | null) => void;
  carteiraPrincipal: string | null;
  sortOption: SortOption;
  sortDirection: SortDirection;
  isLoading: boolean;
  isUpdating: Record<string, boolean>;
}

export const STORAGE_KEY_PRIMARY = 'satotrack_carteira_principal';
