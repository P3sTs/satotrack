
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCarteiras } from '../contexts/carteiras';
import { detectAddressNetwork } from '../services/crypto/addressDetector';
import { toast } from '@/components/ui/sonner';
import { CheckCircle, AlertCircle, Wallet, Info, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NewWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORTED_CURRENCIES = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', color: 'bg-orange-500' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: 'bg-blue-500' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', color: 'bg-gray-500' },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', color: 'bg-yellow-600' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', color: 'bg-green-500' },
  { id: 'bnb', name: 'Binance Coin', symbol: 'BNB', color: 'bg-yellow-500' },
  { id: 'matic', name: 'Polygon', symbol: 'MATIC', color: 'bg-purple-500' },
];

const NewWalletModal: React.FC<NewWalletModalProps> = ({ isOpen, onClose }) => {
  const { adicionarCarteira, isLoading } = useCarteiras();
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [detectedNetwork, setDetectedNetwork] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleEnderecoChange = async (value: string) => {
    setEndereco(value);
    
    if (value.trim().length > 10) {
      setIsValidating(true);
      
      setTimeout(() => {
        try {
          const detected = detectAddressNetwork(value.trim());
          console.log('🔍 Resultado da detecção:', detected);
          setDetectedNetwork(detected);
          
          // Auto-select currency based on detected network
          if (detected) {
            const currencyMap: Record<string, string> = {
              'bitcoin': 'btc',
              'ethereum': 'eth',
              'solana': 'sol',
              'litecoin': 'ltc',
              'dogecoin': 'doge'
            };
            const detectedCurrency = currencyMap[detected.network.id.toLowerCase()];
            if (detectedCurrency && !selectedCurrency) {
              setSelectedCurrency(detectedCurrency);
            }
          }
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

    if (!selectedCurrency) {
      toast.error('Por favor, selecione o tipo de moeda');
      return;
    }

    if (!detectedNetwork) {
      toast.error('Endereço não reconhecido. Verifique se é um endereço válido.');
      return;
    }

    try {
      console.log('📝 Adicionando carteira:', { 
        nome: nome.trim(), 
        endereco: endereco.trim(), 
        currency: selectedCurrency,
        detectedNetwork 
      });
      
      await adicionarCarteira(nome.trim(), endereco.trim());
      
      // Limpar formulário
      setNome('');
      setEndereco('');
      setSelectedCurrency('');
      setDetectedNetwork(null);
      onClose();
      
      const currency = SUPPORTED_CURRENCIES.find(c => c.id === selectedCurrency);
      toast.success(`Carteira ${currency?.name} adicionada com sucesso!`);
    } catch (error) {
      console.error('❌ Erro ao adicionar carteira:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao adicionar carteira';
      toast.error(errorMessage);
    }
  };

  const getNetworkColor = (symbol: string) => {
    const currency = SUPPORTED_CURRENCIES.find(c => c.symbol === symbol);
    return currency?.color || 'bg-gray-500';
  };

  const selectedCurrencyData = SUPPORTED_CURRENCIES.find(c => c.id === selectedCurrency);

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
            <Label htmlFor="currency">
              <Coins className="inline h-4 w-4 mr-1" />
              Tipo de Criptomoeda
            </Label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a moeda..." />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${currency.color}`}></div>
                      <span>{currency.name} ({currency.symbol})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endereco">
              Endereço da Carteira
              {selectedCurrencyData && (
                <Badge className={`ml-2 ${selectedCurrencyData.color} text-white text-xs`}>
                  {selectedCurrencyData.symbol}
                </Badge>
              )}
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

          {/* Informações sobre processamento */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-500" />
              <p className="text-xs font-medium">Processamento Automático:</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Após adicionar, faremos uma consulta automática às APIs das redes blockchain para obter:
              saldo atual, histórico de transações, total recebido/enviado e outras informações da carteira.
            </p>
          </div>

          {/* Moedas suportadas */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs font-medium mb-2">Moedas Suportadas:</p>
            <div className="flex flex-wrap gap-1">
              {SUPPORTED_CURRENCIES.map((currency) => (
                <Badge 
                  key={currency.id}
                  variant="outline" 
                  className={`${currency.color} text-white border-none text-xs`}
                >
                  {currency.symbol}
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
              disabled={isLoading || !detectedNetwork || !selectedCurrency}
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
