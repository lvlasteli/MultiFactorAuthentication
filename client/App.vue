<template>
  <div id="app">
    <navbar></navbar>
    <img alt="Vue logo" src="./assets/logo.png">
    <homepage msg="Homepage"/>
  </div>
</template>

<script>
import Homepage from './components/Homepage.vue';
import Navbar from './components/Navbar.vue';

document.title = 'Two factor Authentication';
export default {
  name: 'app',
  components: {
    Homepage,
    Navbar
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
}
</style>
