import * as THREE from 'three'

export const CAMERA_FOV = 30
export const CAMERA_TARGET: THREE.Vector3Tuple = [0, 0.14, 0]
/** World-space area (whiskers, ear tips and floating extras included) kept in frame. */
const FRAME_SIZE = { width: 3.8, height: 3.5 }

/** Camera distance that fits the frame; `padding` above 1 leaves extra room around it. */
export function fitDistance(aspect: number, padding = 1) {
  const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2))
  return padding * Math.max(FRAME_SIZE.height / 2 / tanHalfFov, FRAME_SIZE.width / 2 / (tanHalfFov * aspect))
}
