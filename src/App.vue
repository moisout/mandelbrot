<template>
  <div id="app">
    <h1>Mandelbrot</h1>
    <input type="text" name id v-model="c1" />
    <input type="text" name id v-model="c2" />
    <button @click="calculate">calculate</button>
    <p v-if="doubleValues">Doppelte Werte: {{doubleValues}}</p>
    <p>Anzahl: {{list.length}}</p>
    <!-- <canvas ref="calcCanvas"></canvas> -->
    <p v-for="(entry, index) in list" :key="index">X: {{entry.zX}} Y: {{entry.zY}}</p>
  </div>
</template>

<script>
import Mandelbrot from "@/logic/mandelbrot";

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
      doubleValues: null
    };
  },
  methods: {
    async calculate() {
      this.list = [];
      this.zX = 0;
      this.zY = 0;
      this.c1 = parseFloat(this.c1)
      this.c2 = parseFloat(this.c2)

      let duplicationArray = []

      await setTimeout(() => {
        for (
          let index = 0;
          index < 1000 && this.zX <= 2 && this.zY <= 2;
          index++
        ) {
          this.zX = this.zX * this.zX - this.zY * this.zY + this.c1;
          this.zY = 2 * this.zX * this.zY + this.c2;
          this.list.push({ zX: this.zX, zY: this.zY });

          if (duplicationArray.length > 0 && duplicationArray.find(e => e.zX === this.zX && e.zY === this.zY)) {
            this.doubleValues = { zX: this.zX, zY: this.zY }
            break;
          }
          duplicationArray.push({ zX: this.zX, zY: this.zY })
        }
      }, 100);
    }
  },
  computed: {
    result() {
      return this.calculate(c1, c2);
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
