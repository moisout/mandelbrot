<template>
  <div id="app">
    <div class="header">
      <h1>Mandelbrot</h1>
      <!-- <input type="text" name id v-model="c1" /> -->
      <!-- <input type="text" name id v-model="c2" /> -->
      <button @click="drawCanvas">calculate</button>
      <button @click="testCanvas">test</button>
      <!-- <p v-if="doubleValues">Doppelte Werte: {{doubleValues}}</p> -->
      <!-- <p>Anzahl: {{list.length}}</p> -->
    </div>
    <canvas ref="calcCanvas" width="2000" height="2000" />
    <!-- <p v-for="(entry, index) in list" :key="index">X: {{entry.zX}} Y: {{entry.zY}}</p> -->
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
      // coords: {
      //   minX: -2.5,
      //   maxX: 1,
      //   minY: -1.2,
      //   maxY: 1.2
      // },
      coords: {
        minX: -1.5,
        maxX: -0.5,
        minY: -0.5,
        maxY: 0.5
      }
    }
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
      const canvas = this.$refs.calcCanvas
      const canvasContext = canvas.getContext('2d')
      canvasContext.fillStyle = 'rgba(0,0,0,1)'
      canvasContext.fillRect(5, 5, 1, 1)
      canvasContext.fillRect(6, 5, 1, 1)
      canvasContext.fillRect(7, 5, 1, 1)
    },

    drawCanvas() {
      const canvas = this.$refs.calcCanvas
      const canvasHeight = canvas.height
      const canvasWidth = canvas.width
      const canvasContext = canvas.getContext('2d')
      for (let pointX = 0; pointX <= canvasWidth; pointX++) {
        for (let pointY = 0; pointY <= canvasHeight; pointY++) {
          const { coordX, coordY } = this.getCoordinatesFromPoints(pointX, pointY)

          const color = this.calculatePointColor(coordX, coordY, 30)

          canvasContext.fillStyle = color
          canvasContext.fillRect(pointX, pointY, 1, 1)
        }
      }
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
        duplicationArray.push({ zX: this.zX, zY: this.zY })
      }

      if (hasDuplication || (Math.abs(zX) <= 2 && Math.abs(zY) <= 2)) {
        return 'rgba(0,0,0,1)'
      }
      return 'rgba(255,255,255,1)'
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
  color: #2c3e50;
  display: flex;
  height: 100%;
  width: 100%;

  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #1e1e1eca;
    color: #fff;
    padding: 10px;

    * {
      color: #fff;
    }
    input,
    button {
      background-color: transparent;
      border: solid 1px #fff;
      margin: 0 10px 0 0;
      padding: 3px;
      border-radius: 5px;
    }
  }

  canvas {
    border: 2px solid #000;
    margin: auto;
  }
}
</style>
