import * as THREE from 'three'
import Cloud from './clouds'

export default class Sky {
  mesh: THREE.Object3D
  nClouds: number

  constructor() {
    this.mesh = new THREE.Object3D()
    this.nClouds = 20

    let stepAngle = (Math.PI * 2) / this.nClouds

    for (let i = 0; i < this.nClouds; i++) {
      let c = new Cloud()

      let a = stepAngle * i
      let h = 700 + Math.random() * 100

      c.mesh.position.y = Math.sin(a) * 700
      c.mesh.position.x = Math.cos(a) * h
      // c.mesh.position.z = Math.tan(a) * 400
      c.mesh.rotation.z = a + Math.PI / 2
      c.mesh.position.z = Math.random() * 400
      let s = 1 + Math.random() * 2
      c.mesh.scale.set(s, s, s)
      this.mesh.add(c.mesh)
    }
  }
}
