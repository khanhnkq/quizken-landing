import * as THREE from 'three'

export type Finish = 'toon' | 'clay'

/** Name given to outline hulls so they can be recognized and skipped. */
export const OUTLINE_NAME = '__outline'

/** Fur, ink and blush are sampled from the reference; the rest are expression accents. */
export const PALETTE = {
  fur: '#b5ce86',
  innerEar: '#6c8b3a',
  blush: '#89a854',
  ink: '#24261f',
  white: '#fbfbf4',
  mouth: '#5a2b27',
  tongue: '#ec8f94',
  heart: '#e5546c',
  tear: '#86cdf0',
  anger: '#dc4b3f',
} as const

export type MaterialKey = keyof typeof PALETTE
export type MaterialSet = Record<MaterialKey, THREE.Material>

const KEYS = Object.keys(PALETTE) as MaterialKey[]

const buildSet = (create: (key: MaterialKey, name: string, color: string) => THREE.Material): MaterialSet =>
  Object.fromEntries(
    KEYS.map((key) => [key, create(key, key[0].toUpperCase() + key.slice(1), PALETTE[key])]),
  ) as MaterialSet

export function createToonMaterials(): MaterialSet {
  // Three flat bands of light, like cel-shaded animation.
  const gradient = new THREE.DataTexture(new Uint8Array([110, 185, 255]), 3, 1, THREE.RedFormat)
  gradient.minFilter = THREE.NearestFilter
  gradient.magFilter = THREE.NearestFilter
  gradient.generateMipmaps = false
  gradient.needsUpdate = true

  return buildSet((_, name, color) => new THREE.MeshToonMaterial({ name, color, gradientMap: gradient }))
}

const CLAY: Partial<Record<MaterialKey, THREE.MeshPhysicalMaterialParameters>> = {
  fur: { sheen: 0.6, sheenRoughness: 0.75, sheenColor: new THREE.Color('#f1f8dc') },
  innerEar: { roughness: 0.7 },
  blush: { roughness: 0.7 },
  ink: { roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.18 },
  white: { roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 },
  mouth: { roughness: 0.75 },
  tongue: { roughness: 0.45, clearcoat: 0.35 },
  heart: { roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.15 },
  tear: { roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 },
  anger: { roughness: 0.4, clearcoat: 0.5 },
}

export function createClayMaterials(): MaterialSet {
  return buildSet(
    (key, name, color) =>
      new THREE.MeshPhysicalMaterial({
        name,
        color,
        roughness: 0.6,
        metalness: 0,
        clearcoat: 0.15,
        clearcoatRoughness: 0.5,
        ...CLAY[key],
      }),
  )
}

/** glTF-native PBR materials for downloads, so files open cleanly in any 3D tool. */
export function createExportMaterials(): MaterialSet {
  return buildSet(
    (key, name, color) =>
      new THREE.MeshStandardMaterial({
        name,
        color,
        roughness: (CLAY[key]?.roughness as number | undefined) ?? 0.65,
        metalness: 0,
      }),
  )
}

export function disposeMaterials(set: MaterialSet) {
  const gradients = new Set<THREE.Texture>()
  Object.values(set).forEach((material) => {
    if (material instanceof THREE.MeshToonMaterial && material.gradientMap)
      gradients.add(material.gradientMap)
    material.dispose()
  })
  gradients.forEach((texture) => texture.dispose())
}

/**
 * Inverted-hull outline: the mesh is redrawn slightly inflated along its normals,
 * back faces only, so a dark rim shows around the silhouette.
 */
function createOutlineMaterial(thickness: number) {
  const material = new THREE.MeshBasicMaterial({ color: PALETTE.ink, side: THREE.BackSide })
  material.name = OUTLINE_NAME
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\ntransformed += normalize(normal) * ${thickness.toFixed(4)};`,
    )
  }
  material.customProgramCacheKey = () => `outline-${thickness}`
  return material
}

export const OUTLINES = {
  head: createOutlineMaterial(0.032),
  ear: createOutlineMaterial(0.028),
  thin: createOutlineMaterial(0.016),
}
export type OutlineWeight = keyof typeof OUTLINES
