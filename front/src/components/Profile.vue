<template>
  <div>
    <top-bar></top-bar>
    <div class="background">
      <b-container class="content">
        <b-col cols="12">
          <h2 class="summoner-name">{{username}}</h2>
            <div class="main-information-block border flex">
              <img v-bind:src=this.summonerProfileImage>
              <div>
                <h3>{{summonerProfileInfo[0].summonerName}}</h3>
                <p class="level nomargin">{{summonerGenralInfo.summonerLevel}}</p>
                <p>{{summonerProfileInfo[0].tier}}{{' ' + summonerProfileInfo[0].rank}}</p>
                <img v-bind:src="require('../assets/images/ranked-emblems/Emblem_' + summonerProfileInfo[0].tier + '.png')">
              </div>
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
      summonerGenralInfo: {},
      summonerProfileInfo: {},
      dataLoaded: false,
      summonerProfileImage: '',
      backrefs: 'http://localhost:3000',
    };
  },
  mounted() {
    this.queryInfoByUsername();
  },
  methods: {
    queryInfoByUsername() {
      // getting the infos for a given summoner name
      axios.get(
        `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fsummoner%2Fv4%2Fsummoners%2Fby-name%2F${this.username}`,
      ).then((response) => {
        console.log(response.data);
        this.summonerGenralInfo = response.data;
        this.encryptedSummonerId = response.data.id;
        const { profileIconId } = response.data;
        const summonerIcon = `http://ddragon.leagueoflegends.com/cdn/10.9.1/img/profileicon/${profileIconId}.png`;
        this.summonerProfileImage = summonerIcon;

        // querying all the in depth information with the encrypted id
        this.queryProfileInfoBySummonerId();
      });
    },
    queryProfileInfoBySummonerId() {
      axios.get(
        `${this.backrefs}/profileInfos?region=euw1&query=%2Flol%2Fleague%2Fv4%2Fentries%2Fby-summoner%2F${this.encryptedSummonerId}`,
      ).then((response) => {
        this.summonerProfileInfo = response.data;
        console.log(this.summonerProfileInfo);
        const rankIcon = '../../assets/images/ranked-emblems/Emblem_Bronze.png';
        this.summonerRankImage = rankIcon;
        this.dataLoaded = true;
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
    background-color: white;
  }
  .main-information-block img{
    width: 50px;
    height: 50px;
  }
  h3{
    padding: 0;
    margin: 0;
  }
  .nomargin{
    margin: 0;
    padding: 0;
  }

</style>
