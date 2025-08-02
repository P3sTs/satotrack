
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Image,
  ExternalLink,
  Send,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Hash,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface NFTItem {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  contractAddress: string;
  collection: string;
  network: string;
  attributes: Array<{ trait_type: string; value: string }>;
  owner: string;
  mintedAt: string;
}

const NFTViewer: React.FC = () => {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [walletAddress, setWalletAddress] = useState('');

  const networks = [
    { id: 'all', name: 'Todas as Redes' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'polygon', name: 'Polygon' },
    { id: 'bsc', name: 'BNB Chain' }
  ];

  useEffect(() => {
    // Carregar NFTs mock na inicialização
    setNfts([
      {
        tokenId: '1',
        name: 'SatoTracker Genesis #001',
        description: 'O primeiro NFT da coleção SatoTracker Genesis',
        image: '/api/placeholder/300/300',
        contractAddress: '0x' + Math.random().toString(16).substring(2, 42),
        collection: 'SatoTracker Genesis',
        network: 'ethereum',
        attributes: [
          { trait_type: 'Rarity', value: 'Legendary' },
          { trait_type: 'Background', value: 'Neon' },
          { trait_type: 'Type', value: 'Genesis' }
        ],
        owner: '0x742d35Cc6632C0532925a3b8DA4C0b07f3b5c7E2',
        mintedAt: '2024-01-15'
      },
      {
        tokenId: '42',
        name: 'Crypto Art #042',
        description: 'Arte digital única com elementos cripto',
        image: '/api/placeholder/300/300',
        contractAddress: '0x' + Math.random().toString(16).substring(2, 42),
        collection: 'Crypto Art Collection',
        network: 'polygon',
        attributes: [
          { trait_type: 'Style', value: 'Abstract' },
          { trait_type: 'Color', value: 'Blue' },
          { trait_type: 'Mood', value: 'Energetic' }
        ],
        owner: '0x742d35Cc6632C0532925a3b8DA4C0b07f3b5c7E2',
        mintedAt: '2024-01-20'
      }
    ]);
  }, []);

  const loadNFTsFromWallet = async () => {
    if (!walletAddress || !walletAddress.startsWith('0x')) {
      toast.error('Endereço de carteira inválido');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`👤 Carregando NFTs da carteira: ${walletAddress}`);
      
      // Simular chamada Tatum API: GET /v3/nft/owned/{chain}/{address}
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock de NFTs encontrados
      const foundNFTs: NFTItem[] = [
        {
          tokenId: Math.floor(Math.random() * 1000).toString(),
          name: `Found NFT #${Math.floor(Math.random() * 100)}`,
          description: 'NFT encontrado na carteira especificada',
          image: '/api/placeholder/300/300',
          contractAddress: '0x' + Math.random().toString(16).substring(2, 42),
          collection: 'External Collection',
          network: 'ethereum',
          attributes: [
            { trait_type: 'Source', value: 'External' },
            { trait_type: 'Type', value: 'Imported' }
          ],
          owner: walletAddress,
          mintedAt: '2024-01-10'
        }
      ];
      
      setNfts(prev => [...prev, ...foundNFTs]);
      toast.success(`✅ ${foundNFTs.length} NFTs encontrados!`);
      
    } catch (error) {
      console.error('Error loading NFTs:', error);
      toast.error('❌ Erro ao carregar NFTs');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAllNFTs = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Atualizando todos os NFTs...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('NFTs atualizados!');
    } catch (error) {
      console.error('Error refreshing NFTs:', error);
      toast.error('Erro ao atualizar NFTs');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.collection.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNetwork = selectedNetwork === 'all' || nft.network === selectedNetwork;
    return matchesSearch && matchesNetwork;
  });

  const openInExplorer = (nft: NFTItem) => {
    const explorerUrls = {
      ethereum: 'https://etherscan.io',
      polygon: 'https://polygonscan.com',
      bsc: 'https://bscscan.com'
    };
    const baseUrl = explorerUrls[nft.network] || explorerUrls.ethereum;
    window.open(`${baseUrl}/token/${nft.contractAddress}?a=${nft.tokenId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <Label className="text-sm text-muted-foreground">Buscar NFTs</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nome ou coleção..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="min-w-[150px]">
          <Label className="text-sm text-muted-foreground">Rede</Label>
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="w-full p-2 rounded-md bg-dashboard-medium border border-dashboard-light text-white"
          >
            {networks.map(network => (
              <option key={network.id} value={network.id}>
                {network.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={refreshAllNFTs}
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Load from External Wallet */}
      <Card className="bg-dashboard-dark/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Search className="h-5 w-5" />
            Carregar NFTs de Carteira
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Endereço da carteira (0x...)"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="font-mono"
            />
            <Button
              onClick={loadNFTsFromWallet}
              disabled={isLoading}
              className="bg-blue-500 text-white"
            >
              {isLoading ? 'Carregando...' : 'Buscar NFTs'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-dashboard-medium/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-satotrack-neon">{filteredNFTs.length}</p>
            <p className="text-sm text-muted-foreground">NFTs Encontrados</p>
          </CardContent>
        </Card>
        
        <Card className="bg-dashboard-medium/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">
              {new Set(filteredNFTs.map(nft => nft.collection)).size}
            </p>
            <p className="text-sm text-muted-foreground">Coleções</p>
          </CardContent>
        </Card>
        
        <Card className="bg-dashboard-medium/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {new Set(filteredNFTs.map(nft => nft.network)).size}
            </p>
            <p className="text-sm text-muted-foreground">Redes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-dashboard-medium/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              {filteredNFTs.reduce((sum, nft) => sum + nft.attributes.length, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Atributos Total</p>
          </CardContent>
        </Card>
      </div>

      {/* NFTs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNFTs.map((nft) => (
          <Card key={`${nft.contractAddress}-${nft.tokenId}`} className="bg-dashboard-dark/50 border-dashboard-light/20 overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-satotrack-neon/20 to-purple-500/20 flex items-center justify-center">
              <Image className="h-16 w-16 text-satotrack-neon" />
            </div>
            
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white truncate">{nft.name}</h3>
                <Badge variant="outline" className="text-xs">
                  #{nft.tokenId}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{nft.collection}</span>
                <Badge variant="outline" className={`text-xs ${
                  nft.network === 'ethereum' ? 'text-blue-400 border-blue-400/30' :
                  nft.network === 'polygon' ? 'text-purple-400 border-purple-400/30' :
                  'text-yellow-400 border-yellow-400/30'
                }`}>
                  {nft.network.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {nft.description}
              </p>

              {nft.attributes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    Atributos
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {nft.attributes.slice(0, 4).map((attr, index) => (
                      <div key={index} className="p-1 bg-dashboard-medium/30 rounded text-center">
                        <p className="text-xs text-purple-400">{attr.trait_type}</p>
                        <p className="text-xs text-white font-medium truncate">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                  {nft.attributes.length > 4 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{nft.attributes.length - 4} mais
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {nft.mintedAt}
                </div>
                <div className="font-mono">
                  {nft.contractAddress.slice(0, 6)}...{nft.contractAddress.slice(-4)}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => openInExplorer(nft)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Explorer
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Send className="h-3 w-3 mr-2" />
                  Transferir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNFTs.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">Nenhum NFT encontrado</p>
          <p className="text-sm text-muted-foreground">
            {searchTerm || selectedNetwork !== 'all' 
              ? 'Tente ajustar os filtros ou buscar por outros termos'
              : 'Carregue NFTs de uma carteira ou crie seus primeiros NFTs'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default NFTViewer;
