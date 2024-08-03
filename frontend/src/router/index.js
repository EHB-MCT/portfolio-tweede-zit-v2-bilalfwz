import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

const authenticatedRoutes = [
  'home'
]

router.beforeEach((to, from) => {
  const user = useUserStore()
  const authenticated = user.loggedIn;
  if (authenticatedRoutes.includes(to.name) && !authenticated) {
    return 'login';
  }
  return true;
})

export default router
