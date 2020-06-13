<template>
  <div id="app">
    <h1>Mandelbrot</h1>
    <input type="number" name id v-model="c1" />
    <input type="number" name id v-model="c2" />

    <p>{{result}}</p>
  </div>
</template>

<script>
import Mandelbrot from '@/logic/mandelbrot'

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      c1: 0,
      c2: 0,
      zX: 0,
      zY: 0
    }
  },
  methods: {
    calculate(c1, c2) {
    }
  },
  computed: {
    result() {
      return this.calculate(c1, c2)
    }
  }
}
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
