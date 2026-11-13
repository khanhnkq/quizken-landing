import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js'
import { createHeadGeometry, surface, weld, type SurfaceHit } from './sculpt'

export type Point2 = [x: number, y: number]

export interface Placement {
  position: THREE.Vector3
  quaternion: THREE.Quaternion
}

const Z_AXIS = new THREE.Vector3(0, 0, 1)
const Y_AXIS = new THREE.Vector3(0, 1, 0)

export function placementOn(position: THREE.Vector3, up: THREE.Vector3, axis = Z_AXIS): Placement {
  return { position, quaternion: new THREE.Quaternion().setFromUnitVectors(axis, up.clone().normalize()) }
}

/* --------------------------------------------------------------- shapes */

/** Polygon with each corner replaced by a quadratic curve of the given radius. */
export function roundedPolygon(points: Point2[], radii: number | number[]) {
  const shape = new THREE.Shape()
  const corners = points.map(([x, y]) => new THREE.Vector2(x, y))
  corners.forEach((corner, i) => {
    const radius = Array.isArray(radii) ? radii[i] : radii
    const previous = corners[(i - 1 + corners.length) % corners.length]
    const next = corners[(i + 1) % corners.length]
    const entry = corner.clone().add(previous.clone().sub(corner).setLength(radius))
    const exit = corner.clone().add(next.clone().sub(corner).setLength(radius))
    if (i === 0) shape.moveTo(entry.x, entry.y)
    else shape.lineTo(entry.x, entry.y)
    shape.quadraticCurveTo(corner.x, corner.y, exit.x, exit.y)
  })
  shape.closePath()
  return shape
}

export function ellipseShape(cx: number, cy: number, rx: number, ry: number) {
  const shape = new THREE.Shape()
  shape.absellipse(cx, cy, rx, ry, 0, Math.PI * 2, false, 0)
  return shape
}

/** A plump heart centered on the origin, `size` wide. */
export function heartShape(size: number) {
  const s = size
  const shape = new THREE.Shape()
  shape.moveTo(0, 0.24 * s)
  shape.bezierCurveTo(0.06 * s, 0.5 * s, 0.5 * s, 0.52 * s, 0.5 * s, 0.14 * s)
  shape.bezierCurveTo(0.5 * s, -0.12 * s, 0.2 * s, -0.3 * s, 0.035 * s, -0.43 * s)
  shape.quadraticCurveTo(0, -0.46 * s, -0.035 * s, -0.43 * s)
  shape.bezierCurveTo(-0.2 * s, -0.3 * s, -0.5 * s, -0.12 * s, -0.5 * s, 0.14 * s)
  shape.bezierCurveTo(-0.5 * s, 0.52 * s, -0.06 * s, 0.5 * s, 0, 0.24 * s)
  return shape
}

/** A drop of water with the point at the top, `size` tall. */
export function dropShape(size: number) {
  const s = size
  const r = 0.3 * s
  const shape = new THREE.Shape()
  shape.moveTo(0, 0.5 * s)
  shape.bezierCurveTo(0.06 * s, 0.28 * s, r, 0.06 * s, r, -0.2 * s)
  shape.absarc(0, -0.2 * s, r, 0, Math.PI, true)
  shape.bezierCurveTo(-r, 0.06 * s, -0.06 * s, 0.28 * s, 0, 0.5 * s)
  return shape
}

/** A chunky letter Z, `size` tall. */
export function zShape(size: number) {
  const s = size / 2
  const t = 0.34
  return roundedPolygon(
    [
      [-0.78 * s, s],
      [0.82 * s, s],
      [0.82 * s, (1 - t) * s],
      [-0.18 * s, -(1 - t) * s],
      [0.84 * s, -(1 - t) * s],
      [0.84 * s, -s],
      [-0.84 * s, -s],
      [-0.84 * s, -(1 - t) * s],
      [0.16 * s, (1 - t) * s],
      [-0.78 * s, (1 - t) * s],
    ],
    0.07 * s,
  )
}

/** A four-point sparkle, `size` across. */
export function sparkleShape(size: number) {
  const r = size / 2
  const pinch = 0.16 * r
  const shape = new THREE.Shape()
  shape.moveTo(0, r)
  shape.quadraticCurveTo(pinch, pinch, r, 0)
  shape.quadraticCurveTo(pinch, -pinch, 0, -r)
  shape.quadraticCurveTo(-pinch, -pinch, -r, 0)
  shape.quadraticCurveTo(-pinch, pinch, 0, r)
  return shape
}

