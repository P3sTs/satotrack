
import { SortOption, SortDirection } from '../../types/types';
import { CarteiraBTC, TransacaoBTC } from '../types/CarteirasTypes';

export interface CarteiraContextType {
  carteiras: CarteiraBTC[];
  carteiraPrincipal: string | null;
  isLoading: boolean;
  isUpdating: { [walletId: string]: boolean };
  sortOption: SortOption;
  sortDirection: SortDirection;
  adicionarCarteira: (nome: string, endereco: string) => Promise<void>;
  removerCarteira: (id: string) => Promise<void>;
  atualizarNomeCarteira: (id: string, novoNome: string) => Promise<void>;
  atualizarCarteira: (id: string) => Promise<void>;
  definirCarteiraPrincipal: (id: string | null) => void;
  ordenarCarteiras: (option: SortOption, direcao: SortDirection) => void;
  transacoes: Record<string, TransacaoBTC[]>;
  carregarTransacoes: (id: string) => Promise<TransacaoBTC[]>;
}

export const STORAGE_KEY_PRIMARY = 'satotrack_carteira_principal';

export interface CarteirasProviderProps {
  children: React.ReactNode;
}
