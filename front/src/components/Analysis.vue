<template>
    <div>
      <p @click="getWinRate()">Check My DATA</p>
      <div class="stat-line">
        <div class="individualGraph">
          <bar-chart v-if="roleVarietyCollection" :chartData="roleVarietyCollection" :options="options"></bar-chart>
          <p @click="fillData()">test</p>
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
        <div>
          <line-chart v-if="kdaTrackingCollection" :chartData="kdaTrackingCollection" :options="options"></line-chart>
        </div>
      </div>
    </div>
</template>

<script>
import BarChart from './charts/barChart';
import LineChart from './charts/lineChart';
import Doughnut from './charts/doughnut';

export default {
  name: 'Analysis',
  components: {
    BarChart,
    Doughnut,
    LineChart,
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
      amountOfGames: 0,
      roleVariety: [],
      roleVarietyCollection: null,
      dataCollection: null,
      winRateCollection: null,
      amountOfToxicChampsCollection: null,
      averageKdaCollection: null,
      globalWinRateCollection: null,
      kdaTrackingCollection: null,
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
      },
      averageKda: 0,
      averageAssists: 0,
      averageKills: 0,
      averageDeaths: 0,
      kdaTracking: [],
      killsTracking: [],
      assistsTracking: [],
      deathsTracking: [],
      test: [1, 23, 4, 15],
    };
  },
  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    fillData() {
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
            data: [this.averageKills, this.averageDeaths, this.averageAssists, this.averageKda],
          },
        ],
      };
      this.kdaTrackingCollection = {
        labels: ['Average Kills', 'Average Deaths', 'Average Assists', 'Average KDA'],
        datasets: [
          {
            label: ['Kills'],
            backgroundColor: '#b3ffd9',
            data: [1, 25, 12, 14, 13],
          },
          {
            label: ['Deaths'],
            backgroundColor: '#f87979',
            data: [this.deathsTracking],
          },
          {
            label: ['Assists'],
            backgroundColor: '#AF33FF',
            data: [this.assistsTracking],
          },
          {
            label: ['Kda'],
            backgroundColor: '#35E7E7',
            data: [this.kdaTracking],
          },
        ],
      };
    },
    async getWinRate() {
      this.globalWinRate = this.propsData[0][0].globalWinRate;
      this.amountOfGames = this.propsData[0].amountOfGames;
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
      console.log(playedChampionsList);
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
      function getKda(individualGame) {
        const { kills } = individualGame[0].individualStats.stats;
        const { deaths } = individualGame[0].individualStats.stats;
        const { assists } = individualGame[0].individualStats.stats;
        const kda = (kills + assists) / deaths;
        averageKda += kda;
        averageKills += kills;
        averageDeaths += deaths;
        averageAssists += assists;
        kdaCollection.push(kda);
        assistsCollection.push(assists);
        killsCollection.push(kills);
        deathsCollection.push(deaths);
        // console.log(this.kdaTrackingCollection);
        console.log(kda);
      }
      for (const game of this.propsData) {
        getKda(game);
      }
      this.averageDeaths = (averageDeaths / this.propsData.length).toFixed(1);
      this.averageKills = (averageKills / this.propsData.length).toFixed(1);
      this.averageAssists = (averageAssists / this.propsData.length).toFixed(1);
      this.averageKda = (averageKda / this.propsData.length).toFixed(1);
      this.kdaTracking = kdaCollection;
      this.killsTracking = killsCollection;
      this.deathsTracking = deathsCollection;
      this.assistsTracking = assistsCollection;
      console.log(this.kdaTracking);
      console.log(this.killsTracking);
      console.log(this.deathsTracking);
      console.log(this.assistsTracking);
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
