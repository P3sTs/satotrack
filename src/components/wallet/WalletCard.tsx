
import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatters';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';

interface WalletCardProps {
  carteira: CarteiraBTC;
  onEdit?: () => void;
  onDelete?: () => void;
  isPrimary?: boolean;
}

const WalletCard: React.FC<WalletCardProps> = ({ 
  carteira, 
  onEdit, 
  onDelete,
  isPrimary = false 
}) => {
  const [copied, setCopied] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(carteira.endereco);
      setCopied(true);
      toast({
        title: "Endereço copiado!",
        description: "O endereço da carteira foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o endereço.",
        variant: "destructive",
      });
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const openBlockchainExplorer = () => {
    window.open(`https://blockstream.info/address/${carteira.endereco}`, '_blank');
  };

  return (
    <Card className={`wallet-card ${isPrimary ? 'border-bitcoin' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium">
            {carteira.nome}
            {isPrimary && (
              <Badge variant="outline" className="ml-2 text-xs border-bitcoin text-bitcoin">
                Principal
              </Badge>
            )}
          </CardTitle>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Endereço:</p>
            <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-md">
              <code className="text-xs font-mono flex-1 truncate">
                {showFullAddress ? carteira.endereco : truncateAddress(carteira.endereco)}
              </code>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowFullAddress(!showFullAddress)}
                  title={showFullAddress ? "Ocultar endereço completo" : "Mostrar endereço completo"}
                >
                  {showFullAddress ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleCopyAddress}
                  title="Copiar endereço"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={openBlockchainExplorer}
                  title="Ver no blockchain"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-bitcoin">
              {formatCurrency(carteira.saldo || 0, 'BTC')}
            </p>
            <p className="text-sm text-muted-foreground">
              ≈ {formatCurrency((carteira.saldo || 0) * (carteira.cotacao || 0), 'BRL')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Transações</p>
              <p className="font-medium">{carteira.transacoes?.length || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Última atualização</p>
              <p className="font-medium">
                {carteira.ultimaAtualizacao 
                  ? new Date(carteira.ultimaAtualizacao).toLocaleDateString('pt-BR')
                  : 'Nunca'
                }
              </p>
            </div>
          </div>

          {(onEdit || onDelete) && (
            <div className="flex gap-2 pt-2 border-t">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
                  Editar
                </Button>
              )}
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={onDelete} className="flex-1">
                  Excluir
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
