
import { supabase } from '../../integrations/supabase/client';
import { DetectedAddress } from './addressDetector';
import { toast } from '@/components/ui/sonner';

export interface WalletData {
  nativeBalance: number;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  tokens?: any[];
}

export interface MultiChainWallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  total_received: number;
  total_sent: number;
  transaction_count: number;
  last_updated: string;
  blockchain_networks?: any;
  address_type?: string;
  native_token_balance?: number;
  tokens_data?: any[];
}

export const fetchWalletData = async (detectedAddress: DetectedAddress): Promise<WalletData> => {
  console.log('🔍 Buscando dados da carteira para:', detectedAddress);
  
  try {
    // Chamar a função Edge do Supabase para buscar dados
    const { data, error } = await supabase.functions.invoke('fetch-wallet-data', {
      body: {
        address: detectedAddress.address,
        network: detectedAddress.network.id,
        addressType: detectedAddress.addressType
      }
    });

    if (error) {
      console.error('❌ Erro na função fetch-wallet-data:', error);
      throw new Error(`Erro ao buscar dados da carteira: ${error.message}`);
    }

    if (!data) {
      console.log('⚠️ Nenhum dado retornado, usando valores padrão');
      return {
        nativeBalance: 0,
        totalReceived: 0,
        totalSent: 0,
        transactionCount: 0,
        tokens: []
      };
    }

    console.log('✅ Dados da carteira recebidos:', data);
    
    return {
      nativeBalance: Number(data.balance) || 0,
      totalReceived: Number(data.total_received) || 0,
      totalSent: Number(data.total_sent) || 0,
      transactionCount: Number(data.transaction_count) || 0,
      tokens: data.tokens || []
    };
  } catch (error) {
    console.error('❌ Erro ao buscar dados da carteira:', error);
    
    // Retornar dados padrão em caso de erro
    return {
      nativeBalance: 0,
      totalReceived: 0,
      totalSent: 0,
      transactionCount: 0,
      tokens: []
    };
  }
};

export const saveMultiChainWallet = async (
  name: string, 
  detectedAddress: DetectedAddress, 
  walletData: WalletData
): Promise<MultiChainWallet> => {
  console.log('💾 Salvando carteira multi-chain:', { name, detectedAddress, walletData });
  
  try {
    // Primeiro, buscar ou criar a rede blockchain
    let { data: network, error: networkError } = await supabase
      .from('blockchain_networks')
      .select('id')
      .eq('name', detectedAddress.network.name)
      .single();

    if (networkError || !network) {
      console.log('🔧 Criando nova rede blockchain:', detectedAddress.network.name);
      
      const { data: newNetwork, error: createNetworkError } = await supabase
        .from('blockchain_networks')
        .insert({
          name: detectedAddress.network.name,
          symbol: detectedAddress.network.symbol,
          chain_id: detectedAddress.network.chainId,
          explorer_url: detectedAddress.network.explorerUrl,
          is_active: true
        })
        .select('id')
        .single();

      if (createNetworkError) {
        console.error('❌ Erro ao criar rede:', createNetworkError);
        throw new Error('Erro ao criar rede blockchain');
      }
      
      network = newNetwork;
    }

    // Salvar a carteira
    const { data: wallet, error: walletError } = await supabase
      .from('crypto_wallets')
      .insert({
        name,
        address: detectedAddress.address,
        network_id: network.id,
        address_type: detectedAddress.addressType,
        balance: walletData.nativeBalance,
        total_received: walletData.totalReceived,
        total_sent: walletData.totalSent,
        transaction_count: walletData.transactionCount,
        native_token_balance: walletData.nativeBalance,
        tokens_data: walletData.tokens || [],
        last_updated: new Date().toISOString()
      })
      .select(`
        *,
        blockchain_networks (
          name,
          symbol,
          chain_id,
          explorer_url
        )
      `)
      .single();

    if (walletError) {
      console.error('❌ Erro ao salvar carteira:', walletError);
      throw new Error(`Erro ao salvar carteira: ${walletError.message}`);
    }

    console.log('✅ Carteira salva com sucesso:', wallet);
    return wallet;
  } catch (error) {
    console.error('❌ Erro completo ao salvar carteira:', error);
    throw error;
  }
};

export const updateMultiChainWallet = async (walletId: string): Promise<MultiChainWallet> => {
  console.log('🔄 Atualizando carteira:', walletId);
  
  try {
    // Buscar a carteira atual
    const { data: wallet, error: fetchError } = await supabase
      .from('crypto_wallets')
      .select(`
        *,
        blockchain_networks (
          name,
          symbol,
          chain_id,
          explorer_url
        )
      `)
      .eq('id', walletId)
      .single();

    if (fetchError || !wallet) {
      throw new Error('Carteira não encontrada');
    }

    // Recriar o DetectedAddress para buscar dados atualizados
    const detectedAddress: DetectedAddress = {
      address: wallet.address,
      network: {
        id: wallet.blockchain_networks.name.toLowerCase(),
        name: wallet.blockchain_networks.name,
        symbol: wallet.blockchain_networks.symbol,
        chainId: wallet.blockchain_networks.chain_id,
        explorerUrl: wallet.blockchain_networks.explorer_url
      },
      addressType: wallet.address_type || 'unknown',
      isValid: true
    };

    // Buscar dados atualizados
    const walletData = await fetchWalletData(detectedAddress);

    // Atualizar a carteira
    const { data: updatedWallet, error: updateError } = await supabase
      .from('crypto_wallets')
      .update({
        balance: walletData.nativeBalance,
        total_received: walletData.totalReceived,
        total_sent: walletData.totalSent,
        transaction_count: walletData.transactionCount,
        native_token_balance: walletData.nativeBalance,
        tokens_data: walletData.tokens || [],
        last_updated: new Date().toISOString()
      })
      .eq('id', walletId)
      .select(`
        *,
        blockchain_networks (
          name,
          symbol,
          chain_id,
          explorer_url
        )
      `)
      .single();

    if (updateError) {
      throw new Error(`Erro ao atualizar carteira: ${updateError.message}`);
    }

    console.log('✅ Carteira atualizada com sucesso');
    return updatedWallet;
  } catch (error) {
    console.error('❌ Erro ao atualizar carteira:', error);
    throw error;
  }
};
