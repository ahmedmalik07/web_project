'use client'

import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center, Float } from '@react-three/drei'
import * as THREE from 'three'

// --- Procedural 3D Golden Trophy ---
function ProceduralTrophy() {
  const trophyRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (trophyRef.current) {
      trophyRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
    }
  })

  return (
    <group ref={trophyRef}>
      {/* Base: Black Marble/Slate */}
      <mesh position={[0, -1.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.8, 32]} />
        <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Gold Ring on Base */}
      <mesh position={[0, -1.35, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.15, 0.1, 32]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Stem / Pillars */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 1.4, 32]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Main Cup Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[1.3, 0.4, 1.5, 32]} />
        <meshStandardMaterial color="#d97706" roughness={0.15} metalness={0.9} />
      </mesh>
      
      {/* Cup Rim */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <torusGeometry args={[1.25, 0.08, 16, 100]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Handle Left */}
      <mesh position={[-1.2, 0.8, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <torusGeometry args={[0.6, 0.08, 16, 100, Math.PI * 1.2]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Handle Right */}
      <mesh position={[1.2, 0.8, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <torusGeometry args={[0.6, 0.08, 16, 100, Math.PI * 1.2]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Top Ornament / Ball */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  )
}

// --- Procedural 3D Cricket Ball ---
function ProceduralCricketBall() {
  const ballRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ballRef.current) {
      ballRef.current.rotation.y = state.clock.getElapsedTime() * 0.6
      ballRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.3
    }
  })

  return (
    <group ref={ballRef}>
      {/* Red Leather Sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          color="#991b1b" 
          roughness={0.25} 
          metalness={0.15} 
          bumpScale={0.05}
        />
      </mesh>

      {/* White Stitched Seam */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Main seam ridge */}
        <mesh castShadow>
          <torusGeometry args={[1.505, 0.03, 8, 120]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        
        {/* Stitching details (dotted mesh ring) */}
        <mesh rotation={[0, 0, 0.02]} castShadow>
          <torusGeometry args={[1.51, 0.015, 8, 80]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

// --- Procedural 3D Cricket Bat ---
function ProceduralCricketBat() {
  const batRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (batRef.current) {
      batRef.current.rotation.y = state.clock.getElapsedTime() * 0.4
      batRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
    }
  })

  return (
    <group ref={batRef} position={[0, -0.5, 0]}>
      {/* Blade (Wooden part) */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 2.2, 0.25]} />
        <meshStandardMaterial color="#d9a05b" roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Flat face edge slopes */}
      <mesh position={[0, 0.4, 0.125]} castShadow>
        <boxGeometry args={[0.5, 2.2, 0.01]} />
        <meshStandardMaterial color="#c08c4a" roughness={0.45} />
      </mesh>

      {/* Shoulder (Curved transitions) */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial color="#d9a05b" roughness={0.4} />
      </mesh>

      {/* Handle (Rubber grip) */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 1.2, 32]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Grip wrap lines */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[0, 1.6 + i * 0.18, 0]}>
          <torusGeometry args={[0.135, 0.015, 8, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      ))}

      {/* Rubber Cap (Top of handle) */}
      <mesh position={[0, 2.7, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.13, 0.06, 32]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.7} />
      </mesh>
    </group>
  )
}

// --- GLB File Loader ---
interface GLBModelProps {
  url: string
}

function GLBModel({ url }: GLBModelProps) {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.4
    }
  })

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={2} />
    </group>
  )
}

interface ThreeViewerProps {
  type: 'trophy' | 'ball' | 'bat' | 'glb'
  glbUrl?: string
}

export default function ThreeViewer({ type, glbUrl }: ThreeViewerProps) {
  return (
    <div className="w-full h-full relative" style={{ minHeight: '300px' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={2.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, -5]} intensity={2.0} color="#ef4444" />
        <pointLight position={[5, -5, 5]} intensity={2.0} color="#f97316" />

        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
            <Center>
              {type === 'trophy' && <ProceduralTrophy />}
              {type === 'ball' && <ProceduralCricketBall />}
              {type === 'bat' && <ProceduralCricketBat />}
              {type === 'glb' && glbUrl && <GLBModel url={glbUrl} />}
            </Center>
          </Float>
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            maxPolarAngle={Math.PI / 1.8} 
            minPolarAngle={Math.PI / 4} 
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
