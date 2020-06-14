<template>
  <div id="app">
    <div class="sidebar">
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
      </div>
      <label for="use-server">Use server</label>
      <button @click="drawCanvas" v-if="!calculating">Calculate</button>
      <span v-if="calculating">Calculating...</span>
      <p>{{progress}} %</p>
      <p>{{timeSpent}} ms</p>
    </div>
    <canvas ref="calcCanvas" :width="canvasWidth" :height="canvasHeight" />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {
      c1: 0,
      c2: 0,
      zX: 0,
      zY: 0,
      list: [],
      doubleValues: null,
      iterations: 10,
      coords: {
        minX: -2,
        maxX: 0.5,
        minY: -1.25,
        maxY: 1.25
      },
      canvasWidth: 1000,
      canvasHeight: 1000,
      calculating: false,
      useServer: false,
      serverImg: null,
      timeSpent: 0,
      progress: 0
      // coords: {
      //   minX: -1.5,
      //   maxX: -0.5,
      //   minY: -0.5,
      //   maxY: 0.5
      // }
    }
  },
  mounted() {
    // window.addEventListener('resize', this.resize)
    this.canvasWidth = window.innerWidth - 15
    this.canvasHeight = window.innerHeight - 15
  },
  methods: {
    // getPointsFromCoordinates(coordX, coordY) {
    //   const canvasWidth = this.$refs.calcCanvas.width
    //   const xCoordsWidth = this.coords.maxX - this.coords.minX

    //   const canvasHeight = this.$refs.calcCanvas.height
    //   const yCoordsHeight = this.coords.maxY - this.coords.minY

    //   const pointX =
    //     (canvasWidth / xCoordsWidth) * Math.abs(this.coords.minX - coordX)

    //   const pointY =
    //     (canvasHeight / yCoordsHeight) * Math.abs(this.coords.maxY - coordY)

    //   return { pointX, pointY }
    // },
    resize() {
      const canvas = this.$refs.calcCanvas
      canvas.width = window.innerWidth - 15
      canvas.height = window.innerHeight - 15
    },
    getCoordinatesFromPoints(pointX, pointY) {
      const canvasWidth = this.$refs.calcCanvas.width
      const xCoordsWidth = this.coords.maxX - this.coords.minX

      const canvasHeight = this.$refs.calcCanvas.height
      const yCoordsHeight = this.coords.maxY - this.coords.minY

      const coordX = (xCoordsWidth / canvasWidth) * pointX + this.coords.minX

      const coordY = this.coords.maxY - ((yCoordsHeight / canvasHeight) * pointY)

      return { coordX, coordY }
    },

    testCanvas() {
      this.coords.minX = parseFloat(this.coords.minX)
      this.coords.maxX = parseFloat(this.coords.maxX)
      this.coords.minY = parseFloat(this.coords.minY)
      this.coords.maxY = parseFloat(this.coords.maxY)

      const canvas = this.$refs.calcCanvas
      const canvasContext = canvas.getContext('2d')
      canvasContext.fillStyle = 'rgba(0,0,0,1)'
      canvasContext.fillRect(5, 5, 1, 1)
      canvasContext.fillRect(6, 5, 1, 1)
      canvasContext.fillRect(7, 5, 1, 1)
    },

    drawCanvas() {
      const time0 = performance.now()
      this.calculating = true

      const canvas = this.$refs.calcCanvas
      const canvasHeight = canvas.height
      const canvasWidth = canvas.width
      const canvasContext = canvas.getContext('2d')
      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)
      let timer = 0
      const interval = setInterval(() => {
        const pointY = timer
        for (let pointX = 0; pointX <= canvasWidth; pointX++) {
          const { coordX, coordY } = this.getCoordinatesFromPoints(pointX, pointY)

          const color = this.calculatePointColor(coordX, coordY, this.iterations)

          if (color) {
            canvasContext.fillStyle = color
            canvasContext.fillRect(pointX, pointY, 1, 1)
          }
        }
        this.progress = Math.ceil(100 / canvasHeight * timer)
        timer++
        if (timer >= canvasHeight) {
          clearInterval(interval)
          this.timeSpent = performance.now() - time0
        }
      }, 0)
      this.calculating = false
    },

    calculatePointColor(c1, c2, iterations) {
      let zX = 0
      let zY = 0

      const duplicationArray = []

      let hasDuplication = false

      for (
        let index = 0;
        index < iterations && Math.abs(zX) <= 2 && Math.abs(zY) <= 2;
        index++
      ) {
        const oldZX = zX
        zX = zX * zX - zY * zY + c1
        zY = 2 * oldZX * zY + c2

        if (
          duplicationArray.length > 0 &&
          duplicationArray.find(e => e.zX === zX && e.zY === zY)
        ) {
          hasDuplication = true
          break
        }
        duplicationArray.push({ zX: zX, zY: zY })
      }

      if (hasDuplication || (Math.abs(zX) <= 2 && Math.abs(zY) <= 2)) {
        return 'rgba(0,0,0,1)'
      }
      return false
    }
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  height: 100%;
  width: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  display: flex;
  height: 100%;
  width: 100%;

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #1e1e1e;
    color: #fff;
    padding: 10px 20px 0 20px;
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
    width: 180px;

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
    }
  }

  canvas,
  img {
    border: 2px solid #000;
    margin: auto;
  }
}
</style>
