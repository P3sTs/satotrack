
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
  const ringArgs = useMemo((): [number, number, number] => {
    // Validar que os valores são números válidos
    if (isNaN(innerRadius) || isNaN(outerRadius) || innerRadius <= 0 || outerRadius <= innerRadius) {
      console.warn('⚠️ [ConnectionRing] Ring geometry args inválidos, usando valores padrão');
      return [1.3, 1.5, 8];
    }
    
    return [innerRadius, outerRadius, 8];
  }, [innerRadius, outerRadius]);

  if (!hasConnections) return null;

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={ringArgs} />
      <meshBasicMaterial
        color="#fbbf24"
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default ConnectionRing;
