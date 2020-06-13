<template>
  <div id="app">
    <div class="header">
      <h1>Mandelbrot</h1>
      <input type="text" name id v-model="c1" />
      <input type="text" name id v-model="c2" />
      <button @click="calculate">calculate</button>
      <p v-if="doubleValues">Doppelte Werte: {{doubleValues}}</p>
      <p>Anzahl: {{list.length}}</p>
    </div>
    <canvas ref="calcCanvas" width="100" height="100" />
    <!-- <p v-for="(entry, index) in list" :key="index">X: {{entry.zX}} Y: {{entry.zY}}</p> -->
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      c1: 0,
      c2: 0,
      zX: 0,
      zY: 0,
      list: [],
      doubleValues: null,
      coords: {
        minX: -2.5,
        maxX: 1,
        minY: -1.5,
        maxY: 1.5
      }
    };
  },
  methods: {
    getPointFromCoordinate(coordX, coordY) {
      const canvasWidth = this.refs.calcCanvas.width;
      const xCoordsWidth = this.coords.maxX - this.coords.minX;

      const canvasHeight = this.refs.calcCanvas.height;
      const yCoordsHeight = this.coords.maxY - this.coords.minY;

      const pointX =
        (canvasWidth / xCoordsWidth) * Math.abs(this.coords.minX - coordX);

      const pointY =
        (canvasHeight / yCoordsHeight) * Math.abs(this.coords.maxY - coordY);

      return { pointX, pointY };
    },
    getCoordinateFromPoint(pointX, pointY) {
      const canvasWidth = this.refs.calcCanvas.width;
      const xCoordsWidth = this.coords.maxX - this.coords.minX;

      const canvasHeight = this.refs.calcCanvas.height;
      const yCoordsHeight = this.coords.maxY - this.coords.minY;

      const coordX = (xCoordsWidth / canvasWidth) * pointX + this.coords.minX;

      const coordY = (yCoordsHeight / canvasHeight) * pointY + this.coords.maxY;

      return { coordX, coordY };
    },

    async calculate() {
      this.list = [];
      this.zX = 0;
      this.zY = 0;
      this.c1 = parseFloat(this.c1);
      this.c2 = parseFloat(this.c2);

      let duplicationArray = [];

      await setTimeout(() => {
        for (
          let index = 0;
          index < 1000 && this.zX <= 2 && this.zY <= 2;
          index++
        ) {
          this.zX = this.zX * this.zX - this.zY * this.zY + this.c1;
          this.zY = 2 * this.zX * this.zY + this.c2;
          this.list.push({ zX: this.zX, zY: this.zY });

          if (
            duplicationArray.length > 0 &&
            duplicationArray.find(e => e.zX === this.zX && e.zY === this.zY)
          ) {
            this.doubleValues = { zX: this.zX, zY: this.zY };
            break;
          }
          duplicationArray.push({ zX: this.zX, zY: this.zY });
        }
      }, 100);
    }
  }
};
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
    border: 1px solid #000;
    margin: auto;
    transform: scale(4);
  }
}
</style>
