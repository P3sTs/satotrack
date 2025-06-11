
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet, polygon, bsc, avalanche } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAccount, useBalance, useDisconnect } from 'wagmi';

// Query client for React Query
const queryClient = new QueryClient();

// Project ID from WalletConnect Cloud
const projectId = 'your-walletconnect-project-id';

// Chains configuration
const chains = [mainnet, arbitrum, polygon, bsc, avalanche] as const;

// Wagmi config
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata: {
    name: 'SatoTracker',
    description: 'Advanced Crypto Portfolio Tracker',
    url: 'https://satotrack.lovable.app',
    icons: ['https://satotrack.lovable.app/favicon.ico']
  }
});

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true
});

interface Web3ContextType {
  isConnected: boolean;
  address?: string;
  balance?: string;
  chainId?: number;
  connect: () => void;
  disconnect: () => void;
  switchNetwork: (chainId: number) => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

const Web3ProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected, chainId } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const connect = () => {
    setIsModalOpen(true);
    // Web3Modal will handle the connection
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const switchNetwork = (targetChainId: number) => {
    // This will be implemented when user tries to switch
    console.log('Switching to chain:', targetChainId);
  };

  const value: Web3ContextType = {
    isConnected,
    address,
    balance: balance?.formatted,
    chainId,
    connect,
    disconnect: handleDisconnect,
    switchNetwork
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3ProviderInner>
          {children}
        </Web3ProviderInner>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
