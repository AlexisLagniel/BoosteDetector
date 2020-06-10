<template>
  <div class="container">
    <analysis v-bind:props-data="gatheredStats" :rank="rank" :tier="tier" class="chart"></analysis>
  </div>
</template>
<script>
import axios from 'axios';
import Analysis from './Analysis.vue';
import champions from './champions.json';

export default {
  name: 'mainComponent',
  components: { Analysis },
  data() {
    return {
      username: this.$route.params.username,
      accountId: '',
      encryptedSummonerId: '',
      backrefs: this.$store.getters.api_url,
      rawMatchList: {},
      matchListDetails: [],
      gatheredStats: [],
      amountOfGamesToFetch: 10,
      champions,
    };
  },
  props: {
    globalWinRate: String,
    amountOfGames: Number,
    rank: String,
    tier: String,
  },
  mounted() {
    this.queryInfoByUsername();
    console.log(window.location.href);
  },
  methods: {
    async queryInfoByUsername() {
      // getting the infos for a given summoner name
      await axios.get(
        `${this.backrefs}/profileByName?region=euw1&name=${encodeURIComponent(decodeURIComponent(this.username))}`,
      ).then((response) => {
        this.encryptedSummonerId = response.data.id;
        this.accountId = response.data.accountId;
      });
      this.retrieveMatchesList();
    },
    retrieveMatchesList() {
      const requestParams = `?queue=420&endIndex=${this.amountOfGamesToFetch}&beginIndex=0`;
      axios.get(
        // `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fmatch%2Fv4%2Fmatchlists%2Fby-account%2F${this.accountId}?endIndex=${this.amountOfGamesToFetch}&beginIndex=0&queue=420`,
        `${this.backrefs}/matches?region=euw1&encryptedId=${this.accountId}&params=${encodeURIComponent(requestParams)}`,
      ).then((response) => {
        this.rawMatchList = response.data;
        this.fetchSingleMatchData();
      });
    },
    async fetchSingleMatchData() {
      const matchListIds = [];
      const matchlist = this.rawMatchList.matches;
      for (const match of matchlist) {
        // eslint-disable-next-line no-await-in-loop
        await matchListIds.push(match.gameId);
      }
      if (this.matchListDetails.length > 0) {
        console.log('already done');
        return;
      }
      for (const matchId of matchListIds) {
        // eslint-disable-next-line no-await-in-loop
        axios.get(
          `${this.backrefs}/profile?region=euw1&query=%2Flol%2Fmatch%2Fv4%2Fmatches%2F${matchId}`,
        ).then((response) => {
          this.matchListDetails.push(response.data);
          if (this.matchListDetails.length === this.amountOfGamesToFetch) {
            this.fetchIndividualPerformance();
          }
        });
      }
    },
    async fetchIndividualPerformance() {
      const gatheredStats = [];
      let participantId;
      function getTeamInfos(teamId) {
        if (teamId === 100) {
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
            const teamId = getTeamInfos(individualMatch.participants[participantId - 1].teamId);
            const championNameQueried = this.getChampionById(individualMatch.participants[participantId - 1].championId);
            await individualGameStats.push(
              {
                win: individualMatch.teams[teamId].win,
                teamId: individualMatch.participants[participantId - 1].teamId,
                baronKills: individualMatch.teams[teamId].baronKills,
                dragonKills: individualMatch.teams[teamId].dragonKills,
                firstBlood: individualMatch.teams[teamId].firstBlood,
                towerKills: individualMatch.teams[teamId].towerKills,
                individualStats: individualMatch.participants[participantId - 1],
                championId: individualMatch.participants[participantId - 1].championId,
                championName: championNameQueried,
                name: player.player.summonerName,
                tier: player.player.tier,
                globalWinRate: this.globalWinRate,
                amountOfGames: this.amountOfGames,
                gameDuration: individualMatch.gameDuration,
              },
            );
            gatheredStats.push(individualGameStats);
          }
        }
      }
      this.gatheredStats = gatheredStats;
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
