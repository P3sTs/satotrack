
import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Html } from '@react-three/drei';
import { Vector3 } from 'three';
import WalletBubble from './WalletBubble';
import FloatingParticles from './FloatingParticles';
import SearchInterface from './SearchInterface';
import WalletDetailPopup from './WalletDetailPopup';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface WalletNode {
  id: string;
  address: string;
  position: Vector3;
  balance: number;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  isLocked: boolean;
  connections: string[];
  type: 'main' | 'transaction' | 'connected';
  transactions?: Array<{
    hash: string;
    amount: number;
    transaction_type: string;
    transaction_date: string;
  }>;
}

const Crypto3DScene: React.FC = () => {
  const [walletNodes, setWalletNodes] = useState<WalletNode[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const controlsRef = useRef<any>();

  const fetchWalletData = async (address: string): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-wallet-data', {
        body: {
          address: address,
          wallet_id: null // opcional
        }
      });

      if (error) {
        console.error('Erro na função edge:', error);
        throw new Error(error.message || 'Erro ao buscar dados da carteira');
      }

      return data;
    } catch (error) {
      console.error('Erro ao chamar a função fetch-wallet-data:', error);
      throw error;
    }
  };

  const addWalletNode = async (address: string, position?: Vector3) => {
    setIsLoading(true);
    
    try {
      console.log('Buscando dados para endereço:', address);
      
      const walletData = await fetchWalletData(address);
      
      console.log('Dados recebidos:', walletData);

      if (!walletData) {
        throw new Error('Nenhum dado retornado para esta carteira');
      }

      const newNode: WalletNode = {
        id: `wallet-${Date.now()}`,
        address,
        position: position || new Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        balance: walletData.balance || 0,
        totalReceived: walletData.total_received || 0,
        totalSent: walletData.total_sent || 0,
        transactionCount: walletData.transaction_count || 0,
        isLocked: false,
        connections: [],
        type: 'main',
        transactions: walletData.transactions || []
      };

      setWalletNodes(prev => [...prev, newNode]);
      
      toast({
        title: "Carteira adicionada com sucesso!",
        description: `Endereço: ${address.substring(0, 8)}...${address.substring(address.length - 8)}`,
      });

    } catch (error: any) {
      console.error('Erro ao buscar dados da carteira:', error);
      
      toast({
        title: "Erro ao buscar dados da carteira",
        description: error.message || 'Verifique se o endereço está correto e tente novamente',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reorganizeNodes = () => {
    setWalletNodes(prev => 
      prev.map((node, index) => ({
        ...node,
        position: new Vector3(
          Math.cos(index * (Math.PI * 2) / prev.length) * 10,
          Math.sin(index * Math.PI / 4) * 5,
          Math.sin(index * (Math.PI * 2) / prev.length) * 10
        ),
        isLocked: false
      }))
    );
  };

  const removeNode = (nodeId: string) => {
    setWalletNodes(prev => prev.filter(node => node.id !== nodeId));
    if (selectedWallet?.id === nodeId) {
      setSelectedWallet(null);
    }
  };

  const toggleLockNode = (nodeId: string) => {
    setWalletNodes(prev =>
      prev.map(node =>
        node.id === nodeId ? { ...node, isLocked: !node.isLocked } : node
      )
    );
  };

  const expandWalletConnections = async (wallet: WalletNode) => {
    if (!wallet.transactions || wallet.transactions.length === 0) {
      toast({
        title: "Sem transações",
        description: "Esta carteira não possui transações para expandir",
        variant: "destructive"
      });
      return;
    }

    // Criar nós para as transações mais significativas
    const significantTransactions = wallet.transactions
      .filter(tx => tx.amount > 0.001) // Filtrar transações pequenas
      .slice(0, 5); // Limitar a 5 transações

    significantTransactions.forEach((tx, index) => {
      const angle = (index * (Math.PI * 2)) / significantTransactions.length;
      const radius = 8;
      
      const transactionNode: WalletNode = {
        id: `tx-${tx.hash}-${Date.now()}`,
        address: tx.hash,
        position: new Vector3(
          wallet.position.x + Math.cos(angle) * radius,
          wallet.position.y + Math.sin(angle) * radius,
          wallet.position.z + (Math.random() - 0.5) * 4
        ),
        balance: tx.amount,
        totalReceived: tx.amount,
        totalSent: 0,
        transactionCount: 1,
        isLocked: false,
        connections: [wallet.id],
        type: 'transaction',
        transactions: [tx]
      };

      setWalletNodes(prev => [...prev, transactionNode]);
    });

    toast({
      title: "Conexões expandidas",
      description: `Adicionadas ${significantTransactions.length} transações relacionadas`,
    });
  };

  return (
    <div className="w-full h-screen relative">
      {/* Interface de busca flutuante */}
      <SearchInterface 
        onSearch={addWalletNode}
        onReorganize={reorganizeNodes}
        isLoading={isLoading}
      />

      {/* Informações de status */}
      {walletNodes.length > 0 && (
        <div className="absolute top-20 left-4 z-40 bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg border border-cyan-500/50">
          <div className="text-sm">
            <div className="text-cyan-400 font-semibold">
              📊 {walletNodes.length} carteira{walletNodes.length > 1 ? 's' : ''} ativa{walletNodes.length > 1 ? 's' : ''}
            </div>
            <div className="text-gray-300 text-xs mt-1">
              💰 Total: {walletNodes.reduce((sum, node) => sum + node.balance, 0).toFixed(4)} BTC
            </div>
          </div>
        </div>
      )}

      {/* Canvas 3D */}
      <Canvas
        camera={{ position: [15, 15, 15], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e)' }}
      >
        <Suspense fallback={null}>
          {/* Iluminação */}
          <ambientLight intensity={0.3} color="#4338ca" />
          <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          
          {/* Grid infinito */}
          <Grid
            args={[50, 50]}
            position={[0, -10, 0]}
            cellSize={2}
            cellThickness={0.5}
            cellColor="#334155"
            sectionSize={10}
            sectionThickness={1}
            sectionColor="#475569"
            fadeDistance={100}
            fadeStrength={1}
            infiniteGrid
          />

          {/* Partículas flutuantes */}
          <FloatingParticles />

          {/* Nós das carteiras */}
          {walletNodes.map((node) => (
            <WalletBubble
              key={node.id}
              node={node}
              onClick={() => setSelectedWallet(node)}
              onPositionChange={(newPosition) => {
                if (!node.isLocked) {
                  setWalletNodes(prev =>
                    prev.map(n =>
                      n.id === node.id ? { ...n, position: newPosition } : n
                    )
                  );
                }
              }}
              onToggleLock={() => toggleLockNode(node.id)}
              onRemove={() => removeNode(node.id)}
            />
          ))}

          {/* Controles de órbita */}
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={100}
            minDistance={5}
          />

          {/* Ambiente */}
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Popup de detalhes */}
      {selectedWallet && (
        <WalletDetailPopup
          wallet={selectedWallet}
          onClose={() => setSelectedWallet(null)}
          onAddConnection={(address) => {
            const newPosition = new Vector3(
              selectedWallet.position.x + (Math.random() - 0.5) * 10,
              selectedWallet.position.y + (Math.random() - 0.5) * 10,
              selectedWallet.position.z + (Math.random() - 0.5) * 10
            );
            addWalletNode(address, newPosition);
          }}
          onExpandConnections={() => expandWalletConnections(selectedWallet)}
        />
      )}

      {/* Instruções de uso */}
      {walletNodes.length === 0 && !isLoading && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-cyan-500/50 max-w-md text-center">
          <div className="text-cyan-400 font-semibold mb-2">
            🚀 Como usar a Visualização 3D
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            <div>• Digite um endereço Bitcoin na busca</div>
            <div>• Clique nas esferas para ver detalhes</div>
            <div>• Arraste para mover as carteiras</div>
            <div>• Use o mouse para rotacionar a cena</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crypto3DScene;
