import Vue from 'vue';
import VueRouter from 'vue-router';
import Profile from '../views/Profile.vue';
import WelcomePage from '../views/WelcomePage.vue';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/useless',
    name: 'useless',
    component: Home,
  },
  {
    path: '/',
    name: 'home',
    component: WelcomePage,
  },
  {
    name: 'ProfileByUsername',
    path: '/user/:username',
    component: Profile,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
