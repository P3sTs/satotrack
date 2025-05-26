
export interface NetworkInfo {
  id: string;
  name: string;
  symbol: string;
  chainId: string;
  explorerUrl: string;
}

export interface DetectedAddress {
  address: string;
  network: NetworkInfo;
  addressType: string;
  isValid: boolean;
}

// Padrões de regex para diferentes tipos de endereços
const ADDRESS_PATTERNS = {
  // Bitcoin
  bitcoin: {
    legacy: /^[1][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    segwit: /^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    bech32: /^(bc1)[a-zA-HJ-NP-Z0-9]{25,89}$/,
    testnet: /^(tb1|[mn2])[a-zA-HJ-NP-Z0-9]{25,89}$/
  },
  // Ethereum e redes compatíveis (BSC, Polygon, Arbitrum, etc.)
  ethereum: /^0x[a-fA-F0-9]{40}$/,
  // Solana
  solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  // Avalanche (formato similar ao Ethereum)
  avalanche: /^0x[a-fA-F0-9]{40}$/
};

const NETWORKS: Record<string, NetworkInfo> = {
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    chainId: 'bitcoin',
    explorerUrl: 'https://blockchain.info'
  },
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    chainId: 'ethereum',
    explorerUrl: 'https://etherscan.io'
  },
  bsc: {
    id: 'bsc',
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    chainId: 'bsc',
    explorerUrl: 'https://bscscan.com'
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    chainId: 'polygon',
    explorerUrl: 'https://polygonscan.com'
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    chainId: 'solana',
    explorerUrl: 'https://explorer.solana.com'
  },
  avalanche: {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    chainId: 'avalanche',
    explorerUrl: 'https://snowtrace.io'
  },
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ARB',
    chainId: 'arbitrum',
    explorerUrl: 'https://arbiscan.io'
  },
  optimism: {
    id: 'optimism',
    name: 'Optimism',
    symbol: 'OP',
    chainId: 'optimism',
    explorerUrl: 'https://optimistic.etherscan.io'
  }
};

export const detectAddressNetwork = (address: string): DetectedAddress | null => {
  if (!address || typeof address !== 'string') {
    return null;
  }

  const cleanAddress = address.trim();

  // Bitcoin
  if (ADDRESS_PATTERNS.bitcoin.legacy.test(cleanAddress)) {
    return {
      address: cleanAddress,
      network: NETWORKS.bitcoin,
      addressType: 'legacy',
      isValid: true
    };
  }

  if (ADDRESS_PATTERNS.bitcoin.segwit.test(cleanAddress)) {
    return {
      address: cleanAddress,
      network: NETWORKS.bitcoin,
      addressType: 'segwit',
      isValid: true
    };
  }

  if (ADDRESS_PATTERNS.bitcoin.bech32.test(cleanAddress)) {
    return {
      address: cleanAddress,
      network: NETWORKS.bitcoin,
      addressType: 'bech32',
      isValid: true
    };
  }

  // Ethereum e redes compatíveis EVM
  if (ADDRESS_PATTERNS.ethereum.test(cleanAddress)) {
    // Para endereços Ethereum, assumimos Ethereum mainnet por padrão
    // Em uma implementação mais avançada, poderíamos verificar em qual rede o endereço tem atividade
    return {
      address: cleanAddress,
      network: NETWORKS.ethereum,
      addressType: 'evm',
      isValid: true
    };
  }

  // Solana
  if (ADDRESS_PATTERNS.solana.test(cleanAddress)) {
    // Verificação adicional para Solana (excluir endereços que parecem Bitcoin)
    if (!cleanAddress.match(/^[13]/)) {
      return {
        address: cleanAddress,
        network: NETWORKS.solana,
        addressType: 'base58',
        isValid: true
      };
    }
  }

  return null;
};

export const validateAddress = (address: string, networkId?: string): boolean => {
  const detected = detectAddressNetwork(address);
  
  if (!detected) return false;
  
  if (networkId) {
    return detected.network.id === networkId;
  }
  
  return detected.isValid;
};

export const getSupportedNetworks = (): NetworkInfo[] => {
  return Object.values(NETWORKS);
};
