<template>
    <div>
      <p @click="getPropsData()">Check My DATA</p>
      <bar-chart v-if="dataCollection" :chartData="dataCollection"></bar-chart>
    </div>
</template>

<script>
import BarChart from './charts/barChart';

export default {
  name: 'Analysis',
  components: {
    BarChart,
  },
  mounted() {
    console.log(this.propsData);
  },
  props: {
    propsData: Array,
  },
  data() {
    return {
      dataCollection: {
        labels: [23, 8, 0, 44],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [23, 11, 8, 31],
          }, {
            label: 'Data two',
            backgroundColor: '#f87979',
            data: [23, 14, 75, 94],
          },
        ],
      },
    };
  },
  methods: {
    getPropsData() {
      console.log(this.propsData);
      console.log(this.dataCollection);
    },
  },
};
</script>

<style scoped>

</style>
