
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Image,
  ExternalLink,
  Copy,
  Settings,
  Verified,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  description: string;
  contractAddress: string;
  network: string;
  totalSupply: number;
  imageUrl: string;
  isVerified: boolean;
  createdAt: string;
}

const CollectionManager: React.FC = () => {
  const [collections, setCollections] = useState<NFTCollection[]>([
    {
      id: '1',
      name: 'SatoTracker Genesis',
      symbol: 'STG',
      description: 'Primeira coleção oficial do SatoTracker',
      contractAddress: '0x' + Math.random().toString(16).substring(2, 42),
      network: 'ethereum',
      totalSupply: 1000,
      imageUrl: '/api/placeholder/300/300',
      isVerified: true,
      createdAt: '2024-01-15'
    }
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    network: 'ethereum',
    image: null as File | null
  });

  const networks = [
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
    { id: 'bsc', name: 'BNB Chain', symbol: 'BNB' }
  ];

  const handleCreateCollection = async () => {
    if (!formData.name || !formData.symbol) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      console.log('📦 Criando coleção NFT via Tatum API...');
      
      // Simular upload da imagem para IPFS
      console.log('📎 Upload da imagem para IPFS...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular deploy do contrato ERC-721: POST /v3/nft/deploy
      console.log('🚀 Deploy do contrato ERC-721...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newCollection: NFTCollection = {
        id: Date.now().toString(),
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        contractAddress: '0x' + Math.random().toString(16).substring(2, 42),
        network: formData.network,
        totalSupply: 0,
        imageUrl: '/api/placeholder/300/300',
        isVerified: false,
        createdAt: new Date().toLocaleDateString()
      };
      
      setCollections(prev => [...prev, newCollection]);
      setShowCreateForm(false);
      setFormData({ name: '', symbol: '', description: '', network: 'ethereum', image: null });
      
      toast.success(`✅ Coleção "${formData.name}" criada com sucesso!`);
      
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('❌ Erro ao criar coleção');
    } finally {
      setIsLoading(false);
    }
  };

  const copyContractAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Endereço do contrato copiado!');
  };

  const getNetworkInfo = (networkId: string) => {
    return networks.find(n => n.id === networkId) || networks[0];
  };

  return (
    <div className="space-y-6">
      {/* Create Collection Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Suas Coleções NFT</h2>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-satotrack-neon to-purple-400 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Coleção
        </Button>
      </div>

      {/* Create Collection Form */}
      {showCreateForm && (
        <Card className="bg-dashboard-dark/50 border-satotrack-neon/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-satotrack-neon">
              <Plus className="h-5 w-5" />
              Criar Nova Coleção NFT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collection-name">Nome da Coleção *</Label>
                <Input
                  id="collection-name"
                  placeholder="Ex: My Awesome NFTs"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collection-symbol">Símbolo *</Label>
                <Input
                  id="collection-symbol"
                  placeholder="Ex: MAN"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  maxLength={10}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection-description">Descrição</Label>
              <Textarea
                id="collection-description"
                placeholder="Descreva sua coleção NFT..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection-network">Rede Blockchain</Label>
              <select
                id="collection-network"
                value={formData.network}
                onChange={(e) => setFormData(prev => ({ ...prev, network: e.target.value }))}
                className="w-full p-2 rounded-md bg-dashboard-medium border border-dashboard-light text-white"
              >
                {networks.map(network => (
                  <option key={network.id} value={network.id}>
                    {network.name} ({network.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection-image">Imagem da Coleção</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="border-dashed border-satotrack-neon/30"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Escolher Arquivo
                </Button>
                <span className="text-sm text-muted-foreground">
                  PNG, JPG até 10MB
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateCollection}
                disabled={isLoading}
                className="bg-satotrack-neon text-black"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                    Criando Coleção...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Coleção
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => {
          const networkInfo = getNetworkInfo(collection.network);
          
          return (
            <Card key={collection.id} className="bg-dashboard-dark/50 border-dashboard-light/20 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-satotrack-neon/20 to-purple-500/20 flex items-center justify-center">
                <Image className="h-12 w-12 text-satotrack-neon" />
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white">{collection.name}</span>
                    {collection.isVerified && (
                      <Verified className="h-4 w-4 text-blue-400" />
                    )}
                  </div>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                    {collection.symbol}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {collection.description || 'Sem descrição'}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rede:</span>
                    <Badge variant="outline" className="text-xs">
                      {networkInfo.name}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Supply:</span>
                    <span className="text-white">{collection.totalSupply}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Criada em:</span>
                    <span className="text-white">{collection.createdAt}</span>
                  </div>
                </div>

                <div className="p-2 bg-dashboard-medium/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Contrato</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyContractAddress(collection.contractAddress)}
                      className="h-6 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-mono text-xs text-white break-all">
                    {collection.contractAddress.slice(0, 10)}...{collection.contractAddress.slice(-8)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-3 w-3 mr-2" />
                    Gerenciar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Explorer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {collections.length === 0 && (
        <div className="text-center py-12">
          <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Nenhuma coleção encontrada</p>
          <p className="text-sm text-muted-foreground">
            Crie sua primeira coleção NFT para começar
          </p>
        </div>
      )}
    </div>
  );
};

export default CollectionManager;
