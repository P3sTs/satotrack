
import React, { useRef, useState, memo, useMemo } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface WalletNode {
  id: string;
  address: string;
  position: THREE.Vector3;
  balance: number;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  isLocked: boolean;
  connections: string[];
  type: 'main' | 'transaction' | 'connected';
}

interface WalletBubbleProps {
  node: WalletNode;
  onClick: () => void;
  onPositionChange: (position: THREE.Vector3) => void;
  onToggleLock: () => void;
  onRemove: () => void;
}

const WalletBubble: React.FC<WalletBubbleProps> = memo(({
  node,
  onClick,
  onPositionChange,
  onToggleLock,
  onRemove
}) => {
  console.log('🎈 [WalletBubble] Renderizando bubble para:', node.address.substring(0, 8) + '...');
  
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { viewport } = useThree();

  // Memoizar propriedades visuais
  const visualProps = useMemo(() => {
    const getColor = () => {
      if (node.type === 'main') return '#06b6d4';
      if (node.type === 'transaction') return '#8b5cf6';
      return '#10b981';
    };

    const getSize = () => {
      const baseSize = 1;
      const balanceScale = Math.min(Math.log10(node.balance + 1) * 0.3, 1.5);
      return Math.max(baseSize, baseSize + balanceScale);
    };

    return { color: getColor(), size: getSize() };
  }, [node.type, node.balance]);

  // Animação de pulsação otimizada - apenas quando não está sendo arrastado
  useFrame((state) => {
    if (meshRef.current && !dragging && !node.isLocked) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      meshRef.current.scale.setScalar(scale);
    }
  });

  // Handlers para eventos de drag simplificados
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (node.isLocked) return;
    event.stopPropagation();
    setDragging(true);
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setDragging(false);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging || node.isLocked || !groupRef.current) return;
    
    event.stopPropagation();
    
    const newPosition = new THREE.Vector3(
      event.point.x,
      event.point.y,
      node.position.z
    );
    
    groupRef.current.position.copy(newPosition);
    onPositionChange(newPosition);
  };

  // Memoizar o endereço formatado
  const formattedAddress = useMemo(() => 
    `${node.address.substring(0, 8)}...${node.address.substring(node.address.length - 8)}`,
    [node.address]
  );

  return (
    <group 
      ref={groupRef}
      position={[node.position.x, node.position.y, node.position.z]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <Sphere
        ref={meshRef}
        args={[visualProps.size, 12, 12]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <meshStandardMaterial
          color={visualProps.color}
          transparent={true}
          opacity={hovered ? 0.9 : 0.7}
          roughness={0.2}
          metalness={0.6}
        />
      </Sphere>

      {/* Efeito de glow simplificado */}
      <Sphere args={[visualProps.size * 1.15, 8, 8]}>
        <meshBasicMaterial
          color={visualProps.color}
          transparent={true}
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Label otimizado - apenas quando hovering */}
      {hovered && (
        <Html
          position={[0, visualProps.size + 1, 0]}
          center
          distanceFactor={8}
          occlude
        >
          <div className="bg-black/90 backdrop-blur-sm text-white p-2 rounded-lg border border-cyan-500/50 text-xs pointer-events-none max-w-xs">
            <div className="font-mono text-xs truncate">
              {formattedAddress}
            </div>
            <div className="text-cyan-400">
              💰 {node.balance.toFixed(4)} BTC
            </div>
            <div className="text-purple-400">
              🔄 {node.transactionCount} tx
            </div>
            {node.isLocked && (
              <div className="text-yellow-400 mt-1">
                🔒 Travada
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Anel de conexões simplificado */}
      {node.connections.length > 0 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[visualProps.size * 1.3, visualProps.size * 1.5, 8]} />
          <meshBasicMaterial
            color="#fbbf24"
            transparent={true}
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
});

WalletBubble.displayName = 'WalletBubble';

export default WalletBubble;
