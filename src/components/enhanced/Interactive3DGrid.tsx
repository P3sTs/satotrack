import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface GridCellProps {
  position: [number, number, number];
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}

const GridCell: React.FC<GridCellProps> = ({ position, index, isHovered, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5 + index * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.2;
      
      // Scale based on hover state
      const targetScale = hovered || isHovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={() => {
        setHovered(true);
        onHover(index);
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial
        color={hovered || isHovered ? "#00ffc6" : "#3b82f6"}
        emissive={hovered || isHovered ? "#00ffc6" : "#1e40af"}
        emissiveIntensity={hovered || isHovered ? 0.3 : 0.1}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

const Grid3D: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const cells = [];
  const gridSize = 8;
  
  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const index = x * gridSize + z;
      const position: [number, number, number] = [
        (x - gridSize / 2) * 2,
        0,
        (z - gridSize / 2) * 2
      ];
      
      cells.push(
        <GridCell
          key={index}
          position={position}
          index={index}
          isHovered={hoveredIndex === index}
          onHover={setHoveredIndex}
        />
      );
    }
  }

  return (
    <group ref={groupRef}>
      {cells}
    </group>
  );
};

const ParticleSystem: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 1000;
  
  const particles = React.useMemo(() => {
    const temp = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 50;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 50;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00ffc6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

export const Interactive3DGrid: React.FC = () => {
  return (
    <motion.div
      className="w-full h-screen relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 10, 15]} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <Grid3D />
        <ParticleSystem />
        
        <fog attach="fog" args={['#0a0a0a', 20, 50]} />
      </Canvas>
      
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      
      <motion.div
        className="absolute bottom-8 left-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <h3 className="text-2xl font-bold mb-2">Interactive 3D Grid</h3>
        <p className="text-sm text-muted-foreground">Hover over cubes to interact</p>
      </motion.div>
    </motion.div>
  );
};

export default Interactive3DGrid;