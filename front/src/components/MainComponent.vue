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
      gatheredStats: [],
      amountOfGames: 10,
      champions,
    };
  },
  mounted() {
    console.log(this.champions);
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
        `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fmatch%2Fv4%2Fmatchlists%2Fby-account%2F${this.accountId}?endIndex=${this.amountOfGames}&beginIndex=0&queue=420`,
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
        return;
      }
      for (const matchId of matchListIds) {
        // eslint-disable-next-line no-await-in-loop
        await axios.get(
          `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fmatch%2Fv4%2Fmatches%2F${matchId}`,
        ).then((response) => {
          this.matchListDetails.push(response.data);
        });
      }
      this.fetchIndividualPerformance();
    },
    fetchIndividualPerformance() {
      const gatheredStats = [];
      let participantId;
      function getTeamInfos(id) {
        if (id >= 4) {
          return 0;
        }
        return 1;
      }
      for (const individualMatch of this.matchListDetails) {
        for (const player of individualMatch.participantIdentities) {
          if (player.player.accountId === this.accountId) {
            const individualGameStats = [];
            // eslint-disable-next-line prefer-destructuring
            participantId = player.participantId;
            const teamId = getTeamInfos(participantId);
            const championNameQueried = this.getChampionById(individualMatch.participants[participantId - 1].championId);
            individualGameStats.push(
              {
                win: individualMatch.teams[teamId].win,
                baronKills: individualMatch.teams[teamId].baronKills,
                dragonKills: individualMatch.teams[teamId].dragonKills,
                firstBlood: individualMatch.teams[teamId].firstBlood,
                towerKills: individualMatch.teams[teamId].towerKills,
                individualStats: individualMatch.participants[participantId - 1],
                championId: individualMatch.participants[participantId - 1].championId,
                championName: championNameQueried,
                name: player.player.summonerName,
              },
            );
            gatheredStats.push(individualGameStats);
            this.gatheredStats = gatheredStats;
          }
        }
      }
      // eslint-disable-next-line no-restricted-syntax
      console.table(this.gatheredStats);
    },
    getChampionById(id) {
      // eslint-disable-next-line guard-for-in
      for (const champion in champions.data) {
        if (champions.data[champion].key == id) {
          return champions.data[champion].name;
        }
      }
      return false;
    },
  },
};
</script>
<style>

</style>
