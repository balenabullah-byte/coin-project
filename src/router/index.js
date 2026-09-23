import { createRouter, createWebHistory } from 'vue-router'
import mianpage from '@/views/MainPage.vue'
import coininfo from '@/views/CoinInfo.vue'
import Compare_coin_page from '@/views/Compare_coin_page.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
path: '/',
name: 'mianpage',
component: mianpage
    },
    {
      path: '/coin/:id',
      name: 'coininfo',
      component: coininfo
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
    {
      path: '/compare-coins',
      name: 'compare-coins',
      component: Compare_coin_page
    }
  ],
})

export default router
