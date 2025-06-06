
export interface BlockchainInfoResponse {
  final_balance: number;
  total_received: number;
  total_sent: number;
  n_tx: number;
  unconfirmed_balance?: number;
  txs: any[];
}

export interface BlockCypherResponse {
  balance: number;
  total_received: number;
  total_sent: number;
  n_tx: number;
  unconfirmed_balance: number;
  txrefs?: any[];
}

export interface BlockstreamResponse {
  addressData: {
    chain_stats: {
      funded_txo_sum: number;
      spent_txo_sum: number;
      tx_count: number;
    };
    mempool_stats: {
      funded_txo_sum: number;
      spent_txo_sum: number;
    };
  };
  txsData: any[];
}

export interface ProcessedWalletData {
  balance: number;
  total_received: number;
  total_sent: number;
  transaction_count: number;
  unconfirmed_balance: number;
  transactions: ProcessedTransaction[];
}

export interface ProcessedTransaction {
  hash: string;
  amount: number;
  transaction_type: string;
  transaction_date: string;
  fee?: number;
  confirmations?: number;
  block_height?: number | null;
  size?: number;
  weight?: number;
  double_spend?: boolean;
}
