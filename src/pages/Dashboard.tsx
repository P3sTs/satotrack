import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useMultiChainWallets } from '@/hooks/useMultiChainWallets';
import NativeHeader from '@/components/mobile/NativeHeader';
import NativeActionButtons from '@/components/mobile/NativeActionButtons';
import NativeTabs from '@/components/mobile/NativeTabs';
import CryptoListItem from '@/components/mobile/CryptoListItem';
import NativeBottomNav from '@/components/mobile/NativeBottomNav';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('crypto');
  
  const {
    wallets,
    isLoading,
    generationStatus,
    hasGeneratedWallets,
    generateWallets,
    refreshAllBalances
  } = useMultiChainWallets();

  // Mock crypto data replicating the image
  const cryptoData = [
    {
      symbol: 'PENGU',
      name: 'Solana',
      network: 'Solana',
      price: 'R$ 0,08',
      change: 7.46,
      amount: '154.658494',
      value: 'R$ 13,89',
      icon: 'PENGU'
    },
    {
      symbol: 'BNB',
      name: 'BNB Beacon Chain',
      network: 'BNB Beacon Chain',
      price: 'R$ 3.575,20',
      change: 0.21,
      amount: '0',
      value: 'R$0.00',
      icon: 'BNB'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      network: 'Bitcoin',
      price: 'R$ 590.594,41',
      change: 0.23,
      amount: '0',
      value: 'R$0.00',
      icon: 'BTC'
    },
    {
      symbol: 'DOGE',
      name: 'Dogecoin',
      network: 'Dogecoin',
      price: 'R$ 0,92',
      change: 0.58,
      amount: '0',
      value: 'R$0.00',
      icon: 'DOGE'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      network: 'Ethereum',
      price: 'R$ 13.937,58',
      change: 0.36,
      amount: '0',
      value: 'R$0.00',
      icon: 'ETH'
    },
    {
      symbol: 'POL',
      name: 'Polygon',
      network: 'Polygon',
      price: 'R$ 1,01',
      change: -1.67,
      amount: '0',
      value: 'R$0.00',
      icon: 'POL'
    }
  ];

  const tabs = [
    { id: 'crypto', label: 'Criptomoeda' },
    { id: 'nfts', label: 'NFTs' }
  ];

  return (
    <div className="min-h-screen bg-dashboard-dark pb-20">
      {/* Header */}
      <NativeHeader title="minha chave" />
      
      {/* Main Content */}
      <div className="pt-16">
        {/* Balance Section */}
        <div className="text-center py-8 px-6">
          <div className="text-4xl font-bold text-white mb-2">
            R$ 13,89
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-emerald-400 text-sm">↗ R$ 0,96 (+7,46%)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <NativeActionButtons />

        {/* Tabs */}
        <NativeTabs 
          tabs={tabs} 
          defaultTab="crypto"
          onTabChange={setActiveTab}
        />

        {/* Crypto List */}
        <div className="divide-y divide-dashboard-medium/20">
          {activeTab === 'crypto' && cryptoData.map((crypto, index) => (
            <CryptoListItem
              key={index}
              symbol={crypto.symbol}
              name={crypto.name}
              network={crypto.network}
              price={crypto.price}
              change={crypto.change}
              amount={crypto.amount}
              value={crypto.value}
              icon={crypto.icon}
            />
          ))}
          
          {activeTab === 'nfts' && (
            <div className="py-12 text-center">
              <p className="text-satotrack-text">Nenhum NFT encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <NativeBottomNav />
    </div>
  );
};

export default Dashboard;