import * as THREE from "three"
import { colors } from "../constants.ts"

export default class Cloud {
  constructor() {
    this.mesh = new THREE.Object3D()
    this.geom = new THREE.SphereGeometry(10, 24, 24)
    this.mat = new THREE.MeshPhongMaterial({
      color: colors.white,
      transparent: true,
      opacity: 0.3,
    })
    let nBlocs = 3 + Math.floor(Math.random() * 3)
    for (let i = 0; i < nBlocs; i++) {
      let m = new THREE.Mesh(this.geom, this.mat)
      m.position.x = i * 5
      m.position.y = Math.random() * 5
      m.position.z = Math.random() * 5
      m.rotation.z = Math.random() * Math.PI * 2
      m.rotation.y = Math.random() * Math.PI * 2
      let s = 0.05 + Math.random() * 0.9
      m.scale.set(s, s, s)
      m.castShadow = true
      // m.receiveShadow = true
      this.mesh.add(m)
    }
  }
}
