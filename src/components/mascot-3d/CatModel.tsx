'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { buildCat } from './cat/buildCat'
import type { ExpressionId } from './cat/expressions'
import {
  createClayMaterials,
  createToonMaterials,
  disposeMaterials,
  type Finish,
} from './cat/materials'
import { CatAnimator } from './cat/motion'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'

export interface CatModelProps {
  expression?: ExpressionId
  finish?: Finish
  outline?: boolean
  pokeKey?: number
  pointerRef?: React.RefObject<{ x: number; y: number; inside: boolean } | null>
  autoPoke?: boolean
  autoPokeInterval?: number
  onPoke?: () => void
  onHoverChange?: (hovered: boolean) => void
}

const noRaycast = () => {}
/** Drags longer than this (in px) are not taps. */
const TAP_SLOP = 8

// Maximum gaze angles (±28° yaw, ±16° pitch)
const MAX_YAW = (28 * Math.PI) / 180
const MAX_PITCH = (16 * Math.PI) / 180

export function CatModel({
  expression = 'happy',
  finish = 'toon',
  outline = true,
  pokeKey = 0,
  pointerRef,
  autoPoke = true,
  autoPokeInterval = 5000,
  onPoke,
  onHoverChange,
}: CatModelProps) {
  const toon = useMemo(() => createToonMaterials(), [])
  const clay = useMemo(() => createClayMaterials(), [])

  useEffect(
    () => () => {
      disposeMaterials(toon)
      disposeMaterials(clay)
    },
    [toon, clay],
  )

  const materials = finish === 'toon' ? toon : clay

  // Cached geometry assembly
  const build = useMemo(() => {
    const cat = buildCat(expression, materials, { outline })
    cat.root.traverse((object) => {
      if (object instanceof THREE.Mesh && !object.name.startsWith('Ear_')) {
        object.raycast = noRaycast
      }
    })
    return cat
  }, [expression, materials, outline])

  const animator = useMemo(() => new CatAnimator(), [])
  useEffect(() => () => animator.dispose(), [animator])

  const reduceMotion = usePrefersReducedMotion()
  const motion = useRef<THREE.Group>(null)
  const gl = useThree((state) => state.gl)
  const get = useThree((state) => state.get)

  const poke = () => {
    if (!reduceMotion) {
      animator.react(expression, get().clock.getElapsedTime(), materials, outline)
    }
    onPoke?.()
  }

  // Pop animation on expression switch
  const shownExpression = useRef(expression)
  useEffect(() => {
    if (shownExpression.current === expression) return
    shownExpression.current = expression
    if (!reduceMotion) {
      animator.pop(expression, get().clock.getElapsedTime(), materials, outline)
    }
  }, [expression, reduceMotion, materials, outline, animator, get])

  // External poke trigger
  const lastPoke = useRef(pokeKey)
  useEffect(() => {
    if (pokeKey === lastPoke.current) return
    lastPoke.current = pokeKey
    if (!reduceMotion) {
      animator.react(expression, get().clock.getElapsedTime(), materials, outline)
    }
  }, [pokeKey, expression, reduceMotion, materials, outline, animator, get])

  // Auto-poke timer (default every 5s)
  useEffect(() => {
    if (!autoPoke || reduceMotion) return
    const interval = window.setInterval(() => {
      animator.react(expression, get().clock.getElapsedTime(), materials, outline)
    }, autoPokeInterval)
    return () => window.clearInterval(interval)
  }, [autoPoke, autoPokeInterval, reduceMotion, expression, materials, outline, animator, get])

  // Canvas hover detection for local fallback
  const pointerInside = useRef(false)

  useEffect(() => {
    const canvas = gl.domElement
    const enter = () => (pointerInside.current = true)
    const leave = () => {
      pointerInside.current = false
      onHoverChange?.(false)
    }
    canvas.addEventListener('pointerenter', enter)
    canvas.addEventListener('pointerleave', leave)
    return () => {
      canvas.removeEventListener('pointerenter', enter)
      canvas.removeEventListener('pointerleave', leave)
    }
  }, [gl, onHoverChange])

  const scratch = useMemo(
    () => ({
      ray: new THREE.Raycaster(),
      point: new THREE.Vector3(),
      goal: new THREE.Vector2(),
    }),
    [],
  )

  useFrame((state, delta) => {
    const group = motion.current
    if (!group) return

    if (reduceMotion) {
      animator.rest(group, build)
      return
    }

    let lookGoal: THREE.Vector2 | null = null
    const parent = group.parent

    if (pointerRef?.current && pointerRef.current.inside) {
      // Use Hero-level pointerRef (normalized: x in [-1, 1], y in [-1, 1])
      const { x, y } = pointerRef.current
      const yaw = THREE.MathUtils.clamp(x * MAX_YAW * 1.1, -MAX_YAW, MAX_YAW)
      const pitch = THREE.MathUtils.clamp(-y * MAX_PITCH * 1.1, -MAX_PITCH, MAX_PITCH)
      lookGoal = scratch.goal.set(yaw, pitch)
    } else if (pointerInside.current && parent) {
      // Fallback: look at cursor over canvas
      const { ray, point, goal } = scratch
      ray.setFromCamera(state.pointer, state.camera)
      const distance = state.camera.position.distanceTo(parent.getWorldPosition(point))
      parent.worldToLocal(ray.ray.at(distance * 0.6, point))
      const yaw = Math.atan2(point.x, Math.max(0.2, point.z))
      const pitch = Math.atan2(point.y - 0.15, Math.hypot(point.x, point.z))
      lookGoal = goal.set(
        THREE.MathUtils.clamp(yaw * 0.7, -MAX_YAW, MAX_YAW),
        THREE.MathUtils.clamp(-pitch * 0.6, -MAX_PITCH, MAX_PITCH),
      )
    }

    animator.update(
      group,
      build,
      state.clock.getElapsedTime(),
      Math.min(delta, 1 / 20),
      lookGoal,
      state.camera,
    )
  })

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (event.delta > TAP_SLOP) return
    poke()
  }

  const onPointerOver = (event: ThreeEvent<PointerEvent>) => {
    onHoverChange?.(true)
    if (reduceMotion) return
    const name = event.object.name
    if (name === 'Ear_L') animator.twitchEar(0, get().clock.getElapsedTime())
    if (name === 'Ear_R') animator.twitchEar(1, get().clock.getElapsedTime())
  }

  const onPointerOut = () => {
    onHoverChange?.(false)
  }

  return (
    <>
      <group
        ref={motion}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <primitive object={build.root} />
        {/* Hit proxy for efficient clicks over head volume */}
        <mesh visible={false} scale={[1.16, 0.98, 0.95]} name="HitProxy">
          <sphereGeometry args={[1, 24, 16]} />
        </mesh>
      </group>
      <primitive object={animator.particles.group} />
    </>
  )
}

export default CatModel
