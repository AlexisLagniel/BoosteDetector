<template>
  <div>
    <h5>{{username}}</h5>
  </div>
</template>

<script>

  import axios from 'axios';
export default {
  name: 'Profile',
  data() {
    return {
      username: this.$route.params.username,
    };
  },
  methods: {
    queryInfoByUsername (){

    },
  }

};
</script>

<style scoped>

</style>
