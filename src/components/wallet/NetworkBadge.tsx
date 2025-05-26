
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface NetworkInfo {
  name: string;
  symbol: string;
  explorer_url: string;
}

interface NetworkBadgeProps {
  network: NetworkInfo;
  address: string;
  size?: 'sm' | 'md' | 'lg';
}

const NetworkBadge: React.FC<NetworkBadgeProps> = ({ 
  network, 
  address, 
  size = 'md' 
}) => {
  const getNetworkColor = (symbol: string) => {
    switch (symbol) {
      case 'BTC':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'ETH':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'BNB':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'MATIC':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'SOL':
        return 'bg-green-500 hover:bg-green-600';
      case 'AVAX':
        return 'bg-red-500 hover:bg-red-600';
      case 'ARB':
        return 'bg-cyan-500 hover:bg-cyan-600';
      case 'OP':
        return 'bg-red-400 hover:bg-red-500';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getExplorerUrl = () => {
    if (network.symbol === 'BTC') {
      return `${network.explorer_url}/address/${address}`;
    } else if (network.symbol === 'SOL') {
      return `${network.explorer_url}/address/${address}`;
    } else {
      // EVM chains
      return `${network.explorer_url}/address/${address}`;
    }
  };

  const handleClick = () => {
    window.open(getExplorerUrl(), '_blank');
  };

  return (
    <Badge 
      variant="outline" 
      className={`
        ${getNetworkColor(network.symbol)} 
        text-white border-none cursor-pointer 
        flex items-center gap-1
        ${size === 'sm' ? 'text-xs px-2 py-0.5' : ''}
        ${size === 'lg' ? 'text-sm px-3 py-1' : ''}
      `}
      onClick={handleClick}
    >
      <span>{network.symbol}</span>
      <ExternalLink className="h-3 w-3" />
    </Badge>
  );
};

export default NetworkBadge;
