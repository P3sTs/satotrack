
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Send,
  Image,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface NFTItem {
  tokenId: string;
  name: string;
  image: string;
  collection: string;
  contractAddress: string;
  network: string;
}

const NFTTransfer: React.FC = () => {
  const [selectedNFT, setSelectedNFT] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [gasEstimate, setGasEstimate] = useState('0.002');

  // Mock NFTs do usuário
  const userNFTs: NFTItem[] = [
    {
      tokenId: '1',
      name: 'SatoTracker Genesis #001',
      image: '/api/placeholder/300/300',
      collection: 'SatoTracker Genesis',
      contractAddress: '0x742d35Cc6632C0532925a3b8DA4C0b07f3b5c7E2',
      network: 'ethereum'
    },
    {
      tokenId: '42',
      name: 'Crypto Art #042',
      image: '/api/placeholder/300/300',
      collection: 'Crypto Art Collection',
      contractAddress: '0x8ba1f109551bD432803012645Hac136c8d2BD1c7',
      network: 'polygon'
    }
  ];

  const selectedNFTData = userNFTs.find(nft => 
    `${nft.contractAddress}-${nft.tokenId}` === selectedNFT
  );

  const validateAddress = (address: string) => {
    return address.startsWith('0x') && address.length === 42;
  };

  const estimateGas = async () => {
    if (!selectedNFTData || !validateAddress(recipientAddress)) return;
    
    console.log('⛽ Estimando taxa de gas...');
    // Simular estimativa de gas
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const estimates = ['0.001', '0.002', '0.003', '0.004'];
    setGasEstimate(estimates[Math.floor(Math.random() * estimates.length)]);
  };

  const handleTransfer = async () => {
    if (!selectedNFTData || !validateAddress(recipientAddress)) {
      toast.error('Selecione um NFT e endereço válido');
      return;
    }

    setIsLoading(true);
    try {
      console.log('📤 Iniciando transferência de NFT...', {
        nft: selectedNFTData.name,
        to: recipientAddress
      });
      
      // Simular chamada Tatum API: POST /v3/nft/transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const txHash = '0x' + Math.random().toString(16).substring(2, 66);
      
      toast.success(`✅ NFT transferido com sucesso! TX: ${txHash.slice(0, 10)}...`);
      
      // Reset form
      setSelectedNFT('');
      setRecipientAddress('');
      setShowConfirmation(false);
      
    } catch (error) {
      console.error('Error transferring NFT:', error);
      toast.error('❌ Erro ao transferir NFT');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedNFTData || !validateAddress(recipientAddress)) {
      toast.error('Verifique os dados antes de confirmar');
      return;
    }
    setShowConfirmation(true);
    estimateGas();
  };

  const networkNames = {
    ethereum: 'Ethereum',
    polygon: 'Polygon',
    bsc: 'BNB Chain'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer Form */}
        <div className="space-y-6">
          <Card className="bg-dashboard-dark/50 border-satotrack-neon/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-satotrack-neon">
                <Send className="h-5 w-5" />
                Transferir NFT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Select NFT */}
              <div className="space-y-2">
                <Label htmlFor="nft-select">Selecionar NFT</Label>
                <select
                  id="nft-select"
                  value={selectedNFT}
                  onChange={(e) => setSelectedNFT(e.target.value)}
                  className="w-full p-2 rounded-md bg-dashboard-medium border border-dashboard-light text-white"
                >
                  <option value="">Escolha um NFT</option>
                  {userNFTs.map(nft => (
                    <option key={`${nft.contractAddress}-${nft.tokenId}`} value={`${nft.contractAddress}-${nft.tokenId}`}>
                      {nft.name} (#{nft.tokenId}) - {nft.collection}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient Address */}
              <div className="space-y-2">
                <Label htmlFor="recipient">Endereço de Destino</Label>
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className={`font-mono ${
                    recipientAddress && !validateAddress(recipientAddress) 
                      ? 'border-red-500' 
                      : recipientAddress && validateAddress(recipientAddress)
                      ? 'border-green-500'
                      : ''
                  }`}
                />
                {recipientAddress && !validateAddress(recipientAddress) && (
                  <p className="text-sm text-red-400">Endereço inválido</p>
                )}
                {recipientAddress && validateAddress(recipientAddress) && (
                  <p className="text-sm text-green-400">Endereço válido</p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                {!showConfirmation ? (
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedNFT || !validateAddress(recipientAddress)}
                    className="w-full bg-satotrack-neon text-black"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Revisar Transferência
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={handleTransfer}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Transferindo...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirmar Transferência
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowConfirmation(false)}
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gas Estimation */}
          {showConfirmation && selectedNFTData && (
            <Card className="bg-orange-900/20 border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <DollarSign className="h-5 w-5" />
                  Estimativa de Taxa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Taxa de Gas (estimada):</span>
                  <span className="text-orange-400">~{gasEstimate} {selectedNFTData.network === 'ethereum' ? 'ETH' : 'MATIC'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa da Plataforma:</span>
                  <span className="text-orange-400">Gratuita</span>
                </div>
                <hr className="border-orange-500/20" />
                <div className="flex justify-between font-medium">
                  <span>Total Estimado:</span>
                  <span className="text-orange-400">~{gasEstimate} {selectedNFTData.network === 'ethereum' ? 'ETH' : 'MATIC'}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview & Confirmation */}
        <div className="space-y-6">
          {selectedNFTData && (
            <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Image className="h-5 w-5" />
                  NFT Selecionado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square bg-gradient-to-br from-satotrack-neon/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                  <Image className="h-16 w-16 text-satotrack-neon" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{selectedNFTData.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedNFTData.collection}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Token ID: #{selectedNFTData.tokenId}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {networkNames[selectedNFTData.network]}
                    </Badge>
                  </div>
                </div>

                <div className="p-2 bg-dashboard-medium/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Contrato</p>
                  <p className="font-mono text-xs text-white break-all">
                    {selectedNFTData.contractAddress}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {showConfirmation && selectedNFTData && validateAddress(recipientAddress) && (
            <Card className="bg-dashboard-dark/50 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <AlertTriangle className="h-5 w-5" />
                  Confirmação de Transferência
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-200 mb-2">
                    ⚠️ <strong>Atenção:</strong> Esta ação não pode ser desfeita!
                  </p>
                  <p className="text-xs text-yellow-300">
                    Você está prestes a transferir permanentemente este NFT para o endereço especificado.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">De:</span>
                    <span className="text-white font-mono">Sua carteira</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Para:</span>
                    <span className="text-white font-mono text-xs break-all">
                      {recipientAddress}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">NFT:</span>
                    <span className="text-white">{selectedNFTData.name}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rede:</span>
                    <span className="text-white">{networkNames[selectedNFTData.network]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-blue-900/20 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Clock className="h-5 w-5" />
                Como Funciona
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-blue-200">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>Selecione o NFT que deseja transferir</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>Insira o endereço de destino válido</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>Revise os detalhes e taxas estimadas</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">4.</span>
                  <span>Confirme a transferência na blockchain</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">5.</span>
                  <span>Aguarde a confirmação da transação</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NFTTransfer;
