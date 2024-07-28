import * as THREE from "three"
import { colors } from "../constants.ts"
import { boxAdjust } from "./adjust"
import Pilot from "./pilot"

export default class AirPlane {
  constructor() {
    this.mesh = new THREE.Object3D()
    // Create the cabin
    let geomCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1)
    let matCockpit = new THREE.MeshPhongMaterial({
      color: colors.ua_yellow,
    })

    boxAdjust(geomCockpit, 10, 20, 30, 20)
    let cockpit = new THREE.Mesh(geomCockpit, matCockpit)
    cockpit.castShadow = true
    cockpit.receiveShadow = true
    this.mesh.add(cockpit)

    const geomWindshield = new THREE.BoxGeometry(3, 15, 20, 1, 1, 1)
    const matWindshield = new THREE.MeshPhongMaterial({
      color: colors.white,
      transparent: true,
      opacity: 0.4,
      shininess: 100,
    })
    const windshield = new THREE.Mesh(geomWindshield, matWindshield)
    windshield.position.set(5, 27, 0)

    windshield.castShadow = true
    windshield.receiveShadow = true

    this.mesh.add(windshield)

    // Create the engine
    let geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1)
    let matEngine = new THREE.MeshPhongMaterial({ color: colors.ua_blue, flatShading: true })
    let engine = new THREE.Mesh(geomEngine, matEngine)
    engine.position.x = 50
    engine.castShadow = true
    engine.receiveShadow = true
    this.mesh.add(engine)

    // Create the tail
    let geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1)
    let matTailPlane = new THREE.MeshPhongMaterial({ color: colors.ua_blue, flatShading: true })
    let tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane)
    tailPlane.position.set(-40, 20, 0)
    tailPlane.castShadow = true
    tailPlane.receiveShadow = true
    this.mesh.add(tailPlane)

    // Create the wing
    let geomSideWing = new THREE.BoxGeometry(35, 5, 130, 1, 1, 1)
    let matSideWing = new THREE.MeshPhongMaterial({ color: colors.ua_blue, flatShading: true })
    let sideWing = new THREE.Mesh(geomSideWing, matSideWing)
    sideWing.position.set(10, 10, 0)
    sideWing.castShadow = true
    sideWing.receiveShadow = true
    this.mesh.add(sideWing)

    // propeller
    let geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1)
    boxAdjust(geomPropeller, 5, 5, 5, 5)

    let matPropeller = new THREE.MeshPhongMaterial({ color: colors.brown, flatShading: true })
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller)
    this.propeller.castShadow = true
    this.propeller.receiveShadow = true

    // blades
    let geomBlade = new THREE.BoxGeometry(1, 80, 10, 1, 1, 1)
    let matBlade = new THREE.MeshPhongMaterial({ color: colors.brownDark, flatShading: true })
    const blade1 = new THREE.Mesh(geomBlade, matBlade)
    blade1.position.set(8, 0, 0)
    blade1.castShadow = true
    blade1.receiveShadow = true
    let blade2 = blade1.clone()
    blade2.rotateX(Math.PI / 2)

    this.propeller.add(blade1)
    this.propeller.add(blade2)
    this.propeller.position.set(60, 0, 0)
    this.mesh.add(this.propeller)

    //wheels
    const wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1)
    const wheelProtecMat = new THREE.MeshPhongMaterial({ color: colors.ua_yellow, flatShading: true })
    const wheelProtecR = new THREE.Mesh(wheelProtecGeom, wheelProtecMat)
    wheelProtecR.position.set(25, -20, 25)
    wheelProtecR.castShadow = true
    wheelProtecR.receiveShadow = true
    this.mesh.add(wheelProtecR)

    const wheelTireGeom = new THREE.BoxGeometry(24, 24, 4)
    const wheelTireMat = new THREE.MeshPhongMaterial({ color: colors.brownDark, flatShading: true })
    const wheelTireR = new THREE.Mesh(wheelTireGeom, wheelTireMat)
    wheelTireR.castShadow = true
    wheelTireR.receiveShadow = true
    wheelTireR.position.set(25, -28, 25)

    const wheelAxisGeom = new THREE.BoxGeometry(10, 10, 6)
    const wheelAxisMat = new THREE.MeshPhongMaterial({ color: colors.ua_blue, flatShading: true })
    const wheelAxis = new THREE.Mesh(wheelAxisGeom, wheelAxisMat)
    wheelAxis.castShadow = true
    wheelAxis.receiveShadow = true

    wheelTireR.add(wheelAxis)
    this.mesh.add(wheelTireR)

    const wheelProtecL = wheelProtecR.clone()
    wheelProtecL.position.z = -wheelProtecR.position.z
    this.mesh.add(wheelProtecL)

    const wheelTireL = wheelTireR.clone()
    wheelTireL.position.z = -wheelTireR.position.z
    this.mesh.add(wheelTireL)

    const wheelTireB = wheelTireR.clone()
    wheelTireB.scale.set(0.5, 0.5, 0.5)
    wheelTireB.position.set(-35, -5, 0)
    this.mesh.add(wheelTireB)

    const suspensionGeom = new THREE.BoxGeometry(4, 20, 4)
    suspensionGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 10, 0))
    const suspensionMat = new THREE.MeshPhongMaterial({ color: colors.ua_yellow, flatShading: true })
    const suspension = new THREE.Mesh(suspensionGeom, suspensionMat)
    suspension.position.set(-35, -5, 0)
    suspension.rotation.z = -0.3
    suspension.castShadow = true
    suspension.receiveShadow = true
    this.mesh.add(suspension)

    //pilot
    this.pilot = new Pilot()
    this.pilot.mesh.position.set(-10, 27, 0)
    this.mesh.add(this.pilot.mesh)

    //shadow
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
  }
}
