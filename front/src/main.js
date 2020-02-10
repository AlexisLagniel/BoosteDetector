import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/css/global.css';


Vue.config.productionTip = false;
Vue.use(BootstrapVue);


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
