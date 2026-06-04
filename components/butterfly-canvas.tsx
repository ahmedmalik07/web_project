'use client'

import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, Center } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  Debug sphere – renders immediately so we know the Canvas is alive  */
/* ------------------------------------------------------------------ */
function DebugSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(s.clock.elapsedTime * 2) * 0.15
    }
  })
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={5} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/*  Butterfly model                                                   */
/* ------------------------------------------------------------------ */
function ButterflyModel() {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/fantasy_butterfly_animation.glb')
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (actions) {
      const keys = Object.keys(actions)
      if (keys.length > 0) {
        actions[keys[0]]?.reset().play()
      }
    }
  }, [actions])

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.roughness = 0.2
          child.material.metalness = 0.7
          child.material.emissive = new THREE.Color('#ef4444')
          child.material.emissiveIntensity = 1.5
        }
      }
    })
  }, [scene])

  // Cursor tracking
  useFrame((state) => {
    if (!group.current) return
    const { width, height } = state.viewport

    const targetX = state.pointer.x * (width / 2.5)
    const targetY = state.pointer.y * (height / 2.5)

    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      targetX,
      0.1
    )
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      targetY,
      0.1
    )

    const dx = targetX - group.current.position.x
    const dy = targetY - group.current.position.y

    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      -dx * 0.4,
      0.12
    )
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      dy * 0.3 + 0.2,
      0.12
    )
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      dx * 0.6,
      0.12
    )
  })

  return (
    <group ref={group}>
      <Center>
        <primitive
          object={scene}
          scale={0.04}
          rotation={[Math.PI / 2, Math.PI, 0]}
        />
      </Center>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Scene                                                             */
/* ------------------------------------------------------------------ */
function Scene() {
  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight position={[0, 5, 5]} intensity={3} color="#ffffff" />
      <pointLight position={[-4, 4, 2]} intensity={5} color="#ef4444" distance={20} />
      <pointLight position={[4, -4, 2]} intensity={5} color="#f97316" distance={20} />
      <spotLight position={[0, 8, 0]} intensity={3} color="#ef4444" angle={0.6} penumbra={1} distance={30} />

      <Suspense fallback={<DebugSphere />}>
        <ButterflyModel />
      </Suspense>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Fixed full-viewport Canvas                                        */
/* ------------------------------------------------------------------ */
export default function ButterflyCanvas() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <Scene />
      </Canvas>
      {/* Dark vignette overlay on top of the Canvas but below content */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(5,7,10,0.45) 0%, rgba(5,7,10,0.78) 100%)',
        }}
      />
    </>
  )
}

// Model will be loaded by useGLTF inside ButterflyModel
