
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Wallet, Plus, Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useCarteiras } from '../contexts/carteiras';
import { useAuth } from '@/contexts/auth';
import { detectAddressNetwork, DetectedAddress } from '../services/crypto/addressDetector';
import DuplicateWalletChecker from './validation/DuplicateWalletChecker';
import { useActionFeedback } from './feedback/ActionFeedback';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NewWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewWalletModal: React.FC<NewWalletModalProps> = ({ isOpen, onClose }) => {
  const [endereco, setEndereco] = useState('');
  const [nome, setNome] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [detectedNetwork, setDetectedNetwork] = useState<DetectedAddress | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [addressError, setAddressError] = useState<string>('');
  
  const { adicionarCarteira } = useCarteiras();
  const { userPlan } = useAuth();
  const { showSuccess, showError } = useActionFeedback();

  // Validar endereço em tempo real
  useEffect(() => {
    if (!endereco.trim()) {
      setDetectedNetwork(null);
      setAddressError('');
      return;
    }

    const validateAddress = async () => {
      setIsValidating(true);
      setAddressError('');
      
      try {
        // Aguardar um pouco para evitar validações excessivas
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const detected = detectAddressNetwork(endereco.trim());
        setDetectedNetwork(detected);
        
        if (detected) {
          console.log('✅ Rede detectada:', detected.network.name);
          setAddressError('');
        } else {
          console.log('❌ Endereço não reconhecido');
          if (endereco.trim().length > 10) {
            setAddressError('Endereço não reconhecido. Verifique se é um endereço válido.');
          }
        }
      } catch (error) {
        console.error('Erro na validação:', error);
        setDetectedNetwork(null);
        setAddressError('Erro ao validar endereço');
      } finally {
        setIsValidating(false);
      }
    };

    const timeoutId = setTimeout(validateAddress, 500);
    return () => clearTimeout(timeoutId);
  }, [endereco]);

  const reset = () => {
    setEndereco('');
    setNome('');
    setIsLoading(false);
    setIsDuplicate(false);
    setDetectedNetwork(null);
    setIsValidating(false);
    setAddressError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDuplicate) {
      showError('❌ Não é possível cadastrar uma carteira duplicada');
      return;
    }

    if (!endereco.trim() || !nome.trim()) {
      showError('❌ Preencha todos os campos obrigatórios');
      return;
    }

    if (!detectedNetwork) {
      showError('❌ Endereço de criptomoeda não reconhecido. Verifique se é um endereço válido.');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🚀 Tentando adicionar carteira:', { endereco: endereco.trim(), nome: nome.trim() });
      await adicionarCarteira(endereco.trim(), nome.trim());
      showSuccess(`✅ Carteira ${detectedNetwork.network.name} adicionada com sucesso!`);
      reset();
      onClose();
    } catch (error) {
      console.error('❌ Erro ao adicionar carteira:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao adicionar carteira';
      showError(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const isFormValid = endereco.trim() && nome.trim() && detectedNetwork && !isDuplicate && !isValidating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Nova Carteira Crypto
          </DialogTitle>
          <DialogDescription>
            Adicione uma carteira para monitoramento em tempo real
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço da Carteira *</Label>
            <Input
              id="endereco"
              placeholder="Ex: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa ou 0x742d3..."
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className={`${isDuplicate ? 'border-red-500' : detectedNetwork ? 'border-green-500' : ''} ${addressError ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            
            {/* Status da validação */}
            {isValidating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Validando endereço...
              </div>
            )}
            
            {/* Rede detectada */}
            {detectedNetwork && !isValidating && !addressError && (
              <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  <strong>{detectedNetwork.network.name} ({detectedNetwork.network.symbol})</strong> detectado
                  <br />
                  <span className="text-xs">Tipo: {detectedNetwork.addressType}</span>
                </AlertDescription>
              </Alert>
            )}
            
            {/* Endereço inválido */}
            {addressError && !isValidating && (
              <Alert className="border-red-500/50 bg-red-50 dark:bg-red-950">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 dark:text-red-300">
                  {addressError}
                </AlertDescription>
              </Alert>
            )}
            
            <DuplicateWalletChecker 
              address={endereco}
              onDuplicateFound={setIsDuplicate}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Carteira *</Label>
            <Input
              id="nome"
              placeholder={detectedNetwork ? `Minha carteira ${detectedNetwork.network.name}` : "Ex: Carteira Principal"}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Informações sobre redes suportadas */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Redes suportadas:</strong> Bitcoin, Ethereum, Solana, Litecoin, Dogecoin, Polygon, BSC, Avalanche, Arbitrum, Optimism
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || isLoading}
              className="bg-bitcoin hover:bg-bitcoin-dark"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Carteira
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewWalletModal;
