
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletNode } from '../../types/WalletNode';

interface WalletAddressProps {
  wallet: WalletNode;
}

const WalletAddress: React.FC<WalletAddressProps> = ({ wallet }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const formatAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  return (
    <div className="mb-4">
      <label className="text-xs text-gray-400 uppercase tracking-wide">
        Endereço
      </label>
      <div className="flex items-center gap-2 mt-1 p-3 bg-black/30 rounded-lg border border-gray-700">
        <div className="flex-1 font-mono text-sm text-gray-300 break-all">
          {formatAddress(wallet.address)}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white flex-shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default WalletAddress;
