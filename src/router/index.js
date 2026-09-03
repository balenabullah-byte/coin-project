import { createRouter, createWebHistory } from 'vue-router'
import mianpage from '@/views/mianpage.vue'
import coininfo from '@/views/coininfo.vue'
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
    }
  ],
})

export default router
