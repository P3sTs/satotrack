
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCarteiras } from '../contexts/carteiras';
import { validarEnderecoCrypto } from '../services/api';
import { toast } from '@/components/ui/sonner';
import { CheckCircle, AlertCircle, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NewWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewWalletModal: React.FC<NewWalletModalProps> = ({ isOpen, onClose }) => {
  const { adicionarCarteira, isLoading } = useCarteiras();
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [detectedNetwork, setDetectedNetwork] = useState<any>(null);

  const handleEnderecoChange = (value: string) => {
    setEndereco(value);
    
    if (value.trim()) {
      const detected = validarEnderecoCrypto(value.trim());
      setDetectedNetwork(detected);
    } else {
      setDetectedNetwork(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast.error('Por favor, insira um nome para a carteira');
      return;
    }

    if (!detectedNetwork) {
      toast.error('Por favor, insira um endereço válido de criptomoeda');
      return;
    }

    try {
      await adicionarCarteira(nome.trim(), endereco.trim());
      setNome('');
      setEndereco('');
      setDetectedNetwork(null);
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar carteira:', error);
    }
  };

  const getNetworkColor = (symbol: string) => {
    switch (symbol) {
      case 'BTC': return 'bg-orange-500';
      case 'ETH': return 'bg-blue-500';
      case 'BNB': return 'bg-yellow-500';
      case 'MATIC': return 'bg-purple-500';
      case 'SOL': return 'bg-green-500';
      case 'AVAX': return 'bg-red-500';
      case 'ARB': return 'bg-cyan-500';
      case 'OP': return 'bg-red-400';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Adicionar Nova Carteira
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Carteira</Label>
            <Input
              id="nome"
              placeholder="Ex: Carteira Principal, Savings, Trading..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endereco">
              Endereço da Criptomoeda
              <span className="text-xs text-muted-foreground ml-2">
                (Bitcoin, Ethereum, Solana, BSC, Polygon, etc.)
              </span>
            </Label>
            <Input
              id="endereco"
              placeholder="Cole o endereço aqui..."
              value={endereco}
              onChange={(e) => handleEnderecoChange(e.target.value)}
              className="font-mono text-sm"
              required
            />
            
            {/* Feedback visual da detecção do endereço */}
            <div className="flex items-center min-h-[24px]">
              {endereco && (
                detectedNetwork ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Endereço válido detectado:</span>
                    <Badge 
                      className={`${getNetworkColor(detectedNetwork.network.symbol)} text-white text-xs`}
                    >
                      {detectedNetwork.network.name} ({detectedNetwork.network.symbol})
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600">
                      Endereço não reconhecido ou inválido
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Informações sobre redes suportadas */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs font-medium mb-2">Redes Suportadas:</p>
            <div className="flex flex-wrap gap-1">
              {[
                { name: 'Bitcoin', symbol: 'BTC' },
                { name: 'Ethereum', symbol: 'ETH' },
                { name: 'Solana', symbol: 'SOL' },
                { name: 'BSC', symbol: 'BNB' },
                { name: 'Polygon', symbol: 'MATIC' },
                { name: 'Avalanche', symbol: 'AVAX' },
                { name: 'Arbitrum', symbol: 'ARB' },
                { name: 'Optimism', symbol: 'OP' }
              ].map((network) => (
                <Badge 
                  key={network.symbol}
                  variant="outline" 
                  className={`${getNetworkColor(network.symbol)} text-white border-none text-xs`}
                >
                  {network.symbol}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !detectedNetwork}
              className="flex-1"
            >
              {isLoading ? 'Adicionando...' : 'Adicionar Carteira'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewWalletModal;
