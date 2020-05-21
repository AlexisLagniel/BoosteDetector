<template>
    <div>
      <p @click="getWinRate()">Check My DATA</p>
      <p @click="test">randomiNT</p>
      <div class="stat-line">
        <div class="individualGraph">
          <bar-chart v-if="dataCollection" :chartData="dataCollection"></bar-chart>
        </div>
        <div class="individualGraph">
          <doughnut :chartData="winRateCollection" :winrate="winRate"></doughnut>
        </div>
      </div>
    </div>
</template>

<script>
import BarChart from './charts/barChart';
import Doughnut from './charts/doughnut';

export default {
  name: 'Analysis',
  components: {
    BarChart,
    Doughnut,
  },
  mounted() {
  },
  props: {
    propsData: Array,
  },
  watch: {
    // winRate() {
    //   // eslint-disable-next-line no-underscore-dangle
    //   this.winRateCollection._chart.update();
    //   console.log('yo');
    // },
  },
  computed: {
    winRateComputed() {
      return this.winRate;
    },
  },
  data() {
    return {
      winRate: 0,
      dataCollection: {
        labels: [23, 8, 0, 44],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#b3ffd9',
            data: [23, 11, 8, 31],
          }, {
            label: 'Data two',
            backgroundColor: '#f87979',
            data: [23, 14, 75, 94],
          },
        ],
      },
      winRateCollection: {
        labels: ['Winrate'],
        datasets: [
          {
            label: 'Win',
            backgroundColor: '#b3ffd9',
            data: [this.getRandomInt()],
          },
          {
            label: 'Lose',
            backgroundColor: '#f87979',
            data: [this.winRate],
          },
        ],
      },
    };
  },
  methods: {
    test() {
      console.log(this.winRateCollection.datasets);
      this.winRateCollection.datasets[1].data.push(154);
      this.winRateCollection.datasets[0].data.push(this.winRate);
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
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
