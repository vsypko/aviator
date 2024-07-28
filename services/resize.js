export function handleWindowResize(renderer, camera) {
  // update height and width of the renderer and the camera
  const HEIGHT = window.innerHeight
  const WIDTH = window.innerWidth
  renderer.setSize(WIDTH, HEIGHT)
  camera.aspect = WIDTH / HEIGHT
  camera.updateProjectionMatrix()
}
