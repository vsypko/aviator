import * as THREE from "three"
import { colors } from "../constants.ts"

export default class Land {
  constructor() {
    this.geom = new THREE.CylinderGeometry(650, 650, 900, 40, 10)
    this.geom.rotateX(-Math.PI / 2)
    // this.geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
    this.mat = new THREE.MeshPhongMaterial({
      color: colors.blue,
      transparent: true,
      opacity: 0.6,
      flatShading: true,
    })
    this.mesh = new THREE.Mesh(this.geom, this.mat)
    this.mesh.receiveShadow = true
  }
}
