import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CryptoWalletCard from '../CryptoWalletCard';

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
  created_at?: string;
  user_id?: string;
  xpub?: string;
  private_key_encrypted?: string;
}

interface CryptoWalletsGridProps {
  wallets: CryptoWallet[];
  generationStatus: GenerationStatus;
  onGenerateWallets: () => void;
}

export const CryptoWalletsGrid: React.FC<CryptoWalletsGridProps> = ({
  wallets,
  generationStatus,
  onGenerateWallets
}) => {
  // Filtra carteiras válidas (não pending)
  const activeWallets = wallets.filter(w => w.address !== 'pending_generation');
  const pendingWallets = wallets.filter(w => w.address === 'pending_generation');

  // Se não há carteiras ou todas estão pending e não está gerando, mostra tela de criação
  if ((wallets.length === 0 || activeWallets.length === 0) && generationStatus !== 'generating') {
    return (
      <Card className="p-8 text-center bg-dashboard-dark border-satotrack-neon/20">
        <CardContent>
          <Wallet className="h-16 w-16 mx-auto mb-4 text-satotrack-neon" />
          <h3 className="text-xl font-semibold mb-2 text-satotrack-text">Suas Carteiras Cripto</h3>
          <p className="text-muted-foreground mb-4">
            Gere suas carteiras cripto para começar a usar o sistema
          </p>
          <Button
            onClick={onGenerateWallets}
            disabled={generationStatus === 'generating'}
            className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
          >
            {generationStatus === 'generating' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {generationStatus === 'generating' ? 'Gerando Carteiras...' : 'Gerar Minhas Carteiras'}
          </Button>
          
          {pendingWallets.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-600">
                {pendingWallets.length} carteira(s) em processamento...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status de geração em andamento */}
      {generationStatus === 'generating' && (
        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <div>
              <h4 className="font-medium text-blue-600">Gerando suas carteiras...</h4>
              <p className="text-sm text-blue-500">Conectando com a Tatum API para criar endereços seguros</p>
            </div>
          </div>
        </Card>
      )}

      {/* Grid de carteiras ativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeWallets.map((wallet) => {
          const walletWithCurrency = {
            ...wallet,
            currency: wallet.currency || wallet.name?.split(' ')[0] || 'UNKNOWN'
          };
          
          return (
            <CryptoWalletCard
              key={wallet.id}
              wallet={walletWithCurrency}
              onSend={() => toast.info(`Funcionalidade de envio ${wallet.currency} será implementada em breve`)}
              onReceive={() => toast.info(`Funcionalidade de recebimento ${wallet.currency} será implementada em breve`)}
            />
          );
        })}
      </div>

      {/* Status de carteiras pendentes */}
      {pendingWallets.length > 0 && (
        <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
            <div>
              <h4 className="font-medium text-yellow-600">Processando carteiras</h4>
              <p className="text-sm text-yellow-500">
                {pendingWallets.length} carteira(s) ainda sendo gerada(s) via Tatum API
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
