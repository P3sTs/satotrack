import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Download, Upload, Copy, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SecurePinModal } from '@/components/security/SecurePinModal';
import { usePinAuth } from '@/hooks/usePinAuth';
import { supabase } from '@/integrations/supabase/client';

interface CreateWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletCreated: (wallet: any) => void;
}

export const CreateWalletModal: React.FC<CreateWalletModalProps> = ({
  isOpen,
  onClose,
  onWalletCreated
}) => {
  const [activeTab, setActiveTab] = useState('create');
  const [walletName, setWalletName] = useState('');
  const [currency, setCurrency] = useState('BTC');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [showSeed, setShowSeed] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedSeed, setGeneratedSeed] = useState<string[]>([]);
  const [verificationWords, setVerificationWords] = useState<string[]>(['', '', '']);
  const [verificationIndexes] = useState([2, 7, 11]); // Random indexes for verification
  const { toast } = useToast();
  const { verifyPin } = usePinAuth();

  const generateSeedPhrase = () => {
    // Mock seed generation - in production use proper crypto libraries
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acoustic', 'acquire', 'across', 'action', 'actor', 'actress', 'actual', 'adapt'
    ];
    
    const seed = Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]);
    setGeneratedSeed(seed);
    setShowSeed(true);
  };

  const handleCreateWallet = () => {
    if (!walletName.trim()) {
      toast({
        title: "Nome Obrigatório",
        description: "Digite um nome para a carteira",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'create') {
      generateSeedPhrase();
    } else {
      if (!seedPhrase.trim()) {
        toast({
          title: "Seed Phrase Obrigatória",
          description: "Digite a seed phrase da carteira existente",
          variant: "destructive"
        });
        return;
      }
      setShowPinModal(true);
    }
  };

  const handleSeedVerification = () => {
    const isValid = verificationIndexes.every((index, i) => 
      verificationWords[i].toLowerCase() === generatedSeed[index].toLowerCase()
    );

    if (!isValid) {
      toast({
        title: "Verificação Falhou",
        description: "As palavras não correspondem à seed phrase gerada",
        variant: "destructive"
      });
      return;
    }

    setShowPinModal(true);
  };

  const handlePinVerified = async (pin: string): Promise<boolean> => {
    setIsProcessing(true);
    
    try {
      // Call secure wallet operations edge function
      const response = await fetch('/functions/v1/secure-wallet-operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          operation: 'generate_wallet',
          data: {
            currency,
            network: 'mainnet',
            name: walletName,
            seedPhrase: activeTab === 'import' ? seedPhrase : generatedSeed.join(' ')
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Carteira Criada",
          description: `Carteira ${walletName} criada com sucesso`,
          variant: "default"
        });
        
        onWalletCreated(result.wallet);
        setWalletName('');
        setSeedPhrase('');
        setGeneratedSeed([]);
        setVerificationWords(['', '', '']);
        setShowSeed(false);
        setShowPinModal(false);
        onClose();
        return true;
      } else {
        toast({
          title: "Erro na Criação",
          description: result.error || "Falha ao criar carteira",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Erro de Rede",
        description: "Falha na comunicação com o servidor",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const copySeedToClipboard = () => {
    navigator.clipboard.writeText(generatedSeed.join(' '));
    toast({
      title: "Copiado",
      description: "Seed phrase copiada para a área de transferência",
      variant: "default"
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Nova Carteira</span>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">
                <Download className="w-4 h-4 mr-2" />
                Criar Nova
              </TabsTrigger>
              <TabsTrigger value="import">
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </TabsTrigger>
            </TabsList>

            <div className="space-y-6 pt-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="walletName">Nome da Carteira</Label>
                  <Input
                    id="walletName"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    placeholder="Minha Carteira Bitcoin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                    <option value="SOL">Solana (SOL)</option>
                  </select>
                </div>
              </div>

              <TabsContent value="create" className="space-y-4">
                {!showSeed ? (
                  <div className="text-center py-6">
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <Download className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Uma nova seed phrase será gerada para sua carteira.
                        <br />
                        Mantenha-a segura e nunca a compartilhe.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Seed Phrase Display */}
                    <Card className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Sua Seed Phrase</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copySeedToClipboard}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {generatedSeed.map((word, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 p-2 bg-muted rounded text-sm"
                            >
                              <span className="text-muted-foreground">{index + 1}.</span>
                              <span className="font-mono">{word}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>

                    {/* Verification */}
                    <Card className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                          <h4 className="font-medium">Verificação de Segurança</h4>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          Digite as palavras nas posições indicadas para confirmar que você anotou a seed phrase:
                        </p>
                        
                        <div className="space-y-2">
                          {verificationIndexes.map((index, i) => (
                            <div key={i} className="flex items-center space-x-3">
                              <Label className="w-20">Palavra {index + 1}:</Label>
                              <Input
                                value={verificationWords[i]}
                                onChange={(e) => {
                                  const newWords = [...verificationWords];
                                  newWords[i] = e.target.value;
                                  setVerificationWords(newWords);
                                }}
                                placeholder="Digite a palavra"
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="import" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seedPhrase">Seed Phrase</Label>
                  <div className="relative">
                    <textarea
                      id="seedPhrase"
                      value={seedPhrase}
                      onChange={(e) => setSeedPhrase(e.target.value)}
                      placeholder="Digite ou cole sua seed phrase de 12 ou 24 palavras..."
                      className="w-full p-3 border rounded-md bg-background min-h-[100px] resize-none"
                      style={{ fontFamily: showSeed ? 'inherit' : 'monospace', WebkitTextSecurity: showSeed ? 'none' : 'disc' }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => setShowSeed(!showSeed)}
                    >
                      {showSeed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Separe as palavras com espaços. Esta informação nunca deixará seu dispositivo sem criptografia.
                  </p>
                </div>
              </TabsContent>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={showSeed && activeTab === 'create' ? handleSeedVerification : handleCreateWallet}
                  className="flex-1"
                  disabled={!walletName || isProcessing || (showSeed && verificationWords.some(w => !w.trim()))}
                >
                  {isProcessing ? "Processando..." : showSeed && activeTab === 'create' ? "Verificar" : "Continuar"}
                </Button>
              </div>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      <SecurePinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => {}}
        onPinVerified={handlePinVerified}
        title="Confirmar Criação"
        description="Digite seu PIN para criar a carteira com segurança"
      />
    </>
  );
};