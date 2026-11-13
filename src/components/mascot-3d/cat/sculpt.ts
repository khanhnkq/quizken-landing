import * as THREE from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'

/**
 * The head sculpt and an exact projector onto its surface.
 *
 * Units: the head is roughly 2 units tall and 2.3 units wide, centered on the
 * origin and facing +Z. Face features are authored as 2D "face plane"
 * coordinates measured from the reference illustration and wrapped onto the
 * head with `surface.front`.
 */

export interface SurfaceHit {
  point: THREE.Vector3
  normal: THREE.Vector3
}

/** Rebuilds shared vertices so normals are smooth across UV seams and bevels. */
export function weld(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  geometry.deleteAttribute('normal')
  geometry.deleteAttribute('uv')
  const welded = mergeVertices(geometry, 1e-4)
  welded.clearGroups()
  geometry.dispose()
  return welded
}

/** Maps a point on the unit sphere to the sculpted head. */
export function sculptPoint(x: number, y: number, z: number, out: THREE.Vector3) {
  // Wider through the cheeks, slightly narrower toward the crown.
  const cheeks = Math.exp(-((y + 0.25) ** 2) / 0.2)
  const crown = Math.max(0, y) ** 2
  const width = 1.1 * (1 + 0.07 * cheeks - 0.08 * crown)

  // A soft forward swell where the nose and mouth sit.
  const muzzle = Math.exp(-(x * x) / 0.08 - (y + 0.15) ** 2 / 0.05) * Math.max(0, z)
  const swell = 1 + 0.035 * muzzle

  // Gently flattened chin.
  const lift = y * 0.97 + 0.04 * Math.max(0, -y) ** 4

  return out.set(x * width * swell, lift * swell, z * 0.92 * swell)
}

export function createHeadGeometry(widthSegments = 192, heightSegments = 144) {
  const head = weld(new THREE.SphereGeometry(1, widthSegments, heightSegments))
  const position = head.getAttribute('position') as THREE.BufferAttribute
  const point = new THREE.Vector3()
  for (let i = 0; i < position.count; i++) {
    sculptPoint(position.getX(i), position.getY(i), position.getZ(i), point)
    position.setXYZ(i, point.x, point.y, point.z)
  }
  head.computeVertexNormals()
  head.computeBoundingSphere()
  return head
}

/* ------------------------------------------------------------ projection */

type Chart = (u: number, v: number, out: THREE.Vector3) => THREE.Vector3
type Component = 0 | 1 | 2

const hemisphere = (u: number, v: number) => Math.sqrt(Math.max(0, 1 - u * u - v * v))
const frontChart: Chart = (u, v, out) => sculptPoint(u, v, hemisphere(u, v), out)
const topChart: Chart = (u, v, out) => sculptPoint(u, hemisphere(u, v), v, out)

const scratch = { p: new THREE.Vector3(), pu: new THREE.Vector3(), pv: new THREE.Vector3() }

/**
 * Finds the surface point whose `ia`/`ib` coordinates equal `a`/`b` with a 2D
 * Newton solve over the hemisphere chart. Points past the silhouette clamp to it.
 */
function project(chart: Chart, ia: Component, ib: Component, a: number, b: number, guess: [number, number]) {
  const { p, pu, pv } = scratch
  const h = 1e-6
  let [u, v] = guess

  for (let i = 0; i < 24; i++) {
    chart(u, v, p)
    const ea = p.getComponent(ia) - a
    const eb = p.getComponent(ib) - b
    if (Math.abs(ea) < 1e-9 && Math.abs(eb) < 1e-9) break
    chart(u + h, v, pu)
    chart(u, v + h, pv)
    const j11 = (pu.getComponent(ia) - p.getComponent(ia)) / h
    const j12 = (pv.getComponent(ia) - p.getComponent(ia)) / h
    const j21 = (pu.getComponent(ib) - p.getComponent(ib)) / h
    const j22 = (pv.getComponent(ib) - p.getComponent(ib)) / h
    const det = j11 * j22 - j12 * j21
    if (Math.abs(det) < 1e-12) break
    u -= (j22 * ea - j12 * eb) / det
    v -= (j11 * eb - j21 * ea) / det
    const r = Math.hypot(u, v)
    if (r > 0.998) {
      u *= 0.998 / r
      v *= 0.998 / r
    }
  }

  const point = chart(u, v, new THREE.Vector3())
  chart(u + 1e-4, v, pu).sub(point)
  chart(u, v + 1e-4, pv).sub(point)
  const normal = new THREE.Vector3().crossVectors(pu, pv).normalize()
  if (normal.dot(point) < 0) normal.negate()
  return { point, normal } satisfies SurfaceHit
}

const clampToDisc = (u: number, v: number): [number, number] => {
  const r = Math.hypot(u, v)
  return r > 0.95 ? [(u * 0.95) / r, (v * 0.95) / r] : [u, v]
}

export const surface = {
  /** The head surface seen straight on: face-plane (x, y) to a point on the face. */
  front: (x: number, y: number): SurfaceHit =>
    project(frontChart, 0, 1, x, y, clampToDisc(x / 1.15, y / 0.97)),
  /** The head surface seen from above: (x, z) to a point on the crown. */
  top: (x: number, z: number): SurfaceHit => project(topChart, 0, 2, x, z, clampToDisc(x / 1.1, z / 0.92)),
}
