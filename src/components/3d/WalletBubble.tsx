
import React, { useRef, useState, memo, useMemo } from 'react';
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

const WalletBubble: React.FC<WalletBubbleProps> = memo(({
  node,
  onClick,
  onPositionChange,
  onToggleLock,
  onRemove
}) => {
  console.log('🎈 [WalletBubble] Renderizando bubble para:', node.address.substring(0, 8) + '...');
  
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { viewport } = useThree();

  // Spring animation para posição
  const [springs, api] = useSpring(() => ({
    position: [node.position.x, node.position.y, node.position.z],
    scale: 1,
  }));

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

  // Configurar drag otimizado
  const bind = useDrag(
    ({ movement: [x, y], dragging: isDragging, last }) => {
      if (node.isLocked) return;
      
      setDragging(isDragging);
      
      if (isDragging) {
        const newPosition = new Vector3(
          node.position.x + (x / viewport.width) * 20,
          node.position.y - (y / viewport.height) * 20,
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
      pointer: { touch: true },
      threshold: 5
    }
  );

  // Memoizar o endereço formatado
  const formattedAddress = useMemo(() => 
    `${node.address.substring(0, 8)}...${node.address.substring(node.address.length - 8)}`,
    [node.address]
  );

  return (
    // @ts-ignore - React Spring animated component
    <animated.group position={springs.position} {...bind()}>
      <Sphere
        ref={meshRef}
        args={[visualProps.size, 12, 12]} // Reduzir segmentos para melhor performance
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => {
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
          side={2}
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
            side={2}
          />
        </mesh>
      )}
    </animated.group>
  );
});

WalletBubble.displayName = 'WalletBubble';

export default WalletBubble;
