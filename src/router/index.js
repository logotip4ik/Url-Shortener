import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/Home.vue';
import Redirecting from '@/views/Redirecting.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/:name',
    name: 'Redirecting',
    component: Redirecting,
    beforeEnter: (to) => {
      const path = to.params.name;
      const { origin } = window.location;
      window.location.replace(`${origin}/api/${path}`);
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