/** A soft-edged solid of the given shape, centered on the origin. */
export function puffyShape(shape: THREE.Shape, depth: number, bevel: number) {
  const geometry = weld(
    new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel * 0.85,
      bevelSegments: 6,
      curveSegments: 28,
    }),
  )
  geometry.translate(0, 0, -depth / 2)
  geometry.computeVertexNormals()
  return geometry
}

/**
 * A soft, rounded tongue hanging from its root (y = 0) down to -length, with a
 * crease down the middle and a tip that curls slightly toward the viewer.
 * `flatten` thins it and `inset` pushes it back along Z (used for the ink rim
 * tucked behind it).
 */
export function createTongueGeometry({
  width = 0.17,
  length = 0.24,
  crease = true,
  inset = 0,
  flatten = 1,
} = {}) {
  const hw = width / 2
  const shape = new THREE.Shape()
  shape.moveTo(-hw, 0.08)
  shape.lineTo(-hw, -length + hw)
  shape.absellipse(0, -length + hw, hw, hw, Math.PI, Math.PI * 2, false, 0)
  shape.lineTo(hw, 0.08)
  shape.closePath()

  const depth = 0.03
  const bevel = 0.026
  const extruded = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: 0.022,
    bevelSegments: 6,
    curveSegments: 32,
  })
  extruded.deleteAttribute('uv')
  extruded.deleteAttribute('normal')
  // Fine triangles so the crease and curl can bend the flat caps.
  const fine = new TessellateModifier(0.014, 24).modify(extruded)
  extruded.dispose()
  const tongue = weld(fine)
  tongue.translate(0, 0, -depth / 2)

  const front = depth / 2 + bevel
  const position = tongue.getAttribute('position') as THREE.BufferAttribute
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const y = position.getY(i)
    let z = position.getZ(i) * flatten
    if (crease && z > 0) {
      const along = THREE.MathUtils.smoothstep(y, -length * 0.85, -length * 0.4)
      // Kept wide and shallow: a crease tighter than the outline thickness would
      // fold the outline hull through the surface.
      z -= 0.011 * Math.exp(-((x / 0.032) ** 2)) * along * (z / front)
    }
    z += 0.05 * Math.max(0, -y / length) ** 2 - inset
    position.setZ(i, z)
  }
  tongue.computeVertexNormals()
  return tongue
}

/* -------------------------------------------------------------- strokes */

export function arc(cx: number, cy: number, rx: number, ry: number, from: number, to: number, steps = 16) {
  return Array.from({ length: steps }, (_, i): Point2 => {
    const t = from + ((to - from) * i) / (steps - 1)
    return [cx + rx * Math.cos(t), cy + ry * Math.sin(t)]
  })
}

export function line(from: Point2, to: Point2, steps = 5) {
  return Array.from({ length: steps }, (_, i): Point2 => {
    const t = i / (steps - 1)
    return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]
  })
}

export const mirror = (points: Point2[]): Point2[] => points.map(([x, y]) => [-x, y])

/** A round-capped tube following the given points, like a raised ink line. */
export function createStroke(points: THREE.Vector3[], radius: number, closed = false) {
  const curve = new THREE.CatmullRomCurve3(points, closed, 'centripetal')
  const segments = Math.max(24, points.length * 5)
  const tube = new THREE.TubeGeometry(curve, segments, radius, 14, closed)
  if (closed) return tube
  const caps = [points[0], points[points.length - 1]].map((point) => {
    const cap = new THREE.SphereGeometry(radius, 16, 12)
    cap.translate(point.x, point.y, point.z)
    return cap
  })
  return mergeAll([tube, ...caps])
}

export function mergeAll(geometries: THREE.BufferGeometry[]) {
  const merged = mergeGeometries(geometries)
  geometries.forEach((geometry) => geometry.dispose())
  return merged
}

interface FaceStrokeOptions {
  closed?: boolean
  /** Height of the tube's center above the skin, as a fraction of its radius. */
  lift?: number
}

/** An ink line drawn in face-plane coordinates and wrapped onto the head. */
export function faceStroke(
  points: Point2[],
  radius: number,
  { closed = false, lift = 0.25 }: FaceStrokeOptions = {},
) {
  const lifted = points.map(([x, y]) => {
    const { point, normal } = surface.front(x, y)
    return point.addScaledVector(normal, radius * lift)
  })
  return createStroke(lifted, radius, closed)
}

/** Traces a shape's contour as a closed ink loop on the face. */
export function faceOutline(shape: THREE.Shape, radius: number, offset: Point2 = [0, 0], lift?: number) {
  const points = shape.getSpacedPoints(72).map((p): Point2 => [p.x + offset[0], p.y + offset[1]])
  points.pop() // the contour returns to its start
  return faceStroke(points, radius, { closed: true, lift })
}

