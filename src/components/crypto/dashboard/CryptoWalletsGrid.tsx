
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CryptoWalletCard from '../CryptoWalletCard';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
  created_at?: string;
  user_id?: string;
  xpub?: string;
}

interface CryptoWalletsGridProps {
  wallets: CryptoWallet[];
  isGenerating: boolean;
  onGenerateWallets: () => void;
}

export const CryptoWalletsGrid: React.FC<CryptoWalletsGridProps> = ({
  wallets,
  isGenerating,
  onGenerateWallets
}) => {
  const activeWallets = wallets.filter(w => w.address !== 'pending_generation');
  const pendingWallets = wallets.filter(w => w.address === 'pending_generation');

  console.log('🔒 CryptoWalletsGrid - SECURE MODE - Total wallets:', wallets.length);
  console.log('🔒 CryptoWalletsGrid - Active wallets:', activeWallets.length);
  console.log('🔒 CryptoWalletsGrid - Pending wallets:', pendingWallets.length);

  if ((wallets.length === 0 || activeWallets.length === 0) && !isGenerating) {
    return (
      <Card className="p-8 text-center bg-dashboard-dark border-satotrack-neon/20">
        <CardContent>
          <Wallet className="h-16 w-16 mx-auto mb-4 text-satotrack-neon" />
          <h3 className="text-xl font-semibold mb-2 text-satotrack-text">Suas Carteiras Cripto Seguras</h3>
          <p className="text-muted-foreground mb-4">
            Gere suas carteiras cripto com segurança máxima - Tatum KMS integrado
          </p>
          <Button
            onClick={onGenerateWallets}
            disabled={isGenerating}
            className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Gerando Carteiras via Tatum KMS...' : 'Gerar Carteiras via Tatum KMS'}
          </Button>
          
          {pendingWallets.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-600">
                {pendingWallets.length} carteira(s) em processamento via Tatum KMS...
              </p>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-xs text-green-600">
              🔒 Sistema Tatum KMS: Chaves gerenciadas com segurança máxima
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {isGenerating && (
        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <div>
              <h4 className="font-medium text-blue-600">Gerando carteiras via Tatum KMS...</h4>
              <p className="text-sm text-blue-500">🔒 Conectando com Tatum API - Chaves seguras na nuvem</p>
            </div>
          </div>
        </Card>
      )}

      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-sm text-green-600 text-center">
          🔒 <strong>Sistema Tatum KMS Ativo:</strong> Suas chaves são gerenciadas pelo Tatum KMS. 
          Máxima segurança com assinatura remota de transações.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {activeWallets.map((wallet) => {
          const walletWithCurrency = {
            ...wallet,
            currency: wallet.currency || wallet.name?.split(' ')[0] || 'UNKNOWN'
          };
          
          return (
            <CryptoWalletCard
              key={wallet.id}
              wallet={walletWithCurrency}
              onSend={() => toast.info(`🔒 Transação ${wallet.currency} via Tatum KMS - Assinatura segura ativada`)}
              onReceive={() => toast.info(`Endereço ${wallet.currency} copiado para área de transferência`)}
            />
          );
        })}
      </div>

      {pendingWallets.length > 0 && (
        <Card className="p-4 bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
            <div>
              <h4 className="font-medium text-yellow-600">Processando via Tatum KMS</h4>
              <p className="text-sm text-yellow-500">
                🔒 {pendingWallets.length} carteira(s) sendo gerada(s) com Tatum KMS
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
