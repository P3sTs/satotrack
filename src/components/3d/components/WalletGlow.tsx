
import React from 'react';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface WalletGlowProps {
  glowSize: number;
  color: string;
}

const WalletGlow: React.FC<WalletGlowProps> = ({ glowSize, color }) => {
  return (
    <Sphere args={[glowSize, 8, 8]}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </Sphere>
  );
};

export default WalletGlow;
