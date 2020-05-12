<template>
  <div class="container">
    <p @click="fetchSingleMatchData">testFetchdata</p>
  </div>
</template>
<script>
import axios from 'axios';
import champions from './champions.json';

export default {
  name: 'mainComponent',
  data() {
    return {
      username: this.$route.params.username,
      accountId: '',
      encryptedSummonerId: '',
      backrefs: 'http://localhost:3000',
      matchList: [],
      rawMatchList: {},
      matchListDetails: [],
      champions,
    };
  },
  mounted() {
    this.queryInfoByUsername();
    console.log(this.champions);
  },
  methods: {
    queryInfoByUsername() {
      // getting the infos for a given summoner name
      axios.get(
        `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fsummoner%2Fv4%2Fsummoners%2Fby-name%2F${this.username}`,
      ).then((response) => {
        this.encryptedSummonerId = response.data.id;
        this.accountId = response.data.accountId;
      });
      this.retrieveMatchesList();
    },
    retrieveMatchesList() {
      axios.get(
        `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fmatch%2Fv4%2Fmatchlists%2Fby-account%2F_zejQIzOTIL_3K0Vr6cFQeus5IKjqIjw6tAhrYSiOzH5uw${this.encryptedSummonerId}?endIndex=10&beginIndex=0`,
      ).then((response) => {
        this.rawMatchList = response.data;
      });
    },
    fetchSingleMatchData() {
      const matchListIds = [];
      const matchlist = this.rawMatchList.matches;
      for (const match of matchlist) {
        matchListIds.push(match.gameId);
      }
      console.log(matchListIds);
      for (const matchId of matchListIds) {
        axios.get(
          `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fmatch%2Fv4%2Fmatches%2F${matchId}`,
        ).then((response) => {
          this.matchListDetails.push(response.data);
        });
      }
      console.log(this.matchListDetails);
    },
  },
};
</script>
<style>

</style>
