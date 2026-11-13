'use client'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { CatModel } from './CatModel'
import type { ExpressionId } from './cat/expressions'
import type { Finish } from './cat/materials'

export interface MascotSceneProps {
  expression?: ExpressionId
  finish?: Finish
  outline?: boolean
  pokeKey?: number
  pointerRef?: React.RefObject<{ x: number; y: number; inside: boolean } | null>
  cameraPosition?: [number, number, number]
  autoPoke?: boolean
  autoPokeInterval?: number
  className?: string
  onPoke?: () => void
  onReady?: () => void
}

export function MascotScene({
  expression = 'happy',
  finish = 'toon',
  outline = true,
  pokeKey = 0,
  pointerRef,
  cameraPosition = [0, 0.1, 7.8],
  autoPoke = true,
  autoPokeInterval = 5000,
  className = '',
  onPoke,
  onReady,
}: MascotSceneProps) {
  const [cursor, setCursor] = useState<'default' | 'pointer'>('default')

  return (
    <div
      className={`relative w-full h-full select-none ${className}`}
      style={{ touchAction: 'pan-y', cursor }}
    >
      <Canvas
        flat
        dpr={[1, 1.75]}
        onCreated={() => onReady?.()}
        camera={{
          fov: 30,
          near: 0.1,
          far: 50,
          position: cameraPosition,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{
          width: '100%',
          height: '100%',
          touchAction: 'pan-y',
          pointerEvents: 'auto',
        }}
      >
        {/* Ambient & Key Lighting tuned for Toon finish */}
        <ambientLight intensity={1.4} color="#ffffff" />
        <directionalLight position={[2.5, 4, 5]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-3, 2, -2]} intensity={0.7} color="#f4fedb" />

        {/* 3D Procedural Cat Character */}
        <CatModel
          expression={expression}
          finish={finish}
          outline={outline}
          pokeKey={pokeKey}
          pointerRef={pointerRef}
          autoPoke={autoPoke}
          autoPokeInterval={autoPokeInterval}
          onPoke={onPoke}
          onHoverChange={(hovered) => setCursor(hovered ? 'pointer' : 'default')}
        />

        {/* Ground ambient contact shadow */}
        <ContactShadows
          position={[0, -1.08, 0]}
          scale={4.2}
          blur={2.4}
          far={2.0}
          opacity={0.35}
          color="#1e3a1e"
        />
      </Canvas>
    </div>
  )
}

export default MascotScene
