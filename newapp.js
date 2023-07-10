import * as THREE from "three"
import { colors } from "./constants"
import { handleWindowResize } from "./services/resize"
import Land from "./objects/land"
import Sky from "./objects/sky"
import AirPlane from "./objects/airplane"

import "./app.css"

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(colors.bg, 100, 950)
scene.background = new THREE.Color(colors.bg)
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.5, 500)
camera.position.x = 0
camera.position.y = 100
camera.position.z = 200

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)
window.addEventListener("resize", handleWindowResize(renderer, camera), false)

const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9)
const shadowLight = new THREE.DirectionalLight(0xffffff, 0.9)
shadowLight.position.set(150, 350, 350)
shadowLight.castShadow = true
shadowLight.shadow.camera.left = -400
shadowLight.shadow.camera.right = 400
shadowLight.shadow.camera.top = 400
shadowLight.shadow.camera.bottom = -400
shadowLight.shadow.camera.near = 1
shadowLight.shadow.camera.far = 1000

shadowLight.shadow.mapSize.width = 2048
shadowLight.shadow.mapSize.height = 2048
scene.add(hemisphereLight)
scene.add(shadowLight)

const land = new Land()
// land.mesh.position.y = -600
land.mesh.position.set(0, -600, 0)
scene.add(land.mesh)

const sky = new Sky()
sky.mesh.position.y = -600
scene.add(sky.mesh)

const airplane = new AirPlane()
airplane.mesh.scale.set(0.2, 0.2, 0.2)
airplane.mesh.position.y = 125
scene.add(airplane.mesh)

let ptr_pos = { x: 0, y: 0, z: 0 }
let range = { min: -0.75, max: 0.75 }

function handlePointerMove(e) {
  let dx = -1 + (e.clientX / window.innerWidth) * 2
  let dy = 1 - (e.clientY / window.innerHeight) * 2
  ptr_pos = { x: dx, y: dy, z: ptr_pos.z }
}

function handleWheel(e) {
  ptr_pos.z = ptr_pos.z + e.deltaY * 0.001
  if (ptr_pos.z < -1) {
    ptr_pos.z = -1
    range.min = -0.5
    range.max = 0.5
  }
  if (ptr_pos.z > 1) {
    ptr_pos.z = 1
    range.min = -1.5
    range.max = 1.5
  }
}

function normalize(v, vmin, vmax, tmin, tmax) {
  let nv = Math.max(Math.min(v, vmax), vmin)
  let dv = vmax - vmin
  let pc = (nv - vmin) / dv
  let dt = tmax - tmin
  let tv = tmin + pc * dt
  return tv
}

function updatePlane() {
  let targetX = normalize(ptr_pos.x, range.min, range.max, -150, 150)
  let targetY = normalize(ptr_pos.y, range.min, range.max, 60, 190)
  let targetZ = normalize(ptr_pos.z, -0.75, 0.75, -300, 100)
  airplane.mesh.position.x += (targetX - airplane.mesh.position.x) * 0.1
  airplane.mesh.position.y += (targetY - airplane.mesh.position.y) * 0.1
  airplane.mesh.position.z += (targetZ - airplane.mesh.position.z) * 0.1
  airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y) * 0.0192
  airplane.mesh.rotation.x = -(airplane.mesh.position.z - targetZ) * 0.0064
  airplane.propeller.rotation.x += 0.3
  airplane.pilot.updateHairs()
}

document.addEventListener("pointermove", handlePointerMove, false)
document.addEventListener("wheel", handleWheel, false)
function loop() {
  land.mesh.rotation.z += 0.001
  sky.mesh.rotation.z += 0.002
  updatePlane()
  airplane.pilot.updateHairs()
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}
loop()
