
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCarteiras } from '../contexts/carteiras';
import { detectAddressNetwork } from '../services/crypto/addressDetector';
import { toast } from '@/components/ui/sonner';
import { CheckCircle, AlertCircle, Wallet, Info } from 'lucide-react';
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
  const [isValidating, setIsValidating] = useState(false);

  const handleEnderecoChange = async (value: string) => {
    setEndereco(value);
    
    if (value.trim().length > 10) { // Só validar se tiver conteúdo suficiente
      setIsValidating(true);
      
      // Pequeno delay para evitar muitas validações
      setTimeout(() => {
        try {
          const detected = detectAddressNetwork(value.trim());
          console.log('🔍 Resultado da detecção:', detected);
          setDetectedNetwork(detected);
        } catch (error) {
          console.error('❌ Erro na validação:', error);
          setDetectedNetwork(null);
        } finally {
          setIsValidating(false);
        }
      }, 300);
    } else {
      setDetectedNetwork(null);
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast.error('Por favor, insira um nome para a carteira');
      return;
    }

    if (!endereco.trim()) {
      toast.error('Por favor, insira o endereço da carteira');
      return;
    }

    if (!detectedNetwork) {
      toast.error('Endereço não reconhecido. Verifique se é um endereço válido de criptomoeda.');
      return;
    }

    try {
      console.log('📝 Adicionando carteira:', { nome: nome.trim(), endereco: endereco.trim(), detectedNetwork });
      
      await adicionarCarteira(nome.trim(), endereco.trim());
      
      // Limpar formulário
      setNome('');
      setEndereco('');
      setDetectedNetwork(null);
      onClose();
      
      toast.success(`Carteira ${detectedNetwork.network.name} adicionada com sucesso!`);
    } catch (error) {
      console.error('❌ Erro ao adicionar carteira:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao adicionar carteira';
      toast.error(errorMessage);
    }
  };

  const getNetworkColor = (symbol: string) => {
    const colors: Record<string, string> = {
      'BTC': 'bg-orange-500',
      'ETH': 'bg-blue-500',
      'BNB': 'bg-yellow-500',
      'MATIC': 'bg-purple-500',
      'SOL': 'bg-green-500',
      'AVAX': 'bg-red-500',
      'ARB': 'bg-cyan-500',
      'OP': 'bg-red-400',
      'LTC': 'bg-gray-500',
      'DOGE': 'bg-yellow-600'
    };
    return colors[symbol] || 'bg-gray-500';
  };

  // Exemplos de endereços para teste
  const addressExamples = [
    { network: 'Bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', symbol: 'BTC' },
    { network: 'Ethereum', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', symbol: 'ETH' },
    { network: 'Solana', address: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj', symbol: 'SOL' },
  ];

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
              {isValidating ? (
                <div className="flex items-center gap-2 text-blue-500">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="text-sm">Validando...</span>
                </div>
              ) : endereco.trim().length > 10 ? (
                detectedNetwork ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Endereço válido:</span>
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
              ) : null}
            </div>
          </div>

          {/* Exemplos de endereços */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-500" />
              <p className="text-xs font-medium">Exemplos de endereços válidos:</p>
            </div>
            <div className="space-y-1">
              {addressExamples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleEnderecoChange(example.address)}
                  className="block w-full text-left text-xs p-2 rounded bg-background hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`${getNetworkColor(example.symbol)} text-white text-xs`}
                    >
                      {example.symbol}
                    </Badge>
                    <span className="font-mono truncate">{example.address}</span>
                  </div>
                </button>
              ))}
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
                { name: 'Optimism', symbol: 'OP' },
                { name: 'Litecoin', symbol: 'LTC' },
                { name: 'Dogecoin', symbol: 'DOGE' }
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isLoading}
            >
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
