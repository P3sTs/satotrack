
import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Html } from '@react-three/drei';
import { Vector3 } from 'three';
import WalletBubble from './WalletBubble';
import FloatingParticles from './FloatingParticles';
import SearchInterface from './SearchInterface';
import WalletDetailPopup from './WalletDetailPopup';

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
}

const Crypto3DScene: React.FC = () => {
  const [walletNodes, setWalletNodes] = useState<WalletNode[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const controlsRef = useRef<any>();

  const addWalletNode = async (address: string, position?: Vector3) => {
    setIsLoading(true);
    
    try {
      // Simular chamada da API (substituir pela chamada real)
      const mockData = {
        balance: Math.random() * 10,
        total_received: Math.random() * 50,
        total_sent: Math.random() * 40,
        transaction_count: Math.floor(Math.random() * 100),
        transactions: []
      };

      const newNode: WalletNode = {
        id: `wallet-${Date.now()}`,
        address,
        position: position || new Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        balance: mockData.balance,
        totalReceived: mockData.total_received,
        totalSent: mockData.total_sent,
        transactionCount: mockData.transaction_count,
        isLocked: false,
        connections: [],
        type: 'main'
      };

      setWalletNodes(prev => [...prev, newNode]);
    } catch (error) {
      console.error('Erro ao buscar dados da carteira:', error);
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

  return (
    <div className="w-full h-screen relative">
      {/* Interface de busca flutuante */}
      <SearchInterface 
        onSearch={addWalletNode}
        onReorganize={reorganizeNodes}
        isLoading={isLoading}
      />

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
        />
      )}
    </div>
  );
};

export default Crypto3DScene;
