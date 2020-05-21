<template>
    <div>
      <p @click="getWinRate()">Check My DATA</p>
      <div class="stat-line">
        <div class="individualGraph">
          <bar-chart v-if="dataCollection" :chartData="dataCollection"></bar-chart>
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
    },
  },
  mounted() {
    this.fillData();
  },
  props: {
    propsData: Array,
  },
  computed: {
  },
  data() {
    return {
      winRate: 0,
      dataCollection: null,
      winRateCollection: null,
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
        console.log(`winrate: ${this.winRate}%`);
      }
    },
    getToxicChampions() {
    },
    getRoleVariety() {
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
