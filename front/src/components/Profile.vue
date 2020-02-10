<template>
  <div>
    <top-bar></top-bar>
    <div class="background">
      <b-container class="content">
        <b-col cols="3">
          <h2 class="summoner-name">{{username}}</h2>
            <div class="main-information-block border flex">
              <img v-bind:src= this.summonerRankImage>
              <h3>{{summonerProfileInfo[0].summonerName}}</h3>
            </div>
        </b-col>
      </b-container>
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
      dataLoaded: false,
      summonerRankImage: 'https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg',
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
        this.summonerProfileInfo = response.data;
        this.dataLoaded = true;
        console.log(this.summonerProfileInfo[0].leagueId);
      });
    },
  },

};
</script>

<style scoped>
  .content{
    padding: 50px;
  }
  .background{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
  }
  .summoner-name{
    font-family: Muli;
    font-size: 45px;
    margin-top: 25px;
  }
  .main-information-block {
    width: 100%;
  }
  .main-information-block img{
    width: 50px;
    height: 50px;
  }

</style>
