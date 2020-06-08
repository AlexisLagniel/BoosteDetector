<template>
    <div>
      <div class="topBar">
        <router-link
          to="/" class="dapoute-icon">
            <img  src="../assets/images/Logo_complet_-_boosted_1.svg">
        </router-link>
        <div class="inputs">
          <input
          type="text"
          id="searchProfile"
          v-model="profileName"
          v-on:keyup.enter="redirectToProfile()"
          placeholder="Search a player"
          >
      </div>
      </div>
    </div>
</template>

<script>

export default {
  name: 'TopBar',
  data() {
    return {
      profileName: '',
    };
  },
  methods: {
    redirectToProfile() {
      this.$router.push(
        {
          name: 'ProfileByUsername',
          params: {
            username: this.profileName,
          },
        },
      );
    },
  },
};
</script>

<style scoped>
  .topBar{
    width: 100%;
    height: 60px;
    background-color: #3206bc;
    opacity: 0.9;
    position: relative;
    display: flex;
  }
  .inputs {
    margin: auto;
    height: 35px;
    display: flex;
    position: absolute;
    padding: 15px;
    right: 50px;
    top: 50%;
    transform: translateY(-50%);
  }
  .inputs input{
    background-color: white;
  }
  #searchProfile {
    width: 300px;
    font-family: Muli;
    height: 50%;
    opacity: 0.85;
    padding: 5px;
    margin-right: 5px;
    background-color: white;
  }
</style>
