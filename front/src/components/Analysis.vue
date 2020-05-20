<template>
    <div>
      <p @click="getPropsData()">Check My DATA</p>
      <bar-chart :chart-data="datacollection"></bar-chart>
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
    };
  },
  methods: {
    getPropsData() {
      console.log(this.propsData);
    },
  },
};
</script>

<style scoped>

</style>
