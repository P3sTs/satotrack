
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { WalletNode } from '../../hooks/useWalletNodes';

interface WalletAddressProps {
  wallet: WalletNode;
}

const WalletAddress: React.FC<WalletAddressProps> = ({ wallet }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "✅ Copiado!",
        description: "Endereço copiado para a área de transferência",
      });
    }).catch(() => {
      toast({
        title: "❌ Erro",
        description: "Não foi possível copiar o endereço",
        variant: "destructive"
      });
    });
  };

  return (
    <div className="mb-4">
      <label className="text-xs text-gray-400 uppercase tracking-wide">
        {wallet.type === 'transaction' ? 'Hash da Transação' : 'Endereço Bitcoin'}
      </label>
      <div className="flex items-center gap-2 mt-1">
        <code className="bg-black/50 text-cyan-300 text-xs p-2 rounded border border-cyan-500/30 flex-1 font-mono break-all">
          {wallet.address}
        </code>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(wallet.address)}
          className="text-gray-400 hover:text-cyan-400 p-2"
          title="Copiar endereço"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default WalletAddress;
