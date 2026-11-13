import * as THREE from 'three'
import type { CatBuild } from './buildCat'
import type { ExpressionId, Motion } from './expressions'
import { dropShape, heartShape, mergeAll, puffyShape, sparkleShape, zShape } from './geometry'
import { OUTLINES, OUTLINE_NAME, type MaterialKey, type MaterialSet } from './materials'

/* -------------------------------------------------------------- helpers */

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
/** A 0 → 1 → 0 sine bump across the window [a, b] of progress `p`. */
const bump = (p: number, a: number, b: number) =>
  p <= a || p >= b ? 0 : Math.sin(((p - a) / (b - a)) * Math.PI)
const easeOutBack = (x: number) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2
const rand = (min: number, max: number) => min + Math.random() * (max - min)
const lerp = THREE.MathUtils.lerp
/** Calls `fn` `count` times with an index and an evenly spread fraction 0–1. */
const fan = (count: number, fn: (index: number, fraction: number) => void) => {
  for (let i = 0; i < count; i++) fn(i, count === 1 ? 0.5 : i / (count - 1))
}
const Z_AXIS = new THREE.Vector3(0, 0, 1)
/** Height of the chin below the head's center; squash and stretch pivot here. */
const CHIN = 0.93

/* ------------------------------------------------------------ particles */

export type ParticleKind = 'heart' | 'sparkle' | 'drop' | 'z' | 'puff'

const PARTICLE_MATERIAL: Record<ParticleKind, MaterialKey> = {
  heart: 'heart',
  sparkle: 'white',
  drop: 'tear',
  z: 'white',
  puff: 'white',
}

/** A little cumulus of three overlapping balls. */
function steamCloud() {
  const balls = (
    [
      [0, 0.012, 0.075],
      [-0.07, -0.018, 0.055],
      [0.068, -0.016, 0.058],
    ] as const
  ).map(([x, y, r]) => new THREE.SphereGeometry(r, 20, 14).translate(x, y, 0))
  return mergeAll(balls)
}

let particleGeometry: Record<ParticleKind, THREE.BufferGeometry> | null = null
function getParticleGeometry() {
  particleGeometry ??= {
    heart: puffyShape(heartShape(0.17), 0.04, 0.02),
    sparkle: puffyShape(sparkleShape(0.2), 0.03, 0.014),
    drop: puffyShape(dropShape(0.14), 0.035, 0.018),
    z: puffyShape(zShape(0.16), 0.035, 0.015),
    puff: steamCloud(),
  }
  return particleGeometry
}

interface EmitOptions {
  velocity: THREE.Vector3Tuple
  life?: number
  /** Downward pull; negative values float upward. */
  gravity?: number
  spin?: number
  size?: number
  /** Swell over the lifetime (steam). */
  grow?: boolean
  delay?: number
}

interface Particle {
  mesh: THREE.Mesh
  velocity: THREE.Vector3
  age: number
  life: number
  gravity: number
  spin: number
  roll: number
  size: number
  grow: boolean
}

/** Short-lived billboarded extras (hearts, tears, steam) launched by reactions. */
class ParticleSystem {
  readonly group = new THREE.Group()
  private particles: Particle[] = []
  private readonly toLocal = new THREE.Quaternion()
  private readonly spin = new THREE.Quaternion()

  constructor() {
    this.group.name = 'Particles'
  }

  emit(
    kind: ParticleKind,
    materials: MaterialSet,
    outline: boolean,
    origin: THREE.Vector3Tuple,
    options: EmitOptions,
  ) {
    const geometry = getParticleGeometry()[kind]
    const mesh = new THREE.Mesh(geometry, materials[PARTICLE_MATERIAL[kind]])
    mesh.name = `Particle_${kind}`
    mesh.raycast = () => {}
    if (outline) {
      const hull = new THREE.Mesh(geometry, OUTLINES.thin)
      hull.name = OUTLINE_NAME
      hull.raycast = () => {}
      mesh.add(hull)
    }
    mesh.position.set(...origin)
    mesh.visible = false
    this.group.add(mesh)
    this.particles.push({
      mesh,
      velocity: new THREE.Vector3(...options.velocity),
      age: -(options.delay ?? 0),
      life: options.life ?? 1,
      gravity: options.gravity ?? 0,
      spin: options.spin ?? rand(-3, 3),
      roll: rand(-0.4, 0.4),
      size: options.size ?? 1,
      grow: options.grow ?? false,
    })
  }

  update(dt: number, camera: THREE.Camera) {
    if (!this.particles.length) return
    // Face the camera regardless of how the turntable has rotated the group.
    this.group.getWorldQuaternion(this.toLocal).invert()
    this.particles = this.particles.filter((particle) => {
      const { mesh, velocity } = particle
      particle.age += dt
      if (particle.age < 0) return true
      if (particle.age >= particle.life) {
        this.group.remove(mesh)
        return false
      }
      velocity.y -= particle.gravity * dt
      velocity.multiplyScalar(1 - 0.6 * dt)
      mesh.position.addScaledVector(velocity, dt)
      particle.roll += particle.spin * dt

      const t = particle.age / particle.life
      const appear = easeOutBack(clamp01(particle.age / 0.18))
      const vanish = 1 - THREE.MathUtils.smoothstep(t, 0.65, 1)
      const growth = particle.grow ? 0.6 + 0.9 * t : 1
      mesh.scale.setScalar(Math.max(1e-4, particle.size * appear * vanish * growth))
      mesh.quaternion
        .copy(this.toLocal)
        .multiply(camera.quaternion)
        .multiply(this.spin.setFromAxisAngle(Z_AXIS, particle.roll))
      mesh.visible = true
      return true
    })
  }

  clear() {
    this.particles.forEach(({ mesh }) => this.group.remove(mesh))
    this.particles = []
  }
}

/* -------------------------------------------------------------- motion */

/** Everything layered onto the head each frame. Scales multiply, the rest adds. */
interface Offsets {
  y: number
  z: number
  roll: number
  turn: number
  pitch: number
  sx: number
  sy: number
  /** Folds both ears back. */
  earFold: number
  /** Swings both ears outward (negative perks them up). */
  earSpread: number
  tongueWiggle: number
  tongueStretch: number
}

const neutral = (): Offsets => ({
  y: 0,
  z: 0,
  roll: 0,
  turn: 0,
  pitch: 0,
  sx: 1,
  sy: 1,
  earFold: 0,
  earSpread: 0,
  tongueWiggle: 0,
  tongueStretch: 1,
})

function idle(motion: Motion, t: number, o: Offsets) {
  switch (motion) {
    case 'float':
      o.y += Math.sin(t * 1.3) * 0.035
      o.roll += Math.sin(t * 0.7) * 0.022
      break
    case 'bounce':
      o.y += Math.abs(Math.sin(t * 4.2)) * 0.07 - 0.03
      o.roll += Math.sin(t * 2.1) * 0.035
      break
    case 'shake': {
      // Bursts of trembling rage.
      const burst = Math.max(0, Math.sin(t * 1.6)) ** 4
      o.y += Math.sin(t * 1.3) * 0.012
      o.roll += Math.sin(t * 42) * 0.018 * burst
      break
    }
    case 'breathe':
      o.y += Math.sin(t * 0.9) * 0.03
      o.roll += Math.sin(t * 0.45) * 0.03
      o.sy *= 1 + Math.sin(t * 0.9) * 0.012
      break
    case 'sob': {
      const sobbing = Math.max(0, Math.sin(t * 0.9))
      o.y += -Math.abs(Math.sin(t * 7)) * 0.025 * sobbing + Math.sin(t * 0.9) * 0.01
      o.roll += Math.sin(t * 0.6) * 0.02
      break
    }
    case 'fidget':
      o.y += Math.sin(t * 1.5) * 0.02
      o.roll += Math.sin(t * 2.4) * 0.03
      o.turn += Math.sin(t * 1.2) * 0.12
      break
  }
}

type Emit = (kind: ParticleKind, origin: THREE.Vector3Tuple, options: EmitOptions) => void

interface Reaction {
  duration: number
  /** Layers the reaction onto `o` at progress `p` (0–1). */
  apply: (p: number, o: Offsets) => void
  burst: (emit: Emit) => void
}

/** What each mood does when poked. */
const REACTIONS: Record<ExpressionId, Reaction> = {
  happy: {
    // A springy hop: crouch, stretch into the air, squash on landing.
    duration: 1,
    apply: (p, o) => {
      const crouch = bump(p, 0, 0.2)
      const air = bump(p, 0.15, 0.72)
      const stretch = bump(p, 0.15, 0.45)
      const land = bump(p, 0.68, 0.9)
      o.y += air * 0.3
      o.sy *= 1 - 0.13 * crouch + 0.09 * stretch - 0.1 * land
      o.sx *= 1 + 0.09 * crouch - 0.05 * stretch + 0.08 * land
      o.earFold += 0.35 * air
    },
    burst: (emit) =>
      fan(6, (_, f) =>
        emit('sparkle', [lerp(-0.9, 0.9, f), 1.05, 0.35], {
          velocity: [lerp(-1.2, 1.2, f), rand(1.3, 1.9), 0.4],
          gravity: 2.6,
          size: rand(0.7, 1.1),
          delay: 0.12,
        }),
      ),
  },
  laughing: {
    // Belly-laugh giggles with tears of joy.
    duration: 1.3,
    apply: (p, o) => {
      const decay = 1 - p
      const giggle = Math.abs(Math.sin(p * Math.PI * 7))
      o.y += giggle * 0.08 * decay
      o.roll += Math.sin(p * Math.PI * 9) * 0.07 * decay
      o.sy *= 1 - giggle * 0.05 * decay
      o.sx *= 1 + giggle * 0.03 * decay
    },
    burst: (emit) =>
      [-1, 1].forEach((side) =>
        fan(3, (i) =>
          emit('drop', [side * 0.62, 0.2, 0.62], {
            velocity: [side * rand(0.9, 1.5), rand(1, 1.6), 0.3],
            gravity: 5,
            life: 0.9,
            size: rand(0.6, 0.85),
            delay: i * 0.18,
          }),
        ),
      ),
  },
  love: {
    // Two heartbeats and a dreamy sway.
    duration: 1.6,
    apply: (p, o) => {
      const beat = bump(p, 0.04, 0.18) + bump(p, 0.2, 0.34)
      o.sx *= 1 + 0.07 * beat
      o.sy *= 1 + 0.07 * beat
      o.roll += Math.sin(p * Math.PI * 2) * 0.12 * (1 - p * 0.6)
      o.y += bump(p, 0, 1) * 0.06
    },
    burst: (emit) =>
      fan(8, (i, f) =>
        emit('heart', [rand(-0.5, 0.5), 0.75, 0.55], {
          velocity: [lerp(-1.1, 1.1, f), rand(0.9, 1.5), 0.35],
          gravity: -0.25,
          life: 1.7,
          size: rand(0.7, 1.15),
          delay: i * 0.06,
        }),
      ),
  },
  cheeky: {
    // A head waggle while the tongue wiggles.
    duration: 1.3,
    apply: (p, o) => {
      const decay = 1 - p
      o.turn += Math.sin(p * Math.PI * 4) * 0.16 * decay
      o.roll += Math.sin(p * Math.PI * 4 + 0.6) * 0.06 * decay
      o.tongueWiggle += Math.sin(p * Math.PI * 10) * 0.4 * decay
      o.tongueStretch *= 1 + 0.35 * bump(p, 0, 0.7)
    },
    burst: (emit) =>
      fan(4, (i, f) =>
        emit('sparkle', [0.78 + f * 0.1, 0.35 + f * 0.25, 0.55], {
          velocity: [rand(0.9, 1.6), lerp(-0.3, 1.7, f), 0.3],
          gravity: 0.5,
          life: 0.9,
          size: rand(0.5, 0.8),
          delay: i * 0.05,
        }),
      ),
  },
  surprised: {
    // Jumps back with ears shooting up, ringed by a flash.
    duration: 0.95,
    apply: (p, o) => {
      const jolt = bump(p, 0, 0.5)
      const snap = bump(p, 0, 0.25)
      o.y += 0.2 * jolt
      o.z -= 0.25 * jolt
      o.pitch -= 0.12 * jolt
      o.sy *= 1 + 0.14 * snap
      o.sx *= 1 - 0.07 * snap
      o.earSpread -= 0.22 * bump(p, 0, 0.8)
    },
    burst: (emit) =>
      fan(8, (i) => {
        const angle = (i / 8) * Math.PI * 2
        emit('sparkle', [Math.cos(angle) * 0.9, 0.25 + Math.sin(angle) * 0.85, 0.3], {
          velocity: [Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0],
          life: 0.6,
          size: 0.6,
        })
      }),
  },
  crying: {
    // Shuddering sobs; tears spill and fall.
    duration: 1.5,
    apply: (p, o) => {
      const decay = 1 - p
      const sob = Math.abs(Math.sin(p * Math.PI * 6))
      o.roll += Math.sin(p * Math.PI * 16) * 0.03 * decay
      o.y -= 0.05 * bump(p, 0, 1) + sob * 0.02 * decay
      o.sy *= 1 - 0.05 * sob * decay
      o.earSpread += 0.12 * bump(p, 0, 1)
    },
    burst: (emit) =>
      [-1, 1].forEach((side) =>
        fan(4, (i) =>
          emit('drop', [side * 0.56, 0.05, 0.66], {
            velocity: [side * rand(0.2, 0.7), rand(0.3, 0.9), 0.45],
            gravity: 5.5,
            size: rand(0.6, 0.9),
            delay: i * 0.22,
          }),
        ),
      ),
  },
  angry: {
    // Furious shaking, puffing up, steam from the ears.
    duration: 1.25,
    apply: (p, o) => {
      const shake = (1 - p) ** 1.5
      const puff = bump(p, 0, 0.4)
      o.turn += Math.sin(p * Math.PI * 22) * 0.09 * shake
      o.roll += Math.sin(p * Math.PI * 17) * 0.04 * shake
      o.sx *= 1 + 0.08 * puff
      o.sy *= 1 + 0.05 * puff
      o.earFold += 0.2 * bump(p, 0, 1)
    },
    burst: (emit) =>
      [-1, 1].forEach((side) =>
        fan(3, (i) =>
          emit('puff', [side * 0.78, 1.1, 0.05], {
            velocity: [side * rand(0.2, 0.5), rand(1.1, 1.5), 0],
            gravity: -0.4,
            life: 1.1,
            size: rand(0.8, 1.1),
            grow: true,
            delay: i * 0.14,
          }),
        ),
      ),
  },
  sleepy: {
    // Startled awake, then nodding back off.
    duration: 1.7,
    apply: (p, o) => {
      const jolt = bump(p, 0, 0.22)
      o.y += 0.15 * jolt
      o.sy *= 1 + 0.1 * jolt
      o.sx *= 1 - 0.04 * jolt
      o.roll -= 0.1 * bump(p, 0.2, 1)
      o.earSpread -= 0.18 * bump(p, 0, 0.6)
    },
    burst: (emit) =>
      fan(3, (i) =>
        emit('z', [0.55, 0.9, 0.35], {
          velocity: [rand(0.35, 0.6), rand(0.55, 0.8), 0],
          gravity: -0.15,
          life: 1.8,
          size: 0.8 + i * 0.2,
          spin: 0.4,
          delay: 0.3 + i * 0.28,
        }),
      ),
  },
  cool: {
    // An unbothered double nod; the shades glint.
    duration: 1.2,
    apply: (p, o) => {
      const envelope = bump(p, 0, 1)
      o.pitch += Math.sin(p * Math.PI * 4) * 0.12 * envelope
      o.roll += 0.05 * envelope
      o.y -= 0.03 * envelope
    },
    burst: (emit) =>
      (
        [
          [-0.82, 0.4],
          [0.82, 0.42],
          [0.2, 0.55],
        ] as const
      ).forEach(([x, y], i) =>
        emit('sparkle', [x, y, 0.75], {
          velocity: [x * 0.3, 0.25, 0.2],
          life: 0.8,
          size: 0.7,
          spin: 2.5,
          delay: i * 0.12,
        }),
      ),
  },
  flustered: {
    // Shrinks and turns away, sweating.
    duration: 1.4,
    apply: (p, o) => {
      const hide = bump(p, 0, 1)
      o.sy *= 1 - 0.12 * hide
      o.sx *= 1 + 0.05 * hide
      o.y -= 0.05 * hide
      o.turn += 0.55 * bump(p, 0, 0.85)
      o.roll += Math.sin(p * Math.PI * 6) * 0.04 * hide
      o.earFold += 0.3 * hide
    },
    burst: (emit) =>
      fan(4, (i) =>
        emit('drop', [0.75, 0.75, 0.45], {
          velocity: [rand(0.8, 1.4), rand(1, 1.6), 0.2],
          gravity: 4.5,
          life: 0.9,
          size: rand(0.55, 0.8),
          delay: i * 0.1,
        }),
      ),
  },
}

const POP_DURATION = 0.5
const EAR_TWITCH_DURATION = 0.45

/**
 * Drives the head: idle motion per expression, pointer look-at, poke
 * reactions, ear twitches, the pop when switching moods, and particles.
 */
export class CatAnimator {
  readonly particles = new ParticleSystem()
  private reaction: { id: ExpressionId; start: number } | null = null
  private popStart = -Infinity
  private readonly earTwitch = [-Infinity, -Infinity]
  private readonly look = new THREE.Vector2()

  /** The poke reaction for a mood, with its particle burst. */
  react(id: ExpressionId, now: number, materials: MaterialSet, outline: boolean) {
    this.reaction = { id, start: now }
    REACTIONS[id].burst((kind, origin, options) =>
      this.particles.emit(kind, materials, outline, origin, options),
    )
  }

  /** Squash-and-stretch when a new mood arrives, with a small taste of its particles. */
  pop(id: ExpressionId, now: number, materials: MaterialSet, outline: boolean) {
    this.popStart = now
    this.reaction = null
    let emitted = 0
    REACTIONS[id].burst((kind, origin, options) => {
      if (emitted++ < 3) this.particles.emit(kind, materials, outline, origin, { ...options, delay: 0.08 })
    })
  }

  twitchEar(index: number, now: number) {
    if (now - this.earTwitch[index] > EAR_TWITCH_DURATION) this.earTwitch[index] = now
  }

