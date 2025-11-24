import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Cone, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';
import type { MashaAction } from '../types';

const BearCharacter = () => {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle breathing
    group.current.scale.y = 1 + Math.sin(t * 1.5) * 0.01;
  });

  return (
    <group ref={group} position={[3.4, 0, -7.5]} rotation={[0, -0.3, 0]}>
      {/* Body */}
      <Sphere args={[1.3, 32, 32]} position={[0, 1.4, 0]} scale={[1.1, 1.3, 0.9]}>
        <meshStandardMaterial color="#3E2723" />
      </Sphere>
      {/* Belly */}
      <Sphere args={[1.0, 32, 32]} position={[0, 1.4, 0.6]} scale={[1.05, 1.1, 0.5]}>
        <meshStandardMaterial color="#D7CCC8" />
      </Sphere>

      {/* Head - Moved up to be visible above body */}
      <group position={[0, 3.2, 0.2]}>
        <Sphere args={[0.9, 32, 32]}>
          <meshStandardMaterial color="#3E2723" />
        </Sphere>
        {/* Snout */}
        <Sphere args={[0.45, 32, 32]} position={[0, -0.1, 0.7]} scale={[1, 0.8, 1]}>
          <meshStandardMaterial color="#D7CCC8" />
        </Sphere>
        {/* Nose */}
        <Sphere args={[0.18, 16, 16]} position={[0, 0.1, 1.1]}>
          <meshStandardMaterial color="#212121" />
        </Sphere>
        {/* Eyes */}
        <Sphere args={[0.09, 16, 16]} position={[-0.25, 0.2, 0.8]}>
          <meshStandardMaterial color="white" />
        </Sphere>
        <Sphere args={[0.05, 16, 16]} position={[-0.25, 0.2, 0.88]}>
          <meshStandardMaterial color="black" />
        </Sphere>
        <Sphere args={[0.09, 16, 16]} position={[0.25, 0.2, 0.8]}>
          <meshStandardMaterial color="white" />
        </Sphere>
        <Sphere args={[0.05, 16, 16]} position={[0.25, 0.2, 0.88]}>
          <meshStandardMaterial color="black" />
        </Sphere>
        {/* Ears */}
        <Sphere args={[0.28, 16, 16]} position={[-0.7, 0.7, 0]}>
          <meshStandardMaterial color="#3E2723" />
        </Sphere>
        <Sphere args={[0.28, 16, 16]} position={[0.7, 0.7, 0]}>
          <meshStandardMaterial color="#3E2723" />
        </Sphere>
      </group>

      {/* Arms */}
      <mesh position={[-1.2, 2, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.28, 0.35, 1.6]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      <mesh position={[1.2, 2, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.28, 0.35, 1.6]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.6, 0.6, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 1.3]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      <mesh position={[0.6, 0.6, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 1.3]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
    </group>
  );
};

const Bed = () => {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Mattress */}
      <Box args={[2.5, 0.4, 4]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#e0f2fe" />
      </Box>
      {/* Frame */}
      <Box args={[2.7, 0.2, 4.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Pillow */}
      <Cylinder args={[0.4, 0.4, 1.5]} position={[0, 0.5, -1.5]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="white" />
      </Cylinder>
      {/* Blanket */}
      <Box args={[2.2, 0.1, 2.5]} position={[0, 0.45, 0.5]}>
        <meshStandardMaterial color="#ec4899" />
      </Box>
    </group>
  );
};

// A more detailed 3D character composed of geometric shapes to represent Masha
const MashaCharacter = ({ action }: { action: MashaAction }) => {
  const group = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!group.current || !headRef.current || !leftArmRef.current || !rightArmRef.current) return;
    
    const t = state.clock.getElapsedTime();
    
    // Idle animation (breathing & swaying)
    if (action === 'idle') {
      group.current.position.y = Math.sin(t * 2) * 0.05;
      group.current.rotation.y = Math.sin(t * 0.5) * 0.05;
      group.current.rotation.z = 0;
      group.current.rotation.x = 0;
      
      // Arms swaying
      leftArmRef.current.rotation.z = 0.5 + Math.sin(t * 2) * 0.1;
      rightArmRef.current.rotation.z = -0.5 - Math.sin(t * 2) * 0.1;
    }
    
    // Jumping/Happy animation
    if (action === 'playing') {
      group.current.position.y = Math.abs(Math.sin(t * 8)) * 0.5;
      group.current.rotation.y += 0.05;
      
      // Arms up
      leftArmRef.current.rotation.z = 2.5;
      rightArmRef.current.rotation.z = -2.5;
    }

    // Eating animation
    if (action === 'eating') {
      headRef.current.rotation.x = Math.sin(t * 10) * 0.1;
      // Arm moving to mouth
      rightArmRef.current.rotation.z = -2;
      rightArmRef.current.rotation.x = Math.sin(t * 10) * 0.5;
    }

    // Talking animation
    if (action === 'talking') {
      headRef.current.rotation.x = Math.sin(t * 15) * 0.05;
      headRef.current.rotation.y = Math.sin(t * 5) * 0.1;
      
      // Gesturing
      leftArmRef.current.rotation.z = 1 + Math.sin(t * 5) * 0.5;
      rightArmRef.current.rotation.z = -1 - Math.sin(t * 5) * 0.5;
    }
    
    // Sleeping animation
    if (action === 'sleeping') {
      // Lay flat on bed
      group.current.rotation.x = -Math.PI / 2; 
      group.current.rotation.z = 0;
      group.current.position.y = 0.3; // On top of mattress
      group.current.position.z = -0.5; // Align with pillow
      group.current.position.x = 0;
      
      // Close eyes (simulated by head tilt down into pillow)
      headRef.current.rotation.x = 0.2;
    } else {
      // Reset rotation if not sleeping
      if (action !== 'playing') {
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, 0.1);
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1);
        group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, 0, 0.1);
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 0, 0.1);
      }
    }
  });

  return (
    <group ref={group}>
      {/* Head Group */}
      <group ref={headRef} position={[0, 1.3, 0]}>
        {/* Hood (Pink) */}
        <Sphere args={[0.55, 32, 32]}>
          <meshStandardMaterial color="#ec4899" />
        </Sphere>
        
        {/* Face (Skin) */}
        <Sphere args={[0.42, 32, 32]} position={[0, 0, 0.2]}>
          <meshStandardMaterial color="#ffdbac" />
        </Sphere>

        {/* Eyes */}
        <group position={[0, 0.1, 0.55]}>
          {/* Left Eye */}
          <group position={[-0.15, 0, 0]}>
            <Sphere args={[0.09, 16, 16]}>
              <meshStandardMaterial color="white" />
            </Sphere>
            <Sphere args={[0.045, 16, 16]} position={[0, 0, 0.08]}>
              <meshStandardMaterial color="#15803d" />
            </Sphere>
            <Sphere args={[0.02, 16, 16]} position={[0.01, 0.01, 0.11]}>
              <meshStandardMaterial color="white" />
            </Sphere>
          </group>
          
          {/* Right Eye */}
          <group position={[0.15, 0, 0]}>
            <Sphere args={[0.09, 16, 16]}>
              <meshStandardMaterial color="white" />
            </Sphere>
            <Sphere args={[0.045, 16, 16]} position={[0, 0, 0.08]}>
              <meshStandardMaterial color="#15803d" />
            </Sphere>
            <Sphere args={[0.02, 16, 16]} position={[0.01, 0.01, 0.11]}>
              <meshStandardMaterial color="white" />
            </Sphere>
          </group>
        </group>

        {/* Mouth (Simple smile) */}
        <Torus args={[0.08, 0.01, 16, 32, Math.PI]} position={[0, -0.15, 0.58]} rotation={[0, 0, Math.PI]}>
           <meshStandardMaterial color="#be123c" />
        </Torus>

        {/* Bangs/Hair peeking out */}
        <Sphere args={[0.1, 16, 16]} position={[0, 0.35, 0.45]} scale={[2, 0.5, 1]}>
           <meshStandardMaterial color="#fcd34d" />
        </Sphere>
      </group>

      {/* Body (Dress) */}
      <group position={[0, 0.4, 0]}>
        {/* Main Dress */}
        <Cone args={[0.6, 1.4, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ec4899" />
        </Cone>
        {/* White Shirt under dress */}
        <Cylinder args={[0.2, 0.25, 0.6]} position={[0, 0.5, 0]}>
           <meshStandardMaterial color="white" />
        </Cylinder>
      </group>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.4, 0.9, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color="white" />
        {/* Hand */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
      </mesh>

      <mesh ref={rightArmRef} position={[0.4, 0.9, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color="white" />
        {/* Hand */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
      </mesh>

      {/* Legs/Shoes */}
      <group position={[0, -0.3, 0]}>
        <mesh position={[-0.2, 0, 0]}>
           <cylinderGeometry args={[0.1, 0.1, 0.6]} />
           <meshStandardMaterial color="white" />
           {/* Shoe */}
           <mesh position={[0, -0.3, 0.1]} scale={[1, 0.5, 1.5]}>
             <sphereGeometry args={[0.12]} />
             <meshStandardMaterial color="#be123c" />
           </mesh>
        </mesh>
        <mesh position={[0.2, 0, 0]}>
           <cylinderGeometry args={[0.1, 0.1, 0.6]} />
           <meshStandardMaterial color="white" />
           {/* Shoe */}
           <mesh position={[0, -0.3, 0.1]} scale={[1, 0.5, 1.5]}>
             <sphereGeometry args={[0.12]} />
             <meshStandardMaterial color="#be123c" />
           </mesh>
        </mesh>
      </group>

    </group>
  );
};

interface Masha3DProps {
  action: MashaAction;
}

export const Masha3D: React.FC<Masha3DProps> = ({ action }) => {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 1.5, 6], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1.2} castShadow />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />
        
        <MashaCharacter action={action} />
        <BearCharacter />
        {action === 'sleeping' && <Bed />}
        
        {/* Floor shadow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#5f9ea0" opacity={0.4} transparent />
        </mesh>
        
        {/* Static Camera - No Controls */}
        {/* <OrbitControls /> removed to keep map static */}
      </Canvas>
    </div>
  );
};
