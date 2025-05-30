
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Copy, ExternalLink, Plus } from 'lucide-react';
import { formatBitcoinValue, formatDate } from '@/utils/formatters';

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
}

interface WalletDetailPopupProps {
  wallet: WalletNode;
  onClose: () => void;
  onAddConnection: (address: string) => void;
}

const WalletDetailPopup: React.FC<WalletDetailPopupProps> = ({
  wallet,
  onClose,
  onAddConnection
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-black border border-cyan-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-cyan-400">
            💎 Detalhes da Carteira
          </h3>
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
            Endereço
          </label>
          <div className="flex items-center gap-2 mt-1">
            <code className="bg-black/50 text-cyan-300 text-xs p-2 rounded border border-cyan-500/30 flex-1 font-mono">
              {wallet.address.substring(0, 12)}...{wallet.address.substring(wallet.address.length - 12)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(wallet.address)}
              className="text-gray-400 hover:text-cyan-400"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/30 p-3 rounded-lg border border-green-500/30">
            <div className="text-xs text-gray-400">Saldo Atual</div>
            <div className="text-lg font-bold text-green-400">
              {formatBitcoinValue(wallet.balance)}
            </div>
          </div>
          
          <div className="bg-black/30 p-3 rounded-lg border border-blue-500/30">
            <div className="text-xs text-gray-400">Transações</div>
            <div className="text-lg font-bold text-blue-400">
              {wallet.transactionCount}
            </div>
          </div>
          
          <div className="bg-black/30 p-3 rounded-lg border border-purple-500/30">
            <div className="text-xs text-gray-400">Total Recebido</div>
            <div className="text-sm font-bold text-purple-400">
              {formatBitcoinValue(wallet.totalReceived)}
            </div>
          </div>
          
          <div className="bg-black/30 p-3 rounded-lg border border-orange-500/30">
            <div className="text-xs text-gray-400">Total Enviado</div>
            <div className="text-sm font-bold text-orange-400">
              {formatBitcoinValue(wallet.totalSent)}
            </div>
          </div>
        </div>

        {/* Type Badge */}
        <div className="mb-4">
          <Badge 
            variant="outline" 
            className={`
              ${wallet.type === 'main' ? 'border-cyan-500/50 text-cyan-400' : ''}
              ${wallet.type === 'transaction' ? 'border-purple-500/50 text-purple-400' : ''}
              ${wallet.type === 'connected' ? 'border-green-500/50 text-green-400' : ''}
            `}
          >
            {wallet.type === 'main' && '🏦 Carteira Principal'}
            {wallet.type === 'transaction' && '⚡ Transação'}
            {wallet.type === 'connected' && '🔗 Conectada'}
          </Badge>
          
          {wallet.isLocked && (
            <Badge variant="outline" className="ml-2 border-yellow-500/50 text-yellow-400">
              🔒 Travada
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/50 text-purple-300"
            onClick={() => {
              // Simular adição de conexão
              const mockAddress = `1A${Math.random().toString(36).substring(2, 15)}`;
              onAddConnection(mockAddress);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Expandir Conexões
          </Button>
          
          <Button
            variant="outline"
            className="w-full bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/50 text-blue-300"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver no Explorer
          </Button>
        </div>

        {/* Connections */}
        {wallet.connections.length > 0 && (
          <div className="mt-4">
            <label className="text-xs text-gray-400 uppercase tracking-wide">
              Conexões ({wallet.connections.length})
            </label>
            <div className="mt-2 space-y-1">
              {wallet.connections.slice(0, 3).map((connection, index) => (
                <div key={index} className="text-xs text-gray-300 font-mono">
                  🔗 {connection.substring(0, 8)}...{connection.substring(connection.length - 8)}
                </div>
              ))}
              {wallet.connections.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{wallet.connections.length - 3} mais...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletDetailPopup;
