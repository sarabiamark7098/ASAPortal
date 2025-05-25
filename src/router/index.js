import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import GuestLayout from '@/layouts/GuestLayout.vue'
import AuthenticatedLayout from '@/layouts/AdminLayout.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: GuestLayout,
      meta: { requiresGuest: true },
      children: [
        {
          path: '',
          name: 'login',
          component: Login,
        },
      ],
    },
    {
      path: '/dashboard',
      component: AuthenticatedLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'), // Create a NotFound.vue view
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  if (!auth.user && !auth.loading) {
    try {
      await auth.fetchUser()
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  if (to.meta.requiresAuth && !auth.user) {
    return next({ name: 'login' })
  }

  if (to.meta.requiresGuest && auth.user) {
    return next({ name: 'dashboard' })
  }

  next()
})
export default router
