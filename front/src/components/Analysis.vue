<template>
    <div>
      <p @click="getWinRate()">Check My DATA</p>
      <div class="stat-line">
        <div class="individualGraph">
          <bar-chart v-if="roleVarietyCollection" :chartData="roleVarietyCollection"></bar-chart>
          <p @click="fillData()">test</p>
        </div>
        <div class="individualGraph">
          <doughnut v-if="winRate" :chartData="winRateCollection"></doughnut>
        </div>
      </div>
      <div class="stat-line">
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
  },
  watch: {
    winRate() {
      this.fillData();
    },
    propsData() {
      this.getWinRate();
      this.getRoleVariety();
      this.calculatePlayerChampionPool();
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
      roleVariety: [],
      roleVarietyCollection: null,
      dataCollection: null,
      winRateCollection: null,
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
    };
  },
  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    fillData() {
      this.dataCollection = {
        labels: [23, 8, 0, 44],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#b3ffd9',
            data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
          }, {
            label: 'Data two',
            backgroundColor: '#f87979',
            data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
          },
        ],
      };
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
    },
    async getWinRate() {
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
      for (const game of this.propsData) {
        const championToxicity = this.getChampionToxicity(game[0].championName);
        if (championToxicity !== 1) {
          amountOfToxicChamps += 1;
          if (!toxicChampsPlayed.includes(game[0].championName)) {
            toxicChampsPlayed.push(game[0].championName);
          }
          console.log(amountOfToxicChamps);
          console.log(toxicChampsPlayed);
        }
      }
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
