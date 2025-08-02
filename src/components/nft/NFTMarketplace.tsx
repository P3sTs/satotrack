
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Store,
  Image,
  ExternalLink,
  Search,
  Filter,
  Verified,
  TrendingUp,
  Eye,
  Heart,
  DollarSign
} from 'lucide-react';

interface MarketplaceCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  floorPrice: string;
  totalVolume: string;
  owners: number;
  totalItems: number;
  network: string;
  isVerified: boolean;
  creator: string;
}

const NFTMarketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [sortBy, setSortBy] = useState('volume');

  const marketplaceCollections: MarketplaceCollection[] = [
    {
      id: '1',
      name: 'SatoTracker Genesis',
      description: 'Primeira coleção oficial do SatoTracker com utilidades exclusivas',
      image: '/api/placeholder/300/300',
      floorPrice: '0.5',
      totalVolume: '125.8',
      owners: 247,
      totalItems: 1000,
      network: 'ethereum',
      isVerified: true,
      creator: 'SatoTracker Team'
    },
    {
      id: '2',
      name: 'Crypto Art Collection',
      description: 'Arte digital única criada por artistas independentes',
      image: '/api/placeholder/300/300',
      floorPrice: '0.1',
      totalVolume: '45.2',
      owners: 89,
      totalItems: 250,
      network: 'polygon',
      isVerified: false,
      creator: 'Crypto Artists'
    },
    {
      id: '3',
      name: 'Digital Legends',
      description: 'Coleção de personagens lendários do mundo digital',
      image: '/api/placeholder/300/300',
      floorPrice: '0.8',
      totalVolume: '89.7',
      owners: 156,
      totalItems: 500,
      network: 'ethereum',
      isVerified: true,
      creator: 'Legend Studios'
    }
  ];

  const networks = [
    { id: 'all', name: 'Todas as Redes' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'polygon', name: 'Polygon' },
    { id: 'bsc', name: 'BNB Chain' }
  ];

  const sortOptions = [
    { id: 'volume', name: 'Volume Total' },
    { id: 'floor', name: 'Floor Price' },
    { id: 'owners', name: 'Proprietários' },
    { id: 'items', name: 'Total de Items' }
  ];

  const filteredCollections = marketplaceCollections
    .filter(collection => {
      const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           collection.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNetwork = selectedNetwork === 'all' || collection.network === selectedNetwork;
      return matchesSearch && matchesNetwork;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return parseFloat(b.totalVolume) - parseFloat(a.totalVolume);
        case 'floor':
          return parseFloat(b.floorPrice) - parseFloat(a.floorPrice);
        case 'owners':
          return b.owners - a.owners;
        case 'items':
          return b.totalItems - a.totalItems;
        default:
          return 0;
      }
    });

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'ethereum': return 'text-blue-400 border-blue-400/30';
      case 'polygon': return 'text-purple-400 border-purple-400/30';
      case 'bsc': return 'text-yellow-400 border-yellow-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Marketplace NFT</h2>
          <p className="text-muted-foreground">Descubra e explore coleções NFT verificadas</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="border-satotrack-neon/30 text-satotrack-neon">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Mais Visualizados
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <Label className="text-sm text-muted-foreground">Buscar Coleções</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nome ou descrição..."
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

        <div className="min-w-[150px]">
          <Label className="text-sm text-muted-foreground">Ordenar por</Label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-2 rounded-md bg-dashboard-medium border border-dashboard-light text-white"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-satotrack-neon/10 to-green-500/10 border-satotrack-neon/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-satotrack-neon">{filteredCollections.length}</p>
            <p className="text-sm text-muted-foreground">Coleções Ativas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">
              {filteredCollections.reduce((sum, c) => sum + c.totalItems, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total NFTs</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {filteredCollections.reduce((sum, c) => sum + c.owners, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Proprietários</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              {filteredCollections.reduce((sum, c) => sum + parseFloat(c.totalVolume), 0).toFixed(1)} ETH
            </p>
            <p className="text-sm text-muted-foreground">Volume Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.map((collection) => (
          <Card key={collection.id} className="bg-dashboard-dark/50 border-dashboard-light/20 overflow-hidden hover:border-satotrack-neon/30 transition-all duration-200">
            <div className="aspect-video bg-gradient-to-br from-satotrack-neon/20 to-purple-500/20 flex items-center justify-center">
              <Image className="h-16 w-16 text-satotrack-neon" />
            </div>
            
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white">{collection.name}</h3>
                  {collection.isVerified && (
                    <Verified className="h-4 w-4 text-blue-400" />
                  )}
                </div>
                <Badge variant="outline" className={`text-xs ${getNetworkColor(collection.network)}`}>
                  {collection.network.toUpperCase()}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {collection.description}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-dashboard-medium/30 rounded">
                  <p className="text-satotrack-neon font-bold">{collection.floorPrice} ETH</p>
                  <p className="text-muted-foreground">Floor Price</p>
                </div>
                <div className="text-center p-2 bg-dashboard-medium/30 rounded">
                  <p className="text-purple-400 font-bold">{collection.totalVolume} ETH</p>
                  <p className="text-muted-foreground">Volume</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-white font-medium">{collection.owners}</p>
                  <p className="text-muted-foreground text-xs">Proprietários</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">{collection.totalItems}</p>
                  <p className="text-muted-foreground text-xs">Items</p>
                </div>
              </div>

              <div className="p-2 bg-dashboard-medium/30 rounded">
                <p className="text-xs text-muted-foreground">Criador</p>
                <p className="text-white text-sm font-medium">{collection.creator}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-2" />
                  Visualizar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  OpenSea
                </Button>
              </div>

              <Button className="w-full bg-gradient-to-r from-satotrack-neon to-green-400 text-black">
                <Store className="h-4 w-4 mr-2" />
                Explorar Coleção
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCollections.length === 0 && (
        <div className="text-center py-12">
          <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">Nenhuma coleção encontrada</p>
          <p className="text-sm text-muted-foreground">
            Tente ajustar os filtros ou buscar por outros termos
          </p>
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Store className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-300">🛍️ Marketplace Descentralizado:</p>
              <ul className="text-blue-200 space-y-1 text-xs">
                <li>• Coleções verificadas pela comunidade</li>
                <li>• Integração direta com OpenSea e marketplaces principais</li>
                <li>• Dados de preço e volume em tempo real via Tatum</li>
                <li>• Suporte para múltiplas redes blockchain</li>
                <li>• Sistema de avaliação e reputação</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTMarketplace;
