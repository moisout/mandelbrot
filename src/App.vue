<template>
  <div id="app" @wheel="wheelZoom">
    <div class="sidebar" :class="{ visible: sidebar }">
      <h1>Mandelbrot</h1>
      <div class="cutout">
        <label for="iterations">Iterations</label>
        <input id="iterations" type="text" v-model="iterations" />
        <label for="iterations">Maximum X</label>
        <input id="iterations" type="text" v-model="coords.maxX" />
        <label for="iterations">Minimum X</label>
        <input id="iterations" type="text" v-model="coords.minX" />
        <label for="iterations">Maximum Y</label>
        <input id="iterations" type="text" v-model="coords.maxY" />
        <label for="iterations">Minimum Y</label>
        <input id="iterations" type="text" v-model="coords.minY" />

        <label for="iterations">Height</label>
        <input id="iterations" type="text" v-model="canvasHeight" />
        <label for="iterations">Width</label>
        <input id="iterations" type="text" v-model="canvasWidth" />

        <input
          class="color-hidden"
          type="color"
          name="startColor"
          id="start-color"
          v-model="startColor"
        />
        <label class="color" for="start-color" :style="{'background-color': startColor}"></label>
        <input class="color-hidden" type="color" name="endColor" id="end-color" v-model="endColor" />
        <label class="color" for="end-color" :style="{'background-color': endColor}"></label>
      </div>
      <button @click="drawCanvas" v-if="!calculating">Calculate</button>
      <span v-if="calculating">Calculating...</span>
      <button v-if="calculating" @click="cancelDrawCanvas">Cancel</button>
      <p>Progress: {{progress}} %</p>
      <p>Time spent: {{timeSpent}} ms</p>
      <button @click="reset" v-if="!calculating">Reset</button>
    </div>
    <button class="toggle-drawer" :class="{ outside: sidebar }" @click="sidebar = !sidebar">
      <span>«</span>
    </button>
    <canvas
      @mousedown.prevent="onCanvasMouseDown"
      @mousemove.prevent="onCanvasMouseMove"
      @mouseup.prevent="onCanvasMouseUp"
      @mouseleave.prevent="onCanvasMouseLeave"
      ref="calcCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      :style="{
        transform: `translate3d(${this.pan.posX}px,${this.pan.posY}px,0) scale(${canvasZoom})`
      }"
    />
    <div
      class="selector"
      :style="{
        left: `${selector.x}px`,
        top: `${selector.y}px`,
        width: `${selector.width}px`,
        height: `${selector.height}px`
      }"
    ></div>
  </div>
</template>

<script>
import { Mandelbrot } from '@/logic/mandelbrot'
import { Common } from '@/logic/common'

