<template>
    <div>
      <div class="topBar">
        <div class="inputs">
          <input
          type="text"
          id="searchProfile"
          v-model="profileName"
          v-on:keyup.enter="redirectToProfile()"
          placeholder="Rechercher un joueur"
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
    background-color: #00cc66;
    opacity: 0.9;
    position: relative;
    display: flex;
  }
  .inputs {
    margin: auto;
    height: 35px;
    display: flex;
    position: absolute;
    right: 50px;
    top: 50%;
    transform: translateY(-50%);
  }
  #searchProfile {
    width: 300px;
    height: 50%;
    opacity: 0.85;
    padding: 5px;
    margin-right: 5px;
  }
</style>
