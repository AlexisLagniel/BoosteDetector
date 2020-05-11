<template>
  <div class="container">
    <p @click="fetchSingleMatchData">testFetchdata</p>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'mainComponent',
  data() {
    return {
      username: this.$route.params.username,
      accountId: '',
      encryptedSummonerId: '',
      backrefs: 'http://localhost:3000',
      matchList: {},
      singleMatch: {},
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
        this.encryptedSummonerId = response.data.id;
        this.accountId = response.data.accountId;
      });
      this.retrieveMatchesList();
    },
    retrieveMatchesList() {
      axios.get(
        `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fmatch%2Fv4%2Fmatchlists%2Fby-account%2F_zejQIzOTIL_3K0Vr6cFQeus5IKjqIjw6tAhrYSiOzH5uw?beginIndex=0${this.encryptedSummonerId}`,
      ).then((response) => {
        this.matchList = response.data;
        console.log(this.matchList);
      });
    },
    fetchSingleMatchData() {
      const matchId = 4591669407;
      axios.get(
        `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fmatch%2Fv4%2Fmatches%2F${matchId}`,
      ).then((response) => {
        this.singleMatch = response.data;
        console.log(this.singleMatch);
      });
    },
  },
};
</script>
<style>

</style>
