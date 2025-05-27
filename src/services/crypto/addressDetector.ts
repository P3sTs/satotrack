
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

// Padrões de regex melhorados para diferentes tipos de endereços
const ADDRESS_PATTERNS = {
  // Bitcoin - padrões mais precisos
  bitcoin: {
    legacy: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    segwit: /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    bech32: /^(bc1|tb1)[a-zA-HJ-NP-Z0-9]{25,87}$/,
    taproot: /^(bc1p|tb1p)[a-zA-HJ-NP-Z0-9]{58}$/
  },
  // Ethereum e redes compatíveis EVM
  ethereum: /^0x[a-fA-F0-9]{40}$/,
  // Solana - padrão mais específico
  solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  // Outros padrões específicos
  avalanche: /^0x[a-fA-F0-9]{40}$/,
  litecoin: {
    legacy: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
    segwit: /^ltc1[a-zA-HJ-NP-Z0-9]{25,87}$/
  },
  dogecoin: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/,
  monero: /^4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}$/
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
  },
  litecoin: {
    id: 'litecoin',
    name: 'Litecoin',
    symbol: 'LTC',
    chainId: 'litecoin',
    explorerUrl: 'https://blockchair.com/litecoin'
  },
  dogecoin: {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    chainId: 'dogecoin',
    explorerUrl: 'https://blockchair.com/dogecoin'
  }
};

// Função para detectar se é um endereço Bitcoin válido
const isBitcoinAddress = (address: string): { isValid: boolean; type: string } => {
  if (ADDRESS_PATTERNS.bitcoin.legacy.test(address)) {
    return { isValid: true, type: 'legacy' };
  }
  if (ADDRESS_PATTERNS.bitcoin.segwit.test(address)) {
    return { isValid: true, type: 'segwit' };
  }
  if (ADDRESS_PATTERNS.bitcoin.bech32.test(address)) {
    return { isValid: true, type: 'bech32' };
  }
  if (ADDRESS_PATTERNS.bitcoin.taproot.test(address)) {
    return { isValid: true, type: 'taproot' };
  }
  return { isValid: false, type: '' };
};

// Função para detectar se é um endereço Solana válido
const isSolanaAddress = (address: string): boolean => {
  // Verificações mais rigorosas para Solana
  if (!ADDRESS_PATTERNS.solana.test(address)) {
    return false;
  }
  
  // Excluir endereços que são claramente Bitcoin
  if (address.match(/^[13]/)) {
    return false;
  }
  
  // Verificar se não é um endereço Ethereum
  if (address.startsWith('0x')) {
    return false;
  }
  
  // Verificar tamanho típico de endereços Solana (32-44 caracteres)
  if (address.length < 32 || address.length > 44) {
    return false;
  }
  
  return true;
};

export const detectAddressNetwork = (address: string): DetectedAddress | null => {
  if (!address || typeof address !== 'string') {
    return null;
  }

  const cleanAddress = address.trim();
  
  console.log('Detecting address:', cleanAddress);

  // Bitcoin
  const bitcoinCheck = isBitcoinAddress(cleanAddress);
  if (bitcoinCheck.isValid) {
    console.log('Detected Bitcoin address:', bitcoinCheck.type);
    return {
      address: cleanAddress,
      network: NETWORKS.bitcoin,
      addressType: bitcoinCheck.type,
      isValid: true
    };
  }

  // Ethereum e redes compatíveis EVM
  if (ADDRESS_PATTERNS.ethereum.test(cleanAddress)) {
    console.log('Detected Ethereum address');
    return {
      address: cleanAddress,
      network: NETWORKS.ethereum,
      addressType: 'evm',
      isValid: true
    };
  }

  // Solana
  if (isSolanaAddress(cleanAddress)) {
    console.log('Detected Solana address');
    return {
      address: cleanAddress,
      network: NETWORKS.solana,
      addressType: 'base58',
      isValid: true
    };
  }

  // Litecoin
  if (ADDRESS_PATTERNS.litecoin.legacy.test(cleanAddress) || 
      ADDRESS_PATTERNS.litecoin.segwit.test(cleanAddress)) {
    console.log('Detected Litecoin address');
    return {
      address: cleanAddress,
      network: NETWORKS.litecoin,
      addressType: cleanAddress.startsWith('ltc1') ? 'segwit' : 'legacy',
      isValid: true
    };
  }

  // Dogecoin
  if (ADDRESS_PATTERNS.dogecoin.test(cleanAddress)) {
    console.log('Detected Dogecoin address');
    return {
      address: cleanAddress,
      network: NETWORKS.dogecoin,
      addressType: 'legacy',
      isValid: true
    };
  }

  console.log('Address not recognized:', cleanAddress);
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
