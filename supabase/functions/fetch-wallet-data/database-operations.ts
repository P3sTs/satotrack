
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { ProcessedWalletData } from './types.ts';

export async function updateWalletDatabase(
  processedData: ProcessedWalletData, 
  wallet_id: string | null
): Promise<void> {
  if (!wallet_id) return;

  console.log(`Updating wallet ${wallet_id} in database`);
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Update wallet data in Supabase
  const { error: updateError } = await supabase
    .from('crypto_wallets')
    .update({
      balance: processedData.balance,
      total_received: processedData.total_received,
      total_sent: processedData.total_sent,
      transaction_count: processedData.transaction_count,
      last_updated: new Date().toISOString()
    })
    .eq('id', wallet_id);
  
  if (updateError) {
    console.error('Error updating wallet:', updateError);
  } else {
    console.log('Wallet updated successfully');
  }

  // Store new transactions
  if (processedData.transactions && processedData.transactions.length > 0) {
    console.log(`Storing ${processedData.transactions.length} transactions`);
    
    const { error: txError } = await supabase
      .from('wallet_transactions')
      .upsert(
        processedData.transactions.map((tx: any) => ({
          wallet_id,
          hash: tx.hash,
          amount: tx.amount,
          transaction_type: tx.transaction_type,
          transaction_date: tx.transaction_date
        })),
        { onConflict: 'wallet_id,hash' }
      );
    
    if (txError) {
      console.error('Error storing transactions:', txError);
    } else {
      console.log('Transactions stored successfully');
    }
  }
}