/* --------------------------------------------------------------- decals */

interface DecalOptions {
  offset?: Point2
  /** Thickness of the raised body; 0 makes a paper-thin painted decal. */
  depth?: number
  /** Rounded edge radius. */
  bevel?: number
  /** Gap between the skin and the underside. */
  lift?: number
}

/**
 * Builds a shape authored in face-plane coordinates and wraps it onto the head,
 * so it hugs the curved surface like an enamel inlay.
 */
export function faceDecal(
  shape: THREE.Shape,
  { offset = [0, 0], depth = 0, bevel = 0, lift = 0.002 }: DecalOptions = {},
) {
  const flat =
    bevel > 0
      ? new THREE.ExtrudeGeometry(shape, {
          depth,
          bevelEnabled: true,
          bevelThickness: bevel,
          bevelSize: bevel * 0.85,
          bevelSegments: 4,
          curveSegments: 28,
        }).translate(0, 0, bevel)
      : new THREE.ShapeGeometry(shape, 28)
  flat.deleteAttribute('uv')
  flat.deleteAttribute('normal')

  // Subdivide so long cap triangles can bend with the head instead of cutting through it.
  const fine = new TessellateModifier(0.022, 24).modify(flat)
  flat.dispose()
  const geometry = weld(fine)

  const position = geometry.getAttribute('position') as THREE.BufferAttribute
  const hits = new Map<string, SurfaceHit>()
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i) + offset[0]
    const y = position.getY(i) + offset[1]
    const key = `${x.toFixed(5)}:${y.toFixed(5)}`
    let hit = hits.get(key)
    if (!hit) {
      hit = surface.front(x, y)
      hits.set(key, hit)
    }
    const height = position.getZ(i) + lift
    position.setXYZ(
      i,
      hit.point.x + hit.normal.x * height,
      hit.point.y + hit.normal.y * height,
      hit.point.z + hit.normal.z * height,
    )
  }
  geometry.computeVertexNormals()
  return geometry
}

/** A domed ellipsoid sitting on the face (eyes, blush). Uses the shared unit sphere. */
export function faceDome(x: number, y: number, radii: THREE.Vector3Tuple, sink = 0) {
  const { point, normal } = surface.front(x, y)
  return {
    ...placementOn(point.addScaledVector(normal, -sink), normal),
    scale: radii,
  }
}

/* ----------------------------------------------------------- base parts */

export interface EarPlacement {
  side: 'L' | 'R'
  position: THREE.Vector3Tuple
  /** Outward turn around Y. */
  yaw: number
  /** Backward lean around X. */
  pitch: number
  /** In-plane tilt around Z (positive leans toward -X). */
  tilt: number
}

export const EAR_PLACEMENTS: EarPlacement[] = [
  { side: 'L', position: [-0.54, 0.64, 0.04], yaw: -0.24, pitch: -0.14, tilt: 0.5 },
  { side: 'R', position: [0.54, 0.64, 0.04], yaw: 0.24, pitch: -0.14, tilt: -0.5 },
]

export const BLUSH_SCALE: THREE.Vector3Tuple = [0.145, 0.088, 0.022]

const EAR_HALF_WIDTH = 0.45
const EAR_HEIGHT = 0.72
const EAR_TAPER = 0.45

/** A cat-ear outline: a soft triangle with a rounded tip and rounded root corners. */
function earShape(halfWidth: number, height: number, tipRadius: number, baseY = 0) {
  return roundedPolygon(
    [
      [-halfWidth, baseY],
      [0, baseY + height],
      [halfWidth, baseY],
      [0, baseY - height * 0.14],
    ],
    [halfWidth * 0.16, tipRadius, halfWidth * 0.16, halfWidth * 0.5],
  )
}

/**
 * Tapers the ear so it is thicker at the root and thinner at the tip. The taper
 * is affine in Y, which keeps ExtrudeGeometry's boundary-only cap triangles
 * planar (a non-linear bend would fold them and break the outline hull).
 */
function taperEar(geometry: THREE.BufferGeometry) {
  const position = geometry.getAttribute('position') as THREE.BufferAttribute
  for (let i = 0; i < position.count; i++) {
    const taper = 1 - EAR_TAPER * (position.getY(i) / EAR_HEIGHT)
    position.setZ(i, position.getZ(i) * taper)
  }
}

