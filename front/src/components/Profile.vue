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
  mounted() {
    this.queryInfoByUsername();
  },
  methods: {
    queryInfoByUsername() {
      axios.get(
        'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Biketeman?api_key=RGAPI-ccdb30eb-5b24-477e-a8d1-d28f8a61c4ff',
      ).then((response) => {
        console.log(response);
      });
    },
  },
};
</script>

<style scoped>

</style>
