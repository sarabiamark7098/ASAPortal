import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import GuestLayout from '@/layouts/GuestLayout.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Register from '@/views/Register.vue'
import UserAccounts from '@/views/Admin/UserAccounts.vue'
import ClientView from '@/views/Client/ClientView.vue'
import RequestVehicle from '@/views/Requests/RequestVehicle.vue'
import RequestBuildingAndGroundsTA from '@/views/Requests/RequestBuildingAndGroundsTA.vue'
import RequestConferenceRoom from '@/views/Requests/RequestConferenceRoom.vue'
import RequestAirTransportOrder from '@/views/Requests/RequestAirTransportOrder.vue'
import RequestEntryToDSWDPremises from '@/views/Requests/RequestEntryToDSWDPremises.vue'
import RequestOvernightParking from '@/views/Requests/RequestOvernightParking.vue'
import RequestJanitorialServices from '@/views/Requests/RequestJanitorialServices.vue'

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
      path: '/register',
      component: GuestLayout,
      meta: { requiresGuest: true },
      children: [
        {
          path: '',
          name: 'register',
          component: Register,
        },
      ],
    },
    {
      path: '/dashboard',
      component: AdminLayout,
      meta: { requiresAuth: true, role: ['superadmin', 'supervisor', 'manager'] },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard,
        },
      ],
    },
    {
      path: '/useraccounts',
      component: AdminLayout,
      meta: { requiresAuth: true, role: ['superadmin', 'supervisor', 'manager'] },
      children: [
        {
          path: '',
          name: 'useraccounts',
          component: UserAccounts,
        },
      ],
    },
    {
      path: '/client',
      component: AuthenticatedLayout,
      meta: { requiresAuth: true, role: ['client', 'superadmin', 'supervisor', 'manager'] },
      children: [
        {
          path: '',
          name: 'clientview',
          component: ClientView,
        },
        {
          path: '/request-forms/buildingAndGroundsTARequest',
          name: 'RequestBuildingAndGroundsTA',
          component: RequestBuildingAndGroundsTA,
        },
        {
          path: '/request-forms/officialVehicleRequest',
          name: 'RequestVehicle',
          component: RequestVehicle,
        },
        {
          path: '/request-forms/conferenceRoomRequest',
          name: 'RequestConferenceRoom',
          component: RequestConferenceRoom,
        },
        {
          path: '/request-forms/airTransportOrderRequest',
          name: 'RequestAirTransportOrder',
          component: RequestAirTransportOrder,
        },
        {
          path: '/request-forms/entryToDSWDPremisesRequest',
          name: 'RequestEntryToDSWDPremises',
          component: RequestEntryToDSWDPremises,
        },
        {
          path: '/request-forms/overnightParkingRequest',
          name: 'RequestOvernightParking',
          component: RequestOvernightParking,
        },
        {
          path: '/request-forms/janitorialServicesRequest',
          name: 'RequestJanitorialServices',
          component: RequestJanitorialServices,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'), // Create a NotFound.vue view
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/views/Unauthorized.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // Fetch user only if token exists and user is not yet loaded
  if (auth.token && !auth.user && !auth.loading) {
    try {
      await auth.fetchUser()
    } catch (error) {
      console.error('Failed to fetch user:', error)
      auth.token = null
      localStorage.removeItem('token')
    }
  }

  // Requires authentication
  if (to.meta.requiresAuth && !auth.user) {
    return next({ name: 'login' })
  }

  // Guest-only page (login, register)
  if (to.meta.requiresGuest && auth.user) {
    // Redirect based on role
    const roles = auth.user.roles || []
    if (roles.includes('superadmin') || roles.includes('supervisor') || roles.includes('manager')) {
      return next({ name: 'dashboard' })
    } else if (roles.includes('client')) {
      return next({ name: 'clientview' })
    } else {
      return next({ name: 'unauthorized' })
    }
  }

  // Role-based access control
  if (to.meta.role && auth.user) {
    const allowedRoles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]
    const userRoles = auth.user.roles || []

    const hasAccess = userRoles.some((role) => allowedRoles.includes(role))

    if (!hasAccess) {
      return next({ name: 'unauthorized' })
    }
  }

  next()
})

router.afterEach((to) => {
  const users = useUsersStore()
  if (to.name === 'useraccounts') {
    users.fetchAllUsers()
  }
})
export default router
