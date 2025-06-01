
import React, { Suspense, useRef, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { Vector3 } from 'three';
import WalletBubble from '../WalletBubble';
import FloatingParticles from '../FloatingParticles';
import { WalletNode } from '../hooks/useWalletNodes';

interface Scene3DRendererProps {
  walletNodes: WalletNode[];
  onWalletClick: (wallet: WalletNode) => void;
  onNodePositionChange: (nodeId: string, position: Vector3) => void;
  onToggleLock: (nodeId: string) => void;
  onRemoveNode: (nodeId: string) => void;
}

const Scene3DRenderer: React.FC<Scene3DRendererProps> = memo(({
  walletNodes,
  onWalletClick,
  onNodePositionChange,
  onToggleLock,
  onRemoveNode
}) => {
  const controlsRef = useRef<any>();

  return (
    <Canvas
      camera={{ position: [15, 15, 15], fov: 60 }}
      style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e)' }}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      frameloop="demand"
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

        {/* Controles de órbita */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={100}
          minDistance={5}
          enableDamping={true}
          dampingFactor={0.05}
        />

        {/* Ambiente */}
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
});

Scene3DRenderer.displayName = 'Scene3DRenderer';

export default Scene3DRenderer;
