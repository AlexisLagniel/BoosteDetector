<template>
    <div>
      <div class="background">
        <div class="center-content">
          <span class="tooltip">Hello I am Dapoute, king of boosteds let me guide you!</span>
          <img class="dapoute" src="../assets/images/mini-logo_boosted.svg">
          <div class="inputs">
          <input
          type="text"
          id="searchProfile"
          v-model="profileName"
          v-on:keyup.enter="redirectToProfile()"
          placeholder="Search a player..."
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
    display: flex;
    background-position: center;
    background-image: url("../assets/images/wallpaper.jpg");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .center-content {
    display: block;
    margin: auto;
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
    border: none!important;
    margin-right: 5px;
    outline: none!important;
  }
  #submit {
    height: 138%!important;
    background-image: url("../assets/images/monkey-button.png");
    background-size: cover;
    background-position: 100% 50%;
    background-color: rgba(50, 96, 188, 0.7);
    width: 80px;
    padding: 5px;
    cursor: pointer;
    color: transparent;
    border: none;
  }
  textarea:focus, input:focus{
    outline: none;
  }
  .tooltip {
    width: 240px;
    font-family: Muli;
    background-color:black;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    color: white;
    font-size: 20px;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 15px;
    cursor: pointer;
  }
</style>
