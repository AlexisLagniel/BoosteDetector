<template>
  <div id="app">
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<style>

@import url('https://fonts.googleapis.com/css?family=Muli&display=swap');
body{
  font-family: 'Muli', sans-serif;
  background-color: #f7f7f7;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body{
  margin: 0;
  padding: 0;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

</style>
