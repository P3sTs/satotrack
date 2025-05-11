
export interface CarteiraBTC {
  id: string;
  nome: string;
  endereco: string;
  saldo: number;
  ultimo_update: string;
  total_entradas: number;
  total_saidas: number;
  qtde_transacoes: number;
}

export interface TransacaoBTC {
  hash: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  data: string;
}

export type SortOption = 'saldo' | 'ultimo_update';
export type SortDirection = 'asc' | 'desc';
