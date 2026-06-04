'use client'

import React, { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, Environment } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  Butterfly – follows cursor across full viewport                    */
/* ------------------------------------------------------------------ */
function Butterfly({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/fantasy_butterfly_animation.glb')
  const { actions } = useAnimations(animations, groupRef)
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0))
  const velocity = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  // Play animation on mount
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0]
      if (firstAction) {
        firstAction.reset().fadeIn(0.5).play()
        firstAction.setLoop(THREE.LoopRepeat, Infinity)
        firstAction.timeScale = 2
      }
    }
  }, [actions])

  useFrame((state) => {
    if (!groupRef.current) return

    // Normalize mouse to -1..1 based on viewport
    const x = (mousePosition.x / window.innerWidth) * 2 - 1
    const y = -((mousePosition.y / window.innerHeight) * 2 - 1)

    // Target in 3D viewport space
    targetPosition.current.set(
      x * viewport.width * 0.5,
      y * viewport.height * 0.5,
      0
    )

    const prevX = groupRef.current.position.x
    const prevY = groupRef.current.position.y

    // Smooth lerp
    groupRef.current.position.lerp(targetPosition.current, 0.08)

    velocity.current.x = groupRef.current.position.x - prevX
    velocity.current.y = groupRef.current.position.y - prevY

    // Tilt based on velocity
    const tiltZ = THREE.MathUtils.clamp(-velocity.current.x * 15, -0.6, 0.6)
    const tiltX = THREE.MathUtils.clamp(velocity.current.y * 10, -0.4, 0.4)

    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, tiltZ, 0.1)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, tiltX, 0.1)

    // Subtle floating motion
    groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 2.5) * 0.003
  })

  return (
    <group ref={groupRef} scale={1.5} rotation={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Loading fallback                                                   */
/* ------------------------------------------------------------------ */
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */
function Scene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#fbbf24" />
      <pointLight position={[0, 0, 5]} intensity={1} color="#ef4444" />

      <Suspense fallback={<LoadingFallback />}>
        <Butterfly mousePosition={mousePosition} />
        <Environment preset="night" />
      </Suspense>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Full-page Canvas wrapper                                           */
/* ------------------------------------------------------------------ */
export default function ButterflyCanvas() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        className="fixed inset-0"
        style={{ zIndex: 1, pointerEvents: 'none' }}
      >
        <Scene mousePosition={mousePosition} />
      </Canvas>
      {/* Dark overlay for text readability */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse at center, rgba(5,7,10,0.45) 0%, rgba(5,7,10,0.78) 100%)',
        }}
      />
    </>
  )
}

useGLTF.preload('/fantasy_butterfly_animation.glb')
