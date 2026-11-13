'use client'

import { useState, useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import type { ExpressionId } from './cat/expressions'
import MascotFallback from './MascotFallback'

export interface MascotCardProps {
  emotion?: ExpressionId
  pokeKey?: number
  pointerRef?: React.RefObject<{ x: number; y: number; inside: boolean } | null>
  cameraPosition?: [number, number, number]
  autoPoke?: boolean
  autoPokeInterval?: number
  className?: string
  onPoke?: () => void
}

const MascotScene = dynamic(() => import('./MascotScene'), {
  ssr: false,
})

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    return Boolean(gl)
  } catch {
    return false
  }
}

const emptySubscribe = () => () => {}

export function MascotCard({
  emotion = 'happy',
  pokeKey = 0,
  pointerRef,
  cameraPosition,
  autoPoke = true,
  autoPokeInterval = 5000,
  className = '',
  onPoke,
}: MascotCardProps) {
  const [is3DReady, setIs3DReady] = useState(false)

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  const hasWebGL = useSyncExternalStore(
    emptySubscribe,
    checkWebGLSupport,
    () => true,
  )

  // Before mount (SSR / first paint) or if WebGL is unavailable:
  // Immediately render the 2D Mascot illustration so there is zero empty flash!
  if (!mounted || !hasWebGL) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center p-2.5 ${className}`}>
        <MascotFallback emotion={emotion} className="w-full h-full" />
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* 2D Mascot is shown immediately until 3D scene finishes initial frame render */}
      <div
        className={`absolute inset-0 flex items-center justify-center p-2.5 transition-opacity duration-500 pointer-events-none ${
          is3DReady ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <MascotFallback emotion={emotion} className="w-full h-full" />
      </div>

      {/* 3D Scene fades in seamlessly once ready */}
      <div
        className={`relative w-full h-full transition-opacity duration-500 ${
          is3DReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <MascotScene
          expression={emotion}
          pokeKey={pokeKey}
          pointerRef={pointerRef}
          cameraPosition={cameraPosition}
          autoPoke={autoPoke}
          autoPokeInterval={autoPokeInterval}
          onPoke={onPoke}
          onReady={() => setIs3DReady(true)}
        />
      </div>
    </div>
  )
}

export default MascotCard
