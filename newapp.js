import * as THREE from 'three'
import { colors } from './constants.ts'
import { handleWindowResize } from './services/resize'
import Land from './objects/land'
import Sky from './objects/sky'
import AirPlane from './objects/airplane'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import './app.css'

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x555555, 400, 1000)
scene.background = new THREE.Color(0xa9d8f0)
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
)
camera.position.set(0, 100, 500)

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
})
let mouseDown = false
let currentDeviceAngle = 60

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)
window.addEventListener(
  'resize',
  () => handleWindowResize(renderer, camera),
  false
)

// const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.2)
// const shadowLight = new THREE.DirectionalLight(0xffffff, 1)
// shadowLight.position.set(150, 350, 350)
// shadowLight.castShadow = true
// shadowLight.shadow.camera.left = -400
// shadowLight.shadow.camera.right = 400
// shadowLight.shadow.camera.top = 400
// shadowLight.shadow.camera.bottom = -400
// shadowLight.shadow.camera.near = 0.1
// shadowLight.shadow.camera.far = 1000

const shadowLight = new THREE.PointLight(0xffffff, 3, 800)
shadowLight.position.set(100, 300, 500)
shadowLight.castShadow = true
// const pLightHelper = new THREE.PointLightHelper(shadowLight)
// scene.add(pLightHelper)
// const control = new OrbitControls(camera, renderer.domElement)
// control.update()

shadowLight.shadow.mapSize.width = 2048
shadowLight.shadow.mapSize.height = 2048
// scene.add(hemisphereLight)
scene.add(shadowLight)

const land = new Land()
// land.mesh.position.y = -600
land.mesh.position.set(0, -600, 0)
scene.add(land.mesh)
camera.lookAt(0, 100, 0)

const sky = new Sky()
sky.mesh.position.y = -600
scene.add(sky.mesh)

const airplane = new AirPlane()
airplane.mesh.scale.set(0.2, 0.2, 0.2)
airplane.mesh.position.y = 125
scene.add(airplane.mesh)

let ptr_pos = { x: 0, y: 0, z: 0 }
let range = { min: -1, max: 1 }

function handlePointerDown() {
  mouseDown = true
}
function handlePointerUp() {
  mouseDown = false
}

function handlePointerMove(e) {
  if (!mouseDown) return
  e.preventDefault()
  ptr_pos.x = -1 + (e.clientX / window.innerWidth) * 2
  ptr_pos.y = 1 - (e.clientY / window.innerHeight) * 2
}

function handleWheel(e) {
  e.preventDefault()

  let dz = 0
  let deltaAngle = 0

  if (e.beta) {
    deltaAngle = currentDeviceAngle - e.beta
    dz = deltaAngle * -0.005
  }

  if (e.deltaY) dz = e.deltaY * 0.001

  ptr_pos.z += dz
  if (ptr_pos.z < -1) {
    ptr_pos.z = -1
  }
  if (ptr_pos.z > 1) {
    ptr_pos.z = 1
  }
}

function handleKey(e) {
  e.preventDefault()
  e.stopImmediatePropagation()
  switch (e.code) {
    case 'ArrowLeft':
      ptr_pos.x -= 0.1
      break
    case 'ArrowRight':
      ptr_pos.x += 0.1
      break
    case 'ArrowUp':
      e.shiftKey ? (ptr_pos.z -= 0.1) : (ptr_pos.y += 0.1)
      break
    case 'ArrowDown':
      e.shiftKey ? (ptr_pos.z += 0.1) : (ptr_pos.y -= 0.1)
      break
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
  let targetZ = normalize(ptr_pos.z, -1, 1, -300, 350)
  airplane.mesh.position.x += (targetX - airplane.mesh.position.x) * 0.005
  airplane.mesh.position.y += (targetY - airplane.mesh.position.y) * 0.005
  airplane.mesh.position.z += (targetZ - airplane.mesh.position.z) * 0.005
  airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y) * 0.013
  airplane.mesh.rotation.x = -(airplane.mesh.position.z - targetZ) * 0.004
  airplane.propeller.rotation.x += 0.3
  airplane.pilot.updateHairs()
}
document.addEventListener('pointerdown', handlePointerDown, false)
document.addEventListener('pointerup', handlePointerUp, false)
document.addEventListener('pointermove', handlePointerMove, false)
document.addEventListener('wheel', handleWheel, false)
window.addEventListener('keydown', handleKey, false)
window.addEventListener('deviceorientation', handleWheel, false)

function loop() {
  land.mesh.rotation.z += 0.001
  sky.mesh.rotation.z += 0.001
  updatePlane()
  airplane.pilot.updateHairs()
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}
loop()