export default {
  name: 'App',
  components: {},
  data () {
    return {
      iterations: 30,
      coords: {
        maxX: 0.5,
        minX: -2,
        maxY: 1.25,
        minY: -1.25
      },
      canvasWidth: 800,
      canvasHeight: 800,
      canvasZoom: 1,
      calculating: false,
      useServer: false,
      serverImg: null,
      timeSpent: 0,
      progress: 0,
      colorPalette: [],
      startColor: '#e6ff00',
      endColor: '#ff0600',
      sidebar: true,
      selector: {
        originalX: 0,
        originalY: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        moving: false
      },
      pan: {
        x: 0,
        y: 0,
        posX: 0,
        posY: 0,
        absX: 0,
        absY: 0
      },
      panning: false,
      ctrlKey: false,
      shiftKey: false,
      drawInterval: null
      // coords: {
      //   minX: -1.5,
      //   maxX: -0.5,
      //   minY: -0.5,
      //   maxY: 0.5
      // }
    }
  },
  mounted () {
    // window.addEventListener('resize', this.resize)
    // this.canvasWidth = window.innerWidth - 15
    // this.canvasHeight = window.innerHeight - 15
    document.addEventListener('keydown', (e) => {
      if (e.which === 17 && this.ctrlKey === false) {
        this.ctrlKey = true
      } else if (e.which === 16 && this.shiftKey) {
        this.shiftKey = true
      }
    })
    document.addEventListener('keyup', (e) => {
      if (e.which === 17) {
        this.ctrlKey = false
      }
    })
  },
  methods: {
    reset () {
      this.iterations = 30
      this.coords = {
        maxX: 0.5,
        minX: -2,
        maxY: 1.25,
        minY: -1.25
      }
      this.canvasWidth = 800
      this.canvasHeight = 800
      this.canvasZoom = 1
      this.timeSpent = 0
      this.progress = 0
      this.colorPalette = []
      this.startColor = '#e6ff00'
      this.endColor = '#ff0600'
      this.selector = {
        originalX: 0,
        originalY: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        moving: false
      }
      this.pan = {
        x: 0,
        y: 0,
        posX: 0,
        posY: 0,
        absX: 0,
        absY: 0
      }
    },
    wheelZoom (e) {
      if (!this.ctrlKey) {
        const bodyRect = document.body.getBoundingClientRect()
        const canvas = this.$refs.calcCanvas
        const elRect = canvas.getBoundingClientRect()
        const offsetTop = elRect.top - bodyRect.top
        const offsetLeft = elRect.left - bodyRect.left
        console.log((elRect.width * this.canvasZoom) / (e.x - offsetLeft))
        // this.pan.absX = e.x - offsetLeft
        // this.pan.absY = e.y - offsetTop
        this.canvasZoom -= e.deltaY / 20
        if (this.canvasZoom < 0.8) {
          this.canvasZoom = 0.8
        }
      }
    },
    onCanvasMouseDown (e) {
      if (this.ctrlKey) {
        this.selector.x = e.x
        this.selector.y = e.y
        this.selector.originalX = e.x
        this.selector.originalY = e.y
        this.selector.width = 0
        this.selector.height = 0
        this.selector.moving = true
      } else {
        this.panning = true
        this.pan.x = e.x
        this.pan.y = e.y
      }
    },
    onCanvasMouseMove (e) {
      if (this.panning) {
        this.pan.posX += e.x - this.pan.x
        this.pan.posY += e.y - this.pan.y
        this.pan.x = e.x
        this.pan.y = e.y
      }
      if (this.selector.moving) {
        const selectorWidth = e.x - this.selector.originalX
        const selectorHeight = e.y - this.selector.originalY
        if (selectorWidth < 0) {
          this.selector.x = this.selector.originalX + selectorWidth
          this.selector.width = Math.abs(selectorWidth)
        } else {
          this.selector.x = this.selector.originalX
          this.selector.width = selectorWidth
        }
        if (selectorHeight < 0) {
          this.selector.y = this.selector.originalY + selectorHeight
          this.selector.height = Math.abs(selectorHeight)
        } else {
          this.selector.y = this.selector.originalY
          this.selector.height = selectorHeight
        }
      }
    },
    onCanvasMouseUp (e) {
      if (this.panning) {
        this.panning = false
        this.pan.panX = e.x - this.pan.x
        this.pan.panY = e.y - this.pan.y
      }
      if (this.selector.moving) {
        this.selector.moving = false

        const bodyRect = document.body.getBoundingClientRect()
        const canvas = this.$refs.calcCanvas
        const elRect = canvas.getBoundingClientRect()
        const offsetTop = elRect.top - bodyRect.top
        const offsetLeft = elRect.left - bodyRect.left
        const pointMaxX = this.selector.x - offsetLeft + this.selector.width
        const pointMaxY = this.selector.y - offsetTop
        const pointMinX = this.selector.x - offsetLeft
        const pointMinY = this.selector.y - offsetTop + this.selector.height

        const maxCoords = Mandelbrot.getCoordinatesFromPoints(
          { pointX: pointMaxX, pointY: pointMaxY },
          { canvasWidth: canvas.width, canvasHeight: canvas.height },
          { maxX: this.coords.maxX, minX: this.coords.minX, maxY: this.coords.maxY, minY: this.coords.minY }
        )
        const minCoords = Mandelbrot.getCoordinatesFromPoints(
          { pointX: pointMinX, pointY: pointMinY },
          { canvasWidth: canvas.width, canvasHeight: canvas.height },
          { maxX: this.coords.maxX, minX: this.coords.minX, maxY: this.coords.maxY, minY: this.coords.minY }
        )

        const aspect = this.selector.width / this.selector.height
        this.canvasWidth = this.canvasHeight * aspect

        this.coords.maxX = maxCoords.coordX
        this.coords.maxY = maxCoords.coordY
        this.coords.minY = minCoords.coordY
        this.coords.minX = minCoords.coordX
        this.drawCanvas()

        this.selector.width = 0
        this.selector.height = 0
      }
    },
    onCanvasMouseLeave (e) {
      this.selector.moving = false
      this.panning = false
    },
    resize () {
      const canvas = this.$refs.calcCanvas
      canvas.width = window.innerWidth - 15
      canvas.height = window.innerHeight - 15
    },
    cancelDrawCanvas () {
      if (this.drawInterval) {
        clearInterval(this.drawInterval)
      }
      this.calculating = false
    },
    drawCanvas () {
      this.coords.minX = parseFloat(this.coords.minX)
      this.coords.maxX = parseFloat(this.coords.maxX)
      this.coords.minY = parseFloat(this.coords.minY)
      this.coords.maxY = parseFloat(this.coords.maxY)

      const time0 = performance.now()
      this.calculating = true

      const canvas = this.$refs.calcCanvas
      const canvasHeight = this.canvasHeight
      const canvasWidth = this.canvasWidth
      const canvasContext = canvas.getContext('2d')

      const maxX = this.coords.maxX
      const minX = this.coords.minX
      const maxY = this.coords.maxY
      const minY = this.coords.minY

      this.colorPalette = Common.generateColorPalette(this.startColor, this.endColor, this.iterations)

      canvasContext.setTransform(1, 0, 0, 1, 0, 0)
      canvasContext.scale(1, 1)

      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)
      let timer = 0
      this.drawInterval = setInterval(() => {
        const pointY = timer
        let cancelBecauseMirror = false
        for (let pointX = 0; pointX <= canvasWidth; pointX++) {
          const { coordX, coordY } = Mandelbrot.getCoordinatesFromPoints(
            { pointX, pointY },
            { canvasWidth, canvasHeight },
            { maxX, minX, maxY, minY }
          )

          if (
            Math.abs(this.coords.maxY) === Math.abs(this.coords.minY) &&
            (canvasHeight % 2 === 0) && coordY === 0
          ) {
            const color = Mandelbrot.calculatePointColor(coordX, coordY, this.iterations, this.colorPalette)

            if (color) {
              canvasContext.fillStyle = color
              canvasContext.fillRect(pointX, pointY, 1, 1)
            }
            cancelBecauseMirror = true
          } else {
            const color = Mandelbrot.calculatePointColor(coordX, coordY, this.iterations, this.colorPalette)

            if (color) {
              canvasContext.fillStyle = color
              canvasContext.fillRect(pointX, pointY, 1, 1)
            }
          }
        }
        this.progress = Math.ceil(100 / canvasHeight * timer)
        timer++
        if (timer >= canvasHeight || cancelBecauseMirror === true) {
          clearInterval(this.drawInterval)
          this.timeSpent = performance.now() - time0
          this.calculating = false
        }
        if (cancelBecauseMirror) {
          this.mirrorHalfYCanvas()
          this.progress = 100
        }
      }, 0)
    },

    mirrorHalfYCanvas () {
      const canvas = this.$refs.calcCanvas
      const canvasHeight = canvas.height
      const canvasWidth = canvas.width
      const canvasContext = canvas.getContext('2d')

      // for (let pointY = 0; pointY < canvasHeight / 2; pointY++) {
      //   for (let pointX = 0; pointX < canvasWidth; pointX++) {
      // const imgData = canvasContext.getImageData(0, 0, canvasWidth, canvasHeight / 2)

      // const yCoordsHeight = this.coords.maxY - this.coords.minY

      const imageObject = new Image()
      imageObject.onload = () => {
        canvasContext.translate(canvasWidth / 2, canvasHeight / 2)
        canvasContext.scale(1, -1)
        canvasContext.drawImage(imageObject, (canvasWidth / 2) * -1, ((canvasHeight / 2) * -1) - 1)
      }
      imageObject.src = canvas.toDataURL()
    }

    // canvasSizeInPowerOf2() {
    //   const canvas = this.$refs.calcCanvas
    //   let canvasHeightModulo = canvas.height
    //   let canvasWidthModulo = canvas.width
    //   const canvasHeightInPowerOf2 = []
    //   let canvasWidthInPowerOf2 = []

    //   while (canvasHeightModulo !== 0) {
    //     const modulo = canvasHeightModulo % 2
    //     if (modulo !== 0) {
    //       canvasHeightModulo -= modulo
    //     }
    //     canvasHeightModulo /= 2
    //     canvasHeightInPowerOf2.push(modulo)
    //   }
    //   if (canvasHeightModulo === canvasWidthModulo) {
    //     canvasWidthInPowerOf2 = canvasHeightInPowerOf2.slice()
    //   } else {
    //     while (canvasWidthModulo !== 0) {
    //       const modulo = canvasWidthModulo % 2
    //       if (modulo !== 0) {
    //         canvasWidthModulo -= modulo
    //       }
    //       canvasWidthModulo /= 2
    //       canvasWidthInPowerOf2.push(modulo)
    //     }
    //   }
    //   return { canvasHeightInPowerOf2, canvasWidthInPowerOf2 }
    // },

    // drawCanvasOptimized() {
    //   const { canvasHeightInPowerOf2, canvasWidthInPowerOf2 } = this.canvasSizeInPowerOf2()
    //   const lengthCanvasHeightInPowerOf2 = canvasHeightInPowerOf2
    //   const lengthCanvasWidthInPowerOf2 = canvasWidthInPowerOf2

    //   for (let index = lengthCanvasHeightInPowerOf2 - 1; index >= 0; index--) {
    //     if (canvasHeightInPowerOf2 ) {

    //     }
    //     else {

    //     }
    //   }
    // },
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  height: 100%;
  width: 100%;
  background-color: #1e1e1e;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  display: flex;
  height: 100%;
  margin: 0;
  width: 100%;
  overflow: hidden;

  .selector {
    box-sizing: border-box;
    background-color: #b3b3b3a1;
    position: absolute;
    pointer-events: none;
    user-select: none;
    height: 1px;
    width: 1px;
    transform-origin: top left;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    color: #fff;
    padding: 10px 20px 0 20px;
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
    width: 180px;
    background-color: #1e1e1e96;
    backdrop-filter: blur(20px);
    transform: translateX(-240px);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 100;

    &.visible {
      transform: translateX(0);
    }

    .cutout {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    input,
    button {
      background-color: transparent;
      margin: 0 0 10px 0;
      padding: 5px 0;
      color: #fff;

      &::-moz-focus-inner {
        border: 0;
      }
    }

    button {
      border: none;
      background-color: #474747;
      border-radius: 5px;
      margin: 10px 0;
      width: 100%;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

      &:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }

    input {
      width: 100%;
      border: none;
      border-bottom: solid 2px #fff;

      &.color-hidden {
        display: none;
      }
    }

    .color {
      height: 30px;
      border: none;
      width: 100%;
      margin: 10px 0;
      border-radius: 5px;
    }
  }

  .toggle-drawer {
    position: fixed;
    left: 0;
    bottom: 0;
    transform: rotate(180deg);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: none;
    background-color: #000000b7;
    width: 50px;
    height: 50px;
    border-radius: 25px 0 0 25px;
    margin: 0 0 30px 0;
    color: #fff;
    font-size: 2rem;
    cursor: pointer;

    &::-moz-focus-inner {
      border: 0;
    }

    span {
      display: block;
      height: calc(100% - 10px);
      margin-bottom: 10px;
      text-align: center;
    }

    &.outside {
      transform: rotate(0deg);
      border-radius: 25px;
      margin: 0 0 30px 30px;
    }
  }

  canvas {
    border: 2px solid #5f5f5f;
    margin: auto;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
