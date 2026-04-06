/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 */

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple animated sphere component
function AnimatedSphere({ position, color, speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.6}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

// Simple floating particles
function SimpleParticles() {
  const particlesRef = useRef();
  const particleCount = 30;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFD77A"
        size={0.03}
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Main 3D Scene
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#E6A520" />

      {/* Animated spheres */}
      <AnimatedSphere position={[-3, 1, -4]} color="#E6A520" speed={0.8} />
      <AnimatedSphere position={[3, -1, -6]} color="#FFD77A" speed={1.2} />
      <AnimatedSphere position={[0, 2, -5]} color="#7A4A00" speed={0.6} />
      
      {/* Simple particles */}
      <SimpleParticles />
    </>
  );
}

// Main Background3D component
const Background3D = () => {
  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ position: 'fixed' }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8E7] via-[#FFD77A]/20 to-[#E6A520]/30" />
      
      {/* 3D Canvas with error boundary */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ 
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#FFF8E7', 0);
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <React.Suspense fallback={null}>
            <Scene />
          </React.Suspense>
        </Canvas>
      </div>
      
      {/* CSS-only overlay patterns as fallback */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-highlight/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
    </div>
  );
};

export default Background3D;