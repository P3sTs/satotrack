
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingParticles: React.FC = () => {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    const colors = new Float32Array(1000 * 3);

    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      // Cores ciberpunk
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Cyan
        colors[i * 3] = 0.024;
        colors[i * 3 + 1] = 0.714;
        colors[i * 3 + 2] = 0.831;
      } else if (colorChoice < 0.66) {
        // Purple
        colors[i * 3] = 0.545;
        colors[i * 3 + 1] = 0.361;
        colors[i * 3 + 2] = 0.976;
      } else {
        // Pink
        colors[i * 3] = 0.976;
        colors[i * 3 + 1] = 0.361;
        colors[i * 3 + 2] = 0.831;
      }
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;

      // Movimento suave das partículas
      const positions = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + positions[i]) * 0.01;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        size={0.3}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default FloatingParticles;
