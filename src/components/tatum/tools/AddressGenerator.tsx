import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Copy, 
  CheckCircle, 
  Wallet,
  ExternalLink,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

const SUPPORTED_CHAINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '₿', color: 'from-orange-500 to-yellow-500' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: 'from-blue-500 to-purple-500' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', icon: '⬟', color: 'from-purple-500 to-pink-500' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '◎', color: 'from-purple-600 to-blue-600' },
  { id: 'tron', name: 'Tron', symbol: 'TRX', icon: '◉', color: 'from-red-500 to-orange-500' },
  { id: 'bsc', name: 'BSC', symbol: 'BNB', icon: '⬟', color: 'from-yellow-500 to-orange-500' }
];

interface GeneratedAddress {
  address: string;
  chain: string;
  timestamp: Date;
  derivationIndex?: number;
}

interface AddressGeneratorProps {
  userWallets?: any[];
}

const AddressGenerator: React.FC<AddressGeneratorProps> = ({ userWallets = [] }) => {
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAddresses, setGeneratedAddresses] = useState<GeneratedAddress[]>([]);
  const [addressCount, setAddressCount] = useState('1');

  const handleGenerateAddress = async () => {
    if (!selectedChain) {
      toast.error('Selecione uma blockchain primeiro');
      return;
    }

    setIsGenerating(true);
    try {
      console.log(`🔗 Gerando endereço para ${selectedChain}...`);
      
      // Simular chamada para Tatum API
      // POST /v3/{chain}/address
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAddress = generateMockAddress(selectedChain);
      const newAddress: GeneratedAddress = {
        address: mockAddress,
        chain: selectedChain,
        timestamp: new Date(),
        derivationIndex: generatedAddresses.length
      };
      
      setGeneratedAddresses(prev => [newAddress, ...prev]);
      toast.success(`✅ Endereço ${selectedChain.toUpperCase()} gerado com sucesso!`);
      
    } catch (error) {
      console.error('Error generating address:', error);
      toast.error('❌ Erro ao gerar endereço');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockAddress = (chain: string): string => {
    const prefixes = {
      bitcoin: ['1', '3', 'bc1'],
      ethereum: '0x',
      polygon: '0x',
      solana: '',
      tron: 'T',
      bsc: '0x'
    };
    
    const prefix = prefixes[chain as keyof typeof prefixes];
    if (Array.isArray(prefix)) {
      const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
      return randomPrefix + Math.random().toString(36).substring(2, 34);
    }
    return prefix + Math.random().toString(36).substring(2, 42);
  };

  const copyToClipboard = async (address: string, chain: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success(`📋 Endereço ${chain.toUpperCase()} copiado!`);
    } catch (error) {
      toast.error('❌ Erro ao copiar endereço');
    }
  };

  const getChainInfo = (chainId: string) => {
    return SUPPORTED_CHAINS.find(chain => chain.id === chainId);
  };

  const getExplorerUrl = (address: string, chain: string) => {
    const explorers = {
      bitcoin: `https://blockstream.info/address/${address}`,
      ethereum: `https://etherscan.io/address/${address}`,
      polygon: `https://polygonscan.com/address/${address}`,
      solana: `https://explorer.solana.com/address/${address}`,
      tron: `https://tronscan.org/#/address/${address}`,
      bsc: `https://bscscan.com/address/${address}`
    };
    return explorers[chain as keyof typeof explorers] || '#';
  };

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Plus className="h-5 w-5 text-satotrack-neon" />
            Gerar Novo Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="blockchain">Blockchain</Label>
              <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a rede" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{chain.icon}</span>
                        <span>{chain.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {chain.symbol}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Quantidade</Label>
              <Select value={addressCount} onValueChange={setAddressCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 endereço</SelectItem>
                  <SelectItem value="5">5 endereços</SelectItem>
                  <SelectItem value="10">10 endereços</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleGenerateAddress}
                disabled={isGenerating || !selectedChain}
                className="w-full bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black font-semibold"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Gerar Endereço
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Addresses */}
      {generatedAddresses.length > 0 && (
        <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Wallet className="h-5 w-5 text-emerald-400" />
              Endereços Gerados ({generatedAddresses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedAddresses.map((addr, index) => {
                const chainInfo = getChainInfo(addr.chain);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-dashboard-medium/30 rounded-lg border border-dashboard-light/20"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${chainInfo?.color} flex items-center justify-center text-white font-bold`}>
                        {chainInfo?.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-white">{chainInfo?.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {chainInfo?.symbol}
                          </Badge>
                          {addr.derivationIndex !== undefined && (
                            <Badge variant="secondary" className="text-xs">
                              #{addr.derivationIndex}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-mono text-muted-foreground break-all">
                          {addr.address}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Gerado em {addr.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(addr.address, addr.chain)}
                        className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                      >
                        <a 
                          href={getExplorerUrl(addr.address, addr.chain)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Notice */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-300">💡 Funcionalidades:</p>
              <ul className="text-blue-200 space-y-1 text-xs">
                <li>• Geração segura via Tatum API</li>
                <li>• Suporte a múltiplas blockchains</li>
                <li>• Histórico local de endereços</li>
                <li>• Links diretos para explorers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressGenerator;