import * as THREE from 'three'
import {
  arc,
  createTongueGeometry,
  dropShape,
  ellipseShape,
  faceDecal,
  faceDome,
  faceOutline,
  faceStroke,
  getBaseParts,
  heartShape,
  line,
  mergeAll,
  mirror,
  placementOn,
  puffyShape,
  roundedPolygon,
  sparkleShape,
  zShape,
  type Point2,
} from './geometry'
import { surface } from './sculpt'
import type { MaterialKey, OutlineWeight } from './materials'

export const EXPRESSION_IDS = [
  'happy',
  'laughing',
  'love',
  'cheeky',
  'surprised',
  'crying',
  'angry',
  'sleepy',
  'cool',
  'flustered',
] as const

export type ExpressionId = (typeof EXPRESSION_IDS)[number]
export type Motion = 'float' | 'bounce' | 'shake' | 'breathe' | 'sob' | 'fidget'

export interface Expression {
  id: ExpressionId
  label: string
  /** Completes "Green cat, …" in the page heading. */
  headline: string
  blush: 'none' | 'soft' | 'big'
  motion: Motion
  /** Static head tilt around Z, in radians. */
  headTilt: number
  /** Ear pose relative to neutral: `spread` swings ears outward, `pitch` folds them back (negative). */
  ears: { spread: number; pitch: number }
}

export const EXPRESSIONS: Expression[] = [
  {
    id: 'happy',
    label: 'Happy',
    headline: 'feeling happy',
    blush: 'soft',
    motion: 'float',
    headTilt: 0,
    ears: { spread: 0, pitch: 0 },
  },
  {
    id: 'laughing',
    label: 'Laughing',
    headline: 'laughing out loud',
    blush: 'big',
    motion: 'bounce',
    headTilt: 0.04,
    ears: { spread: -0.06, pitch: 0.04 },
  },
  {
    id: 'love',
    label: 'In love',
    headline: 'head over heels',
    blush: 'big',
    motion: 'float',
    headTilt: 0.07,
    ears: { spread: 0.04, pitch: 0 },
  },
  {
    id: 'cheeky',
    label: 'Cheeky',
    headline: 'being cheeky',
    blush: 'soft',
    motion: 'float',
    headTilt: -0.09,
    ears: { spread: 0, pitch: 0 },
  },
  {
    id: 'surprised',
    label: 'Surprised',
    headline: 'caught off guard',
    blush: 'none',
    motion: 'float',
    headTilt: 0,
    ears: { spread: -0.14, pitch: 0.06 },
  },
  {
    id: 'crying',
    label: 'Crying',
    headline: 'in floods of tears',
    blush: 'soft',
    motion: 'sob',
    headTilt: 0,
    ears: { spread: 0.42, pitch: -0.12 },
  },
  {
    id: 'angry',
    label: 'Angry',
    headline: 'absolutely fuming',
    blush: 'none',
    motion: 'shake',
    headTilt: 0,
    ears: { spread: 0.26, pitch: -0.5 },
  },
  {
    id: 'sleepy',
    label: 'Sleepy',
    headline: 'half asleep',
    blush: 'soft',
    motion: 'breathe',
    headTilt: 0.11,
    ears: { spread: 0.16, pitch: -0.06 },
  },
  {
    id: 'cool',
    label: 'Cool',
    headline: 'way too cool',
    blush: 'none',
    motion: 'float',
    headTilt: 0.05,
    ears: { spread: 0, pitch: 0 },
  },
  {
    id: 'flustered',
    label: 'Flustered',
    headline: 'totally flustered',
    blush: 'big',
    motion: 'fidget',
    headTilt: -0.07,
    ears: { spread: 0.22, pitch: -0.28 },
  },
]

const byId = new Map(EXPRESSIONS.map((expression) => [expression.id, expression]))

export function getExpression(id: ExpressionId) {
  return byId.get(id)!
}

/* ------------------------------------------------------------ features */

export interface FeatureSpec {
  name: string
  geometry: THREE.BufferGeometry
  material: MaterialKey
  position?: THREE.Vector3
  quaternion?: THREE.Quaternion
  scale?: THREE.Vector3Tuple
  outline?: OutlineWeight
  /** Free-floating extras (hearts, Zs) that bob around the head. */
  floater?: boolean
  /**
   * Parts the animator moves on their own. Features sharing a role share one
   * placement (taken from the first) and move together.
   */
  role?: 'tongue'
  /** Only built when outlines are on (and so never exported). */
  outlineOnly?: boolean
}

const INK = 0.027
const EYE_X = 0.53
const SIDES = [-1, 1] as const
const sideName = (side: -1 | 1) => (side < 0 ? 'L' : 'R')

const ink = (name: string, geometry: THREE.BufferGeometry): FeatureSpec => ({
  name,
  geometry,
  material: 'ink',
})

/** Closed, smiling eye: the "^" arc from the reference. */
const happyEye = (cx: number) => faceStroke(arc(cx, 0.115, 0.17, 0.11, Math.PI * 0.92, Math.PI * 0.08), INK)

/** Open, glossy eye with two catch-lights. */
function roundEye(name: string, cx: number, cy: number, rx = 0.075, ry = 0.095): FeatureSpec[] {
  const { dome } = getBaseParts()
  const depth = 0.04
  const sink = 0.012
  const glint = (suffix: string, du: number, dv: number, size: number): FeatureSpec => {
    const height = depth * Math.sqrt(Math.max(0, 1 - du * du - dv * dv)) - sink
    const { point, normal } = surface.front(cx + du * rx, cy + dv * ry)
    return {
      name: `${name}_${suffix}`,
      geometry: dome,
      material: 'white',
      ...placementOn(point.addScaledVector(normal, height - size * 0.2), normal),
      scale: [size, size * 1.1, size * 0.5],
    }
  }
  return [
    { name, geometry: dome, material: 'ink', ...faceDome(cx, cy, [rx, ry, depth], sink) },
    glint('Glint', -0.32, 0.36, rx * 0.32),
    glint('Sparkle', 0.36, -0.38, rx * 0.14),
  ]
}

/** The "ω" mouth: a short stem under the nose and two rounded lobes. */
function omegaMouth(scale = 1) {
  const s = scale
  const lobeY = -0.06 - 0.105 * s
  return mergeAll([
    faceStroke(line([0, -0.06], [0, -0.06 - 0.092 * s], 4), INK),
    faceStroke(arc(-0.1 * s, lobeY, 0.1 * s, 0.085 * s, 0.12, -Math.PI - 0.32, 18), INK),
    faceStroke(arc(0.1 * s, lobeY, 0.1 * s, 0.085 * s, Math.PI - 0.12, Math.PI * 2 + 0.32, 18), INK),
  ])
}

/** An open mouth: dark cavity, optional tongue, and an ink rim. */
function openMouth(cavity: THREE.Shape, tongue?: THREE.Shape): FeatureSpec[] {
  const parts: FeatureSpec[] = [
    { name: 'MouthCavity', geometry: faceDecal(cavity, { lift: 0.002 }), material: 'mouth' },
  ]
  if (tongue)
    parts.push({ name: 'Tongue', geometry: faceDecal(tongue, { lift: 0.0045 }), material: 'tongue' })
  parts.push(ink('Mouth', faceOutline(cavity, 0.025)))
  return parts
}

function floater(
  name: string,
  geometry: THREE.BufferGeometry,
  material: MaterialKey,
  position: THREE.Vector3Tuple,
  roll: number,
  outline?: OutlineWeight,
): FeatureSpec {
  return {
    name,
    geometry,
    material,
    position: new THREE.Vector3(...position),
    quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, roll)),
    outline,
    floater: true,
  }
}

const BUILDERS: Record<ExpressionId, () => FeatureSpec[]> = {
  happy: () => [ink('Eye_L', happyEye(-EYE_X)), ink('Eye_R', happyEye(EYE_X)), ink('Mouth', omegaMouth())],

  laughing: () => {
    const eye = (cx: number) => faceStroke(arc(cx, 0.1, 0.16, 0.135, Math.PI * 0.96, Math.PI * 0.04), INK)
    const cavity = new THREE.Shape()
    cavity.moveTo(-0.19, -0.12)
    cavity.quadraticCurveTo(0, -0.155, 0.19, -0.12)
    cavity.bezierCurveTo(0.2, -0.32, 0.1, -0.4, 0, -0.4)
    cavity.bezierCurveTo(-0.1, -0.4, -0.2, -0.32, -0.19, -0.12)
    const tongue = new THREE.Shape()
    tongue.moveTo(-0.13, -0.31)
    tongue.quadraticCurveTo(-0.065, -0.24, 0, -0.285)
    tongue.quadraticCurveTo(0.065, -0.24, 0.13, -0.31)
    tongue.bezierCurveTo(0.09, -0.38, 0.045, -0.392, 0, -0.392)
    tongue.bezierCurveTo(-0.045, -0.392, -0.09, -0.38, -0.13, -0.31)
    return [ink('Eye_L', eye(-EYE_X)), ink('Eye_R', eye(EYE_X)), ...openMouth(cavity, tongue)]
  },

  love: () => {
    const heart = heartShape(0.26)
    const eyes = SIDES.map((side): FeatureSpec => ({
      name: `Eye_${sideName(side)}`,
      geometry: faceDecal(heart, { offset: [side * EYE_X, 0.17], depth: 0.01, bevel: 0.016 }),
      material: 'heart',
    }))
    const puffyHeart = (size: number) => puffyShape(heartShape(size), size * 0.22, size * 0.12)
    return [
      ...eyes,
      ink('Mouth', omegaMouth()),
      floater('FloatingHeart_1', puffyHeart(0.3), 'heart', [1.16, 1.12, 0.35], -0.32, 'thin'),
      floater('FloatingHeart_2', puffyHeart(0.22), 'heart', [-1.14, 0.84, 0.3], 0.36, 'thin'),
      floater('FloatingHeart_3', puffyHeart(0.16), 'heart', [1.36, 0.6, 0.2], -0.12, 'thin'),
    ]
  },

  cheeky: () => {
    // A real 3D tongue poking out from under the "ω", drooping forward.
    const anchor = surface.front(0.02, -0.14)
    const quaternion = new THREE.Quaternion()
      .setFromUnitVectors(new THREE.Vector3(0, 0, 1), anchor.normal)
      .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.55, 0, 0.1)))
    return [
      ink('Eye_L', happyEye(-EYE_X)),
      ...roundEye('Eye_R', EYE_X, 0.17, 0.085, 0.105),
      {
        name: 'Tongue',
        geometry: createTongueGeometry(),
        material: 'tongue',
        // Root sits deep enough that the tongue only surfaces just under the mouth.
        position: anchor.point.addScaledVector(anchor.normal, -0.062),
        quaternion,
        role: 'tongue',
      },
      {
        // A slightly larger dark copy tucked behind the tongue reads as its ink
        // rim. (An inverted-hull outline pokes through the skin where the buried
        // root runs just beneath it.)
        name: 'TongueRim',
        geometry: createTongueGeometry({
          width: 0.198,
          length: 0.255,
          crease: false,
          inset: 0.019,
          flatten: 0.55,
        }),
        material: 'ink',
        role: 'tongue',
        outlineOnly: true,
      },
      ink('Mouth', omegaMouth()),
    ]
  },

  surprised: () => {
    const brow = (cx: number) =>
      faceStroke(arc(cx, 0.36, 0.12, 0.05, Math.PI * 0.85, Math.PI * 0.15, 12), 0.021)
    const bar = new THREE.CapsuleGeometry(0.045, 0.17, 6, 16).translate(0, 0.08, 0)
    const dot = new THREE.SphereGeometry(0.05, 20, 14).translate(0, -0.13, 0)
    return [
      ...roundEye('Eye_L', -EYE_X, 0.16, 0.095, 0.122),
      ...roundEye('Eye_R', EYE_X, 0.16, 0.095, 0.122),
      ink('Brow_L', brow(-EYE_X)),
      ink('Brow_R', brow(EYE_X)),
      ...openMouth(ellipseShape(0, -0.22, 0.068, 0.088)),
      floater('Exclamation', mergeAll([bar, dot]), 'ink', [1.04, 1.14, 0.3], -0.24),
    ]
  },

  crying: () => {
    const eye = (cx: number) => faceStroke(arc(cx, 0.21, 0.15, 0.065, Math.PI * 1.08, Math.PI * 1.92), INK)
    const brow: Point2[] = [
      [-0.7, 0.33],
      [-0.4, 0.41],
    ]
    const tears = SIDES.flatMap((side): FeatureSpec[] => {
      const cx = side * (EYE_X + 0.01)
      const stream = roundedPolygon(
        [
          [cx - 0.045, 0.15],
          [cx + 0.045, 0.15],
          [cx + 0.07, -0.42],
          [cx - 0.07, -0.42],
        ],
        [0.02, 0.02, 0.066, 0.066],
      )
      return [
        {
          name: `Tears_${sideName(side)}`,
          geometry: faceDecal(stream, { depth: 0.006, bevel: 0.01, lift: 0.001 }),
          material: 'tear',
        },
        ink(`TearsRim_${sideName(side)}`, faceOutline(stream, 0.012)),
      ]
    })
    const cavity = new THREE.Shape()
    cavity.moveTo(-0.15, -0.31)
    cavity.bezierCurveTo(-0.13, -0.15, 0.13, -0.15, 0.15, -0.31)
    cavity.quadraticCurveTo(0, -0.27, -0.15, -0.31)
    const tongue = new THREE.Shape()
    tongue.moveTo(-0.085, -0.293)
    tongue.quadraticCurveTo(0, -0.225, 0.085, -0.293)
    tongue.quadraticCurveTo(0, -0.279, -0.085, -0.293)
    return [
      ...tears,
      ink('Eye_L', eye(-EYE_X)),
      ink('Eye_R', eye(EYE_X)),
      ink('Brow_L', faceStroke(line(...(brow as [Point2, Point2])), 0.022)),
      ink('Brow_R', faceStroke(line(...(mirror(brow) as [Point2, Point2])), 0.022)),
      ...openMouth(cavity, tongue),
    ]
  },

  angry: () => {
    const brow: [Point2, Point2] = [
      [-0.75, 0.44],
      [-0.36, 0.33],
    ]
    // The manga "popping vein" mark: four separate arcs around a center, each
    // bowing inward, with gaps on the diagonals.
    const center: Point2 = [0.32, 0.55]
    const mark = mergeAll(
      [0, 1, 2, 3].map((k) => {
        const angle = (k * Math.PI) / 2
        const cx = center[0] + Math.cos(angle) * 0.19
        const cy = center[1] + Math.sin(angle) * 0.19
        const facing = angle + Math.PI
        return faceStroke(arc(cx, cy, 0.11, 0.11, facing - 0.5, facing + 0.5, 10), 0.024)
      }),
    )
    return [
      ...roundEye('Eye_L', -0.52, 0.17, 0.072, 0.078),
      ...roundEye('Eye_R', 0.52, 0.17, 0.072, 0.078),
      ink('Brow_L', faceStroke(line(...brow), 0.032)),
      ink('Brow_R', faceStroke(line(...(mirror(brow) as [Point2, Point2])), 0.032)),
      ink('Mouth', faceStroke(arc(0, -0.27, 0.12, 0.075, Math.PI * 0.95, Math.PI * 0.05), INK)),
      { name: 'AngerMark', geometry: mark, material: 'anger' },
    ]
  },

  sleepy: () => {
    const eye = (cx: number) => faceStroke(arc(cx, 0.17, 0.15, 0.05, Math.PI * 1.08, Math.PI * 1.92), INK)
    const z = (size: number) => puffyShape(zShape(size), size * 0.22, size * 0.1)
    return [
      ink('Eye_L', eye(-EYE_X)),
      ink('Eye_R', eye(EYE_X)),
      ink('Mouth', omegaMouth(0.75)),
      floater('Z_1', z(0.15), 'white', [0.9, 0.98, 0.35], 0.2, 'thin'),
      floater('Z_2', z(0.2), 'white', [1.16, 1.2, 0.3], 0.1, 'thin'),
      floater('Z_3', z(0.25), 'white', [1.44, 1.44, 0.25], 0.02, 'thin'),
    ]
  },

  cool: () => {
    const lensPoints: Point2[] = [
      [-0.2, 0.1],
      [0.21, 0.11],
      [0.19, -0.07],
      [0.04, -0.13],
      [-0.16, -0.1],
    ]
    const lensRadii = [0.05, 0.06, 0.07, 0.07, 0.07]
    // Glare stays on the upper left of both lenses, matching the light.
    const glare = roundedPolygon(
      [
        [-0.13, 0.075],
        [-0.06, 0.085],
        [-0.12, -0.06],
        [-0.18, -0.05],
      ],
      0.015,
    )
    const lenses = SIDES.flatMap((side): FeatureSpec[] => {
      const offset: Point2 = [side * 0.5, 0.2]
      const shape = roundedPolygon(side < 0 ? mirror(lensPoints) : lensPoints, lensRadii)
      return [
        {
          name: `Lens_${sideName(side)}`,
          geometry: faceDecal(shape, { offset, depth: 0.012, bevel: 0.014, lift: 0.003 }),
          material: 'ink',
        },
        {
          name: `LensGlare_${sideName(side)}`,
          geometry: faceDecal(glare, { offset, lift: 0.0445 }),
          material: 'white',
        },
        ink(
          `Temple_${sideName(side)}`,
          faceStroke(line([side * 0.69, 0.27], [side * 1.0, 0.31]), 0.02, { lift: 1.2 }),
        ),
      ]
    })
    const sparkle = (size: number) => puffyShape(sparkleShape(size), size * 0.16, size * 0.08)
    return [
      ...lenses,
      ink(
        'Bridge',
        faceStroke(arc(0, 0.2, 0.3, 0.07, Math.PI * 0.97, Math.PI * 0.03, 12), 0.022, { lift: 1.2 }),
      ),
      ink(
        'Mouth',
        faceStroke(
          [
            [-0.11, -0.165],
            [-0.05, -0.2],
            [0.03, -0.205],
            [0.1, -0.18],
            [0.15, -0.12],
          ],
          INK,
        ),
      ),
      floater('Sparkle_1', sparkle(0.28), 'white', [-1.08, 0.8, 0.38], 0.15, 'thin'),
      floater('Sparkle_2', sparkle(0.17), 'white', [1.14, 1.0, 0.25], -0.1, 'thin'),
    ]
  },

  flustered: () => {
    // ">" and "<", squeezed shut.
    const chevron = (side: -1 | 1) =>
      mergeAll([
        faceStroke(line([side * 0.67, 0.26], [side * 0.43, 0.17]), INK),
        faceStroke(line([side * 0.43, 0.17], [side * 0.67, 0.08]), INK),
      ])
    const wobble = Array.from({ length: 17 }, (_, i): Point2 => {
      const t = i / 16
      return [-0.12 + 0.24 * t, -0.2 + 0.022 * Math.sin(t * Math.PI * 3)]
    })
    const hatches = SIDES.map((side) =>
      ink(
        `Hatch_${sideName(side)}`,
        mergeAll(
          [-0.07, 0, 0.07].map((dx) => {
            const x = side * 0.74 + dx
            return faceStroke(line([x - 0.025, -0.2], [x + 0.025, -0.1], 4), 0.011, { lift: 1.5 })
          }),
        ),
      ),
    )
    const drop = dropShape(0.21)
    return [
      ink('Eye_L', chevron(-1)),
      ink('Eye_R', chevron(1)),
      ink('Mouth', faceStroke(wobble, 0.022)),
      ...hatches,
      {
        name: 'SweatDrop',
        geometry: faceDecal(drop, { offset: [0.72, 0.42], depth: 0.008, bevel: 0.012 }),
        material: 'tear',
      },
      ink('SweatDropRim', faceOutline(drop, 0.013, [0.72, 0.42])),
    ]
  },
}

const featureCache = new Map<ExpressionId, FeatureSpec[]>()

/** Expression geometry is built on first use and then shared. */
export function getExpressionFeatures(id: ExpressionId) {
  let features = featureCache.get(id)
  if (!features) {
    features = BUILDERS[id]()
    featureCache.set(id, features)
  }
  return features
}
