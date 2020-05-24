<template>
    <div>
      <div class="stat-line">
        <div class="individualGraph">
          <bar-chart v-if="roleVarietyCollection" :chartData="roleVarietyCollection" :options="options"></bar-chart>
        </div>
        <div class="individualGraph">
          <doughnut v-if="winRate" :chartData="winRateCollection" :options="options"></doughnut>
        </div>
      </div>
      <div class="stat-line">
        <div class="individualGraph">
          <doughnut v-if="amountOfToxicChampsCollection" :chartData="amountOfToxicChampsCollection" :options="options"></doughnut>
        </div>
        <div class="individualGraph">
          <doughnut v-if="globalWinRateCollection" :chartData="globalWinRateCollection" :options="options"></doughnut>
        </div>
      </div>
      <div class="stat-line">
        <div class="individualGraph">
          <bar-chart v-if="averageKdaCollection" :chartData="averageKdaCollection" :options="options"></bar-chart>
        </div>
      </div>
      <div class="stat-line">
        <div class="individualGraph">
          <div>
            <line-chart v-if="kdaTrackingCollection" :chartData="kdaTrackingCollection" :options="options"></line-chart>
          </div>
        </div>
        <div class="individualGraph">
          <div>
            <radar-chart v-if="visionCollection" :chartData="visionCollection" :options="options"></radar-chart>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import BarChart from './charts/barChart';
import LineChart from './charts/lineChart';
import Doughnut from './charts/doughnut';
import RadarChart from './charts/radar';

