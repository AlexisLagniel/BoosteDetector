<template>
    <div>
      <div class="background">
        <div class="inputs">
          <input
          type="text"
          id="searchProfile"
          v-model="profileName"
          placeholder="Rechercher un joueur"
          >
        <input
          type="submit"
          id="submit"
          v-on:click="redirectToProfile()"
        >
      </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'WelcomePage',
  data() {
    return {
      profileName: '',
    };
  },
  methods: {
    getInputValue() {
      console.log(this.profileName);
    },
    redirectToProfile() {
      console.log(this);
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

  .background{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-repeat: no-repeat;
    background-image: url("../assets/images/background3.jpg");
    background-size: 100% 100%;
    display: flex;
  }
  .inputs {
    margin: auto;
    height: 35px;
    display: flex;
  }
  #searchProfile {
    width: 500px;
    height: 100%;
    opacity: 0.85;
    padding: 5px;
    margin-right: 5px;
  }
  #submit {
    height: 135%!important;
    width: 125px;
    opacity: 0.89;
    padding: 5px;
    cursor: pointer;
  }
</style>
