<template>
    <div class="container">
      <top-bar></top-bar>
      <div class="background">
        <div class="centered-items">
          <h2 class="title">It's OK ! We all happen to be lost buddy</h2>
          <img class="dapoute" src="../assets/images/dapoute.svg">
        </div>

      </div>
    </div>
</template>

<script>
import TopBar from '../components/TopBar.vue';

export default {
  name: '404',
  components: { TopBar },
};
</script>

<style scoped>
.title{
 color: white;
  font-size: 55px;

  font-family: Muli;
}
.centered-items{
  position: absolute;
  top: 40%;
  left: 50%;
   transform: translateX(-50%);
}
.container, html{
  height: calc(100vh - 60px);
}
.background{
  /* The image used */
  background-image: url("../assets/images/wallpaper.jpg");

  /* Full height */
  height: 100%;

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
