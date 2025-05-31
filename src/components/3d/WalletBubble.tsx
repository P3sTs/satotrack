
import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Sphere } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/three';

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

interface WalletBubbleProps {
  node: WalletNode;
  onClick: () => void;
  onPositionChange: (position: Vector3) => void;
  onToggleLock: () => void;
  onRemove: () => void;
}

const WalletBubble: React.FC<WalletBubbleProps> = ({
  node,
  onClick,
  onPositionChange,
  onToggleLock,
  onRemove
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { camera, size } = useThree();

  // Spring animation for position
  const [springs, api] = useSpring(() => ({
    position: [node.position.x, node.position.y, node.position.z],
    scale: 1,
  }));

  // Animação de pulsação
  useFrame((state) => {
    if (meshRef.current && !dragging) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  // Configurar drag usando @use-gesture/react
  const bind = useDrag(
    ({ movement: [x, y], dragging: isDragging, first, last }) => {
      if (node.isLocked) return;
      
      setDragging(isDragging);
      
      if (meshRef.current && isDragging) {
        // Convert screen coordinates to world coordinates
        const vector = new Vector3();
        vector.set(
          (x / size.width) * 2 - 1,
          -(y / size.height) * 2 + 1,
          0.5
        );
        vector.unproject(camera);
        vector.sub(camera.position).normalize();
        const distance = -camera.position.z / vector.z;
        vector.multiplyScalar(distance).add(camera.position);
        
        const newPosition = new Vector3(
          node.position.x + x * 0.01,
          node.position.y - y * 0.01,
          node.position.z
        );
        
        api.start({ position: [newPosition.x, newPosition.y, newPosition.z] });
        
        if (last) {
          onPositionChange(newPosition);
        }
      }
    },
    { 
      filterTaps: true,
      pointer: { touch: true }
    }
  );

  const getColor = () => {
    if (node.type === 'main') return '#06b6d4'; // Cyan para carteira principal
    if (node.type === 'transaction') return '#8b5cf6'; // Roxo para transações
    return '#10b981'; // Verde para conexões
  };

  const getSize = () => {
    const baseSize = 1;
    const balanceScale = Math.log10(node.balance + 1) * 0.3;
    return Math.max(baseSize, baseSize + balanceScale);
  };

  return (
    // @ts-ignore - React Spring animated component
    <animated.group position={springs.position}>
      <Sphere
        ref={meshRef}
        args={[getSize(), 32, 32]}
        {...bind()}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <meshStandardMaterial
          color={getColor()}
          transparent={true}
          opacity={hovered ? 0.9 : 0.7}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>

      {/* Efeito de glow */}
      <Sphere args={[getSize() * 1.2, 16, 16]}>
        <meshBasicMaterial
          color={getColor()}
          transparent={true}
          opacity={0.2}
          side={2}
        />
      </Sphere>

      {/* Label flutuante */}
      {hovered && (
        <Html
          position={[0, getSize() + 1, 0]}
          center
          distanceFactor={10}
          occlude
        >
          <div className="bg-black/80 backdrop-blur-sm text-white p-2 rounded-lg border border-cyan-500/50 text-xs">
            <div className="font-mono text-xs">
              {node.address.substring(0, 8)}...{node.address.substring(node.address.length - 8)}
            </div>
            <div className="text-cyan-400">
              💰 {node.balance.toFixed(4)} BTC
            </div>
            <div className="text-purple-400">
              🔄 {node.transactionCount} transações
            </div>
            {node.isLocked && (
              <div className="text-yellow-400 mt-1">
                🔒 Travada
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Anel de conexões */}
      {node.connections.length > 0 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[getSize() * 1.5, getSize() * 1.7, 32]} />
          <meshBasicMaterial
            color="#fbbf24"
            transparent={true}
            opacity={0.6}
            side={2}
          />
        </mesh>
      )}
    </animated.group>
  );
};

export default WalletBubble;
