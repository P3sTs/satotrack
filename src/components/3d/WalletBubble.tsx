
import React, { useRef, useState, memo, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
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

  // Validar dados do nó
  if (!node || !node.position) {
    console.warn('⚠️ [WalletBubble] Nó inválido:', node);
    return null;
  }

  // Memoizar propriedades visuais com validação rigorosa
  const visualProps = useMemo(() => {
    const getColor = () => {
      if (node.type === 'main') return '#06b6d4';
      if (node.type === 'transaction') return '#8b5cf6';
      return '#10b981';
    };

    const getSize = () => {
      const baseSize = 1;
      const balance = typeof node.balance === 'number' ? node.balance : 0;
      const balanceScale = Math.min(Math.log10(balance + 1) * 0.3, 1.5);
      const finalSize = Math.max(baseSize, baseSize + balanceScale);
      
      // Garantir que retornamos um número válido
      return isNaN(finalSize) ? baseSize : finalSize;
    };

    const size = getSize();
    return { 
      color: getColor(), 
      size: size,
      // Pré-calcular valores para evitar cálculos no render
      innerRadius: size * 1.3,
      outerRadius: size * 1.5,
      glowSize: size * 1.15
    };
  }, [node.type, node.balance]);

  // Animação de pulsação
  useFrame((state) => {
    if (meshRef.current && !dragging && !node.isLocked) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      meshRef.current.scale.setScalar(scale);
    }
  });

  // Handlers simplificados
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (node.isLocked) return;
    event.stopPropagation();
    setDragging(true);
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (dragging && groupRef.current) {
      event.stopPropagation();
      onPositionChange(groupRef.current.position.clone());
    }
    setDragging(false);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging || node.isLocked || !groupRef.current) return;
    event.stopPropagation();
    
    if (event.point) {
      groupRef.current.position.copy(event.point);
    }
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!dragging) {
      event.stopPropagation();
      onClick();
    }
  };

  // Endereço formatado
  const formattedAddress = useMemo(() => 
    `${node.address.substring(0, 8)}...${node.address.substring(node.address.length - 8)}`,
    [node.address]
  );

  // Posição segura
  const safePosition: [number, number, number] = useMemo(() => {
    const pos = node.position;
    return [
      typeof pos.x === 'number' && !isNaN(pos.x) ? pos.x : 0,
      typeof pos.y === 'number' && !isNaN(pos.y) ? pos.y : 0,
      typeof pos.z === 'number' && !isNaN(pos.z) ? pos.z : 0
    ];
  }, [node.position]);

  // Garantir que os argumentos do ring geometry são válidos
  const ringArgs = useMemo(() => {
    const innerRadius = visualProps.innerRadius;
    const outerRadius = visualProps.outerRadius;
    
    // Validar que os valores são números válidos
    if (isNaN(innerRadius) || isNaN(outerRadius) || innerRadius <= 0 || outerRadius <= innerRadius) {
      console.warn('⚠️ [WalletBubble] Ring geometry args inválidos, usando valores padrão');
      return [1.3, 1.5, 8];
    }
    
    return [innerRadius, outerRadius, 8];
  }, [visualProps.innerRadius, visualProps.outerRadius]);

  return (
    <group 
      ref={groupRef}
      position={safePosition}
    >
      <Sphere
        ref={meshRef}
        args={[visualProps.size, 16, 16]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={visualProps.color}
          transparent
          opacity={hovered ? 0.9 : 0.7}
          roughness={0.2}
          metalness={0.6}
        />
      </Sphere>

      {/* Efeito de glow */}
      <Sphere args={[visualProps.glowSize, 8, 8]}>
        <meshBasicMaterial
          color={visualProps.color}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Label quando hovering */}
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
              💰 {(node.balance || 0).toFixed(4)} BTC
            </div>
            <div className="text-purple-400">
              🔄 {node.transactionCount || 0} tx
            </div>
            {node.isLocked && (
              <div className="text-yellow-400 mt-1">
                🔒 Travada
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Anel de conexões - agora com args válidos garantidos */}
      {node.connections && node.connections.length > 0 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={ringArgs} />
          <meshBasicMaterial
            color="#fbbf24"
            transparent
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
