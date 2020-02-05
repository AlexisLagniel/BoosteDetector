<template>
  <div>
    <top-bar></top-bar>
    <div class="background">
      <div class="content">
        <h2 class="summoner-name">{{username}}</h2>
        <div class="blocks">
        </div>
        <h5>{{encryptedSummonerId}}</h5>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import TopBar from './TopBar.vue';

export default {
  name: 'Profile',
  components: { TopBar },
  data() {
    return {
      username: this.$route.params.username,
      encryptedSummonerId: '',
    };
  },
  mounted() {
    this.queryInfoByUsername();
  },
  methods: {
    queryInfoByUsername() {
      const { username } = this;
      axios.get(
        `http://boostedetector.herokuapp.com/profile?region=euw1&query=%2Flol%2Fsummoner%2Fv4%2Fsummoners%2Fby-name%2F${username}`,
      ).then((response) => {
        console.log(response.data);
        this.encryptedSummonerId = response.data.id;
        console.log(this.encryptedSummonerId);
      });
    },
  },
};
</script>

<style scoped>
  .background{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-repeat: no-repeat;
    background-image: url("../assets/images/monkey.jpg");
    background-size: auto;
    background-color: black;
    background-position: 50% 0%;
    display: flex;
  }
  .content{
    margin: auto;
  }
  .summoner-name{
    color: white;
    font-family: Muli;
    font-size: 45px;
  }
  .blocks{}
</style>
