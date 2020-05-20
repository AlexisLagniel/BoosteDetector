import { Radar, mixins } from 'vue-chartjs';

export default {
  extends: Radar,
  mixins: [mixins.reactiveProp],
  props: ['options', 'chartdata'],
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    chartdata() {
      // this line is important otherwise chart WILL NOT update when props change
      this.renderChart(this.chartdata, this.options);
    },
    options() {
      this.renderChart(this.chartData, this.options);
    },
  },
};
