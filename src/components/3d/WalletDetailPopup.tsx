
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Copy, ExternalLink, Plus, Expand, Wallet, Hash } from 'lucide-react';
import { formatBitcoinValue, formatDate } from '@/utils/formatters';
import { toast } from '@/hooks/use-toast';

interface WalletNode {
  id: string;
  address: string;
  position: any;
  balance: number;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  isLocked: boolean;
  connections: string[];
  type: 'main' | 'transaction' | 'connected';
  transactions?: Array<{
    hash: string;
    amount: number;
    transaction_type: string;
    transaction_date: string;
  }>;
}

interface WalletDetailPopupProps {
  wallet: WalletNode;
  onClose: () => void;
  onAddConnection: (address: string) => void;
  onExpandConnections?: () => void;
}

const WalletDetailPopup: React.FC<WalletDetailPopupProps> = ({
  wallet,
  onClose,
  onAddConnection,
  onExpandConnections
}) => {
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

  const openInExplorer = () => {
    if (wallet.type === 'transaction') {
      window.open(`https://blockstream.info/tx/${wallet.address}`, '_blank');
    } else {
      window.open(`https://blockstream.info/address/${wallet.address}`, '_blank');
    }
  };

  const formatAddressDisplay = (address: string, type: 'main' | 'transaction' | 'connected') => {
    if (type === 'transaction') {
      return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
    }
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-black border border-cyan-500/50 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {wallet.type === 'main' && <Wallet className="h-5 w-5 text-cyan-400" />}
            {wallet.type === 'transaction' && <Hash className="h-5 w-5 text-purple-400" />}
            {wallet.type === 'connected' && <Plus className="h-5 w-5 text-green-400" />}
            
            <h3 className="text-xl font-bold text-cyan-400">
              {wallet.type === 'main' && 'Carteira Bitcoin'}
              {wallet.type === 'transaction' && 'Transação'}
              {wallet.type === 'connected' && 'Carteira Conectada'}
            </h3>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Address */}
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/30 p-3 rounded-lg border border-green-500/30">
            <div className="text-xs text-gray-400 mb-1">
              {wallet.type === 'transaction' ? 'Valor' : 'Saldo Atual'}
            </div>
            <div className="text-lg font-bold text-green-400">
              {formatBitcoinValue(wallet.balance)}
            </div>
            {wallet.balance > 0 && (
              <div className="text-xs text-green-300 mt-1">
                ≈ {(wallet.balance * 100000000).toLocaleString()} sats
              </div>
            )}
          </div>
          
          <div className="bg-black/30 p-3 rounded-lg border border-blue-500/30">
            <div className="text-xs text-gray-400 mb-1">Transações</div>
            <div className="text-lg font-bold text-blue-400">
              {wallet.transactionCount.toLocaleString()}
            </div>
            {wallet.transactionCount > 0 && (
              <div className="text-xs text-blue-300 mt-1">
                Total de operações
              </div>
            )}
          </div>
          
          {wallet.type !== 'transaction' && (
            <>
              <div className="bg-black/30 p-3 rounded-lg border border-purple-500/30">
                <div className="text-xs text-gray-400 mb-1">Total Recebido</div>
                <div className="text-sm font-bold text-purple-400">
                  {formatBitcoinValue(wallet.totalReceived)}
                </div>
              </div>
              
              <div className="bg-black/30 p-3 rounded-lg border border-orange-500/30">
                <div className="text-xs text-gray-400 mb-1">Total Enviado</div>
                <div className="text-sm font-bold text-orange-400">
                  {formatBitcoinValue(wallet.totalSent)}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Type and Status Badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge 
            variant="outline" 
            className={`
              ${wallet.type === 'main' ? 'border-cyan-500/50 text-cyan-400' : ''}
              ${wallet.type === 'transaction' ? 'border-purple-500/50 text-purple-400' : ''}
              ${wallet.type === 'connected' ? 'border-green-500/50 text-green-400' : ''}
            `}
          >
            {wallet.type === 'main' && '🏦 Principal'}
            {wallet.type === 'transaction' && '⚡ Transação'}
            {wallet.type === 'connected' && '🔗 Conectada'}
          </Badge>
          
          {wallet.isLocked && (
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
              🔒 Travada
            </Badge>
          )}

          {wallet.balance === 0 && wallet.type === 'main' && (
            <Badge variant="outline" className="border-gray-500/50 text-gray-400">
              💸 Vazia
            </Badge>
          )}
        </div>

        {/* Recent Transactions */}
        {wallet.transactions && wallet.transactions.length > 0 && (
          <div className="mb-4">
            <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
              Transações Recentes ({wallet.transactions.length})
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {wallet.transactions.slice(0, 5).map((tx, index) => (
                <div key={index} className="bg-black/30 p-2 rounded border border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="text-xs flex-1">
                      <div className="text-gray-300 font-mono">
                        {tx.hash.substring(0, 12)}...{tx.hash.substring(tx.hash.length - 8)}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {formatDate(tx.transaction_date)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        tx.transaction_type === 'entrada' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {tx.transaction_type === 'entrada' ? '+' : '-'}{formatBitcoinValue(tx.amount)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {tx.transaction_type === 'entrada' ? 'Recebido' : 'Enviado'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {wallet.transactions.length > 5 && (
                <div className="text-xs text-gray-500 text-center py-1">
                  +{wallet.transactions.length - 5} transações a mais...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
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

        {/* Connections */}
        {wallet.connections.length > 0 && (
          <div className="mt-4">
            <label className="text-xs text-gray-400 uppercase tracking-wide">
              Conexões Ativas ({wallet.connections.length})
            </label>
            <div className="mt-2 space-y-1">
              {wallet.connections.slice(0, 3).map((connection, index) => (
                <div key={index} className="text-xs text-gray-300 font-mono flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  {formatAddressDisplay(connection, 'connected')}
                </div>
              ))}
              {wallet.connections.length > 3 && (
                <div className="text-xs text-gray-500 pl-4">
                  +{wallet.connections.length - 3} conexões a mais...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500">
          <div className="flex justify-between items-center">
            <span>Dados em tempo real</span>
            <span>🔐 Seguro via blockchain</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDetailPopup;