function createEarGeometries() {
  const outerDepth = 0.08
  const outerBevel = 0.06
  const outer = weld(
    new THREE.ExtrudeGeometry(earShape(EAR_HALF_WIDTH, EAR_HEIGHT, 0.13), {
      depth: outerDepth,
      bevelEnabled: true,
      bevelThickness: outerBevel,
      bevelSize: 0.05,
      bevelSegments: 8,
      curveSegments: 40,
    }),
  )
  outer.translate(0, 0, -outerDepth / 2)

  const inner = weld(
    new THREE.ExtrudeGeometry(earShape(0.23, 0.42, 0.08, 0.2), {
      depth: 0.01,
      bevelEnabled: true,
      bevelThickness: 0.022,
      bevelSize: 0.02,
      bevelSegments: 5,
      curveSegments: 32,
    }),
  )
  // Seat the inner ear just proud of the outer ear's front face.
  inner.translate(0, 0, outerDepth / 2 + outerBevel - 0.014)

  taperEar(outer)
  taperEar(inner)
  outer.computeVertexNormals()
  inner.computeVertexNormals()
  return { outer, inner }
}

function createNoseGeometry() {
  const depth = 0.02
  const nose = weld(
    new THREE.ExtrudeGeometry(
      roundedPolygon(
        [
          [-0.072, 0.04],
          [0.072, 0.04],
          [0, -0.048],
        ],
        [0.036, 0.036, 0.03],
      ),
      {
        depth,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.024,
        bevelSegments: 6,
        curveSegments: 16,
      },
    ),
  )
  nose.translate(0, 0, -depth / 2)
  nose.computeVertexNormals()
  return nose
}

/** Whiskers start on the cheek and sweep outward in a gentle curve. */
function whisker(x: number, y: number, direction: THREE.Vector3) {
  const { point, normal } = surface.front(x, y)
  const start = point.addScaledVector(normal, -0.01)
  const points = Array.from({ length: 6 }, (_, i) => {
    const t = i / 5
    const bow = Math.sin(t * Math.PI)
    return start
      .clone()
      .addScaledVector(direction, t)
      .add(new THREE.Vector3(0, bow * 0.02, bow * 0.03))
  })
  return createStroke(points, 0.019)
}

export interface BaseParts {
  head: THREE.BufferGeometry
  ear: THREE.BufferGeometry
  innerEar: THREE.BufferGeometry
  nose: THREE.BufferGeometry
  nosePlacement: Placement
  whiskers: [THREE.BufferGeometry, THREE.BufferGeometry]
  tuft: THREE.BufferGeometry
  tufts: Placement[]
  /** Unit sphere shared by every dome (blush, eyes, highlights). */
  dome: THREE.BufferGeometry
  blushes: { position: THREE.Vector3; quaternion: THREE.Quaternion }[]
}

function buildBaseParts(): BaseParts {
  const { outer: ear, inner: innerEar } = createEarGeometries()

  const noseHit = surface.front(0, -0.03)
  const nosePlacement = placementOn(noseHit.point.addScaledVector(noseHit.normal, 0.004), noseHit.normal)

  const whiskers: [THREE.BufferGeometry, THREE.BufferGeometry] = [
    mergeAll([
      whisker(-1.0, 0.0, new THREE.Vector3(-0.56, 0.13, 0.1)),
      whisker(-0.99, -0.18, new THREE.Vector3(-0.54, -0.15, 0.13)),
    ]),
    mergeAll([
      whisker(1.0, 0.0, new THREE.Vector3(0.56, 0.13, 0.1)),
      whisker(0.99, -0.18, new THREE.Vector3(0.54, -0.15, 0.13)),
    ]),
  ]

  const tuftLength = 0.15
  const tuftRadius = 0.03
  const tufts = [-0.2, 0.2].map((x) => {
    const { point } = surface.top(x, 0.2)
    const direction = new THREE.Vector3(Math.sign(x) * 0.28, 1, 0.12).normalize()
    // Bury the root of each tuft in the crown.
    const center = point.addScaledVector(direction, tuftLength / 2 + tuftRadius - 0.07)
    return placementOn(center, direction, Y_AXIS)
  })

  const blushes = [-0.74, 0.74].map((x) => {
    // Sink the lens slightly so its rim meets the curved cheek.
    const { position, quaternion } = faceDome(x, -0.15, BLUSH_SCALE, 0.006)
    return { position, quaternion }
  })

  return {
    head: createHeadGeometry(),
    ear,
    innerEar,
    nose: createNoseGeometry(),
    nosePlacement,
    whiskers,
    tuft: new THREE.CapsuleGeometry(tuftRadius, tuftLength, 6, 14),
    tufts,
    dome: new THREE.SphereGeometry(1, 40, 24),
    blushes,
  }
}

let baseParts: BaseParts | null = null

/** Geometry is built once and shared by every expression; it never changes at runtime. */
export function getBaseParts() {
  baseParts ??= buildBaseParts()
  return baseParts
}
