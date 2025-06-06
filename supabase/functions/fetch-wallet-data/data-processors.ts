
import { 
  BlockchainInfoResponse, 
  BlockCypherResponse, 
  BlockstreamResponse, 
  ProcessedWalletData,
  ProcessedTransaction 
} from './types.ts';

export function processBlockchainInfoData(data: BlockchainInfoResponse, targetAddress: string): ProcessedWalletData {
  console.log(`Processing blockchain.info data for address: ${targetAddress}`);
  
  const transactions = data.txs.map((tx: any) => {
    let totalValueIn = 0;
    let totalValueOut = 0;
    let isIncoming = false;
    let isOutgoing = false;

    // Check inputs (saídas de outras carteiras para esta)
    if (tx.inputs) {
      tx.inputs.forEach((input: any) => {
        if (input.prev_out && input.prev_out.addr === targetAddress) {
          totalValueOut += input.prev_out.value / 100000000; // Convert satoshis to BTC
          isOutgoing = true;
        }
      });
    }

    // Check outputs (entradas para esta carteira)
    if (tx.out) {
      tx.out.forEach((output: any) => {
        if (output.addr === targetAddress) {
          totalValueIn += output.value / 100000000; // Convert satoshis to BTC
          isIncoming = true;
        }
      });
    }

    // Determine transaction type and amount
    let transactionType: string;
    let amount: number;
    
    if (isIncoming && isOutgoing) {
      // Self-transaction or change
      amount = totalValueIn - totalValueOut;
      transactionType = amount > 0 ? 'entrada' : 'saida';
    } else if (isIncoming) {
      amount = totalValueIn;
      transactionType = 'entrada';
    } else if (isOutgoing) {
      amount = totalValueOut;
      transactionType = 'saida';
    } else {
      // Not related to this address
      return null;
    }

    return {
      hash: tx.hash,
      amount: Math.abs(amount),
      transaction_type: transactionType,
      transaction_date: new Date(tx.time * 1000).toISOString(),
      fee: tx.fee ? tx.fee / 100000000 : 0,
      confirmations: tx.confirmations || 0,
      block_height: tx.block_height || null,
      size: tx.size || 0
    };
  }).filter((tx: any) => tx !== null);

  console.log(`Processed ${transactions.length} transactions from blockchain.info`);

  return {
    balance: data.final_balance / 100000000,
    total_received: data.total_received / 100000000,
    total_sent: data.total_sent / 100000000,
    transaction_count: data.n_tx,
    unconfirmed_balance: (data.final_balance - (data.final_balance - (data.unconfirmed_balance || 0))) / 100000000,
    transactions
  };
}

export function processBlockCypherData(data: BlockCypherResponse, targetAddress: string): ProcessedWalletData {
  console.log(`Processing BlockCypher data for address: ${targetAddress}`);
  
  const transactions = (data.txrefs || []).map((tx: any): ProcessedTransaction => {
    return {
      hash: tx.tx_hash,
      amount: Math.abs(tx.value) / 100000000,
      transaction_type: tx.tx_output_n >= 0 ? 'entrada' : 'saida',
      transaction_date: new Date(tx.confirmed).toISOString(),
      confirmations: tx.confirmations || 0,
      block_height: tx.block_height || null,
      double_spend: tx.double_spend || false
    };
  });

  console.log(`Processed ${transactions.length} transactions from BlockCypher`);

  return {
    balance: data.balance / 100000000,
    total_received: data.total_received / 100000000,
    total_sent: data.total_sent / 100000000,
    transaction_count: data.n_tx,
    unconfirmed_balance: data.unconfirmed_balance / 100000000,
    transactions
  };
}

export function processBlockstreamData(result: BlockstreamResponse, targetAddress: string): ProcessedWalletData {
  console.log(`Processing Blockstream data for address: ${targetAddress}`);
  
  const { addressData, txsData } = result;
  
  const transactions = txsData.map((tx: any) => {
    let totalValueIn = 0;
    let totalValueOut = 0;
    let isIncoming = false;
    let isOutgoing = false;

    // Check inputs
    if (tx.vin) {
      tx.vin.forEach((input: any) => {
        if (input.prevout && input.prevout.scriptpubkey_address === targetAddress) {
          totalValueOut += input.prevout.value / 100000000;
          isOutgoing = true;
        }
      });
    }

    // Check outputs
    if (tx.vout) {
      tx.vout.forEach((output: any) => {
        if (output.scriptpubkey_address === targetAddress) {
          totalValueIn += output.value / 100000000;
          isIncoming = true;
        }
      });
    }

    let transactionType: string;
    let amount: number;
    
    if (isIncoming && isOutgoing) {
      amount = totalValueIn - totalValueOut;
      transactionType = amount > 0 ? 'entrada' : 'saida';
    } else if (isIncoming) {
      amount = totalValueIn;
      transactionType = 'entrada';
    } else if (isOutgoing) {
      amount = totalValueOut;
      transactionType = 'saida';
    } else {
      return null;
    }

    return {
      hash: tx.txid,
      amount: Math.abs(amount),
      transaction_type: transactionType,
      transaction_date: new Date(tx.status.block_time * 1000).toISOString(),
      confirmations: tx.status.confirmed ? 1 : 0,
      block_height: tx.status.block_height || null,
      fee: tx.fee ? tx.fee / 100000000 : 0,
      size: tx.size || 0,
      weight: tx.weight || 0
    };
  }).filter((tx: any) => tx !== null);

  console.log(`Processed ${transactions.length} transactions from Blockstream`);

  return {
    balance: (addressData.chain_stats.funded_txo_sum - addressData.chain_stats.spent_txo_sum) / 100000000,
    total_received: addressData.chain_stats.funded_txo_sum / 100000000,
    total_sent: addressData.chain_stats.spent_txo_sum / 100000000,
    transaction_count: addressData.chain_stats.tx_count,
    unconfirmed_balance: (addressData.mempool_stats.funded_txo_sum - addressData.mempool_stats.spent_txo_sum) / 100000000,
    transactions
  };
}
