import * as THREE from "three"
import Cloud from "./clouds"

export default class Sky {
  constructor() {
    this.mesh = new THREE.Object3D()
    this.nClouds = 20

    let stepAngle = (Math.PI * 2) / this.nClouds

    for (let i = 0; i < this.nClouds; i++) {
      let c = new Cloud()

      let a = stepAngle * i
      let h = 700 + Math.random() * 100

      c.mesh.position.y = Math.sin(a) * h
      c.mesh.position.x = Math.cos(a) * h
      c.mesh.rotation.z = a + Math.PI / 2
      c.mesh.position.z = 1 - Math.random() * 2
      let s = 1 + Math.random() * 2
      c.mesh.scale.set(s, s, s)
      this.mesh.add(c.mesh)
    }
  }
}
