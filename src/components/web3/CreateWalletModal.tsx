
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, AlertCircle } from 'lucide-react';

interface Network {
  symbol: string;
  name: string;
  color: string;
}

interface CreateWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWallet: (network: string, name?: string) => Promise<void>;
  supportedNetworks: Network[];
  isLoading: boolean;
}

const CreateWalletModal: React.FC<CreateWalletModalProps> = ({
  isOpen,
  onClose,
  onCreateWallet,
  supportedNetworks,
  isLoading
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [walletName, setWalletName] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedNetwork) {
      return;
    }

    try {
      await onCreateWallet(selectedNetwork, walletName || undefined);
      setSelectedNetwork('');
      setWalletName('');
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedNetwork('');
      setWalletName('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-satotrack-neon" />
            Criar Nova Carteira Web3
          </DialogTitle>
          <DialogDescription>
            Selecione a rede blockchain e crie uma carteira segura
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Network Selection */}
          <div className="space-y-3">
            <Label>Selecionar Rede</Label>
            <div className="grid grid-cols-1 gap-3">
              {supportedNetworks.map((network) => (
                <Card 
                  key={network.symbol}
                  className={`cursor-pointer transition-all ${
                    selectedNetwork === network.symbol 
                      ? 'ring-2 ring-satotrack-neon bg-satotrack-neon/10' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedNetwork(network.symbol)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: network.color }}
                      />
                      <div>
                        <p className="font-medium">{network.name}</p>
                        <p className="text-sm text-muted-foreground">{network.symbol}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{network.symbol}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Wallet Name */}
          <div className="space-y-2">
            <Label htmlFor="wallet-name">Nome da Carteira (opcional)</Label>
            <Input
              id="wallet-name"
              placeholder={`Ex: Minha carteira ${selectedNetwork || 'cripto'}`}
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Security Warning */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-yellow-500">
                  Importante sobre Segurança
                </p>
                <p className="text-xs text-muted-foreground">
                  • Sua chave privada será gerada de forma segura<br/>
                  • Faça backup da sua chave privada em local seguro<br/>
                  • Nunca compartilhe sua chave privada com ninguém<br/>
                  • Você é responsável pela segurança dos seus fundos
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
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
              disabled={!selectedNetwork || isLoading}
              className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Carteira'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWalletModal;
