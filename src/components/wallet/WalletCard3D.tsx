
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Trash2, 
  Edit2, 
  Star, 
  StarOff, 
  Copy, 
  ExternalLink,
  Bitcoin,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatBitcoinValue, formatDate, formatCurrency } from '@/utils/formatters';
import { useCarteiras } from '@/contexts/carteiras';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { toast } from '@/components/ui/sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WalletCard3DProps {
  carteira: CarteiraBTC;
  isPrimary?: boolean;
  onEdit?: (carteira: CarteiraBTC) => void;
  onDelete?: (carteira: CarteiraBTC) => void;
}

const WalletCard3D: React.FC<WalletCard3DProps> = ({ 
  carteira, 
  isPrimary = false, 
  onEdit, 
  onDelete 
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const { definirCarteiraPrincipal, atualizarCarteira, isUpdating } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const addressRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isUpdatingWallet = isUpdating[carteira.id] || false;
  
  // Calculate fiat values
  const fiatValueUSD = carteira.saldo * (bitcoinData?.price_usd || 0);
  const fiatValueBRL = carteira.saldo * (bitcoinData?.price_brl || 0);
  
  // Format address for display
  const formatAddress = (address: string) => {
    if (showFullAddress) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Endereço copiado!');
    } catch (err) {
      toast.error('Erro ao copiar endereço');
    }
  };
  
  const handleSetPrimary = () => {
    try {
      definirCarteiraPrincipal(isPrimary ? null : carteira.id);
      toast.success(isPrimary ? 'Carteira removida como principal' : 'Carteira definida como principal');
    } catch (error) {
      toast.error('Erro ao definir carteira principal');
    }
  };
  
  const handleUpdate = async () => {
    try {
      await atualizarCarteira(carteira.id);
      toast.success('Carteira atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar carteira');
    }
  };
  
  const getExplorerUrl = (address: string) => {
    return `https://www.blockchain.com/explorer/addresses/btc/${address}`;
  };
  
  // Determine wallet status
  const getWalletStatus = () => {
    if (!carteira.ultimo_update) return 'inativa';
    
    const lastUpdateDate = new Date(carteira.ultimo_update);
    const currentDate = new Date();
    
    // If last update was more than 30 days ago, consider inactive
    if ((currentDate.getTime() - lastUpdateDate.getTime()) > (30 * 24 * 60 * 60 * 1000)) {
      return 'inativa';
    }
    
    return 'ativa';
  };
  
  // 3D Effect handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 8; // Max 8 degrees
    const rotateX = ((y - centerY) / centerY) * -8; // Max 8 degrees, inverted
    
    setRotation({ x: rotateX, y: rotateY });
  };
  
  const resetRotation = () => {
    setRotation({ x: 0, y: 0 });
  };
  
  const walletStatus = getWalletStatus();
  
  // Determine background style based on balance
  const getCardBackground = () => {
    if (isPrimary) {
      return 'bg-gradient-to-br from-blue-900/40 via-blue-900/20 to-purple-900/30';
    }
    
    if (carteira.saldo > 1) {
      return 'bg-gradient-to-br from-green-900/40 via-green-900/20 to-blue-900/30';
    } else if (carteira.saldo > 0.1) {
      return 'bg-gradient-to-br from-cyan-900/40 via-cyan-900/20 to-blue-900/30';
    }
    
    return 'bg-gradient-to-br from-dashboard-medium via-dashboard-dark to-dashboard-medium';
  };

  return (
    <Card 
      ref={cardRef}
      className={`group hover:shadow-neon transition-all duration-300 border-l-4 border-l-bitcoin animate-fade-in ${getCardBackground()} card-3d-fluid`}
      style={{ 
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetRotation}
    >
      <CardContent className="p-4 md:p-6 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold truncate">{carteira.nome}</h3>
              {isPrimary && (
                <Badge variant="default" className="bg-bitcoin hover:bg-bitcoin-dark">
                  Principal
                </Badge>
              )}
              <div className="flex items-center gap-1 ml-2">
                <span className={`h-2 w-2 rounded-full ${
                  walletStatus === 'ativa' ? 'bg-green-500' : 'bg-gray-400'
                }`}></span>
                <span className="text-xs text-muted-foreground capitalize">{walletStatus}</span>
              </div>
            </div>
            
            {/* Address */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <span 
                ref={addressRef}
                className="font-mono cursor-pointer"
                onClick={() => setShowFullAddress(!showFullAddress)}
              >
                {formatAddress(carteira.endereco)}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(carteira.endereco)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copiar endereço</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      asChild
                    >
                      <a 
                        href={getExplorerUrl(carteira.endereco)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver no explorer</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSetPrimary}
                    className="h-8 w-8 p-0"
                  >
                    {isPrimary ? <Star className="h-4 w-4 fill-current text-bitcoin" /> : <StarOff className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPrimary ? 'Remover como principal' : 'Definir como principal'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {onEdit && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(carteira)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar carteira</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {onDelete && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(carteira)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remover carteira</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        {/* Balance */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Bitcoin className="h-5 w-5 text-bitcoin" />
            <span className="text-2xl font-bold text-bitcoin-gradient">
              {formatBitcoinValue(carteira.saldo)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>≈ {formatCurrency(fiatValueUSD, 'USD')}</p>
            <p>≈ {formatCurrency(fiatValueBRL, 'BRL')}</p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Recebido</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-sm font-medium text-green-500">
                {formatBitcoinValue(carteira.total_entradas)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Enviado</p>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-sm font-medium text-red-500">
                {formatBitcoinValue(carteira.total_saidas)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Transações: {carteira.qtde_transacoes}</span>
          </div>
          <span>
            Atualizado: {formatDate(carteira.ultimo_update)}
          </span>
        </div>
        
        {/* Action Buttons Row */}
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleUpdate}
                  disabled={isUpdatingWallet}
                >
                  {isUpdatingWallet ? 'Atualizando...' : 'Atualizar'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Atualizar dados da carteira</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1 bg-bitcoin hover:bg-bitcoin-dark"
                  asChild
                >
                  <Link to={`/carteira/${carteira.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Mais
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver detalhes da carteira</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard3D;
