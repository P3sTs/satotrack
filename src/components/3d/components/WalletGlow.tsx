
import React, { useMemo } from 'react';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface WalletGlowProps {
  glowSize: number;
  color: string;
}

const WalletGlow: React.FC<WalletGlowProps> = ({ glowSize, color }) => {
  // Propriedades seguras como valores primitivos
  const safeGlowSize = useMemo(() => {
    return typeof glowSize === 'number' && !isNaN(glowSize) && glowSize > 0 ? glowSize : 1.15;
  }, [glowSize]);
  
  const safeColor = useMemo(() => {
    return color && typeof color === 'string' ? color : '#06b6d4';
  }, [color]);

  // Args da Sphere como valores primitivos
  const sphereArgs = useMemo((): [number, number, number] => [
    safeGlowSize,
    8, // widthSegments fixo
    8  // heightSegments fixo
  ], [safeGlowSize]);

  return (
    <Sphere args={sphereArgs}>
      <meshBasicMaterial
        color={safeColor}
        transparent={true}
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </Sphere>
  );
};

export default WalletGlow;
