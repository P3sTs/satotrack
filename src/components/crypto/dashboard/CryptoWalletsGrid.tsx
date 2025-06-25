
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
  if (wallets.length === 0 && generationStatus !== 'generating') {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma carteira encontrada</h3>
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
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wallets.map((wallet) => {
        const walletWithCurrency = {
          ...wallet,
          currency: wallet.currency || wallet.name?.split(' ')[0] || 'UNKNOWN'
        };
        
        return (
          <CryptoWalletCard
            key={wallet.id}
            wallet={walletWithCurrency}
            onSend={() => toast.info(`Funcionalidade de envio ${wallet.name} em desenvolvimento`)}
            onReceive={() => toast.info(`Funcionalidade de recebimento ${wallet.name} em desenvolvimento`)}
          />
        );
      })}
    </div>
  );
};
