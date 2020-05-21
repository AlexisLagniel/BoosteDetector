import { Doughnut, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  props: ['options', 'chartData', 'winrate'],
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    chartdata() {
      // this line is important otherwise chart WILL NOT update when props change
      this.renderChart(this.chartData, this.options);
    },
    options() {
      this.renderChart(this.chartData, this.options);
    },
  },

};
