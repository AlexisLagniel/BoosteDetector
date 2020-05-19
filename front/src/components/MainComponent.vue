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
      rawMatchList: {},
      matchListDetails: [],
      individualGamesPerformances: [],
      champions,
    };
  },
  mounted() {
    this.queryInfoByUsername();
  },
  methods: {
    async queryInfoByUsername() {
      // getting the infos for a given summoner name
      await axios.get(
        `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fsummoner%2Fv4%2Fsummoners%2Fby-name%2F${this.username}`,
      ).then((response) => {
        this.encryptedSummonerId = response.data.id;
        this.accountId = response.data.accountId;
      });
      this.retrieveMatchesList();
    },
    retrieveMatchesList() {
      console.log(this.encryptedSummonerId);
      axios.get(
        `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fmatch%2Fv4%2Fmatchlists%2Fby-account%2F${this.accountId}?endIndex=10&beginIndex=0&queue=420`,
      ).then((response) => {
        this.rawMatchList = response.data;
      });
    },
    async fetchSingleMatchData() {
      const matchListIds = [];
      const matchlist = this.rawMatchList.matches;
      for (const match of matchlist) {
        // eslint-disable-next-line no-await-in-loop
        matchListIds.push(match.gameId);
      }
      if (this.matchListDetails.length > 0) {
        console.log('already done');
      } else {
        for (const matchId of matchListIds) {
          // eslint-disable-next-line no-await-in-loop
          await axios.get(
            `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fmatch%2Fv4%2Fmatches%2F${matchId}`,
          ).then((response) => {
            this.matchListDetails.push(response.data);
          });
        }
        this.fetchIndividualPerformance();
      }
    },
    fetchIndividualPerformance() {
      // eslint-disable-next-line guard-for-in
      // const gatheredStats = [];
      let participantId;
      function getTeamInfos(id) {
        if (id >= 4) {
          return 0;
        }
        return 1;
      }
      for (const individualMatch of this.matchListDetails) {
        console.log(individualMatch);
        for (const player of individualMatch.participantIdentities) {
          if (player.player.accountId === this.accountId) {
            const individualGameStats = [];
            // eslint-disable-next-line prefer-destructuring
            participantId = player.participantId;
            console.log(participantId);
            const teamInfos = getTeamInfos(participantId);
            console.log(`aa${teamInfos}`);
            individualGameStats.push(individualMatch.teams[teamInfos]);
          }
        }
      }
    },
  },
};
</script>
<style>

</style>
