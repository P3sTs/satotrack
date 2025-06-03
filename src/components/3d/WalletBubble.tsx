
import React, { useRef, useState, memo, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { WalletNode } from './types/WalletNode';
import { useWalletVisualProps } from './hooks/useWalletVisualProps';
import WalletLabel from './components/WalletLabel';
import WalletGlow from './components/WalletGlow';
import ConnectionRing from './components/ConnectionRing';

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
  console.log('🎈 [WalletBubble] Renderizando bubble para:', node?.address?.substring(0, 8) + '...');
  
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Validar dados do nó
  if (!node || !node.position || !node.address) {
    console.warn('⚠️ [WalletBubble] Nó inválido:', node);
    return null;
  }

  const visualProps = useWalletVisualProps(node);

  // Validar visualProps
  if (!visualProps || typeof visualProps.size !== 'number' || isNaN(visualProps.size)) {
    console.warn('⚠️ [WalletBubble] VisualProps inválido:', visualProps);
    return null;
  }

  // Animação de pulsação
  useFrame((state) => {
    if (meshRef.current && !dragging && !node.isLocked) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      meshRef.current.scale.setScalar(scale);
    }
  });

  // Handlers simplificados - sem usar props diretamente em callbacks
  const handlePointerDown = React.useCallback((event: ThreeEvent<PointerEvent>) => {
    if (node.isLocked) return;
    event.stopPropagation();
    setDragging(true);
  }, [node.isLocked]);

  const handlePointerUp = React.useCallback((event: ThreeEvent<PointerEvent>) => {
    if (dragging && groupRef.current) {
      event.stopPropagation();
      const position = groupRef.current.position.clone();
      onPositionChange(position);
    }
    setDragging(false);
  }, [dragging, onPositionChange]);

  const handlePointerMove = React.useCallback((event: ThreeEvent<PointerEvent>) => {
    if (!dragging || node.isLocked || !groupRef.current) return;
    event.stopPropagation();
    
    if (event.point) {
      groupRef.current.position.copy(event.point);
    }
  }, [dragging, node.isLocked]);

  const handleClick = React.useCallback((event: ThreeEvent<MouseEvent>) => {
    if (!dragging) {
      event.stopPropagation();
      onClick();
    }
  }, [dragging, onClick]);

  // Posição segura usando array simples
  const position = useMemo(() => {
    const pos = node.position;
    return [
      typeof pos.x === 'number' && !isNaN(pos.x) ? pos.x : 0,
      typeof pos.y === 'number' && !isNaN(pos.y) ? pos.y : 0,
      typeof pos.z === 'number' && !isNaN(pos.z) ? pos.z : 0
    ] as [number, number, number];
  }, [node.position]);

  // Propriedades seguras - valores primitivos apenas
  const safeSize = useMemo(() => Math.max(0.5, Math.min(3, visualProps.size || 1)), [visualProps.size]);
  const safeColor = useMemo(() => visualProps.color || '#06b6d4', [visualProps.color]);
  
  // Args da Sphere como valores primitivos
  const sphereArgs = useMemo((): [number, number, number] => [
    safeSize,
    16, // widthSegments fixo
    16  // heightSegments fixo
  ], [safeSize]);

  return (
    <group 
      ref={groupRef}
      position={position}
    >
      <Sphere
        ref={meshRef}
        args={sphereArgs}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={safeColor}
          transparent={true}
          opacity={hovered ? 0.9 : 0.7}
          roughness={0.2}
          metalness={0.6}
        />
      </Sphere>

      <WalletGlow 
        glowSize={safeSize * 1.15} 
        color={safeColor} 
      />

      <WalletLabel 
        node={node} 
        size={safeSize} 
        hovered={hovered} 
      />

      <ConnectionRing 
        innerRadius={safeSize * 1.3}
        outerRadius={safeSize * 1.5}
        hasConnections={Boolean(node.connections && node.connections.length > 0)}
      />
    </group>
  );
});

WalletBubble.displayName = 'WalletBubble';

export default WalletBubble;
