
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

// Padrões de regex melhorados e mais específicos
const ADDRESS_PATTERNS = {
  // Bitcoin - padrões mais específicos
  bitcoin: {
    legacy: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    segwit: /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    bech32: /^(bc1|tb1)[a-zA-HJ-NP-Z0-9]{25,87}$/,
    taproot: /^(bc1p|tb1p)[a-zA-HJ-NP-Z0-9]{58}$/
  },
  // Ethereum e redes compatíveis EVM
  ethereum: /^0x[a-fA-F0-9]{40}$/,
  // Solana
  solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  // Litecoin
  litecoin: {
    legacy: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
    segwit: /^ltc1[a-zA-HJ-NP-Z0-9]{25,87}$/
  },
  // Dogecoin
  dogecoin: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/
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

const isBitcoinAddress = (address: string): { isValid: boolean; type: string } => {
  console.log('🔍 Verificando se é endereço Bitcoin:', address);
  
  if (ADDRESS_PATTERNS.bitcoin.legacy.test(address)) {
    console.log('✅ Bitcoin Legacy detectado');
    return { isValid: true, type: 'legacy' };
  }
  if (ADDRESS_PATTERNS.bitcoin.segwit.test(address)) {
    console.log('✅ Bitcoin SegWit detectado');
    return { isValid: true, type: 'segwit' };
  }
  if (ADDRESS_PATTERNS.bitcoin.bech32.test(address)) {
    console.log('✅ Bitcoin Bech32 detectado');
    return { isValid: true, type: 'bech32' };
  }
  if (ADDRESS_PATTERNS.bitcoin.taproot.test(address)) {
    console.log('✅ Bitcoin Taproot detectado');
    return { isValid: true, type: 'taproot' };
  }
  
  console.log('❌ Não é endereço Bitcoin');
  return { isValid: false, type: '' };
};

const isSolanaAddress = (address: string): boolean => {
  console.log('🔍 Verificando se é endereço Solana:', address);
  
  if (!ADDRESS_PATTERNS.solana.test(address)) {
    console.log('❌ Não passou no regex do Solana');
    return false;
  }
  
  if (address.match(/^[13]/)) {
    console.log('❌ Começa com 1 ou 3, provavelmente Bitcoin');
    return false;
  }
  
  if (address.startsWith('0x')) {
    console.log('❌ Começa com 0x, é Ethereum');
    return false;
  }
  
  if (address.length < 32 || address.length > 44) {
    console.log('❌ Tamanho inválido para Solana');
    return false;
  }
  
  console.log('✅ Endereço Solana válido');
  return true;
};

export const detectAddressNetwork = (address: string): DetectedAddress | null => {
  if (!address || typeof address !== 'string') {
    console.log('❌ Endereço vazio ou inválido');
    return null;
  }

  const cleanAddress = address.trim();
  console.log('🔍 Detectando rede para endereço:', cleanAddress);

  // Bitcoin - verificação prioritária
  const bitcoinCheck = isBitcoinAddress(cleanAddress);
  if (bitcoinCheck.isValid) {
    console.log('✅ Bitcoin detectado:', bitcoinCheck.type);
    return {
      address: cleanAddress,
      network: NETWORKS.bitcoin,
      addressType: bitcoinCheck.type,
      isValid: true
    };
  }

  // Ethereum e redes compatíveis EVM
  if (ADDRESS_PATTERNS.ethereum.test(cleanAddress)) {
    console.log('✅ Ethereum/EVM detectado');
    return {
      address: cleanAddress,
      network: NETWORKS.ethereum,
      addressType: 'evm',
      isValid: true
    };
  }

  // Solana
  if (isSolanaAddress(cleanAddress)) {
    console.log('✅ Solana detectado');
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
    console.log('✅ Litecoin detectado');
    return {
      address: cleanAddress,
      network: NETWORKS.litecoin,
      addressType: cleanAddress.startsWith('ltc1') ? 'segwit' : 'legacy',
      isValid: true
    };
  }

  // Dogecoin
  if (ADDRESS_PATTERNS.dogecoin.test(cleanAddress)) {
    console.log('✅ Dogecoin detectado');
    return {
      address: cleanAddress,
      network: NETWORKS.dogecoin,
      addressType: 'legacy',
      isValid: true
    };
  }

  console.log('❌ Nenhuma rede reconhecida para:', cleanAddress);
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
