
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Wallet, Key, Shield, AlertTriangle } from 'lucide-react';

interface WalletActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const WalletActionModal: React.FC<WalletActionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [walletName, setWalletName] = useState('');

  const handleCreateWallet = async () => {
    if (!pin || pin.length !== 6) {
      toast.error('PIN deve ter 6 dígitos');
      return;
    }

    if (pin !== confirmPin) {
      toast.error('PINs não coincidem');
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('wallet-create', {
        body: {
          pin,
          seed_words: 12 // Padrão 12 palavras
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success('Carteiras criadas com sucesso!');
        onSuccess();
        onClose();
      } else {
        throw new Error(data?.error || 'Erro ao criar carteiras');
      }
    } catch (error) {
      console.error('Erro ao criar carteiras:', error);
      toast.error(error.message || 'Erro ao criar carteiras');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportWallet = async () => {
    if (!seedPhrase || !pin) {
      toast.error('Seed phrase e PIN são obrigatórios');
      return;
    }

    if (pin.length !== 6) {
      toast.error('PIN deve ter 6 dígitos');
      return;
    }

    const words = seedPhrase.trim().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
      toast.error('Seed phrase deve ter 12 ou 24 palavras');
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('wallet-link-external', {
        body: {
          seed_phrase: seedPhrase,
          wallet_name: walletName || 'Carteira Importada',
          pin
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success('Carteira importada com sucesso!');
        onSuccess();
        onClose();
      } else {
        throw new Error(data?.error || 'Erro ao importar carteira');
      }
    } catch (error) {
      console.error('Erro ao importar carteira:', error);
      toast.error(error.message || 'Erro ao importar carteira');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-dashboard-dark border-dashboard-light/30">
        <DialogHeader>
          <DialogTitle className="text-satotrack-text flex items-center gap-2">
            <Wallet className="h-5 w-5 text-satotrack-neon" />
            Gerenciar Carteiras
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-dashboard-medium">
            <TabsTrigger value="create">Criar Nova</TabsTrigger>
            <TabsTrigger value="import">Importar</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div className="text-center p-4 bg-satotrack-neon/10 rounded-lg border border-satotrack-neon/20">
              <Shield className="h-8 w-8 mx-auto mb-2 text-satotrack-neon" />
              <h3 className="font-semibold text-satotrack-text mb-1">
                Carteira Segura KMS
              </h3>
              <p className="text-xs text-muted-foreground">
                Suas chaves privadas são protegidas por criptografia KMS avançada
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="pin" className="text-satotrack-text">
                  Definir PIN de Segurança (6 dígitos)
                </Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="••••••"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="bg-dashboard-medium border-dashboard-light/30 text-satotrack-text"
                />
              </div>

              <div>
                <Label htmlFor="confirmPin" className="text-satotrack-text">
                  Confirmar PIN
                </Label>
                <Input
                  id="confirmPin"
                  type="password"
                  placeholder="••••••"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="bg-dashboard-medium border-dashboard-light/30 text-satotrack-text"
                />
              </div>

              <div className="flex gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-200">
                  <strong>Importante:</strong> Memorize seu PIN. Ele será necessário para todas as transações.
                </div>
              </div>

              <Button
                onClick={handleCreateWallet}
                disabled={isLoading || !pin || !confirmPin || pin !== confirmPin}
                className="w-full bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
              >
                {isLoading ? 'Criando...' : 'Criar Carteiras'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Key className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <h3 className="font-semibold text-satotrack-text mb-1">
                Importar Carteira Existente
              </h3>
              <p className="text-xs text-muted-foreground">
                Importe sua carteira usando a seed phrase de 12 ou 24 palavras
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="walletName" className="text-satotrack-text">
                  Nome da Carteira (opcional)
                </Label>
                <Input
                  id="walletName"
                  placeholder="Ex: Minha Carteira Principal"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="bg-dashboard-medium border-dashboard-light/30 text-satotrack-text"
                />
              </div>

              <div>
                <Label htmlFor="seedPhrase" className="text-satotrack-text">
                  Seed Phrase (12 ou 24 palavras)
                </Label>
                <Textarea
                  id="seedPhrase"
                  placeholder="Digite sua seed phrase separada por espaços..."
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  className="bg-dashboard-medium border-dashboard-light/30 text-satotrack-text h-20 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="importPin" className="text-satotrack-text">
                  PIN de Segurança (6 dígitos)
                </Label>
                <Input
                  id="importPin"
                  type="password"
                  placeholder="••••••"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="bg-dashboard-medium border-dashboard-light/30 text-satotrack-text"
                />
              </div>

              <div className="flex gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-red-200">
                  <strong>Atenção:</strong> Sua seed phrase nunca será armazenada localmente. 
                  Apenas os endereços públicos serão sincronizados.
                </div>
              </div>

              <Button
                onClick={handleImportWallet}
                disabled={isLoading || !seedPhrase || !pin}
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                {isLoading ? 'Importando...' : 'Importar Carteira'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
