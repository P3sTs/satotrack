import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Image, 
  Upload, 
  Send, 
  Eye,
  Palette,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface NFT {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  contractAddress: string;
  owner: string;
  metadata: any;
}

interface NFTManagerProps {
  userWallets?: any[];
}

const NFTManager: React.FC<NFTManagerProps> = ({ userWallets = [] }) => {
  const [activeTab, setActiveTab] = useState<'view' | 'mint' | 'transfer'>('view');
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mint form
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftImageUrl, setNftImageUrl] = useState('');
  const [mintToAddress, setMintToAddress] = useState('');

  // Transfer form
  const [selectedNFT, setSelectedNFT] = useState<string>('');
  const [transferToAddress, setTransferToAddress] = useState('');

  const handleViewNFTs = async () => {
    setIsLoading(true);
    try {
      console.log('🖼️ Buscando NFTs do usuário...');
      
      // Simular chamada Tatum API
      // GET /v3/nft/metadata/{chain}/{contractAddress}/{tokenId}
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockNFTs = generateMockNFTs();
      setUserNFTs(mockNFTs);
      
      toast.success(`✅ ${mockNFTs.length} NFTs encontrados`);
      
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      toast.error('❌ Erro ao buscar NFTs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMintNFT = async () => {
    if (!nftName || !nftDescription || !nftImageUrl || !mintToAddress) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🎨 Criando NFT via Tatum...', { nftName, nftDescription });
      
      // Simular chamada Tatum API
      // POST /v3/nft/mint
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newTokenId = Math.floor(Math.random() * 10000).toString();
      
      toast.success(`✅ NFT criado com sucesso! Token ID: ${newTokenId}`);
      
      // Reset form
      setNftName('');
      setNftDescription('');
      setNftImageUrl('');
      setMintToAddress('');
      
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('❌ Erro ao criar NFT');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferNFT = async () => {
    if (!selectedNFT || !transferToAddress) {
      toast.error('Selecione um NFT e endereço de destino');
      return;
    }

    setIsLoading(true);
    try {
      console.log('📤 Transferindo NFT...', { selectedNFT, transferToAddress });
      
      // Simular chamada Tatum API
      // POST /v3/nft/transfer
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      toast.success('✅ NFT transferido com sucesso!');
      
      setSelectedNFT('');
      setTransferToAddress('');
      
    } catch (error) {
      console.error('Error transferring NFT:', error);
      toast.error('❌ Erro ao transferir NFT');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockNFTs = (): NFT[] => {
    return [
      {
        tokenId: '1',
        name: 'SatoTracker Genesis',
        description: 'O primeiro NFT da coleção SatoTracker',
        image: '/api/placeholder/300/300',
        contractAddress: '0x' + Math.random().toString(16).substring(2, 42),
        owner: '0x742d35cc6632c0532925a3b8da4c0b07f3b5c7e2',
        metadata: { rarity: 'Legendary', created: '2024-01-01' }
      },
      {
        tokenId: '2',
        name: 'Crypto Wallet Art',
        description: 'Arte digital representando uma carteira cripto',
        image: '/api/placeholder/300/300',
        contractAddress: '0x' + Math.random().toString(16).substring(2, 42),
        owner: '0x742d35cc6632c0532925a3b8da4c0b07f3b5c7e2',
        metadata: { rarity: 'Rare', created: '2024-01-15' }
      }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-dashboard-dark/50 rounded-lg p-1">
        {[
          { id: 'view', label: 'Visualizar', icon: Eye },
          { id: 'mint', label: 'Criar NFT', icon: Palette },
          { id: 'transfer', label: 'Transferir', icon: Send }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-pink-500 text-white'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* View NFTs Tab */}
      {activeTab === 'view' && (
        <div className="space-y-4">
          <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Eye className="h-5 w-5 text-pink-400" />
                  Meus NFTs
                </div>
                <Button
                  onClick={handleViewNFTs}
                  disabled={isLoading}
                  variant="outline"
                  className="border-pink-500/30 text-pink-400"
                >
                  {isLoading ? 'Carregando...' : 'Atualizar'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userNFTs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userNFTs.map((nft) => (
                    <Card key={nft.tokenId} className="bg-dashboard-medium/30 border-dashboard-light/20">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg mb-3 flex items-center justify-center">
                          <Image className="h-12 w-12 text-pink-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-2">{nft.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{nft.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Token ID:</span>
                            <Badge variant="secondary">#{nft.tokenId}</Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-pink-500/30 text-pink-400"
                            asChild
                          >
                            <a href="#" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-2" />
                              Ver no OpenSea
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum NFT encontrado</p>
                  <p className="text-sm text-muted-foreground">Clique em "Atualizar" para buscar seus NFTs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mint NFT Tab */}
      {activeTab === 'mint' && (
        <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Palette className="h-5 w-5 text-pink-400" />
              Criar Novo NFT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nft-name">Nome do NFT</Label>
                <Input
                  id="nft-name"
                  placeholder="Ex: Minha Arte Digital"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mint-to">Endereço de Destino</Label>
                <Input
                  id="mint-to"
                  placeholder="0x..."
                  value={mintToAddress}
                  onChange={(e) => setMintToAddress(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nft-description">Descrição</Label>
              <Textarea
                id="nft-description"
                placeholder="Descreva seu NFT..."
                value={nftDescription}
                onChange={(e) => setNftDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nft-image">URL da Imagem</Label>
              <Input
                id="nft-image"
                placeholder="https://... ou IPFS hash"
                value={nftImageUrl}
                onChange={(e) => setNftImageUrl(e.target.value)}
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleMintNFT}
                disabled={isLoading || !nftName || !nftDescription || !nftImageUrl || !mintToAddress}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Criando NFT...
                  </>
                ) : (
                  <>
                    <Palette className="h-4 w-4 mr-2" />
                    Criar NFT
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transfer NFT Tab */}
      {activeTab === 'transfer' && (
        <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Send className="h-5 w-5 text-pink-400" />
              Transferir NFT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="select-nft">Selecionar NFT</Label>
                <select
                  id="select-nft"
                  value={selectedNFT}
                  onChange={(e) => setSelectedNFT(e.target.value)}
                  className="w-full p-2 rounded-md bg-dashboard-medium border border-dashboard-light text-white"
                >
                  <option value="">Escolha um NFT</option>
                  {userNFTs.map((nft) => (
                    <option key={nft.tokenId} value={nft.tokenId}>
                      {nft.name} (#{nft.tokenId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transfer-to">Endereço de Destino</Label>
                <Input
                  id="transfer-to"
                  placeholder="0x..."
                  value={transferToAddress}
                  onChange={(e) => setTransferToAddress(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleTransferNFT}
                disabled={isLoading || !selectedNFT || !transferToAddress}
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Transferindo...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Transferir NFT
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Info */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Image className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-300">🎨 Recursos NFT:</p>
              <ul className="text-blue-200 space-y-1 text-xs">
                <li>• Criação (mint) via Tatum API</li>
                <li>• Transferência segura entre carteiras</li>
                <li>• Visualização de metadados completos</li>
                <li>• Integração com marketplaces</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTManager;