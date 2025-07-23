import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface MorphingShapeProps {
  index: number;
}

const MorphingShape: React.FC<MorphingShapeProps> = ({ index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const time = state.clock.elapsedTime;
      
      // Rotation
      meshRef.current.rotation.x = time * 0.5 + index;
      meshRef.current.rotation.y = time * 0.3 + index;
      meshRef.current.rotation.z = time * 0.1 + index;
      
      // Position floating
      meshRef.current.position.y = Math.sin(time + index) * 0.5;
      meshRef.current.position.x = Math.cos(time * 0.5 + index) * 2;
      
      // Color morphing
      const hue = (time * 50 + index * 60) % 360;
      materialRef.current.color.setHSL(hue / 360, 0.8, 0.6);
      materialRef.current.emissive.setHSL(hue / 360, 0.5, 0.3);
    }
  });

  const shapes = [
    <Sphere ref={meshRef} args={[0.5, 32, 32]}>
      <meshStandardMaterial ref={materialRef} />
    </Sphere>,
    <Box ref={meshRef} args={[0.8, 0.8, 0.8]}>
      <meshStandardMaterial ref={materialRef} />
    </Box>,
    <Torus ref={meshRef} args={[0.6, 0.2, 16, 100]}>
      <meshStandardMaterial ref={materialRef} />
    </Torus>
  ];

  return shapes[index % 3];
};

export const MorphingShapes: React.FC = () => {
  return (
    <motion.div
      className="w-full h-64 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffc6" />
        
        {Array.from({ length: 5 }, (_, i) => (
          <MorphingShape key={i} index={i} />
        ))}
      </Canvas>
    </motion.div>
  );
};

export default MorphingShapes;