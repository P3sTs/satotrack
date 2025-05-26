
import { supabase } from '@/integrations/supabase/client';
import { DetectedAddress } from './addressDetector';

export interface WalletBalance {
  nativeBalance: number;
  nativeSymbol: string;
  tokens: TokenBalance[];
  totalUsdValue: number;
  transactionCount: number;
}

export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  usdValue: number;
  [key: string]: any; // Add index signature for Json compatibility
}

export interface NetworkApiConfig {
  name: string;
  symbol: string;
  apiUrl: string;
  apiKey?: string;
}

const NETWORK_APIS: Record<string, NetworkApiConfig> = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    apiUrl: 'https://blockchain.info'
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    apiUrl: 'https://api.etherscan.io/api'
  },
  bsc: {
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    apiUrl: 'https://api.bscscan.com/api'
  },
  polygon: {
    name: 'Polygon',
    symbol: 'MATIC',
    apiUrl: 'https://api.polygonscan.com/api'
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    apiUrl: 'https://api.mainnet-beta.solana.com'
  }
};

export const fetchWalletData = async (detectedAddress: DetectedAddress): Promise<WalletBalance> => {
  const { network, address } = detectedAddress;
  
  // Usar edge function para buscar dados de forma unificada
  const { data, error } = await supabase.functions.invoke('fetch-multichain-data', {
    body: { 
      address,
      network: network.id,
      chainId: network.chainId
    }
  });

  if (error) {
    console.error('Erro ao buscar dados multi-chain:', error);
    throw new Error(`Erro ao buscar dados para ${network.name}: ${error.message}`);
  }

  return {
    nativeBalance: data.nativeBalance || 0,
    nativeSymbol: network.symbol,
    tokens: data.tokens || [],
    totalUsdValue: data.totalUsdValue || 0,
    transactionCount: data.transactionCount || 0
  };
};

// Função para salvar dados da carteira multi-chain no banco
export const saveMultiChainWallet = async (
  name: string, 
  detectedAddress: DetectedAddress,
  walletData: WalletBalance
): Promise<any> => {
  try {
    // Buscar network_id do banco de dados
    const { data: networkData, error: networkError } = await supabase
      .from('blockchain_networks')
      .select('id')
      .eq('symbol', detectedAddress.network.symbol)
      .single();

    if (networkError) {
      throw new Error(`Rede ${detectedAddress.network.name} não suportada`);
    }

    // Convert tokens to JSON-compatible format
    const tokensJson = walletData.tokens.map(token => ({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      balance: token.balance,
      decimals: token.decimals,
      usdValue: token.usdValue
    }));

    // Inserir carteira
    const { data: wallet, error: walletError } = await supabase
      .from('crypto_wallets')
      .insert({
        name,
        address: detectedAddress.address,
        network_id: networkData.id,
        address_type: detectedAddress.addressType,
        balance: walletData.nativeBalance,
        native_token_balance: walletData.nativeBalance,
        total_received: walletData.nativeBalance, // Será atualizado pela API
        total_sent: 0, // Será calculado pela API
        transaction_count: walletData.transactionCount,
        tokens_data: tokensJson,
        last_updated: new Date().toISOString()
      })
      .select()
      .single();

    if (walletError) {
      throw new Error(`Erro ao salvar carteira: ${walletError.message}`);
    }

    // Salvar tokens se existirem
    if (walletData.tokens && walletData.tokens.length > 0) {
      const tokenBalances = walletData.tokens.map(token => ({
        wallet_id: wallet.id,
        token_address: token.address,
        token_symbol: token.symbol,
        token_name: token.name,
        balance: token.balance,
        decimals: token.decimals,
        usd_value: token.usdValue
      }));

      const { error: tokensError } = await supabase
        .from('wallet_token_balances')
        .insert(tokenBalances);

      if (tokensError) {
        console.error('Erro ao salvar tokens:', tokensError);
      }
    }

    return wallet;
  } catch (error) {
    console.error('Erro ao salvar carteira multi-chain:', error);
    throw error;
  }
};

export const updateMultiChainWallet = async (walletId: string): Promise<any> => {
  try {
    // Buscar dados da carteira
    const { data: wallet, error: walletError } = await supabase
      .from('crypto_wallets')
      .select(`
        *,
        blockchain_networks (*)
      `)
      .eq('id', walletId)
      .single();

    if (walletError) {
      throw new Error(`Carteira não encontrada: ${walletError.message}`);
    }

    const detectedAddress: DetectedAddress = {
      address: wallet.address,
      network: {
        id: wallet.blockchain_networks.chain_id,
        name: wallet.blockchain_networks.name,
        symbol: wallet.blockchain_networks.symbol,
        chainId: wallet.blockchain_networks.chain_id,
        explorerUrl: wallet.blockchain_networks.explorer_url
      },
      addressType: wallet.address_type,
      isValid: true
    };

    // Buscar dados atualizados
    const walletData = await fetchWalletData(detectedAddress);

    // Convert tokens to JSON-compatible format
    const tokensJson = walletData.tokens.map(token => ({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      balance: token.balance,
      decimals: token.decimals,
      usdValue: token.usdValue
    }));

    // Atualizar carteira
    const { data: updatedWallet, error: updateError } = await supabase
      .from('crypto_wallets')
      .update({
        balance: walletData.nativeBalance,
        native_token_balance: walletData.nativeBalance,
        transaction_count: walletData.transactionCount,
        tokens_data: tokensJson,
        last_updated: new Date().toISOString()
      })
      .eq('id', walletId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Erro ao atualizar carteira: ${updateError.message}`);
    }

    // Atualizar tokens
    if (walletData.tokens && walletData.tokens.length > 0) {
      // Deletar tokens antigos
      await supabase
        .from('wallet_token_balances')
        .delete()
        .eq('wallet_id', walletId);

      // Inserir tokens atualizados
      const tokenBalances = walletData.tokens.map(token => ({
        wallet_id: walletId,
        token_address: token.address,
        token_symbol: token.symbol,
        token_name: token.name,
        balance: token.balance,
        decimals: token.decimals,
        usd_value: token.usdValue
      }));

      await supabase
        .from('wallet_token_balances')
        .insert(tokenBalances);
    }

    return updatedWallet;
  } catch (error) {
    console.error('Erro ao atualizar carteira multi-chain:', error);
    throw error;
  }
};
