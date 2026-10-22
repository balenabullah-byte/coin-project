import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/views/MainPage.vue'
import CoinInfo from '@/views/coininfo.vue'
import CompareCoinPage from '@/views/Compare_coin_page.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
  routes: [
    {
path: '/',
name: 'home',
component: MainPage
    },
    {
      path: '/coin/:id',
      name: 'coin-info',
      component: CoinInfo
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
    {
      path: '/compare-coins',
      name: 'compare-coins',
      component: CompareCoinPage
    }
  ],
})

export default router
