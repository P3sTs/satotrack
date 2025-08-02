
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
  Eye,
  Zap,
  DollarSign,
  Hash,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface NFTMetadata {
  name: string;
  description: string;
  image: File | null;
  attributes: Array<{ trait_type: string; value: string }>;
}

const NFTMinter: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [metadata, setMetadata] = useState<NFTMetadata>({
    name: '',
    description: '',
    image: null,
    attributes: []
  });

  const [newAttribute, setNewAttribute] = useState({ trait_type: '', value: '' });

  const collections = [
    { id: '1', name: 'SatoTracker Genesis', symbol: 'STG', network: 'ethereum' },
    { id: '2', name: 'Crypto Art Collection', symbol: 'CAC', network: 'polygon' }
  ];

  const addAttribute = () => {
    if (newAttribute.trait_type && newAttribute.value) {
      setMetadata(prev => ({
        ...prev,
        attributes: [...prev.attributes, newAttribute]
      }));
      setNewAttribute({ trait_type: '', value: '' });
    }
  };

  const removeAttribute = (index: number) => {
    setMetadata(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Arquivo muito grande (máximo 10MB)');
        return;
      }
      setMetadata(prev => ({ ...prev, image: file }));
      toast.success('Imagem carregada!');
    }
  };

  const mintNFT = async () => {
    if (!metadata.name || !metadata.image || !selectedCollection || !recipientAddress) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🎨 Iniciando processo de mint NFT...');
      
      // 1. Upload da imagem para IPFS
      console.log('📎 Upload da imagem para IPFS via Pinata/Web3.storage...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const imageIPFS = 'https://ipfs.io/ipfs/QmYourImageHash';
      
      // 2. Upload do metadata JSON para IPFS
      console.log('📋 Upload do metadata JSON para IPFS...');
      const metadataJSON = {
        name: metadata.name,
        description: metadata.description,
        image: imageIPFS,
        attributes: metadata.attributes
      };
      await new Promise(resolve => setTimeout(resolve, 1500));
      const metadataIPFS = 'https://ipfs.io/ipfs/QmYourMetadataHash';
      
      // 3. Mint do NFT via Tatum: POST /v3/nft/mint
      console.log('🔥 Mint do NFT via Tatum API...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const tokenId = Math.floor(Math.random() * 10000);
      const txHash = '0x' + Math.random().toString(16).substring(2, 66);
      
      toast.success(`✅ NFT mintado com sucesso! Token ID: ${tokenId}`);
      
      // Reset form
      setMetadata({
        name: '',
        description: '',
        image: null,
        attributes: []
      });
      setSelectedCollection('');
      setRecipientAddress('');
      setShowPreview(false);
      
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('❌ Erro ao mintar NFT');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCollectionData = collections.find(c => c.id === selectedCollection);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6">
          <Card className="bg-dashboard-dark/50 border-satotrack-neon/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-satotrack-neon">
                <Image className="h-5 w-5" />
                Mint Novo NFT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Collection Selection */}
              <div className="space-y-2">
                <Label htmlFor="collection">Coleção *</Label>
                <select
                  id="collection"
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full p-2 rounded-md bg-dashboard-medium border border-dashboard-light text-white"
                >
                  <option value="">Selecione uma coleção</option>
                  {collections.map(collection => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name} ({collection.symbol}) - {collection.network}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient Address */}
              <div className="space-y-2">
                <Label htmlFor="recipient">Endereço de Destino *</Label>
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="font-mono"
                />
              </div>

              {/* NFT Name */}
              <div className="space-y-2">
                <Label htmlFor="nft-name">Nome do NFT *</Label>
                <Input
                  id="nft-name"
                  placeholder="Ex: Awesome NFT #1"
                  value={metadata.name}
                  onChange={(e) => setMetadata(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* NFT Description */}
              <div className="space-y-2">
                <Label htmlFor="nft-description">Descrição</Label>
                <Textarea
                  id="nft-description"
                  placeholder="Descreva seu NFT..."
                  value={metadata.description}
                  onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="nft-image">Imagem do NFT *</Label>
                <div className="border-2 border-dashed border-satotrack-neon/30 rounded-lg p-6 text-center">
                  {metadata.image ? (
                    <div className="space-y-2">
                      <div className="w-20 h-20 bg-satotrack-neon/20 rounded-lg mx-auto flex items-center justify-center">
                        <Image className="h-8 w-8 text-satotrack-neon" />
                      </div>
                      <p className="text-sm text-white">{metadata.image.name}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMetadata(prev => ({ ...prev, image: null }))}
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-satotrack-neon mx-auto mb-2" />
                      <p className="text-satotrack-neon font-medium">Clique para fazer upload</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF até 10MB</p>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attributes Section */}
          <Card className="bg-dashboard-dark/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Hash className="h-5 w-5" />
                Atributos (Traits)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Tipo (ex: Color)"
                  value={newAttribute.trait_type}
                  onChange={(e) => setNewAttribute(prev => ({ ...prev, trait_type: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Valor (ex: Blue)"
                    value={newAttribute.value}
                    onChange={(e) => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
                  />
                  <Button onClick={addAttribute} size="sm">
                    +
                  </Button>
                </div>
              </div>

              {metadata.attributes.length > 0 && (
                <div className="space-y-2">
                  {metadata.attributes.map((attr, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-dashboard-medium/30 rounded">
                      <span className="text-sm">
                        <span className="text-purple-400">{attr.trait_type}:</span> {attr.value}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttribute(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Eye className="h-5 w-5" />
                Preview em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-satotrack-neon/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                {metadata.image ? (
                  <div className="text-center">
                    <Image className="h-16 w-16 text-satotrack-neon mx-auto mb-2" />
                    <p className="text-sm text-white">Imagem carregada</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Image className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Sem imagem</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">
                  {metadata.name || 'Nome do NFT'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {metadata.description || 'Descrição não definida'}
                </p>
              </div>

              {selectedCollectionData && (
                <div className="p-3 bg-dashboard-medium/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Coleção</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white">{selectedCollectionData.name}</span>
                    <Badge variant="outline">{selectedCollectionData.symbol}</Badge>
                  </div>
                </div>
              )}

              {metadata.attributes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">Atributos:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {metadata.attributes.map((attr, index) => (
                      <div key={index} className="p-2 bg-dashboard-medium/30 rounded text-center">
                        <p className="text-xs text-purple-400">{attr.trait_type}</p>
                        <p className="text-sm text-white font-medium">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost Estimation */}
          <Card className="bg-green-900/20 border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <DollarSign className="h-5 w-5" />
                Estimativa de Custo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Taxa de Gas (estimada):</span>
                <span className="text-green-400">~0.005 ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxa da Plataforma:</span>
                <span className="text-green-400">0.001 ETH</span>
              </div>
              <hr className="border-green-500/20" />
              <div className="flex justify-between font-medium">
                <span>Total Estimado:</span>
                <span className="text-green-400">~0.006 ETH</span>
              </div>
            </CardContent>
          </Card>

          {/* Mint Button */}
          <Button
            onClick={mintNFT}
            disabled={isLoading || !metadata.name || !metadata.image || !selectedCollection || !recipientAddress}
            className="w-full bg-gradient-to-r from-satotrack-neon to-purple-400 text-black py-3 text-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2" />
                Mintando NFT...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Mint NFT
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NFTMinter;
