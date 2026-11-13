import * as THREE from 'three'
import { BLUSH_SCALE, EAR_PLACEMENTS, getBaseParts } from './geometry'
import {
  getExpression,
  getExpressionFeatures,
  type ExpressionId,
  type FeatureSpec,
  type Motion,
} from './expressions'
import { OUTLINES, OUTLINE_NAME, type MaterialSet, type OutlineWeight } from './materials'

export interface CatBuild {
  root: THREE.Group
  /** Innermost ear groups, free for idle flicks (rest rotation is zero). */
  earPivots: THREE.Group[]
  floaters: THREE.Object3D[]
  /** Parts with their own animation, keyed by role (rest transform is identity). */
  parts: Partial<Record<NonNullable<FeatureSpec['role']>, THREE.Object3D>>
  motion: Motion
}

const BIG_BLUSH: THREE.Vector3Tuple = [BLUSH_SCALE[0] * 1.3, BLUSH_SCALE[1] * 1.25, BLUSH_SCALE[2]]

/**
 * Assembles the cat for one expression as a plain three.js object tree. The
 * same builder feeds the live viewer, the PNG renderer and the GLB exporter, so
 * all three always match.
 */
export function buildCat(
  id: ExpressionId,
  materials: MaterialSet,
  { outline }: { outline: boolean },
): CatBuild {
  const base = getBaseParts()
  const expression = getExpression(id)

  const mesh = (
    name: string,
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    weight?: OutlineWeight,
  ) => {
    const object = new THREE.Mesh(geometry, material)
    object.name = name
    if (outline && weight) {
      const hull = new THREE.Mesh(geometry, OUTLINES[weight])
      hull.name = OUTLINE_NAME
      hull.raycast = () => {}
      object.add(hull)
    }
    return object
  }
  const place = (
    object: THREE.Object3D,
    placement: { position?: THREE.Vector3; quaternion?: THREE.Quaternion },
  ) => {
    if (placement.position) object.position.copy(placement.position)
    if (placement.quaternion) object.quaternion.copy(placement.quaternion)
    return object
  }

  const root = new THREE.Group()
  root.name = `GreenCat_${expression.label.replace(/\s+/g, '')}`
  const pose = new THREE.Group()
  pose.name = 'Pose'
  pose.rotation.z = expression.headTilt
  root.add(pose)

  pose.add(mesh('Head', base.head, materials.fur, 'head'))

  const earPivots = EAR_PLACEMENTS.map((ear) => {
    const outward = ear.side === 'L' ? 1 : -1
    const mount = new THREE.Group()
    mount.position.set(...ear.position)
    mount.rotation.y = ear.yaw
    const lean = new THREE.Group()
    lean.rotation.x = ear.pitch + expression.ears.pitch
    const tilt = new THREE.Group()
    tilt.rotation.z = ear.tilt + outward * expression.ears.spread
    const pivot = new THREE.Group()
    pivot.name = `EarPivot_${ear.side}`
    pivot.add(
      mesh(`Ear_${ear.side}`, base.ear, materials.fur, 'ear'),
      mesh(`InnerEar_${ear.side}`, base.innerEar, materials.innerEar),
    )
    tilt.add(pivot)
    lean.add(tilt)
    mount.add(lean)
    pose.add(mount)
    return pivot
  })

  base.tufts.forEach((tuft, i) =>
    pose.add(place(mesh(`Tuft_${i === 0 ? 'L' : 'R'}`, base.tuft, materials.ink), tuft)),
  )
  pose.add(place(mesh('Nose', base.nose, materials.ink), base.nosePlacement))
  pose.add(
    mesh('Whiskers_L', base.whiskers[0], materials.ink),
    mesh('Whiskers_R', base.whiskers[1], materials.ink),
  )

  if (expression.blush !== 'none') {
    base.blushes.forEach((blush, i) => {
      const object = place(mesh(`Blush_${i === 0 ? 'L' : 'R'}`, base.dome, materials.blush), blush)
      object.scale.set(...(expression.blush === 'big' ? BIG_BLUSH : BLUSH_SCALE))
      pose.add(object)
    })
  }

  const floaters: THREE.Object3D[] = []
  const parts: CatBuild['parts'] = {}
  getExpressionFeatures(id).forEach((feature, i) => {
    if (feature.outlineOnly && !outline) return
    const object = mesh(feature.name, feature.geometry, materials[feature.material], feature.outline)
    if (feature.scale) object.scale.set(...feature.scale)
    if (feature.role) {
      let part = parts[feature.role]
      if (!part) {
        // The pivot carries the placement so the part can wiggle around its own root.
        const pivot = place(new THREE.Group(), feature)
        pivot.name = `${feature.name}Pivot`
        part = new THREE.Group()
        pivot.add(part)
        pose.add(pivot)
        parts[feature.role] = part
      }
      part.add(object)
      return
    }
    place(object, feature)
    if (feature.floater) {
      object.userData.rest = { y: object.position.y, roll: object.rotation.z, phase: i * 1.7 }
      floaters.push(object)
    }
    pose.add(object)
  })

  return { root, earPivots, floaters, parts, motion: expression.motion }
}

const triangleCount = (geometry: THREE.BufferGeometry) =>
  (geometry.index?.count ?? geometry.getAttribute('position').count) / 3

/** Mesh and triangle counts for one expression (outline hulls excluded). */
export function getModelStats(id: ExpressionId) {
  const placeholder = new THREE.MeshBasicMaterial()
  const materials = new Proxy({} as MaterialSet, { get: () => placeholder })
  const { root } = buildCat(id, materials, { outline: false })
  let meshes = 0
  let triangles = 0
  root.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      meshes += 1
      triangles += triangleCount(object.geometry)
    }
  })
  placeholder.dispose()
  return { meshes, triangles }
}
