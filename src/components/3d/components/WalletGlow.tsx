
import React from 'react';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface WalletGlowProps {
  glowSize: number;
  color: string;
}

const WalletGlow: React.FC<WalletGlowProps> = ({ glowSize, color }) => {
  // Validate props to prevent Three.js errors
  const safeGlowSize = typeof glowSize === 'number' && !isNaN(glowSize) && glowSize > 0 ? glowSize : 1.15;
  const safeColor = color && typeof color === 'string' ? color : '#06b6d4';

  return (
    <Sphere args={[safeGlowSize, 8, 8]}>
      <meshBasicMaterial
        color={safeColor}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </Sphere>
  );
};

export default WalletGlow;
