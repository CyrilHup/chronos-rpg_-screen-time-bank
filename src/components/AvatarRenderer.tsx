import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Torus, Box, Icosahedron, Sparkles, Stars, Float, OrbitControls } from '@react-three/drei';
import { Avatar } from '../types';

interface AvatarRendererProps {
  avatar: Avatar;
  className?: string;
}

const CosmeticAttachment: React.FC<{ type: string; id: string; stage: number }> = ({ type, id, stage }) => {
  // Helper to adjust position based on stage
  const getHatPosition = (baseY: number): [number, number, number] => {
      const distortionOffset = 0.6; // Increased buffer for distortion
      switch (stage) {
          case 1: return [0, baseY + distortionOffset, 0]; 
          case 2: return [0, baseY + 0.3 + distortionOffset, 0]; 
          case 3: return [0, baseY + 0.5 + distortionOffset, 0]; 
          case 4: return [0, baseY + 0.4 + distortionOffset, 0]; 
          case 5: return [0, baseY + 0.8 + distortionOffset, 0]; 
          default: return [0, baseY + distortionOffset, 0];
      }
  };

  const getCapePosition = (baseZ: number): [number, number, number] => {
       const distortionOffset = 0.6; // Increased buffer
       switch (stage) {
          case 1: return [0, 0, baseZ - distortionOffset];
          case 2: return [0, 0, baseZ - 0.2 - distortionOffset];
          case 3: return [0, 0, baseZ - 0.4 - distortionOffset];
          case 4: return [0, 0, baseZ + 0.2]; 
          case 5: return [0, 0, baseZ - 0.6 - distortionOffset];
          default: return [0, 0, baseZ - distortionOffset];
      }
  };

  // Hat Logic
  if (type === 'hat') {
    if (id === 'c1') { // Neon Halo
      return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group position={getHatPosition(1.2)}>
             {/* Core Ring */}
             <Torus args={[0.8, 0.05, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
             </Torus>
             {/* Outer Glow Ring */}
             <Torus args={[0.9, 0.02, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} transparent opacity={0.3} />
             </Torus>
          </group>
        </Float>
      );
    }
    if (id === 'c2') { // Cyber Visor
      const pos = getHatPosition(0.3);
      return (
        <group position={[pos[0], pos[1], 1.4 + stage * 0.1]}>
           {/* Main Visor */}
           <Box args={[1.0, 0.25, 0.1]}>
             <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1.5} opacity={0.9} transparent />
           </Box>
           {/* Side Bars */}
           <Box args={[0.1, 0.25, 0.6]} position={[0.55, 0, -0.3]}>
             <meshStandardMaterial color="#333" />
           </Box>
           <Box args={[0.1, 0.25, 0.6]} position={[-0.55, 0, -0.3]}>
             <meshStandardMaterial color="#333" />
           </Box>
        </group>
      );
    }
    if (id === 'c10') { // Samurai Helm
      const pos = getHatPosition(0.6);
      return (
        <group position={pos}>
           {/* Crest */}
           <Torus args={[0.7, 0.08, 16, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
             <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
           </Torus>
           {/* Central Ornament */}
           <Box args={[0.3, 0.5, 0.3]} position={[0, 0.6, 0]}>
             <meshStandardMaterial color="#ff0000" emissive="#500000" />
           </Box>
           {/* Side Horns */}
           <Box args={[0.1, 0.6, 0.1]} position={[0.6, 0.4, 0]} rotation={[0, 0, -0.5]}>
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
           </Box>
           <Box args={[0.1, 0.6, 0.1]} position={[-0.6, 0.4, 0]} rotation={[0, 0, 0.5]}>
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
           </Box>
        </group>
      );
    }
  }

  // Cape Logic
  if (type === 'cape') {
    if (id === 'c4') { // Golden Wings
      return (
        <group position={getCapePosition(-0.8)} rotation={[0.2, 0, 0]}>
           {/* Left Wing */}
           <Box args={[1.2, 0.4, 0.05]} position={[-0.8, 0.5, 0]} rotation={[0, 0, 0.5]}>
             <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
           </Box>
           <Box args={[1.0, 0.4, 0.05]} position={[-0.7, 0.1, 0]} rotation={[0, 0, 0.3]}>
             <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
           </Box>
           {/* Right Wing */}
           <Box args={[1.2, 0.4, 0.05]} position={[0.8, 0.5, 0]} rotation={[0, 0, -0.5]}>
             <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
           </Box>
           <Box args={[1.0, 0.4, 0.05]} position={[0.7, 0.1, 0]} rotation={[0, 0, -0.3]}>
             <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
           </Box>
           {/* Center Piece */}
           <Box args={[0.4, 0.8, 0.1]} position={[0, 0.2, 0]}>
              <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
           </Box>
        </group>
      );
    }
    if (id === 'c7') { // Void Cape
      return (
        <group position={getCapePosition(-0.8)} rotation={[0.1, 0, 0]}>
           <Box args={[1.4, 2.0, 0.1]}>
             <meshStandardMaterial color="#111" roughness={0.9} />
           </Box>
           {/* Bottom tattered effect (simulated with smaller boxes) */}
           <Box args={[0.3, 0.5, 0.1]} position={[-0.4, -1.1, 0]}>
              <meshStandardMaterial color="#111" roughness={0.9} />
           </Box>
           <Box args={[0.3, 0.4, 0.1]} position={[0.4, -1.05, 0]}>
              <meshStandardMaterial color="#111" roughness={0.9} />
           </Box>
        </group>
      );
    }
  }

  // Aura Logic (Attached to Avatar)
  if (type === 'aura') {
    if (id === 'c3') { // Matrix Aura
      return <Sparkles count={60} scale={5 + stage * 0.5} size={3} speed={0.5} opacity={0.6} color="#00ff00" />;
    }
    if (id === 'c9') { // Glitch Effect
      return (
        <group>
           <Sparkles count={40} scale={4 + stage * 0.5} size={6} speed={3} opacity={0.8} color="#ff00ff" noise={1} />
           <mesh>
             <sphereGeometry args={[1.4 + stage * 0.1, 32, 32]} />
             <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.15} />
           </mesh>
        </group>
      );
    }
  }

  return null;
};

const BackgroundEffect: React.FC<{ id: string }> = ({ id }) => {
    if (id === 'c5') { // Zen Garden
        return <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />;
    }
    if (id === 'c8') { // Cosmic Void
        return (
            <group>
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={1} fade speed={0.5} />
                <mesh scale={100}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshBasicMaterial color="#0a0a1a" side={2} />
                </mesh>
            </group>
        );
    }
    return null;
};

const AvatarMesh: React.FC<{ avatar: Avatar }> = ({ avatar }) => {

  // Evolution Stage Logic - 5 Stages
  const { color, scale, distort, speed, geometry } = useMemo(() => {
    const stage = avatar.evolutionStage;
    
    if (stage === 1) {
      return { color: "#6B9080", scale: 1.5, distort: 0.3, speed: 1.5, geometry: 'sphere' };
    } else if (stage === 2) {
      return { color: "#A4C3B2", scale: 1.8, distort: 0.4, speed: 2, geometry: 'icosahedron' };
    } else if (stage === 3) {
      return { color: "#CCE3DE", scale: 2.1, distort: 0.5, speed: 2.5, geometry: 'dodecahedron' };
    } else if (stage === 4) {
      return { color: "#EAF4F4", scale: 2.3, distort: 0.6, speed: 3, geometry: 'torusKnot' };
    } else { // Stage 5+
      return { color: "#F6FFF8", scale: 2.5, distort: 0.8, speed: 4, geometry: 'octahedron' };
    }
  }, [avatar.evolutionStage]);

  // Clothes Logic (modifies base material)
  const clothesColor = useMemo(() => {
      const clothesId = avatar.equippedCosmetics['clothes'];
      if (clothesId === 'c6') return "#8b5cf6"; // Neural Robes (Violet)
      if (clothesId === 'c11') return "#fbbf24"; // Solar Robes (Gold)
      if (clothesId === 'c12') return "#1f2937"; // Void Robes (Dark Grey)
      if (clothesId === 'c13') return "#06b6d4"; // Cyber Tunic (Cyan)
      return color;
  }, [avatar.equippedCosmetics, color]);

  const renderGeometry = () => {
      const materialProps = {
          color: clothesColor,
          distort: distort,
          speed: speed,
          roughness: 0.2,
          metalness: 0.6
      };

      switch (geometry) {
          case 'sphere':
              return <Sphere args={[1, 64, 64]} scale={scale}><MeshDistortMaterial {...materialProps} /></Sphere>;
          case 'icosahedron':
              return <Icosahedron args={[1, 0]} scale={scale}><MeshDistortMaterial {...materialProps} /></Icosahedron>;
          case 'dodecahedron':
              // Dodecahedron isn't a standard drei primitive, using Icosahedron with detail 1 or Sphere with low poly? 
              // Actually Drei has Icosahedron, Octahedron, Tetrahedron. No Dodecahedron.
              // Let's use Octahedron for stage 3 and TorusKnot for stage 4.
              // Wait, I defined 'dodecahedron' above. Let's use Octahedron instead.
              return <Icosahedron args={[1, 1]} scale={scale}><MeshDistortMaterial {...materialProps} wireframe /></Icosahedron>; // Placeholder for distinct look
          case 'torusKnot':
              return (
                  <mesh scale={scale * 0.6}>
                      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
                      <MeshDistortMaterial {...materialProps} />
                  </mesh>
              );
          case 'octahedron':
               return (
                   <mesh scale={scale}>
                       <octahedronGeometry args={[1, 0]} />
                       <MeshDistortMaterial {...materialProps} />
                   </mesh>
               );
          default:
              return <Sphere args={[1, 64, 64]} scale={scale}><MeshDistortMaterial {...materialProps} /></Sphere>;
      }
  };

  return (
    <group>
      {/* Render Background Effect if equipped */}
      {avatar.equippedCosmetics['background'] && <BackgroundEffect id={avatar.equippedCosmetics['background']} />}

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        {renderGeometry()}
        
        {/* Render Equipped Cosmetics attached to the avatar group */}
        {Object.entries(avatar.equippedCosmetics).map(([type, id]) => {
            if (type === 'background') return null; // Handled separately
            return <CosmeticAttachment key={type} type={type} id={id} stage={avatar.evolutionStage} />;
        })}
      </Float>
    </group>
  );
};

const AvatarRenderer: React.FC<AvatarRendererProps> = ({ avatar, className }) => {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#A4C3B2" />
        <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
        
        <AvatarMesh avatar={avatar} />
        
        <OrbitControls enableZoom={true} minDistance={3} maxDistance={8} autoRotate autoRotateSpeed={1} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI - Math.PI / 4} />
      </Canvas>
    </div>
  );
};

export default AvatarRenderer;
