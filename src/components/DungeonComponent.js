import React from "react"
import * as THREE from "three"
import debounce from "lodash/debounce"
import sphereGeometry from "../assets/peels_d27.json"

import { withStyles } from "@material-ui/core"

const styles = {
  animationRoot: {
    opacity: 0.2,
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    height: [["100%"], "!important"],
    width: [["100%"], "!important"],
  },
}

let renderer, scene, camera, planet

const initScene = function() {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(100, 1, 0.1, 100)

  const planetGeometry = new THREE.BufferGeometry()

  planetGeometry.setIndex(
    new THREE.BufferAttribute(
      Uint32Array.from(sphereGeometry.data.index.array),
      1
    )
  )

  planetGeometry.addAttribute(
    'position',
    new THREE.BufferAttribute(
      Float32Array.from(sphereGeometry.data.attributes.position.array),
      3
    )
  )

  planet = new THREE.LineSegments(
    planetGeometry,
    new THREE.LineBasicMaterial({
      color: 0xa9d6ce,
    })
  )

  scene.add(planet)

  // planetGeometry.setIndex(
  //   new THREE.BufferAttribute(
  //     Uint32Array.from(sphereGeometry.data.index.array),
  //     1
  //   )
  // )

  // planetGeometry.addAttribute(
  //   "position",
  //   new THREE.BufferAttribute(
  //     Float32Array.from(sphereGeometry.data.attributes.position.array),
  //     3
  //   )
  // )

  // planetGeometry.addAttribute(
  //   "positionm",
  //   new THREE.BufferAttribute(
  //     Float32Array.from(sphereGeometry.data.attributes.normal.array),
  //     3
  //   )
  // )

  // planetGeometry.addAttribute(
  //   "color",
  //   new THREE.BufferAttribute(
  //     Float32Array.from(sphereGeometry.data.attributes.color.array),
  //     3
  //   )
  // )

  // planet = new THREE.Mesh(
  //   planetGeometry,
  //   new THREE.MeshBasicMaterial({
  //     vertexColors: THREE.VertexColors,
  //     wireframe: true,
  //   })
  // )

  // scene.add(planet)
}

export function setRenderer({ canvas }) {
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
  })
}

export function onResize({ width, height }) {
  camera.aspect = width / height
  camera.updateProjectionMatrix()

  if (renderer) renderer.setSize(width, height)
}

let playing = false

function onRender() {
  planet.rotation.x += 2.5e-4
  renderer.render(scene, camera)
}

function render() {
  onRender()
  if (playing) requestAnimationFrame(render)
}

export function play() {
  playing = true
  render()
}

export function pause() {
  playing = false
}

class DungeonComponent extends React.Component {
  constructor(props) {
    super(props)
    this.animationRoot = React.createRef()
    this.onResize = debounce(this._onResize, 500).bind(this)
  }

  playIntroAnimation() {
    play()
  }

  _onResize() {
    const depth = window.devicePixelRatio
    const dims = this.animationRoot.current.getBoundingClientRect()
    const width = dims.width * depth
    const height = dims.height * depth
    onResize({ width, height })
  }

  componentDidMount() {
    setRenderer({ canvas: this.animationRoot.current })
    initScene()
    window.addEventListener("resize", this.onResize)
    this._onResize()
    this.playIntroAnimation()
  }

  render() {
    const { classes } = this.props

    return <canvas ref={this.animationRoot} className={classes.animationRoot} />
  }
}

export default withStyles(styles)(DungeonComponent)
