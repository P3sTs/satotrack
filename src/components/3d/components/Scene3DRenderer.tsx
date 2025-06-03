
import React, { Suspense, useRef, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { Vector3 } from 'three';
import WalletBubble from '../WalletBubble';
import FloatingParticles from '../FloatingParticles';
import { WalletNode } from '../types/WalletNode';

interface Scene3DRendererProps {
  walletNodes: WalletNode[];
  onWalletClick: (wallet: WalletNode) => void;
  onNodePositionChange: (nodeId: string, position: Vector3) => void;
  onToggleLock: (nodeId: string) => void;
  onRemoveNode: (nodeId: string) => void;
}

// Error boundary component for 3D scene
const Scene3DContent: React.FC<{
  walletNodes: WalletNode[];
  onWalletClick: (wallet: WalletNode) => void;
  onNodePositionChange: (nodeId: string, position: Vector3) => void;
  onToggleLock: (nodeId: string) => void;
  onRemoveNode: (nodeId: string) => void;
}> = ({ walletNodes, onWalletClick, onNodePositionChange, onToggleLock, onRemoveNode }) => {
  const controlsRef = useRef<any>();

  return (
    <>
      {/* Iluminação otimizada */}
      <ambientLight intensity={0.4} color="#4338ca" />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />
      
      {/* Grid com configurações otimizadas */}
      <Grid
        args={[30, 30]}
        position={[0, -10, 0]}
        cellSize={2}
        cellThickness={0.5}
        cellColor="#334155"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#475569"
        fadeDistance={50}
        fadeStrength={1}
        infiniteGrid
      />

      {/* Partículas apenas se houver poucos nós */}
      {walletNodes.length < 5 && <FloatingParticles />}

      {/* Nós das carteiras - renderizar apenas se valid */}
      {walletNodes
        .filter(node => node && node.id && node.position)
        .map((node) => (
          <WalletBubble
            key={node.id}
            node={node}
            onClick={() => onWalletClick(node)}
            onPositionChange={(newPosition) => {
              if (!node.isLocked) {
                onNodePositionChange(node.id, newPosition);
              }
            }}
            onToggleLock={() => onToggleLock(node.id)}
            onRemove={() => onRemoveNode(node.id)}
          />
        ))}

      {/* Controles de órbita otimizados */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={80}
        minDistance={5}
        enableDamping={true}
        dampingFactor={0.1}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        panSpeed={0.8}
      />

      {/* Ambiente com preset mais leve */}
      <Environment preset="night" />
    </>
  );
};

const Scene3DRenderer: React.FC<Scene3DRendererProps> = memo(({
  walletNodes,
  onWalletClick,
  onNodePositionChange,
  onToggleLock,
  onRemoveNode
}) => {
  console.log('🎮 [Scene3DRenderer] Renderizando cena 3D com', walletNodes.length, 'nós');

  // Fallback se não houver dados válidos
  if (!Array.isArray(walletNodes)) {
    console.warn('⚠️ [Scene3DRenderer] walletNodes não é um array válido');
    return <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black" />;
  }

  return (
    <Canvas
      camera={{ position: [15, 15, 15], fov: 60 }}
      style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e)' }}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      frameloop="demand"
      gl={{ 
        powerPreference: "high-performance",
        antialias: false,
        stencil: false,
        depth: true
      }}
      onCreated={(state) => {
        console.log('🎨 [Scene3DRenderer] Canvas criado com sucesso');
      }}
    >
      <Suspense fallback={null}>
        <Scene3DContent
          walletNodes={walletNodes}
          onWalletClick={onWalletClick}
          onNodePositionChange={onNodePositionChange}
          onToggleLock={onToggleLock}
          onRemoveNode={onRemoveNode}
        />
      </Suspense>
    </Canvas>
  );
});

Scene3DRenderer.displayName = 'Scene3DRenderer';

export default Scene3DRenderer;
