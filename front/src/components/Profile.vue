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
      summonerProfileInfo: {},
    };
  },
  mounted() {
    this.queryInfoByUsername();
  },
  methods: {
    queryInfoByUsername() {
      // getting the infos for a given summoner name
      axios.get(
        `http://boostedetector.herokuapp.com/profile?region=euw1&query=%2Flol%2Fsummoner%2Fv4%2Fsummoners%2Fby-name%2F${this.username}`,
      ).then((response) => {
        console.log(response.data);
        this.encryptedSummonerId = response.data.id;
        // querying all the in depth information with the encrypted id
        this.queryProfileInfoBySummonerId();
      });
    },
    queryProfileInfoBySummonerId() {
      console.log(this.encryptedSummonerId);
      axios.get(
        `http://boostedetector.herokuapp.com/profileInfos?region=euw1&query=%2Flol%2Fleague%2Fv4%2Fentries%2Fby-summoner%2F${this.encryptedSummonerId}`,
      ).then((response) => {
        console.log(response.data[0]);
        this.summonerProfileInfo = response.data[0];
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
