import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/Login.vue'
import HomeView from '../views/HomeView.vue'
import Conversation from '../views/Conversation/Conversation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/conversation/:clientId',
      name: 'conversation',
      component: Conversation,
      meta: { requiresAuth: true }
    },
  ],
})

export default router
