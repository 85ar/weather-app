import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import MapPage from '../pages/MapPage.vue'
import SettingPage from '../pages/SettingPage.vue'
import FavoritePage from '../pages/FavoritePage.vue'
import LocationPage from '../pages/LocationPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/map',
      name: 'map',
      component: MapPage,
    },
    {
      path: '/location',
      name: 'location',
      component: LocationPage,
    },
    {
      path: '/favorite',
      name: 'favorite',
      component: FavoritePage,
    },
    {
      path: '/setting',
      name: 'setting',
      component: SettingPage,
    },
  ],
})

export default router