export default {
  name: 'Analysis',
  components: {
    BarChart,
    Doughnut,
    LineChart,
    RadarChart,
  },
  watch: {
    winRate() {
      this.fillData();
    },
    propsData() {
      this.getWinRate();
      this.getRoleVariety();
      this.calculatePlayerChampionPool();
      this.singleGameAnalysis();
    },
  },
  mounted() {
    this.getChampionToxicity('Ilaoi');
  },
  props: {
    propsData: Array,
  },
  data() {
    return {
      winRate: 0,
      globalWinRate: 0,
      totalAmountOfGames: 0,
      roleVariety: [],
      roleVarietyCollection: null,
      dataCollection: null,
      winRateCollection: null,
      amountOfToxicChampsCollection: null,
      averageKdaCollection: null,
      globalWinRateCollection: null,
      kdaTrackingCollection: null,
      visionCollection: null,
      toxicChampions: [{
        tier: 1,
        list: ['Evelynn', 'Ilaoi', 'Master Yi', 'Mordekaiser', 'Senna', 'Sylas', 'Talon'],
      },
      {
        tier: 2,
        list: ['Akali', 'Aphelios', 'Diana', 'Fizz', 'Kassadin', 'Sett', 'Teemo', 'Tryndamere', 'Vladimir', 'Zed', 'Kayn'],
      },
      {
        tier: 3,
        list: ['Irelia', 'Katarina', 'Qiyanna', 'Rengar', 'Shyvana', 'Yasuo', 'Yummi', 'Zoe'],
      }],
      mainChampion: null,
      toxicChampsPlayed: [],
      amountOfToxicChamps: 0,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: true,
        //     },
        //   }],
        // },
      },
      kdaData: {},
      averageKda: 0,
    };
  },
  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    fillData() {
      const that = this;
      function fullFillTrackingDataLabels() {
        const targetLabel = that.kdaData.gameLabels;
        const targetData = that.kdaData.killsTracking;
        for (const gameLabel of targetLabel) {
          that.kdaTrackingCollection.labels.push(gameLabel);
        }
        for (const [i, value] of targetData.entries()) {
          that.kdaTrackingCollection.datasets[0].data.push(that.kdaData.killsTracking[i]);
          that.kdaTrackingCollection.datasets[1].data.push(that.kdaData.deathsTracking[i]);
          that.kdaTrackingCollection.datasets[2].data.push(that.kdaData.assistsTracking[i]);
          that.kdaTrackingCollection.datasets[3].data.push(that.kdaData.kdaTracking[i]);
        }
      }
      this.winRateCollection = {
        labels: ['Win', 'Lose'],
        datasets: [
          {
            label: 'Win',
            backgroundColor: ['#b3ffd9', '#f87979'],
            data: [this.winRate, 100 - this.winRate],
          },
        ],
      };
      this.globalWinRateCollection = {
        labels: ['Win', 'Lose'],
        datasets: [
          {
            label: 'Win',
            backgroundColor: ['#b3ffd9', '#f87979'],
            data: [this.globalWinRate, 100 - this.globalWinRate],
          },
        ],
      };
      this.amountOfToxicChampsCollection = {
        labels: ['Toxic', 'Not toxic'],
        datasets: [
          {
            label: 'Win',
            backgroundColor: ['#f87979', '#b3ffd9'],
            data: [((this.amountOfToxicChamps / this.propsData.length) * 100).toFixed(0), 100 - ((this.amountOfToxicChamps / this.propsData.length) * 100).toFixed(0)],
          },
        ],
      };
      this.roleVarietyCollection = {
        labels: ['Top', 'Jungle', 'Mid', 'Adc', 'Support', 'Not ranked'],
        datasets: [
          {
            label: ['Roles'],
            backgroundColor: '#b3ffd9',
            data: [this.roleVariety[0].top, this.roleVariety[0].jungle, this.roleVariety[0].mid, this.roleVariety[0].adc, this.roleVariety[0].support, this.roleVariety[0].notRanked],
          },
        ],
      };
      this.averageKdaCollection = {
        labels: ['Average Kills', 'Average Deaths', 'Average Assists', 'Average KDA'],
        datasets: [
          {
            label: ['Stats'],
            backgroundColor: '#b3ffd9',
            data: [this.kdaData.averageKills, this.kdaData.averageDeaths, this.kdaData.averageAssists, this.kdaData.averageKda],
          },
        ],
      };
      this.kdaTrackingCollection = {
        labels: [],
        datasets: [
          {
            label: ['Kills'],
            fill: false,
            borderColor: '#b3ffd9',
            data: [],
          },
          {
            label: ['Deaths'],
            fill: false,
            borderColor: '#f87979',
            data: [],
          },
          {
            label: ['Assists'],
            fill: false,
            borderColor: '#ffed52',
            data: [],
          },
          {
            label: ['Kda'],
            fill: false,
            borderColor: '#35E7E7',
            data: [],
          },
        ],
      };
      this.visionCollection = {
        labels: ['Average VisionScore', 'Average Vision Wards Bought', 'Average Wards Placed'],
        datasets: [
          {
            label: ['Vision Scores'],
            backgroundColor: ['rgba(200,0,0,0.2)'],
            data: [this.kdaData.averageVisionScore, this.kdaData.averageVisionWardsBoughtInGame, this.kdaData.averageWardsPlaced],
          },
        ],
      };

      fullFillTrackingDataLabels();
    },
    async getWinRate() {
      this.globalWinRate = this.propsData[0][0].globalWinRate;
      this.totalAmountOfGames = this.propsData[0][0].amountOfGames;
      console.log(this.propsData);
      let win = 0;
      let lose = 0;
      for (const game of this.propsData) {
        if (game[0].win === 'Win') {
          await (win += 1);
        } else if (game[0].win === 'Fail') {
          await (lose += 1);
        } else {
          await console.log(game[0].win);
        }
      }
      if (lose + win === this.propsData.length) {
        const winrate = (win / this.propsData.length) * 100;
        this.winRate = winrate;
      }
    },
    getChampionToxicity(champion) {
      if (this.toxicChampions[0].list.includes(champion)) {
        return 2;
      } if (this.toxicChampions[1].list.includes(champion)) {
        return 3;
      } if (this.toxicChampions[2].list.includes(champion)) {
        return 4;
      }
      return 1;
    },
    calculatePlayerChampionPool() {
      let amountOfToxicChamps = 0;
      const toxicChampsPlayed = [];
      const playedChampionsList = [];
      for (const game of this.propsData) {
        playedChampionsList.push(game[0].championName);
        const championToxicity = this.getChampionToxicity(game[0].championName);
        if (championToxicity !== 1) {
          amountOfToxicChamps += 1;
          if (!toxicChampsPlayed.includes(game[0].championName)) {
            toxicChampsPlayed.push(game[0].championName);
          }
        }
      }
      function findMainChamp(list) {
        return list.sort((a, b) => list.filter(v => v === a).length
        - list.filter(v => v === b).length).pop();
      }
      if (playedChampionsList.length === this.propsData.length) {
        this.mainChampion = findMainChamp(playedChampionsList);
      }
      this.amountOfToxicChamps = amountOfToxicChamps;
      this.toxicChampsPlayed = toxicChampsPlayed;
    },
    getRole(game) {
      console.log(game.individualStats.timeline.lane);
    },
    async getRoleVariety() {
      const roleVarietyArray = [];
      let jungle = 0;
      let middle = 0;
      let adc = 0;
      let top = 0;
      let notRanked = 0;
      let support = 0;
      for (const game of this.propsData) {
        const { lane } = game[0].individualStats.timeline;
        const { role } = game[0].individualStats.timeline;
        switch (lane) {
          case 'JUNGLE':
            jungle += 1;
            break;
          case 'BOTTOM':
            if (role === 'DUO_SUPPORT') {
              support += 1;
            } else {
              adc += 1;
            }
            break;
          case 'TOP':
            top += 1;
            break;
          case 'NONE':
            notRanked += 1;
            break;
          case 'MIDDLE':
            middle += 1;
            break;
          default:
            console.log('lane error');
        }
      }
      roleVarietyArray.push({
        middle,
        jungle,
        adc,
        top,
        support,
        notRanked,
      });
      this.roleVariety = roleVarietyArray;
    },
    singleGameAnalysis() {
      let averageKda = 0;
      let averageKills = 0;
      let averageDeaths = 0;
      let averageAssists = 0;
      const kdaCollection = [];
      const assistsCollection = [];
      const killsCollection = [];
      const deathsCollection = [];
      const gameLabels = [];
      let amountOfGames = 0;
      let averageVisionScore = 0;
      let averageGameDuration = 0;
      let averageWardsPlaced = 0;
      let averageVisionWardsBoughtInGame = 0;
      let visionScorePerMinute = 0;
      let championToxicityScore = 0;
      const doubleKillCollection = [];
      const tripleKillCollection = [];
      const quadraKillCollection = [];
      const pentaKillCollection = [];
      let averageDoubleKill = 0;
      let averageTripleKill = 0;
      let averageQuadraKill = 0;
      let averagePentaKill = 0;
      function getKda(individualGame) {
        const { kills } = individualGame[0].individualStats.stats;
        const { deaths } = individualGame[0].individualStats.stats;
        const { assists } = individualGame[0].individualStats.stats;
        let kda;
        if (deaths === 0) {
          kda = (kills + assists) / (deaths + 1);
        } else {
          kda = (kills + assists) / deaths;
        }

        averageKda += kda;
        averageKills += kills;
        averageDeaths += deaths;
        averageAssists += assists;

        kdaCollection.push(kda);
        assistsCollection.push(assists);
        killsCollection.push(kills);
        deathsCollection.push(deaths);
      }

      function getVisionScore(individualGame) {
        const { gameDuration } = individualGame[0];
        const { visionScore } = individualGame[0].individualStats.stats;
        const { wardsPlaced } = individualGame[0].individualStats.stats;
        const { visionWardsBoughtInGame } = individualGame[0].individualStats.stats;
        averageVisionScore += visionScore;
        averageGameDuration += gameDuration;
        averageWardsPlaced += wardsPlaced;
        visionScorePerMinute += (visionScore / (gameDuration / 60));
        averageVisionWardsBoughtInGame += visionWardsBoughtInGame;
      }
      function getMultiKills(individualGame) {
        const { doubleKills } = individualGame[0].individualStats.stats;
        const { tripleKills } = individualGame[0].individualStats.stats;
        const { quadraKills } = individualGame[0].individualStats.stats;
        const { pentaKills } = individualGame[0].individualStats.stats;
        averageDoubleKill += doubleKills;
        averageTripleKill += tripleKills;
        averageQuadraKill += quadraKills;
        averagePentaKill += pentaKills;

        doubleKillCollection.push(doubleKills);
        tripleKillCollection.push(tripleKills);
        quadraKillCollection.push(quadraKills);
        pentaKillCollection.push(pentaKills);
      }

      for (const game of this.propsData) {
        getKda(game);
        const champion = this.getChampionToxicity(game[0].championName);
        championToxicityScore += champion;
        amountOfGames += 1;
        gameLabels.push((`game ${amountOfGames}( ${game[0].championName})`));
        getVisionScore(game);
        getMultiKills(game);
      }
      this.kdaData.averageDeaths = (averageDeaths / this.propsData.length).toFixed(1);
      this.kdaData.averageDeaths = (averageDeaths / this.propsData.length).toFixed(1);
      this.kdaData.averageKills = (averageKills / this.propsData.length).toFixed(1);
      this.kdaData.averageAssists = (averageAssists / this.propsData.length).toFixed(1);
      this.kdaData.averageKda = (averageKda / this.propsData.length).toFixed(1);
      this.kdaData.kdaTracking = kdaCollection;
      this.kdaData.killsTracking = killsCollection;
      this.kdaData.deathsTracking = deathsCollection;
      this.kdaData.assistsTracking = assistsCollection;
      this.kdaData.gameLabels = gameLabels;
      this.kdaData.averageVisionScore = (averageVisionScore / this.propsData.length).toFixed(1);
      this.kdaData.averageGameDuration = ((averageGameDuration / this.propsData.length) / 60).toFixed(1);
      this.kdaData.averageWardsPlaced = (averageWardsPlaced / this.propsData.length).toFixed(1);
      this.kdaData.averageVisionWardsBoughtInGame = (averageVisionWardsBoughtInGame / this.propsData.length).toFixed(1);
      this.kdaData.averageVisionScorePerMinute = (visionScorePerMinute / this.propsData.length).toFixed(1);
      this.kdaData.championToxicityScore = championToxicityScore;
      this.kdaData.averageDoubleKill = (averageDoubleKill / this.propsData.length).toFixed(1);
      this.kdaData.averageTripleKill = (averageTripleKill / this.propsData.length).toFixed(1);
      this.kdaData.averageQuadraKill = (averageQuadraKill / this.propsData.length).toFixed(1);
      this.kdaData.averagePentaKill = (averagePentaKill / this.propsData.length).toFixed(1);
      this.kdaData.doubleKillCollection = doubleKillCollection;
      this.kdaData.tripleKillCollection = tripleKillCollection;
      this.kdaData.quadraKillCollection = quadraKillCollection;
      this.kdaData.pentaKillCollection = pentaKillCollection;
      console.log(this.kdaData);
    },
  },
};
</script>

<style scoped>
.stat-line{
  display: flex;
}
.individualGraph{
  width: 50%;
}
</style>
