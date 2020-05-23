<template>
  <div>
    <top-bar></top-bar>
    <div class="background">
      <b-container v-if="dataLoaded" class="flex main-content content">
        <div class="12 profile">
            <div class="main-information-block border flex">
              <img v-bind:src=this.summonerProfileImage>
              <div class="profile-text nomargin">
                <h3>{{summonerProfileInfo[defineSoloQueuePlaceInData()].summonerName}}</h3>
                <p class="level nomargin">{{summonerGenralInfo.summonerLevel}}</p>
                <p>{{summonerProfileInfo[defineSoloQueuePlaceInData()].tier}}{{' ' + summonerProfileInfo[defineSoloQueuePlaceInData()].rank}}</p>
                <img v-bind:src="require('../assets/images/ranked-emblems/Emblem_' + summonerProfileInfo[defineSoloQueuePlaceInData()].tier + '.png')">
                <p>{{summonerProfileInfo[defineSoloQueuePlaceInData()].leaguePoints}} LP </p>
              </div>
            </div>
        </div>
        <main-component v-bind:amount-of-games="amountOfGames" :global-win-rate="globalWinRate"  class="border main-component">
        </main-component>
      </b-container>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import TopBar from '../components/TopBar.vue';
import MainComponent from '../components/MainComponent.vue';

export default {
  name: 'Profile',
  components: { TopBar, MainComponent },
  data() {
    return {
      username: this.$route.params.username,
      encryptedSummonerId: '',
      summonerGenralInfo: {},
      summonerProfileInfo: {},
      dataLoaded: false,
      summonerProfileImage: '',
      backrefs: 'http://localhost:3000',
      globalWinRate: 0,
      amountOfGames: 0,
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
        this.getGlobalWinRate();
      });
    },
    defineSoloQueuePlaceInData() {
      const player = this.summonerProfileInfo;
      if (player[0].queueType === 'RANKED_SOLO_5x5') {
        return 0;
      }
      return 1;
    },
    getGlobalWinRate() {
      const { wins } = this.summonerProfileInfo[this.defineSoloQueuePlaceInData()];
      const { losses } = this.summonerProfileInfo[this.defineSoloQueuePlaceInData()];
      const amountOfGames = wins + losses;
      const globalWinRate = ((wins / amountOfGames) * 100).toFixed(1);
      this.globalWinRate = globalWinRate;
      this.amountOfGames = amountOfGames;
    },
  },

};
</script>

<style scoped>
  .content{
    padding: 50px;
  }
  .background{
    max-width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
  }
  .main-information-block {
    width: 300px;
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
  .main-content {
    width: 100%;
  }
  .profile {
    width: 33.333%;
  }
  .profile-text {
    margin-left: auto;
    margin-right: auto;
  }
  .main-component {
    width: 66.666%;
    background-color: white;
  }

</style>
