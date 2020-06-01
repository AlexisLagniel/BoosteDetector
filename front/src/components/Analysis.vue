<template>
    <div>
      <div class="stat-line">
        <div class="individualGraph">
          <bar-chart v-if="dataLoaded" :chartData="roleVarietyCollection" :options="options"></bar-chart>
        </div>
        <div class="individualGraph">
          <doughnut v-if="dataLoaded" :chartData="winRateCollection" :options="options"></doughnut>
        </div>
      </div>
      <div class="stat-line">
        <div class="individualGraph">
          <doughnut v-if="dataLoaded" :chartData="amountOfToxicChampsCollection" :options="options"></doughnut>
        </div>
        <div class="individualGraph">
          <doughnut v-if="dataLoaded" :chartData="globalWinRateCollection" :options="options"></doughnut>
        </div>
      </div>
      <div class="stat-line">
        <div class="individualGraph">
          <bar-chart v-if="dataLoaded" :chartData="averageKdaCollection" :options="options"></bar-chart>
        </div>
        <div class="individualGraph">
          <bar-chart v-if="dataLoaded" :chartData="averageGoldDeltaCollection" :options="options"></bar-chart>
        </div>
      </div>
      <div class="stat-line">
        <div class="individualGraph">
          <div>
            <line-chart v-if="dataLoaded" :chartData="kdaTrackingCollection" :options="options"></line-chart>
          </div>
        </div>
        <div class="individualGraph">
          <div>
            <radar-chart v-if="dataLoaded" :chartData="visionCollection" :options="options"></radar-chart>
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
    dataLoaded() {
      this.fillData();
      this.generateScores();
    },
  },
  mounted() {
  },
  props: {
    propsData: Array,
    rank: String,
    tier: String,
  },
  data() {
    return {
      dataLoaded: false,
      winRate: 0,
      globalWinRate: 0,
      totalAmountOfGames: 0,
      roleVariety: [],
      roleVarietyCollection: null,
      winRateCollection: null,
      amountOfToxicChampsCollection: null,
      averageKdaCollection: null,
      averageGoldDeltaCollection: null,
      globalWinRateCollection: null,
      kdaTrackingCollection: null,
      visionCollection: null,
      multiKillsCollection: null,
      boostedScores: {},
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
      mainChampionToxicity: null,
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
      finalBoostingScore: null,
    };
  },
  methods: {
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
          that.kdaTrackingCollection.datasets[4].data.push(that.kdaData.farmCollection[i]);
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
            borderColor: '#ff99ff',
            data: [],
          },
          {
            label: ['Kda'],
            fill: false,
            borderColor: '#35E7E7',
            data: [],
          },
          {
            label: ['Creeps per minute'],
            fill: false,
            borderColor: '#ffff66',
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
      this.averageGoldDeltaCollection = {
        labels: ['At 10', 'At 20', 'At 30', 'After 30'],
        datasets: [
          {
            label: ['Average gold per minute'],
            backgroundColor: '#b3ffd9',
            data: [this.kdaData.averageGoldAt10, this.kdaData.averageGoldAt20, this.kdaData.averageGoldAt30, this.kdaData.averageGoldAfter30],
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
        this.mainChampionToxicity = this.getChampionToxicity(this.mainChampion);
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
      const that = this;
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
      const farmCollection = [];
      let averageFarm = 0;
      let averageFarmPerminute = 0;
      const pentaKillCollection = [];
      let averageDoubleKill = 0;
      let averageTripleKill = 0;
      let averageQuadraKill = 0;
      let averagePentaKill = 0;
      const averagegoldDeltaAt10 = [];
      const averagegoldDeltaAt20 = [];
      const averagegoldDeltaAt30 = [];
      const averagegoldDeltaAfter30 = [];
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
        const { totalMinionsKilled } = individualGame[0].individualStats.stats;
        averageVisionScore += visionScore;
        averageGameDuration += gameDuration;
        averageWardsPlaced += wardsPlaced;
        averageFarm += totalMinionsKilled;
        averageFarmPerminute += (totalMinionsKilled / (gameDuration / 60));
        visionScorePerMinute += (visionScore / (gameDuration / 60));
        averageVisionWardsBoughtInGame += visionWardsBoughtInGame;
        farmCollection.push((totalMinionsKilled / (gameDuration / 60)).toFixed(1));
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
      function getAverageGoldDeltas(period) {
        let accumuler = 0;
        for (const gold of period) {
          accumuler += gold;
        }
        return accumuler;
      }
      function getGoldDelta(individualGame) {
        const { goldPerMinDeltas } = individualGame[0].individualStats.timeline;
        for (const [period, value] of Object.entries(goldPerMinDeltas)) {
          switch (period) {
            case '0-10':
              averagegoldDeltaAt10.push(value);
              break;
            case '10-20':
              averagegoldDeltaAt20.push(value);
              break;
            case '20-30':
              averagegoldDeltaAt30.push(value);
              break;
            case '30-end':
              averagegoldDeltaAfter30.push(value);
              break;
            default:
              console.log('error');
          }
        }
        setTimeout(() => {
          that.kdaData.averageGoldAt10 = (getAverageGoldDeltas(averagegoldDeltaAt10) / averagegoldDeltaAt10.length).toFixed(0);
          that.kdaData.averageGoldAt20 = (getAverageGoldDeltas(averagegoldDeltaAt20) / averagegoldDeltaAt20.length).toFixed(0);
          that.kdaData.averageGoldAt30 = (getAverageGoldDeltas(averagegoldDeltaAt30) / averagegoldDeltaAt30.length).toFixed(0);
          that.kdaData.averageGoldAfter30 = (getAverageGoldDeltas(averagegoldDeltaAfter30) / averagegoldDeltaAfter30.length).toFixed(0);
          that.dataLoaded = true;
        }, 50);
      }


      for (const game of this.propsData) {
        getKda(game);
        const champion = this.getChampionToxicity(game[0].championName);
        championToxicityScore += champion;
        amountOfGames += 1;
        gameLabels.push((`game ${amountOfGames}( ${game[0].championName})`));
        getVisionScore(game);
        getMultiKills(game);
        getGoldDelta(game);
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
      this.kdaData.farmCollection = farmCollection;
      this.kdaData.averageFarm = (averageFarm / this.propsData.length).toFixed(1);
      this.kdaData.averageFarmPerMinute = ((averageFarm / this.propsData.length) / ((averageGameDuration / 60) / this.propsData.length)).toFixed(1);
      console.log(this.kdaData);
    },
    generateScores() {
      const that = this;
      function mainChampToxicityScore() {
        const mainChampionscore = that.mainChampionToxicity;
        const averageScore = (that.kdaData.championToxicityScore / that.propsData.length);
        switch (mainChampionscore) {
          case 1:
            that.boostedScores.mainChampionToxicity = 10;
            break;
          case 2:
            that.boostedScores.mainChampionToxicity = 6;
            break;
          case 3:
            that.boostedScores.mainChampionToxicity = 3;
            break;
          case 4:
            that.boostedScores.mainChampionToxicity = 0;
            break;
          default:
        }
        if (averageScore <= 1.3) {
          that.boostedScores.averageChampionToxicity = 10;
        } else if (averageScore > 1.3 && averageScore <= 1.8) {
          that.boostedScores.averageChampionToxicity = 8;
        } else if (averageScore > 1.8 && averageScore <= 2.2) {
          that.boostedScores.averageChampionToxicity = 5;
        } else if (averageScore > 2.2 && averageScore <= 2.5) {
          that.boostedScores.averageChampionToxicity = 3;
        } else if (averageScore > 2.2 && averageScore <= 2.5) {
          that.boostedScores.averageChampionToxicity = 3;
        } else if (averageScore > 2.5) {
          that.boostedScores.averageChampionToxicity = 0;
        }
      }
      function winRateScore() {
        const { globalWinRate } = that;
        const currentWinRate = that.winRate;
        if (globalWinRate <= 40) {
          that.boostedScores.globalWinRate = 0;
        } else if (globalWinRate > 40 && globalWinRate <= 43) {
          that.boostedScores.globalWinRate = 1;
        } else if (globalWinRate > 43 && globalWinRate <= 45) {
          that.boostedScores.globalWinRate = 2;
        } else if (globalWinRate > 45 && globalWinRate <= 47) {
          that.boostedScores.globalWinRate = 3;
        } else if (globalWinRate > 47 && globalWinRate <= 49) {
          that.boostedScores.globalWinRate = 4;
        } else if (globalWinRate > 49 && globalWinRate <= 50) {
          that.boostedScores.globalWinRate = 5;
        } else if (globalWinRate > 49 && globalWinRate <= 50) {
          that.boostedScores.globalWinRate = 5;
        } else if (globalWinRate > 50 && globalWinRate <= 52) {
          that.boostedScores.globalWinRate = 6;
        } else if (globalWinRate > 52 && globalWinRate <= 54) {
          that.boostedScores.globalWinRate = 7;
        } else if (globalWinRate > 54 && globalWinRate <= 57) {
          that.boostedScores.globalWinRate = 8;
        } else if (globalWinRate > 57 && globalWinRate <= 60) {
          that.boostedScores.globalWinRate = 9;
        } else if (globalWinRate > 60) {
          that.boostedScores.globalWinRate = 10;
        }

        if (currentWinRate <= 35) {
          that.boostedScores.currentWinRate = 0;
        } else if (currentWinRate > 35 && currentWinRate <= 40) {
          that.boostedScores.currentWinRate = 1;
        } else if (currentWinRate > 40 && currentWinRate <= 45) {
          that.boostedScores.currentWinRate = 3;
        } else if (currentWinRate > 45 && currentWinRate <= 50) {
          that.boostedScores.currentWinRate = 5;
        } else if (currentWinRate > 50 && currentWinRate <= 55) {
          that.boostedScores.currentWinRate = 7;
        } else if (currentWinRate > 55 && currentWinRate <= 60) {
          that.boostedScores.currentWinRate = 9;
        } else if (currentWinRate > 60) {
          that.boostedScores.currentWinRate = 10;
        }
      }
      function farmScore() {
        const averageFarmScore = that.kdaData.averageFarm;
        const averageFarmPerMinScore = that.kdaData.averageFarmPerMinute;

        if (averageFarmScore < 70) {
          that.boostedScores.averageFarm = 0;
        } else if (averageFarmScore > 70 && averageFarmScore <= 90) {
          that.boostedScores.averageFarm = 1;
        } else if (averageFarmScore > 70 && averageFarmScore <= 90) {
          that.boostedScores.averageFarm = 2;
        } else if (averageFarmScore > 90 && averageFarmScore <= 110) {
          that.boostedScores.averageFarm = 3;
        } else if (averageFarmScore > 110 && averageFarmScore <= 130) {
          that.boostedScores.averageFarm = 4;
        } else if (averageFarmScore > 130 && averageFarmScore <= 150) {
          that.boostedScores.averageFarm = 5;
        } else if (averageFarmScore > 150 && averageFarmScore <= 170) {
          that.boostedScores.averageFarm = 6;
        } else if (averageFarmScore > 190 && averageFarmScore <= 210) {
          that.boostedScores.averageFarm = 7;
        } else if (averageFarmScore > 210 && averageFarmScore <= 230) {
          that.boostedScores.averageFarm = 8;
        } else if (averageFarmScore > 250 && averageFarmScore <= 280) {
          that.boostedScores.averageFarm = 9;
        } else if (averageFarmScore > 280) {
          that.boostedScores.averageFarm = 10;
        }

        if (averageFarmPerMinScore < 3) {
          that.boostedScores.averageFarmPerMinute = 0;
        } else if (averageFarmPerMinScore > 3 && averageFarmPerMinScore <= 4.5) {
          that.boostedScores.averageFarmPerMinute = 2;
        } else if (averageFarmPerMinScore > 4.5 && averageFarmPerMinScore <= 5.5) {
          that.boostedScores.averageFarmPerMinute = 5;
        } else if (averageFarmPerMinScore > 5.5 && averageFarmPerMinScore <= 6.5) {
          that.boostedScores.averageFarmPerMinute = 7;
        } else if (averageFarmPerMinScore > 6.5 && averageFarmPerMinScore <= 7.5) {
          that.boostedScores.averageFarmPerMinute = 9;
        } else if (averageFarmPerMinScore > 7.5) {
          that.boostedScores.averageFarmPerMinute = 10;
        }
      }
      function gameDurationScore() {
        const { averageGameDuration } = that.kdaData;
        if (averageGameDuration > 40) {
          that.boostedScores.gameDuration = 0;
        } else if (averageGameDuration < 40 && averageGameDuration >= 35) {
          that.boostedScores.gameDuration = 1;
        } else if (averageGameDuration < 35 && averageGameDuration >= 31) {
          that.boostedScores.gameDuration = 3;
        } else if (averageGameDuration < 31 && averageGameDuration >= 28) {
          that.boostedScores.gameDuration = 5;
        } else if (averageGameDuration < 28 && averageGameDuration >= 26) {
          that.boostedScores.gameDuration = 7;
        } else if (averageGameDuration < 26 && averageGameDuration >= 24) {
          that.boostedScores.gameDuration = 9;
        } else if (averageGameDuration < 24) {
          that.boostedScores.gameDuration = 10;
        }
      }
      function averageGoldScore(score, index) {
        let suffix = '';
        if (index === 1) {
          suffix = 'goldScoreAt10';
        } else if (index === 2) {
          suffix = 'goldScoreAt20';
        } else if (index === 3) {
          suffix = 'goldScoreAt30';
        } else if (index === 4) {
          suffix = 'goldScoreAfter30';
        }

        if (index === 1) {
          if (score <= 250) {
            that.boostedScores[suffix] = 0;
          } else if (score > 250 && score <= 280) {
            that.boostedScores[suffix] = 2;
          } else if (score > 250 && score <= 280) {
            that.boostedScores[suffix] = 4;
          } else if (score > 280 && score <= 300) {
            that.boostedScores[suffix] = 6;
          } else if (score > 300 && score <= 330) {
            that.boostedScores[suffix] = 8;
          } else if (score > 330) {
            that.boostedScores[suffix] = 10;
          }
        } else if (index !== 1) {
          if (score <= 300) {
            that.boostedScores[suffix] = 0;
          } else if (score > 300 && score <= 350) {
            that.boostedScores[suffix] = 2;
          } else if (score > 350 && score <= 380) {
            that.boostedScores[suffix] = 4;
          } else if (score > 380 && score <= 420) {
            that.boostedScores[suffix] = 6;
          } else if (score > 420 && score <= 450) {
            that.boostedScores[suffix] = 8;
          } else if (score > 450) {
            that.boostedScores[suffix] = 10;
          }
        }
      }
      function rankScore() {
        const { rank } = that;
        const { tier } = that;

        if (tier === 'IRON') {
          that.boostedScores.rankScore = 0;
        } else if (tier === 'BRONZE') {
          that.boostedScores.rankScore = 1;
        } else if (tier === 'SILVER') {
          that.boostedScores.rankScore = 3;
        } else if (tier === 'GOLD') {
          that.boostedScores.rankScore = 4;
        } else if (tier === 'PLATINUM') {
          that.boostedScores.rankScore = 6;
        } else if (tier === 'DIAMOND' && rank === 'IV') {
          that.boostedScores.rankScore = 7;
        } else if (tier === 'DIAMOND' && (rank === 'III' || rank === 'II' || rank === 'I')) {
          that.boostedScores.rankScore = 8;
        } else {
          that.boostedScores.rankScore = 10;
        }
      }
      function visionScore() {
        const { averageVisionScorePerMinute } = that.kdaData;
        const { averageVisionWardsBoughtInGame } = that.kdaData;
        const { averageWardsPlaced } = that.kdaData;

        // average vision score
        if (averageVisionScorePerMinute <= 0.3) {
          that.boostedScores.averageVisionScore = 0;
        } else if (averageVisionScorePerMinute > 0.3 && averageVisionScorePerMinute <= 0.5) {
          that.boostedScores.averageVisionScore = 2;
        } else if (averageVisionScorePerMinute > 0.5 && averageVisionScorePerMinute <= 0.8) {
          that.boostedScores.averageVisionScore = 4;
        } else if (averageVisionScorePerMinute > 0.8 && averageVisionScorePerMinute <= 1) {
          that.boostedScores.averageVisionScore = 6;
        } else if (averageVisionScorePerMinute > 1 && averageVisionScorePerMinute <= 1.5) {
          that.boostedScores.averageVisionScore = 8;
        } else if (averageVisionScorePerMinute > 1.5) {
          that.boostedScores.averageVisionScore = 10;
        }

        // vision wards bought score
        if (averageVisionWardsBoughtInGame <= 0.5) {
          that.boostedScores.visionWardsScore = 0;
        } else if (averageVisionWardsBoughtInGame > 0.5 && averageVisionWardsBoughtInGame <= 1) {
          that.boostedScores.visionWardsScore = 1;
        } else if (averageVisionWardsBoughtInGame > 1 && averageVisionWardsBoughtInGame <= 1.5) {
          that.boostedScores.visionWardsScore = 2;
        } else if (averageVisionWardsBoughtInGame > 1.5 && averageVisionWardsBoughtInGame <= 2) {
          that.boostedScores.visionWardsScore = 4;
        } else if (averageVisionWardsBoughtInGame > 2 && averageVisionWardsBoughtInGame <= 2.5) {
          that.boostedScores.visionWardsScore = 6;
        } else if (averageVisionWardsBoughtInGame > 2.5 && averageVisionWardsBoughtInGame <= 3) {
          that.boostedScores.visionWardsScore = 8;
        } else if (averageVisionWardsBoughtInGame > 3 && averageVisionWardsBoughtInGame <= 4) {
          that.boostedScores.visionWardsScore = 9;
        } else if (averageVisionWardsBoughtInGame > 4) {
          that.boostedScores.visionWardsScore = 10;
        }

        // vision wards bought score
        if (averageWardsPlaced <= 2) {
          that.boostedScores.wardsPlaced = 0;
        } else if (averageWardsPlaced > 2 && averageWardsPlaced <= 4) {
          that.boostedScores.wardsPlaced = 1;
        } else if (averageWardsPlaced > 4 && averageWardsPlaced <= 6) {
          that.boostedScores.wardsPlaced = 2;
        } else if (averageWardsPlaced > 10 && averageWardsPlaced <= 15) {
          that.boostedScores.wardsPlaced = 4;
        } else if (averageWardsPlaced > 15 && averageWardsPlaced <= 20) {
          that.boostedScores.wardsPlaced = 6;
        } else if (averageWardsPlaced > 20 && averageWardsPlaced <= 25) {
          that.boostedScores.wardsPlaced = 8;
        } else if (averageWardsPlaced > 25 && averageWardsPlaced <= 30) {
          that.boostedScores.wardsPlaced = 9;
        } else if (averageWardsPlaced > 30) {
          that.boostedScores.wardsPlaced = 10;
        }
      }
      function kdaScore() {
        const kda = that.kdaData.averageKda;
        const kills = that.kdaData.averageKills;
        const deaths = that.kdaData.averageDeaths;
        const assists = that.kdaData.averageAssists;

        if (kda <= 1) {
          that.boostedScores.kdaScore = 0;
        } else if (kda > 1 && kda <= 1.5) {
          that.boostedScores.kdaScore = 1;
        } else if (kda > 1.5 && kda <= 2) {
          that.boostedScores.kdaScore = 2;
        } else if (kda > 2 && kda <= 2.5) {
          that.boostedScores.kdaScore = 4;
        } else if (kda > 2.5 && kda <= 3) {
          that.boostedScores.kdaScore = 6;
        } else if (kda > 3 && kda <= 3.5) {
          that.boostedScores.kdaScore = 8;
        } else if (kda > 3.5 && kda <= 4) {
          that.boostedScores.kdaScore = 9;
        } else if (kda > 4) {
          that.boostedScores.kdaScore = 10;
        }

        if (kills <= 1) {
          that.boostedScores.killsScore = 0;
        } else if (kills > 1 && kills <= 2) {
          that.boostedScores.killsScore = 1;
        } else if (kills > 2 && kills <= 3) {
          that.boostedScores.killsScore = 2;
        } else if (kills > 3 && kills <= 4) {
          that.boostedScores.killsScore = 4;
        } else if (kills > 4 && kills <= 5) {
          that.boostedScores.killsScore = 5;
        } else if (kills > 5 && kills <= 6) {
          that.boostedScores.killsScore = 6;
        } else if (kills > 6 && kills <= 7) {
          that.boostedScores.killsScore = 8;
        } else if (kills > 7 && kills <= 8) {
          that.boostedScores.killsScore = 9;
        } else if (kills > 8) {
          that.boostedScores.killsScore = 10;
        }

        if (deaths >= 12) {
          that.boostedScores.deathsScore = 0;
        } else if (deaths < 12 && deaths >= 10) {
          that.boostedScores.deathsScore = 2;
        } else if (deaths < 10 && deaths >= 8) {
          that.boostedScores.deathsScore = 4;
        } else if (deaths < 8 && deaths >= 6) {
          that.boostedScores.deathsScore = 6;
        } else if (deaths < 6 && deaths >= 4) {
          that.boostedScores.deathsScore = 7;
        } else if (deaths < 4 && deaths >= 3) {
          that.boostedScores.deathsScore = 8;
        } else if (deaths < 3 && deaths >= 2) {
          that.boostedScores.deathsScore = 9;
        } else if (deaths < 2) {
          that.boostedScores.deathsScore = 10;
        }

        if (assists <= 3) {
          that.boostedScores.assistsScore = 0;
        } else if (assists > 3 && assists <= 5) {
          that.boostedScores.assistsScore = 1;
        } else if (assists > 5 && assists <= 8) {
          that.boostedScores.assistsScore = 3;
        } else if (assists > 8 && assists <= 10) {
          that.boostedScores.assistsScore = 5;
        } else if (assists > 10 && assists <= 13) {
          that.boostedScores.assistsScore = 7;
        } else if (assists > 13 && assists <= 15) {
          that.boostedScores.assistsScore = 8;
        } else if (assists > 15 && assists <= 18) {
          that.boostedScores.assistsScore = 10;
        }
      }

      mainChampToxicityScore();
      winRateScore();
      farmScore();
      gameDurationScore();
      rankScore();
      averageGoldScore(that.kdaData.averageGoldAt10, 1);
      averageGoldScore(that.kdaData.averageGoldAt20, 2);
      averageGoldScore(that.kdaData.averageGoldAt30, 3);
      averageGoldScore(that.kdaData.averageGoldAfter30, 4);
      visionScore();
      kdaScore();
      this.getFinalBoostingScore();
      console.log(that.boostedScores);
    },
    getFinalBoostingScore() {
      let points = 0;
      let numberOfStatsAnalyzed = 0;
      for (const i in this.boostedScores) {
        points += this.boostedScores[i];
        numberOfStatsAnalyzed += 1;
      }
      console.log((points / numberOfStatsAnalyzed) * 10);
      console.log(numberOfStatsAnalyzed);
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
