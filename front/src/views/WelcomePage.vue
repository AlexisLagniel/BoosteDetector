<template>
    <div>
      <div class="background">
        <div class="center-content">
          <div class="main-picture">

          </div>
          <div class="inputs">
          <input
          type="text"
          id="searchProfile"
          v-model="profileName"
          v-on:keyup.enter="redirectToProfile()"
          placeholder="Rechercher un joueur"
          >
        <input
          type="submit"
          id="submit"
          v-on:click="redirectToProfile()"
          placeholder=""
        >
      </div>
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
    background-color: #f7f7f7;
    display: flex;
  }
  .center-content {
    display: flex;
    margin: auto;
    width: 800px;
  }
  .main-picture {
    width: 100%;
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
    height: 138%!important;
    background-image: url("../assets/images/monkey-button.png");
    background-size: cover;
    background-position: 100% 50%;
    background-color: #00cc66;
    width: 80px;
    padding: 5px;
    cursor: pointer;
    color: transparent;
    border: none;
  }
  textarea:focus, input:focus{
    outline: none;
  }
</style>
