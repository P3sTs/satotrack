
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ConnectionRingProps {
  innerRadius: number;
  outerRadius: number;
  hasConnections: boolean;
}

const ConnectionRing: React.FC<ConnectionRingProps> = ({ 
  innerRadius, 
  outerRadius, 
  hasConnections 
}) => {
  // Args do ring como valores primitivos seguros
  const ringArgs = useMemo((): [number, number, number] => {
    const safeInnerRadius = typeof innerRadius === 'number' && !isNaN(innerRadius) && innerRadius > 0 ? innerRadius : 1.3;
    const safeOuterRadius = typeof outerRadius === 'number' && !isNaN(outerRadius) && outerRadius > safeInnerRadius ? outerRadius : safeInnerRadius + 0.2;
    
    return [safeInnerRadius, safeOuterRadius, 8];
  }, [innerRadius, outerRadius]);

  if (!hasConnections) return null;

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={ringArgs} />
      <meshBasicMaterial
        color="#fbbf24"
        transparent={true}
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default ConnectionRing;
