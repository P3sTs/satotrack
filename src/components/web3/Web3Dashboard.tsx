
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWeb3Wallet, Web3Wallet } from '@/hooks/useWeb3Wallet';
import { useAuth } from '@/contexts/auth';
import { 
  Wallet, 
  Plus, 
  RefreshCw, 
  Send, 
  Download, 
  QrCode,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import WalletCard from './WalletCard';
import CreateWalletModal from './CreateWalletModal';
import SendTransactionModal from './SendTransactionModal';
import ReceiveModal from './ReceiveModal';
import TransactionHistory from './TransactionHistory';
import Web3Overview from './Web3Overview';

const SUPPORTED_NETWORKS = [
  { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { symbol: 'MATIC', name: 'Polygon', color: '#8247E5' }
];

const Web3Dashboard: React.FC = () => {
  const { userPlan } = useAuth();
  const { 
    wallets, 
    transactions, 
    isLoading, 
    createWallet, 
    getBalance, 
    getTransactions,
    sendTransaction,
    refreshAllWallets 
  } = useWeb3Wallet();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWallet, setSelectedWallet] = useState<Web3Wallet | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  const isPremium = userPlan === 'premium';

  // Refresh wallets on mount
  useEffect(() => {
    if (wallets.length > 0) {
      refreshAllWallets();
    }
  }, []);

  const handleCreateWallet = async (network: string, name?: string) => {
    try {
      const newWallet = await createWallet(network, name);
      setIsCreateModalOpen(false);
      toast.success(`${network} wallet created successfully!`);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  const handleSendTransaction = async (
    wallet: Web3Wallet,
    recipient: string,
    amount: string,
    memo?: string
  ) => {
    try {
      await sendTransaction(wallet, recipient, amount, memo);
      setIsSendModalOpen(false);
      toast.success('Transaction sent successfully!');
    } catch (error) {
      console.error('Failed to send transaction:', error);
    }
  };

  const handleRefreshWallet = async (wallet: Web3Wallet) => {
    try {
      await getBalance(wallet);
      await getTransactions(wallet);
      toast.success('Wallet refreshed!');
    } catch (error) {
      console.error('Failed to refresh wallet:', error);
    }
  };

  const totalBalance = wallets.reduce((sum, wallet) => {
    return sum + parseFloat(wallet.balance || '0');
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-satotrack-text mb-2">
            🚀 Web3 Dashboard
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas carteiras cripto com segurança total
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={refreshAllWallets}
            variant="outline"
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
          >
            <Plus className="h-4 w-4" />
            Nova Carteira
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Carteiras</p>
                <p className="text-2xl font-bold text-blue-400">{wallets.length}</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Estimado</p>
                <p className="text-2xl font-bold text-green-400">
                  ${totalBalance.toFixed(6)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transações</p>
                <p className="text-2xl font-bold text-purple-400">{transactions.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Redes Ativas</p>
                <p className="text-2xl font-bold text-orange-400">
                  {new Set(wallets.map(w => w.network)).size}
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-dashboard-medium">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="wallets">Carteiras</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="tools">Ferramentas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Web3Overview wallets={wallets} transactions={transactions} />
        </TabsContent>

        <TabsContent value="wallets" className="space-y-6">
          {wallets.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent>
                <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma carteira encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  Crie sua primeira carteira Web3 para começar
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Carteira
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wallets.map((wallet) => (
                <WalletCard
                  key={wallet.id}
                  wallet={wallet}
                  onSend={() => {
                    setSelectedWallet(wallet);
                    setIsSendModalOpen(true);
                  }}
                  onReceive={() => {
                    setSelectedWallet(wallet);
                    setIsReceiveModalOpen(true);
                  }}
                  onRefresh={() => handleRefreshWallet(wallet)}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <TransactionHistory transactions={transactions} />
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-satotrack-neon" />
              <h3 className="text-lg font-semibold mb-2">Backup de Carteiras</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Exporte suas chaves privadas com segurança
              </p>
              <Button variant="outline" disabled>
                Em breve
              </Button>
            </Card>

            <Card className="p-6 text-center">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-satotrack-neon" />
              <h3 className="text-lg font-semibold mb-2">QR Scanner</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Escaneie endereços para envio rápido
              </p>
              <Button variant="outline" disabled>
                Em breve
              </Button>
            </Card>

            <Card className="p-6 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-satotrack-neon" />
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Análise avançada de portfólio
              </p>
              <Button variant="outline" disabled>
                Em breve
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateWalletModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateWallet={handleCreateWallet}
        supportedNetworks={SUPPORTED_NETWORKS}
        isLoading={isLoading}
      />

      {selectedWallet && (
        <>
          <SendTransactionModal
            isOpen={isSendModalOpen}
            onClose={() => {
              setIsSendModalOpen(false);
              setSelectedWallet(null);
            }}
            wallet={selectedWallet}
            onSendTransaction={handleSendTransaction}
            isLoading={isLoading}
          />

          <ReceiveModal
            isOpen={isReceiveModalOpen}
            onClose={() => {
              setIsReceiveModalOpen(false);
              setSelectedWallet(null);
            }}
            wallet={selectedWallet}
          />
        </>
      )}
    </div>
  );
};

export default Web3Dashboard;
