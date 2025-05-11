
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

export interface DatabaseCarteiraBTC {
  id: string;
  name: string;
  address: string;
  balance: number;
  last_updated: string;
  total_received: number;
  total_sent: number;
  transaction_count: number;
  created_at: string;
  user_id: string;
}

export interface DatabaseTransacaoBTC {
  id: string;
  wallet_id: string;
  hash: string;
  amount: number;
  transaction_type: 'entrada' | 'saida';
  transaction_date: string;
  created_at: string;
}
