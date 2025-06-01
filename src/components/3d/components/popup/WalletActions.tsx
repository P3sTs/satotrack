
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Expand, Plus } from 'lucide-react';
import { WalletNode } from '../../hooks/useWalletNodes';

interface WalletActionsProps {
  wallet: WalletNode;
  onAddConnection: (address: string) => void;
  onExpandConnections?: () => void;
}

const WalletActions: React.FC<WalletActionsProps> = ({
  wallet,
  onAddConnection,
  onExpandConnections
}) => {
  const openInExplorer = () => {
    if (wallet.type === 'transaction') {
      window.open(`https://blockstream.info/tx/${wallet.address}`, '_blank');
    } else {
      window.open(`https://blockstream.info/address/${wallet.address}`, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      {wallet.type === 'main' && onExpandConnections && (
        <Button
          variant="outline"
          className="w-full bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/50 text-purple-300"
          onClick={onExpandConnections}
        >
          <Expand className="h-4 w-4 mr-2" />
          Expandir Transações ({wallet.transactions?.length || 0})
        </Button>
      )}
      
      <Button
        variant="outline"
        className="w-full bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/50 text-blue-300"
        onClick={openInExplorer}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Ver no Blockstream Explorer
      </Button>

      {wallet.type === 'main' && (
        <Button
          variant="outline"
          className="w-full bg-green-600/20 hover:bg-green-600/30 border-green-500/50 text-green-300"
          onClick={() => {
            // Simular adição de conexão com endereço relacionado
            const mockAddress = `1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2`; // Endereço real de exemplo
            onAddConnection(mockAddress);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Conexão Relacionada
        </Button>
      )}
    </div>
  );
};

export default WalletActions;
