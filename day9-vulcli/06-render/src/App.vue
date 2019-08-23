<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Test2></Test2>
  </div>
</template>

<script>
import Test2 from './render-comp/Test2'
export default {
  name: 'app',
  components: {
    Test2
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
