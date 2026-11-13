'use client'

import { useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import type { ExpressionId } from './cat/expressions'
import MascotFallback from './MascotFallback'

export interface MascotCardProps {
  emotion?: ExpressionId
  pokeKey?: number
  pointerRef?: React.RefObject<{ x: number; y: number; inside: boolean } | null>
  className?: string
  onPoke?: () => void
}

function MascotSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center select-none ${className}`}
      aria-label="Đang tải mascot 3D..."
    >
      <div className="relative flex items-center justify-center animate-pulse">
        {/* Soft emerald outer aura */}
        <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-xl absolute" />
        {/* Mascot silhouette placeholder */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-emerald-100/70 to-emerald-200/40 dark:from-emerald-950/60 dark:to-emerald-900/30 border border-emerald-500/20 shadow-inner flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20 flex items-center justify-center">
            <span className="text-2xl animate-bounce">🐾</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const MascotScene = dynamic(() => import('./MascotScene'), {
  ssr: false,
  loading: () => <MascotSkeleton />,
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
  className = '',
  onPoke,
}: MascotCardProps) {
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

  if (!mounted) {
    return <MascotSkeleton className={className} />
  }

  if (!hasWebGL) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <MascotFallback emotion={emotion} />
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <MascotScene
        expression={emotion}
        pokeKey={pokeKey}
        pointerRef={pointerRef}
        onPoke={onPoke}
      />
    </div>
  )
}

export default MascotCard
