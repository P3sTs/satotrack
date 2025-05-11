
import { supabase } from '../../integrations/supabase/client';
import { CarteiraBTC } from '../../types/types';
import { toast } from '@/components/ui/use-toast';

/**
 * Setup realtime subscription for wallet changes
 */
export const setupRealtimeSubscriptions = (
  carteiras: CarteiraBTC[], 
  setCarteiras: React.Dispatch<React.SetStateAction<CarteiraBTC[]>>,
  setTransacoes: React.Dispatch<React.SetStateAction<Record<string, any>>>
) => {
  const walletChanges = supabase
    .channel('table-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bitcoin_wallets'
      },
      (payload) => {
        console.log('Realtime update received:', payload);
        
        // Handle different types of changes
        if (payload.eventType === 'INSERT') {
          const newWallet = payload.new as any;
          if (newWallet && !carteiras.some(c => c.id === newWallet.id)) {
            // Format the new wallet according to our app's type
            setCarteiras(prev => [...prev, {
              id: newWallet.id,
              nome: newWallet.name,
              endereco: newWallet.address,
              saldo: newWallet.balance || 0,
              ultimo_update: newWallet.last_updated,
              total_entradas: newWallet.total_received || 0,
              total_saidas: newWallet.total_sent || 0,
              qtde_transacoes: newWallet.transaction_count || 0
            }]);
          }
        } else if (payload.eventType === 'UPDATE') {
          const updatedWallet = payload.new as any;
          setCarteiras(prev => prev.map(wallet => 
            wallet.id === updatedWallet.id ? {
              ...wallet,
              nome: updatedWallet.name,
              endereco: updatedWallet.address,
              saldo: updatedWallet.balance || 0,
              ultimo_update: updatedWallet.last_updated,
              total_entradas: updatedWallet.total_received || 0,
              total_saidas: updatedWallet.total_sent || 0,
              qtde_transacoes: updatedWallet.transaction_count || 0
            } : wallet
          ));
          
          // Show notification if balance changed
          const existingWallet = carteiras.find(w => w.id === updatedWallet.id);
          if (existingWallet && existingWallet.saldo !== updatedWallet.balance) {
            const isIncrease = existingWallet.saldo < updatedWallet.balance;
            toast({
              title: `Saldo da carteira ${updatedWallet.name} ${isIncrease ? 'aumentou' : 'diminuiu'}`,
              description: `${isIncrease ? '+' : '-'} ${Math.abs(updatedWallet.balance - existingWallet.saldo).toFixed(8)} BTC`,
              variant: isIncrease ? "default" : "destructive",
            });
          }
        } else if (payload.eventType === 'DELETE') {
          const deletedWallet = payload.old as any;
          setCarteiras(prev => prev.filter(wallet => wallet.id !== deletedWallet.id));
        }
      }
    )
    .subscribe();
  
  // Transaction changes subscription
  const transactionChanges = supabase
    .channel('transaction-db-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'wallet_transactions'
      },
      (payload) => {
        const newTx = payload.new as any;
        
        if (newTx && newTx.wallet_id) {
          // Find wallet for this transaction
          const relatedWallet = carteiras.find(w => w.id === newTx.wallet_id);
          
          if (relatedWallet) {
            // Update transactions for this wallet
            setTransacoes(prev => {
              const currentTxs = prev[newTx.wallet_id] || [];
              
              // Check if we already have this transaction
              if (!currentTxs.some(tx => tx.hash === newTx.hash)) {
                // Add new transaction
                const newTransaction = {
                  hash: newTx.hash,
                  valor: newTx.amount,
                  tipo: newTx.transaction_type,
                  data: newTx.transaction_date
                };
                
                // Show notification for new transaction
                toast({
                  title: `Nova transação ${newTx.transaction_type === 'entrada' ? 'recebida' : 'enviada'}`,
                  description: `${newTx.amount} BTC na carteira ${relatedWallet.nome}`,
                  variant: newTx.transaction_type === 'entrada' ? "default" : "destructive",
                });
                
                return {
                  ...prev,
                  [newTx.wallet_id]: [newTransaction, ...currentTxs]
                };
              }
              return prev;
            });
          }
        }
      }
    )
    .subscribe();
    
  return { walletChanges, transactionChanges };
};
