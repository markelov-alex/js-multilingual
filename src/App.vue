<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
.flex-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-top: 10px;
}
.flex-item {
  -ms-flex-preferred-size: 100%;
  flex-basis: 100%;
  /*background: tomato;*/
  padding: 5px;

  box-sizing: border-box;
}
</style>
