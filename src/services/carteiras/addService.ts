
import { CarteiraBTC } from '../../types/types';
import { detectAddressNetwork } from '../crypto/addressDetector';
import { saveMultiChainWallet, fetchWalletData } from '../crypto/multiChainService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Adds a new multi-chain wallet to the database with automatic data fetching
 */
export const addCarteira = async (nome: string, endereco: string, currency?: string): Promise<CarteiraBTC> => {
  console.log('🚀 Iniciando adição de carteira:', { nome, endereco, currency });
  
  // Detectar automaticamente o tipo de endereço
  const detectedAddress = detectAddressNetwork(endereco);
  
  if (!detectedAddress) {
    const errorMsg = 'Endereço de criptomoeda não reconhecido. Verifique se é um endereço válido.';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  console.log('✅ Endereço detectado:', detectedAddress);

  try {
    // Salvar carteira no banco primeiro para obter o ID
    console.log('💾 Salvando carteira no banco...');
    const novaCarteira = await saveMultiChainWallet(nome, detectedAddress, {
      nativeBalance: 0,
      totalReceived: 0,
      totalSent: 0,
      transactionCount: 0,
      tokens: []
    });
    console.log('✅ Carteira salva:', novaCarteira);

    // Agora fazer a requisição para buscar dados reais via edge function
    console.log('📡 Buscando dados da carteira via API...');
    
    const currencyToUse = currency || detectedAddress.network.symbol.toLowerCase();
    
    const { data: walletData, error: fetchError } = await supabase.functions.invoke('fetch-wallet-data', {
      body: {
        address: endereco,
        wallet_id: novaCarteira.id,
        currency: currencyToUse
      }
    });

    if (fetchError) {
      console.warn('⚠️ Erro ao buscar dados via API, usando dados padrão:', fetchError);
    } else if (walletData) {
      console.log('📊 Dados da API recebidos:', walletData);
      
      // Atualizar a carteira com os dados reais
      const { error: updateError } = await supabase
        .from('crypto_wallets')
        .update({
          balance: walletData.balance || 0,
          total_received: walletData.total_received || 0,
          total_sent: walletData.total_sent || 0,
          transaction_count: walletData.transaction_count || 0,
          last_updated: new Date().toISOString()
        })
        .eq('id', novaCarteira.id);

      if (updateError) {
        console.warn('⚠️ Erro ao atualizar dados da carteira:', updateError);
      } else {
        // Atualizar objeto local com dados reais
        novaCarteira.balance = walletData.balance || 0;
        novaCarteira.total_received = walletData.total_received || 0;
        novaCarteira.total_sent = walletData.total_sent || 0;
        novaCarteira.transaction_count = walletData.transaction_count || 0;
        novaCarteira.last_updated = new Date().toISOString();
      }
    }
    
    // Retornar a nova carteira formatada para compatibilidade
    const carteiraFormatada: CarteiraBTC = {
      id: novaCarteira.id,
      nome: novaCarteira.name,
      endereco: novaCarteira.address,
      saldo: Number(novaCarteira.balance),
      ultimo_update: novaCarteira.last_updated,
      total_entradas: Number(novaCarteira.total_received || 0),
      total_saidas: Number(novaCarteira.total_sent || 0),
      qtde_transacoes: novaCarteira.transaction_count,
      // Campos extras para multi-chain
      network: novaCarteira.blockchain_networks,
      addressType: novaCarteira.address_type,
      nativeTokenBalance: Number(novaCarteira.native_token_balance || 0),
      tokensData: novaCarteira.tokens_data || []
    };
    
    console.log('🎉 Carteira formatada e pronta:', carteiraFormatada);
    return carteiraFormatada;
    
  } catch (error) {
    console.error('❌ Erro ao adicionar carteira:', error);
    
    if (error instanceof Error) {
      // Tratar erros específicos
      if (error.message.includes('constraint')) {
        throw new Error('Este endereço já foi adicionado ou não é válido para nossa plataforma.');
      }
      if (error.message.includes('network')) {
        throw new Error('Erro de conectividade. Verifique sua conexão e tente novamente.');
      }
      throw error;
    } else {
      const errorMessage = typeof error === 'object' && error !== null 
        ? JSON.stringify(error)
        : 'Erro desconhecido ao adicionar carteira';
      throw new Error(errorMessage);
    }
  }
};