  update(
    group: THREE.Group,
    build: CatBuild,
    t: number,
    dt: number,
    lookGoal: THREE.Vector2 | null,
    camera: THREE.Camera,
  ) {
    const o = neutral()
    idle(build.motion, t, o)

    if (this.reaction) {
      const reaction = REACTIONS[this.reaction.id]
      const p = (t - this.reaction.start) / reaction.duration
      if (p >= 1) this.reaction = null
      else reaction.apply(p, o)
    }

    const pop = (t - this.popStart) / POP_DURATION
    if (pop >= 0 && pop < 1) {
      const squash = bump(pop, 0, 0.35)
      const stretch = bump(pop, 0.3, 0.8)
      o.sy *= 1 - 0.1 * squash + 0.06 * stretch
      o.sx *= 1 + 0.07 * squash - 0.04 * stretch
      o.earFold += 0.25 * bump(pop, 0, 1)
    }

    this.look.x = THREE.MathUtils.damp(this.look.x, lookGoal?.x ?? 0, 5, dt)
    this.look.y = THREE.MathUtils.damp(this.look.y, lookGoal?.y ?? 0, 5, dt)
    o.turn += this.look.x
    o.pitch += this.look.y

    // Squash and stretch pivot at the chin so the head stays planted.
    group.position.set(0, o.y + (o.sy - 1) * CHIN, o.z)
    group.rotation.set(o.pitch, o.turn, o.roll)
    group.scale.set(o.sx, o.sy, o.sx)

    // Every few seconds one ear gives a quick flick back, alternating sides.
    const period = 4.6
    const phase = (t % period) / 0.42
    const flick = phase < 1 ? Math.sin(phase * Math.PI) ** 2 : 0
    const active = Math.floor(t / period) % 2
    build.earPivots.forEach((ear, i) => {
      const idleFlick = i === active ? flick : 0
      const tp = (t - this.earTwitch[i]) / EAR_TWITCH_DURATION
      const twitch = tp >= 0 && tp < 1 ? Math.sin(tp * Math.PI * 2) * (1 - tp) : 0
      const outward = i === 0 ? 1 : -1
      ear.rotation.x = -0.32 * idleFlick - o.earFold - 0.45 * Math.abs(twitch)
      ear.rotation.z = outward * (0.06 * idleFlick + o.earSpread + 0.14 * twitch)
    })

    const tongue = build.parts.tongue
    if (tongue) {
      tongue.rotation.z = Math.sin(t * 2.3) * 0.05 + o.tongueWiggle * 0.5
      tongue.scale.set(1, o.tongueStretch * (1 + Math.sin(t * 1.7) * 0.03), 1)
    }

    build.floaters.forEach((object) => {
      const rest = object.userData.rest as { y: number; roll: number; phase: number }
      object.position.y = rest.y + Math.sin(t * 1.6 + rest.phase) * 0.05
      object.rotation.z = rest.roll + Math.sin(t * 1.1 + rest.phase) * 0.12
      object.scale.setScalar(1 + Math.sin(t * 2.2 + rest.phase) * 0.06)
    })

    this.particles.update(dt, camera)
  }

  /** Holds the rest pose (reduced motion). */
  rest(group: THREE.Group, build: CatBuild) {
    this.reaction = null
    this.particles.clear()
    group.position.set(0, 0, 0)
    group.rotation.set(0, 0, 0)
    group.scale.set(1, 1, 1)
    build.earPivots.forEach((ear) => ear.rotation.set(0, 0, 0))
    build.parts.tongue?.rotation.set(0, 0, 0)
    build.parts.tongue?.scale.set(1, 1, 1)
    build.floaters.forEach((object) => {
      const rest = object.userData.rest as { y: number; roll: number }
      object.position.y = rest.y
      object.rotation.z = rest.roll
      object.scale.setScalar(1)
    })
  }

  dispose() {
    this.particles.clear()
  }
}
