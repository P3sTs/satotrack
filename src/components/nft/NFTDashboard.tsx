
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet,
  Plus,
  Image,
  Send,
  Store,
  Settings,
  Shield,
  Zap
} from 'lucide-react';
import WalletManager from './WalletManager';
import CollectionManager from './CollectionManager';
import NFTMinter from './NFTMinter';
import NFTViewer from './NFTViewer';
import NFTTransfer from './NFTTransfer';
import NFTMarketplace from './NFTMarketplace';
import AdminPanel from './AdminPanel';
import { useAuth } from '@/contexts/auth';

const NFTDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('wallets');
  const { user, userPlan } = useAuth();
  const isPremium = userPlan === 'premium';

  const tabs = [
    {
      id: 'wallets',
      label: 'Carteiras',
      icon: Wallet,
      description: 'Gerenciar carteiras Web3',
      component: WalletManager
    },
    {
      id: 'collections',
      label: 'Coleções',
      icon: Plus,
      description: 'Criar e gerenciar coleções NFT',
      component: CollectionManager
    },
    {
      id: 'mint',
      label: 'Mint NFT',
      icon: Image,
      description: 'Criar novos NFTs com metadata',
      component: NFTMinter
    },
    {
      id: 'my-nfts',
      label: 'Meus NFTs',
      icon: Shield,
      description: 'Visualizar NFTs owned',
      component: NFTViewer
    },
    {
      id: 'transfer',
      label: 'Transferir',
      icon: Send,
      description: 'Enviar NFTs para outras carteiras',
      component: NFTTransfer
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: Store,
      description: 'Vitrine pública de coleções',
      component: NFTMarketplace
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Settings,
      description: 'Painel administrativo',
      component: AdminPanel,
      adminOnly: true
    }
  ];

  const availableTabs = tabs.filter(tab => {
    if (tab.adminOnly && user?.id !== '8cd63bda-79d7-4cf2-8525-bce3e0a95e37') return false;
    return true;
  });

  const currentTab = availableTabs.find(tab => tab.id === activeTab);
  const TabComponent = currentTab?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-satotrack-neon to-purple-400 flex items-center justify-center">
                <Image className="h-6 w-6 text-black" />
              </div>
              Sistema NFT Tatum
            </h1>
            <p className="text-muted-foreground">
              Plataforma completa para criação, gestão e comercialização de NFTs
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon">
              <Zap className="h-3 w-3 mr-1" />
              Tatum API
            </Badge>
            {isPremium && (
              <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                Premium
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Carteiras</p>
                  <p className="text-2xl font-bold text-blue-400">3</p>
                </div>
                <Wallet className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Coleções</p>
                  <p className="text-2xl font-bold text-green-400">2</p>
                </div>
                <Plus className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">NFTs Mintados</p>
                  <p className="text-2xl font-bold text-purple-400">15</p>
                </div>
                <Image className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transferências</p>
                  <p className="text-2xl font-bold text-orange-400">8</p>
                </div>
                <Send className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative p-4 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-satotrack-neon text-black shadow-lg scale-105' 
                    : 'bg-dashboard-medium/30 border border-dashboard-light/30 text-muted-foreground hover:border-satotrack-neon/50 hover:text-white'
                }`}
              >
                <div className="text-center space-y-2">
                  <div className={`w-8 h-8 mx-auto ${isActive ? 'text-black' : 'text-satotrack-neon'}`}>
                    <Icon className="w-full h-full" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{tab.label}</p>
                    <p className={`text-xs ${isActive ? 'text-black/80' : 'text-muted-foreground'}`}>
                      {tab.description.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              {currentTab && (
                <>
                  <div className="w-8 h-8 rounded-lg bg-satotrack-neon flex items-center justify-center">
                    <currentTab.icon className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {currentTab.label}
                    </div>
                    <p className="text-sm text-muted-foreground font-normal">
                      {currentTab.description}
                    </p>
                  </div>
                </>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {TabComponent && <TabComponent />}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-blue-300">🔥 Recursos NFT via Tatum:</p>
                <ul className="text-blue-200 space-y-1 text-xs">
                  <li>• Criação de carteiras Web3 seguras (Ethereum, Polygon, BNB)</li>
                  <li>• Deploy de coleções ERC-721 personalizadas</li>
                  <li>• Upload automático para IPFS (Pinata/Web3.storage)</li>
                  <li>• Mint de NFTs com metadata completa</li>
                  <li>• Transferência P2P com confirmação blockchain</li>
                  <li>• Marketplace público com sistema de verificação</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NFTDashboard;
