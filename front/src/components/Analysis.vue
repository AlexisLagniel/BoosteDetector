<template>
    <div>
      <p @click="getPropsData()">Check My DATA</p>
    </div>
</template>

<script>
export default {
  name: 'Analysis',
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
