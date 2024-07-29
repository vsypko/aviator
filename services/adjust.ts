import { BoxGeometry } from 'three'

export const boxAdjust = (
  geom: BoxGeometry,
  y1: number,
  z1: number,
  y2: number,
  z2: number
) => {
  const pos = geom.attributes.position

  for (let i = 0; i < pos.count; i++) {
    if (pos.getX(i) < 0) {
      if (pos.getY(i) >= 0) {
        pos.setY(i, pos.getY(i) - y1)
      } else {
        pos.setY(i, pos.getY(i) + (y2 ? y2 : y1))
      }
      if (pos.getZ(i) >= 0) {
        pos.setZ(i, pos.getZ(i) - (z1 ? z1 : y1))
      } else {
        pos.setZ(i, pos.getZ(i) + (z2 ? z2 : z1 ? z1 : y1))
      }
    }
  }
}
