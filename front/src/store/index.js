import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  getters: {
    api_url: () => {
      if (window.location.href.includes('localhost')) {
        return 'http://localhost:3000';
      }
      return 'https://boostedetector.herokuapp.com';
    },
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
});
