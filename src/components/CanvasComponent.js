import React, { Component } from "react"
import * as simpleheat from "simpleheat"
import io from "socket.io-client"
import throttle from "lodash/throttle"
import debounce from "lodash/debounce"

const url = "https://jurgioserveris.herokuapp.com/"
// const url = "localhost:3000"
console.log("went inside of canvas")
const socket = io.connect(url)

let frame, heatmap
const itemStyle = {
  // MAKES THE CANVAS ON TOP OF STUFF
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: "100% !IMPORTANT",
  height: "100% !IMPORTANT",
  WebkitTransform: "translateZ(0)",
  transform: "translateZ(0)",
  WebkitBackfaceVisibility: "hidden",
  BackfaceVisibility: "hidden",
  verticalAlign: "bottom",
  pointerEvents: "none",
}

export default class CanvasComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      col: {
        0.9: "orange",
        0.1: "red",
        0.5: "blue",
        0.8: "cyan",
        0.8: "yellow",
      },
      r: 25,
      r2: 15,
      maxlength: 250,
      url: "localhost:3000",
    }
    this.onResize = debounce(this._onResize, 200).bind(this)
    this.heatSpace = React.createRef()
  }

  _onResize() {
    const depth = window.devicePixelRatio
    if (this.heatSpace.current !== null) {
      const dims = this.heatSpace.current.getBoundingClientRect()
      const width = dims.width * depth
      const height = dims.height * depth
      // onResize({ width, height })
      this.heatSpace.current.width = width
      this.heatSpace.current.height = height
      heatmap = simpleheat(this.heatSpace.current).max(20)
      heatmap.gradient(this.state.col)
      heatmap.radius(this.state.r, this.state.r2)
      window.requestAnimationFrame(this.draw)

      // console.log("this.heatSpace.current.width():", this.heatSpace.current)
    } else {
      console.log("heatSpace is null")
    }

    //     // console.log("canvas changed")
    //     canvas.width = width
    //     canvas.height = height
    //     heatmap = simpleheat(canvas).max(20)
    //     heatmap.gradient(this.state.col)
    //     heatmap.radius(this.state.r, this.state.r2)

    //     return true
    //   }
  }

  initHeatmap = () => {
    heatmap = simpleheat(this.heatSpace.current).max(20)
    heatmap.gradient(this.state.col)
    heatmap.radius(this.state.r, this.state.r2)
  }

  componentDidMount() {
    socket.emit("load history")
    console.log("mounted canvas")

    console.log("check 1", socket.connected)
    if (socket.connected === false) {
      // io.connect(url)
      // const socket = io.connect(url)
      // console.log("io.connect(url):", io.connect(url))

      console.log("went into socket check")
    }

    socket.on("connect", function() {
      console.log("check 2", socket.connected)
    })

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame
    this.canvas = this.heatSpace.current
    this.initHeatmap()
    // heatmap = simpleheat(this.canvas).max(20)
    // heatmap.gradient(this.state.col)
    // heatmap.radius(this.state.r, this.state.r2)
    // heatmap.clear()
    document.body.addEventListener(
      "mousemove",
      throttle(this.collectMouseData, 5)
    )

    socket.on("here you go", history => {
      console.log("got it thanks", history[0])
      this.setState({
        data: [...this.state.data, ...history],
      })
      this.state.data.forEach(el => {
        heatmap.add(el)
      })

      window.requestAnimationFrame(this.draw)
    })
    socket.on("livestream", coordinate => {
      heatmap.add(coordinate)
      // console.log("heatmap data length:", heatmap._data.length)

      if (heatmap._data.length > 5000) {
        // heatmap._data.splice(0, 4500)
        heatmap.clear()

        console.log(
          "Went here and deleted  5000 elements:",
          heatmap._data.length
        )
      } else if (heatmap._data.length >= 700) {
        heatmap._data.splice(0, 500)

        window.requestAnimationFrame(this.draw)
        console.log(
          "Went here and deleted  500 elements:",
          heatmap._data.length
        )
      }

      if (heatmap._data.length > this.state.maxlength) {
        heatmap._data.shift()
      }
      window.requestAnimationFrame(this.draw)
    })

    // WINDOW RESIZE QUEST BEGINS HERE
    // solution from here : https://www.hawatel.com/blog/handle-window-resize-in-react/
    // this.resizeCanvasToDisplaySize(this.canvas)
    // window.addEventListener(
    //   "resize",

    //   () => {
    //     this.resizeCanvasToDisplaySize(this.canvas)
    //   }
    // )

    window.addEventListener("resize", this.onResize)
  }

  componentWillUnmount() {
    console.log("unmounted canvas")
    document.body.removeEventListener("mousemove", this.collectMouseData)
    this.manualSocketDisconnect()

    // socket.disconnect()
    // socket.close()

    // window.removeEventListener("resize", () => {
    //   this.resizeCanvasToDisplaySize(this.canvas)
    // })
  }

  draw = () => {
    heatmap.draw()
    frame = null
  }

  manualSocketConnect = () => {
    socket.emit("connection", socket.id)
    console.log("socket.id:", socket.id)
  }

  manualSocketDisconnect = () => {
    socket.emit("manual-disconnection", socket.id)
    socket.close()
    console.log("Socket Closed. ")
  }

  // resizeCanvasToDisplaySize = canvas => {
  //   let width = canvas.clientWidth
  //   // let width = this.canvasRef.current.clientWidth

  //   let height = canvas.clientHeight
  //   heatmap = simpleheat(canvas).max(20)

  //   if (canvas.width !== width || canvas.height !== height) {
  //     // console.log("canvas changed")
  //     canvas.width = width
  //     canvas.height = height
  //     heatmap = simpleheat(canvas).max(20)
  //     heatmap.gradient(this.state.col)
  //     heatmap.radius(this.state.r, this.state.r2)

  //     return true
  //   }
  //   console.log("in the false zone")
  //   return false

  //   // let depth = window.devicePixelRatio
  //   // let displayWidth = Math.floor()
  // }

  collectMouseData = e => {
    e.preventDefault()
    let x = e.offsetX
    let y = e.offsetY
    // console.log("x:", x)
    heatmap.add([x, y, 1])
    socket.emit("hell", [x, y, 1])

    if (heatmap._data.length > this.state.maxlength) {
      heatmap._data.shift()
      // heatmap.clear()
    }
    frame = frame || window.requestAnimationFrame(this.draw)
  }

  render() {
    if (typeof window !== `undefined`) {
      return (
        <canvas
          style={itemStyle}
          ref={this.heatSpace}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )
    } else {
      return <canvas />
    }
  }
}
