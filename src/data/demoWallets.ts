export const demoWallets = [
  {
    id: 'demo-btc',
    name: 'Bitcoin Demo',
    symbol: 'BTC',
    balance: 0.05847,
    balanceUSD: 2847.23,
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    network: 'Bitcoin',
    icon: '₿',
    change24h: 2.34,
    isDemo: true
  },
  {
    id: 'demo-eth',
    name: 'Ethereum Demo',
    symbol: 'ETH',
    balance: 1.2456,
    balanceUSD: 4123.67,
    address: '0x742d35Cc6634C0532925a3b8D9cC5f2d2E3a5Cb1',
    network: 'Ethereum',
    icon: 'Ξ',
    change24h: -1.28,
    isDemo: true
  },
  {
    id: 'demo-sol',
    name: 'Solana Demo',
    symbol: 'SOL',
    balance: 15.789,
    balanceUSD: 1876.45,
    address: 'DemoWallet123456789SolanaAddress',
    network: 'Solana',
    icon: '◎',
    change24h: 5.67,
    isDemo: true
  },
  {
    id: 'demo-usdt',
    name: 'Tether Demo',
    symbol: 'USDT',
    balance: 1000.00,
    balanceUSD: 1000.00,
    address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    network: 'Ethereum',
    icon: '₮',
    change24h: 0.01,
    isDemo: true
  }
];

export const demoStats = {
  totalBalance: 9847.35,
  totalBalanceBRL: 52847.23,
  activeWallets: 4,
  totalTransactions: 127,
  activeNetworks: 3,
  securityScore: 85
};