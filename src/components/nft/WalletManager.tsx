
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet,
  Plus,
  Copy,
  ExternalLink,
  Key,
  Shield,
  Zap,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Web3Wallet {
  id: string;
  name: string;
  address: string;
  network: string;
  balance: string;
  seedPhrase?: string;
  isExternal: boolean;
}

const WalletManager: React.FC = () => {
  const [wallets, setWallets] = useState<Web3Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newWalletNetwork, setNewWalletNetwork] = useState('ethereum');
  const [externalWalletAddress, setExternalWalletAddress] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showConnectForm, setShowConnectForm] = useState(false);

  const networks = [
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: 'text-blue-400' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', color: 'text-purple-400' },
    { id: 'bsc', name: 'BNB Chain', symbol: 'BNB', color: 'text-yellow-400' }
  ];

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    setIsLoading(true);
    try {
      // Simular carregamento de carteiras
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWallets: Web3Wallet[] = [
        {
          id: '1',
          name: 'Carteira Principal ETH',
          address: '0x742d35Cc6632C0532925a3b8DA4C0b07f3b5c7E2',
          network: 'ethereum',
          balance: '2.45',
          isExternal: false
        },
        {
          id: '2',
          name: 'Polygon Wallet',
          address: '0x8ba1f109551bD432803012645Hac136c8d2BD1c7',
          network: 'polygon',
          balance: '125.80',
          isExternal: false
        }
      ];
      
      setWallets(mockWallets);
      toast.success('Carteiras carregadas com sucesso!');
    } catch (error) {
      console.error('Error loading wallets:', error);
      toast.error('Erro ao carregar carteiras');
    } finally {
      setIsLoading(false);
    }
  };

  const createWallet = async () => {
    setIsLoading(true);
    try {
      console.log('🔒 Criando carteira Web3 via Tatum API...');
      
      // Simular chamada Tatum API: POST /v3/ethereum/wallet
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newWallet: Web3Wallet = {
        id: Date.now().toString(),
        name: `Nova Carteira ${networks.find(n => n.id === newWalletNetwork)?.name}`,
        address: '0x' + Math.random().toString(16).substring(2, 42),
        network: newWalletNetwork,
        balance: '0.00',
        seedPhrase: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        isExternal: false
      };
      
      setWallets(prev => [...prev, newWallet]);
      setShowCreateForm(false);
      
      toast.success('Carteira criada com sucesso! ⚠️ Guarde sua seed phrase!');
      
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast.error('Erro ao criar carteira');
    } finally {
      setIsLoading(false);
    }
  };

  const connectExternalWallet = async () => {
    if (!externalWalletAddress || !externalWalletAddress.startsWith('0x')) {
      toast.error('Endereço inválido');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔗 Conectando carteira externa...', externalWalletAddress);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const externalWallet: Web3Wallet = {
        id: Date.now().toString(),
        name: 'Carteira Externa (MetaMask)',
        address: externalWalletAddress,
        network: 'ethereum',
        balance: '0.00',
        isExternal: true
      };
      
      setWallets(prev => [...prev, externalWallet]);
      setShowConnectForm(false);
      setExternalWalletAddress('');
      
      toast.success('Carteira externa conectada!');
      
    } catch (error) {
      console.error('Error connecting external wallet:', error);
      toast.error('Erro ao conectar carteira externa');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para área de transferência!');
  };

  const getNetworkInfo = (networkId: string) => {
    return networks.find(n => n.id === networkId) || networks[0];
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-satotrack-neon to-green-400 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Criar Carteira
        </Button>
        
        <Button
          onClick={() => setShowConnectForm(!showConnectForm)}
          variant="outline"
          className="border-blue-500/30 text-blue-400"
        >
          <Wallet className="h-4 w-4 mr-2" />
          Conectar Externa
        </Button>
        
        <Button
          onClick={loadWallets}
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Create Wallet Form */}
      {showCreateForm && (
        <Card className="bg-dashboard-dark/50 border-satotrack-neon/20">
          <CardHeader>
            <CardTitle className="text-satotrack-neon">Criar Nova Carteira</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="network">Rede Blockchain</Label>
              <select
                id="network"
                value={newWalletNetwork}
                onChange={(e) => setNewWalletNetwork(e.target.value)}
                className="w-full p-2 rounded-md bg-dashboard-medium border border-dashboard-light text-white"
              >
                {networks.map(network => (
                  <option key={network.id} value={network.id}>
                    {network.name} ({network.symbol})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={createWallet}
                disabled={isLoading}
                className="bg-satotrack-neon text-black"
              >
                {isLoading ? 'Criando...' : 'Criar Carteira'}
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connect External Wallet Form */}
      {showConnectForm && (
        <Card className="bg-dashboard-dark/50 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-blue-400">Conectar Carteira Externa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Endereço da Carteira</Label>
              <Input
                id="address"
                placeholder="0x..."
                value={externalWalletAddress}
                onChange={(e) => setExternalWalletAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={connectExternalWallet}
                disabled={isLoading || !externalWalletAddress}
                className="bg-blue-500 text-white"
              >
                {isLoading ? 'Conectando...' : 'Conectar'}
              </Button>
              <Button
                onClick={() => setShowConnectForm(false)}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => {
          const networkInfo = getNetworkInfo(wallet.network);
          
          return (
            <Card key={wallet.id} className="bg-dashboard-dark/50 border-dashboard-light/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-satotrack-neon" />
                    <span className="text-white">{wallet.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className={`border-${networkInfo.color.split('-')[1]}-500/30 ${networkInfo.color}`}>
                      {networkInfo.symbol}
                    </Badge>
                    {wallet.isExternal && (
                      <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                        Externa
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="p-3 bg-dashboard-medium/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Endereço</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(wallet.address)}
                      className="h-6 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-mono text-sm break-all">
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                  </p>
                </div>

                <div className="p-3 bg-dashboard-medium/30 rounded-lg">
                  <span className="text-xs text-muted-foreground">Saldo</span>
                  <p className="font-bold text-lg text-satotrack-neon">
                    {wallet.balance} {networkInfo.symbol}
                  </p>
                </div>

                {wallet.seedPhrase && (
                  <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="h-4 w-4 text-red-400" />
                      <span className="text-xs text-red-400 font-medium">Seed Phrase</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(wallet.seedPhrase!)}
                      className="w-full border-red-500/30 text-red-400"
                    >
                      <Shield className="h-3 w-3 mr-2" />
                      Copiar (Seguro!)
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Explorer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {wallets.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Nenhuma carteira encontrada</p>
          <p className="text-sm text-muted-foreground">
            Crie uma nova carteira ou conecte uma carteira externa para começar
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletManager;
