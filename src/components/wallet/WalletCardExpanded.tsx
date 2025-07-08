import React, { useState } from 'react';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bitcoin, 
  Copy, 
  ExternalLink, 
  Star, 
  StarOff,
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  BarChart3,
  Shield,
  Zap,
  Calendar,
  DollarSign
} from 'lucide-react';
import { formatBitcoinValue, formatDate, formatCurrency } from '@/utils/formatters';
import { useCarteiras } from '@/contexts/carteiras';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { toast } from 'sonner';

interface WalletCardExpandedProps {
  carteira: CarteiraBTC;
  isPrimary?: boolean;
  onEdit?: (carteira: CarteiraBTC) => void;
  onDelete?: (carteira: CarteiraBTC) => void;
  onCollapse?: () => void;
}

const WalletCardExpanded: React.FC<WalletCardExpandedProps> = ({ 
  carteira, 
  isPrimary = false, 
  onEdit, 
  onDelete,
  onCollapse 
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const { definirCarteiraPrincipal, atualizarCarteira, isUpdating } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  
  const isUpdatingWallet = isUpdating[carteira.id] || false;
  
  // Calculate values
  const fiatValueUSD = carteira.saldo * (bitcoinData?.price_usd || 0);
  const fiatValueBRL = carteira.saldo * (bitcoinData?.price_brl || 0);
  const profitLoss = carteira.saldo - carteira.total_entradas + carteira.total_saidas;
  const profitLossPercentage = carteira.total_entradas > 0 ? (profitLoss / carteira.total_entradas) * 100 : 0;
  
  // Wallet activity score (based on transactions and recency)
  const lastUpdateDate = new Date(carteira.ultimo_update || Date.now());
  const daysSinceUpdate = Math.floor((Date.now() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24));
  const activityScore = Math.max(0, 100 - (daysSinceUpdate * 2) - Math.max(0, (50 - carteira.qtde_transacoes) * 0.5));
  
  const formatAddress = (address: string) => {
    if (showFullAddress) return address;
    return `${address.slice(0, 12)}...${address.slice(-12)}`;
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
  
  const getWalletStatus = () => {
    if (daysSinceUpdate > 30) return { status: 'inativa', color: 'text-red-500' };
    if (daysSinceUpdate > 7) return { status: 'moderada', color: 'text-yellow-500' };
    return { status: 'ativa', color: 'text-green-500' };
  };
  
  const walletStatus = getWalletStatus();

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-card via-card/90 to-dashboard-medium border-l-4 border-l-bitcoin shadow-2xl rounded-xl overflow-hidden animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-dashboard-medium to-dashboard-dark pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-bitcoin to-bitcoin-dark flex items-center justify-center shadow-lg">
                <Bitcoin className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-2xl font-bold text-foreground truncate">{carteira.nome}</CardTitle>
                  {isPrimary && (
                    <Badge variant="default" className="bg-bitcoin hover:bg-bitcoin-dark text-white">
                      Principal
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${
                    walletStatus.status === 'ativa' ? 'bg-green-500' : 
                    walletStatus.status === 'moderada' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span className={`text-sm font-medium capitalize ${walletStatus.color}`}>
                    {walletStatus.status}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {carteira.qtde_transacoes} transações
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSetPrimary}
              className="text-muted-foreground hover:text-foreground"
            >
              {isPrimary ? <Star className="h-4 w-4 fill-current text-bitcoin" /> : <StarOff className="h-4 w-4" />}
            </Button>
            
            {onCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCollapse}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Address Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Endereço da Carteira:</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
            <span 
              className="font-mono text-sm cursor-pointer flex-1 select-all"
              onClick={() => setShowFullAddress(!showFullAddress)}
            >
              {formatAddress(carteira.endereco)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(carteira.endereco)}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0"
            >
              <a 
                href={getExplorerUrl(carteira.endereco)} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Balance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-bitcoin" />
              <span className="font-semibold">Saldo Atual</span>
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl font-bold text-bitcoin">
                {showBalance ? formatBitcoinValue(carteira.saldo) : '••••••••'}
              </div>
              {showBalance && (
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>≈ {formatCurrency(fiatValueUSD, 'USD')}</p>
                  <p>≈ {formatCurrency(fiatValueBRL, 'BRL')}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Performance</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Lucro/Prejuízo</span>
                <div className="flex items-center gap-1">
                  {profitLoss >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`font-medium ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {showBalance ? `${profitLoss >= 0 ? '+' : ''}${formatBitcoinValue(profitLoss)}` : '••••••'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Percentual</span>
                <span className={`font-medium ${profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {showBalance ? `${profitLossPercentage >= 0 ? '+' : ''}${profitLossPercentage.toFixed(2)}%` : '••••'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Recebido</p>
                <p className="text-lg font-bold text-green-500">
                  {showBalance ? formatBitcoinValue(carteira.total_entradas) : '••••••••'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Enviado</p>
                <p className="text-lg font-bold text-red-500">
                  {showBalance ? formatBitcoinValue(carteira.total_saidas) : '••••••••'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Transações</p>
                <p className="text-lg font-bold text-blue-500">{carteira.qtde_transacoes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Score */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <span className="font-semibold">Score de Atividade</span>
            <Badge variant="outline" className="text-xs">
              {Math.round(activityScore)}%
            </Badge>
          </div>
          <Progress value={activityScore} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Baixa atividade</span>
            <span>Alta atividade</span>
          </div>
        </div>

        {/* Last Update Info */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Última atualização:</span>
          </div>
          <span className="text-sm font-medium">{formatDate(carteira.ultimo_update)}</span>
          <div className="flex items-center gap-2 ml-auto">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {daysSinceUpdate === 0 ? 'Hoje' : `${daysSinceUpdate} dia${daysSinceUpdate > 1 ? 's' : ''} atrás`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleUpdate}
            disabled={isUpdatingWallet}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isUpdatingWallet ? 'animate-spin' : ''}`} />
            {isUpdatingWallet ? 'Atualizando...' : 'Atualizar Dados'}
          </Button>
          
          {onEdit && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onEdit(carteira)}
            >
              Editar Carteira
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={() => onDelete(carteira)}
            >
              Remover Carteira
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCardExpanded;