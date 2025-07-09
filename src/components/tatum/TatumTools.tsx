import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Send, 
  Download, 
  Coins, 
  Image, 
  Repeat, 
  QrCode, 
  Activity,
  Settings,
  TrendingUp,
  Shield
} from 'lucide-react';
import AddressGenerator from './tools/AddressGenerator';
import BalanceViewer from './tools/BalanceViewer';
import TransactionHistory from './tools/TransactionHistory';
import CryptoSender from './tools/CryptoSender';
import NFTManager from './tools/NFTManager';
import TokenSwap from './tools/TokenSwap';
import QRCodeGenerator from './tools/QRCodeGenerator';
import NetworkStatus from './tools/NetworkStatus';

interface TatumToolsProps {
  userWallets?: any[];
}

const TatumTools: React.FC<TatumToolsProps> = ({ userWallets = [] }) => {
  const [activeTab, setActiveTab] = useState('wallets');

  const tools = [
    {
      id: 'wallets',
      name: 'Carteiras',
      icon: Wallet,
      description: 'Geração e gerenciamento de endereços',
      component: AddressGenerator,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'balances',
      name: 'Saldos',
      icon: Coins,
      description: 'Visualização multi-token com conversão',
      component: BalanceViewer,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'transactions',
      name: 'Transações',
      icon: Activity,
      description: 'Histórico com filtros avançados',
      component: TransactionHistory,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'send',
      name: 'Enviar',
      icon: Send,
      description: 'Envio seguro de criptomoedas',
      component: CryptoSender,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'nfts',
      name: 'NFTs',
      icon: Image,
      description: 'Gerenciamento de tokens não-fungíveis',
      component: NFTManager,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'swap',
      name: 'Swap',
      icon: Repeat,
      description: 'Troca de tokens (Beta)',
      component: TokenSwap,
      color: 'from-yellow-500 to-yellow-600',
      beta: true
    },
    {
      id: 'qrcode',
      name: 'QR Code',
      icon: QrCode,
      description: 'Geração de códigos para pagamento',
      component: QRCodeGenerator,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'network',
      name: 'Rede',
      icon: TrendingUp,
      description: 'Status e monitoramento',
      component: NetworkStatus,
      color: 'from-cyan-500 to-cyan-600'
    }
  ];

  const getCurrentTool = () => {
    return tools.find(tool => tool.id === activeTab);
  };

  const currentTool = getCurrentTool();
  const ToolComponent = currentTool?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 flex items-center justify-center">
                <Settings className="h-6 w-6 text-black" />
              </div>
              Ferramentas Tatum
            </h1>
            <p className="text-muted-foreground">
              Suite completa de ferramentas Web3 para gerenciar seus ativos digitais
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              <Shield className="h-3 w-3 mr-1" />
              KMS Protegido
            </Badge>
            <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon">
              API Tatum
            </Badge>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTab === tool.id;
            
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`relative p-4 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r ' + tool.color + ' text-white shadow-lg scale-105' 
                    : 'bg-dashboard-medium/30 border border-dashboard-light/30 text-muted-foreground hover:border-satotrack-neon/50 hover:text-white'
                }`}
              >
                <div className="text-center space-y-2">
                  <div className={`w-8 h-8 mx-auto ${isActive ? 'text-white' : 'text-satotrack-neon'}`}>
                    <Icon className="w-full h-full" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center justify-center gap-1">
                      {tool.name}
                      {tool.beta && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          β
                        </Badge>
                      )}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {tool.description.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tool Content */}
        <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              {currentTool && (
                <>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${currentTool.color} flex items-center justify-center`}>
                    <currentTool.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {currentTool.name}
                      {currentTool.beta && (
                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                          Beta
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-normal">
                      {currentTool.description}
                    </p>
                  </div>
                </>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {ToolComponent && (
              <ToolComponent userWallets={userWallets} />
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-blue-300">🔐 Segurança Integrada</p>
                <ul className="text-blue-200 space-y-1 text-xs">
                  <li>• Todas as operações são protegidas pelo Tatum KMS</li>
                  <li>• Chaves privadas nunca ficam expostas no frontend</li>
                  <li>• Transações assinadas remotamente com máxima segurança</li>
                  <li>• Integração com biometria e PIN para autorização</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TatumTools;