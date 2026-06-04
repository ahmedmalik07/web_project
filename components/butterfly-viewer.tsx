'use client'

import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

function Butterfly() {
  const group = useRef<THREE.Group>(null)
  
  // Load the butterfly model
  const { scene, animations } = useGLTF('/fantasy_butterfly_animation.glb')
  
  // Load animations
  const { actions } = useAnimations(animations, group)

  // Play animation clip (e.g., flapping wings)
  useEffect(() => {
    if (actions) {
      const actionKeys = Object.keys(actions)
      if (actionKeys.length > 0) {
        // Play the first animation clip
        actions[actionKeys[0]]?.reset().play()
      }
    }
  }, [actions])

  // Track cursor position and move the butterfly smoothly
  useFrame((state) => {
    if (group.current) {
      // Normalize pointer [-1, 1] to 3D space dimensions
      // The viewport aspect ratio is used to size movements correctly
      const { width, height } = state.viewport
      const targetX = (state.pointer.x * width) / 2.2
      const targetY = (state.pointer.y * height) / 2.2
      
      // Interpolate position (higher speed gives a snappy, lag-free flight feel)
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.12)
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.12)
      
      // Dynamic rotation depending on direction of movement (simulating banking/pitching)
      const dx = targetX - group.current.position.x
      const dy = targetY - group.current.position.y
      
      // Banking (Roll) - rotate around Z axis
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -dx * 0.35, 0.15)
      
      // Pitching - rotate around X axis
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, dy * 0.25 + 0.2, 0.15)
      
      // Yaw - face path direction
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, dx * 0.5, 0.15)
    }
  })

  // Apply a glowing emissive look if the model material supports it,
  // and scale/rotate the model to look upright.
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.castShadow = true
        child.receiveShadow = true
        
        // Enhance visual quality for the fantasy/cyber theme
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.roughness = 0.15
          child.material.metalness = 0.8
          // Add a subtle neon crimson glow if possible
          child.material.emissive = new THREE.Color('#ef4444')
          child.material.emissiveIntensity = 0.85
        }
      }
    })
  }, [scene])

  return (
    <group ref={group} dispose={null}>
      {/* Base orientation adjustment */}
      <primitive 
        object={scene} 
        scale={0.028} // Larger scale so it's visible as a background element
        rotation={[Math.PI / 2, Math.PI, 0]} // Face upwards/towards camera
      />
    </group>
  )
}

// Preload the asset to prevent stuttering on first render
useGLTF.preload('/fantasy_butterfly_animation.glb')

export default function ButterflyViewer() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Soft environmental lighting */}
        <ambientLight intensity={1.5} />
        
        {/* Directional light that cast shadows */}
        <directionalLight
          position={[0, 5, 5]}
          intensity={3.0}
          color="#ffffff"
        />
        
        {/* Neon Cyberpunk ambient highlights */}
        <pointLight position={[-5, 5, 2]} intensity={4.0} color="#ef4444" />
        <pointLight position={[5, -5, 2]} intensity={4.0} color="#f97316" />
        <spotLight position={[0, 10, 0]} intensity={2.0} color="#ef4444" angle={0.5} penumbra={1} />
        
        <Suspense fallback={null}>
          <Butterfly />
        </Suspense>
      </Canvas>
    </div>
  )
}
