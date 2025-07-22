import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SwapQuote {
  rate: number;
  fromAmount: string;
  toAmount: string;
  estimatedFee: string;
  platformFee: {
    amount: number;
    currency: string;
    type: 'fixed' | 'percentage';
  };
  totalFromAmount: string;
  fromCurrency: string;
  toCurrency: string;
  validUntil: string;
}

export interface SwapTransaction {
  id: string;
  user_id: string;
  from_currency: string;
  to_currency: string;
  from_amount: number;
  to_amount: number;
  from_address: string;
  to_address: string;
  transaction_hash?: string;
  status: string;
  swap_rate: number;
  network_fee: string;
  platform_fee_amount: number;
  platform_fee_type: string;
  platform_fee_currency: string;
  created_at: string;
  completed_at?: string;
}

export interface SwapFormData {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  fromAddress: string;
  toAddress: string;
  feeType: string;
}

export const useSwapManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [swapHistory, setSwapHistory] = useState<SwapTransaction[]>([]);
  const [currentQuote, setCurrentQuote] = useState<SwapQuote | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Get swap quote with platform fees
  const getSwapQuote = useCallback(async (
    fromCurrency: string,
    toCurrency: string,
    amount: string,
    fromAddress: string,
    toAddress: string,
    feeType: 'fixed' | 'percentage' = 'percentage'
  ): Promise<SwapQuote | null> => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Digite um valor válido');
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('tatum-token-swap', {
        body: {
          action: 'quote',
          fromCurrency,
          toCurrency,
          amount,
          fromAddress,
          toAddress,
          feeType
        }
      });

      if (error) {
        console.error('Swap quote error:', error);
        throw new Error(error.message || 'Erro ao obter cotação');
      }

      if (!data.success) {
        throw new Error(data.error || 'Erro ao obter cotação');
      }

      const quote = data.data as SwapQuote;
      setCurrentQuote(quote);
      
      toast.success('Cotação obtida com sucesso!');
      return quote;
    } catch (error: any) {
      console.error('Quote error:', error);
      toast.error(error.message || 'Erro ao obter cotação');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Execute swap with platform fees
  const executeSwap = useCallback(async (formData: SwapFormData): Promise<boolean> => {
    if (!currentQuote) {
      toast.error('Obtenha uma cotação primeiro');
      return false;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('tatum-token-swap', {
        body: {
          action: 'execute',
          fromCurrency: formData.fromCurrency,
          toCurrency: formData.toCurrency,
          amount: formData.fromAmount,
          fromAddress: formData.fromAddress,
          toAddress: formData.toAddress,
          feeType: formData.feeType,
          // Note: In production, private keys should be handled securely via KMS
          privateKey: 'secure_private_key_placeholder'
        }
      });

      if (error) {
        console.error('Swap execution error:', error);
        throw new Error(error.message || 'Erro ao executar swap');
      }

      if (!data.success) {
        throw new Error(data.error || 'Erro ao executar swap');
      }

      const swapData = data.data;
      
      toast.success(
        `🚀 Swap executado com sucesso!`,
        {
          description: `Hash: ${swapData.transactionHash.slice(0, 10)}...`
        }
      );

      // Clear current quote and refresh history
      setCurrentQuote(null);
      await loadSwapHistory();
      
      return true;
    } catch (error: any) {
      console.error('Execute swap error:', error);
      toast.error(error.message || 'Erro ao executar swap');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentQuote]);

  // Load user's swap history
  const loadSwapHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('swap_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading swap history:', error);
        toast.error('Erro ao carregar histórico');
        return;
      }

      setSwapHistory(data || []);
    } catch (error: any) {
      console.error('Load history error:', error);
      toast.error('Erro ao carregar histórico');
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Get platform fee settings
  const getPlatformFeeSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_value')
        .eq('setting_key', 'swap_fees')
        .single();

      if (error) {
        console.error('Error fetching fee settings:', error);
        return null;
      }

      return data?.setting_value;
    } catch (error: any) {
      console.error('Get fee settings error:', error);
      return null;
    }
  }, []);

  // Calculate platform fee display
  const calculateDisplayFee = useCallback((
    amount: number,
    currency: string,
    feeType: 'fixed' | 'percentage',
    feeSettings: any
  ) => {
    if (!feeSettings) return { amount: 0, display: '0' };

    if (feeType === 'fixed') {
      const fixedFees = feeSettings.fixed;
      const feeAmount = parseFloat(fixedFees[currency] || '0.001');
      return {
        amount: feeAmount,
        display: `${feeAmount} ${currency}`
      };
    } else {
      const percentageRate = parseFloat(feeSettings.percentage.rate);
      const feeAmount = amount * (percentageRate / 100);
      return {
        amount: feeAmount,
        display: `${percentageRate}% (${feeAmount.toFixed(8)} ${currency})`
      };
    }
  }, []);

  // Check swap status
  const checkSwapStatus = useCallback(async (transactionHash: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('tatum-token-swap', {
        body: {
          action: 'status',
          transactionHash
        }
      });

      if (error) {
        console.error('Status check error:', error);
        return null;
      }

      return data.success ? data.data : null;
    } catch (error: any) {
      console.error('Check status error:', error);
      return null;
    }
  }, []);

  // Load swap history on mount
  useEffect(() => {
    loadSwapHistory();
  }, [loadSwapHistory]);

  return {
    // State
    isLoading,
    isLoadingHistory,
    swapHistory,
    currentQuote,
    
    // Actions
    getSwapQuote,
    executeSwap,
    loadSwapHistory,
    getPlatformFeeSettings,
    calculateDisplayFee,
    checkSwapStatus,
    
    // Helpers
    clearQuote: () => setCurrentQuote(null)
  };
};