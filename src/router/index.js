import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

import GuestLayout from '@/layouts/GuestLayout.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Admin/Dashboard.vue'
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

import ViewRequestBuildingandGround from '@/views/Client/ViewRequestBuildingandGround.vue'
import ViewRequestVehicle from '@/views/Client/ViewRequestVehicle.vue'
import ViewRequestAirTransport from '@/views/Client/ViewRequestAirTransport.vue'
import ViewRequestConference from '@/views/Client/ViewRequestConference.vue'
import ViewRequestEntry from '@/views/Client/ViewRequestEntry.vue'
import ViewRequestParking from '@/views/Client/ViewRequestParking.vue'
import ViewRequestJanitorial from '@/views/Client/ViewRequestJanitorial.vue'

import VehicleSchedule from '@/views/Calendar/VehicleSchedule.vue'
import MaagapSchedule from '@/views/Calendar/MaagapSchedule.vue'
import MagitingSchedule from '@/views/Calendar/MagitingSchedule.vue'
import SeminarHallSchedule from '@/views/Calendar/SeminarSchedule.vue'

import Drivers from '@/views/Admin/Management/Drivers.vue'
import Vehicles from '@/views/Admin/Management/Vehicles.vue'
import Signatories from '@/views/Admin/Management/Signatories.vue'

import TARequest from '@/views/Admin/Requests/TechnicalAssistance.vue'
import VehicleRequest from '@/views/Admin/Requests/Vehicle.vue'
import MaagapRequest from '@/views/Admin/Requests/Maagap.vue'
import MagitingRequest from '@/views/Admin/Requests/Magiting.vue'
import SeminarRequest from '@/views/Admin/Requests/Seminar.vue'
import AirTravelOrderRequest from '@/views/Admin/Requests/AirTravelOrder.vue'
import EntryRequest from '@/views/Admin/Requests/Entry.vue'
import ParkingRequest from '@/views/Admin/Requests/Parking.vue'
import JanitorialRequest from '@/views/Admin/Requests/Janitorial.vue'

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
      path: '/manage/useraccounts',
      component: AdminLayout,
      meta: { requiresAuth: true, role: ['superadmin'] },
      children: [
        {
          path: '',
          name: 'useraccounts',
          component: UserAccounts,
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
      path: '/manage',
      component: AdminLayout,
      meta: { requiresAuth: true, role: ['superadmin', 'supervisor', 'manager'] },
      children: [
        {
          path: 'drivers',
          name: 'drivers',
          component: Drivers,
        },
        {
          path: 'vehicles',
          name: 'vehicles',
          component: Vehicles,
        },
        {
          path: 'signatories',
          name: 'signatories',
          component: Signatories,
        },
      ],
    },
    {
      path: '/request',
      component: AdminLayout,
      meta: { requiresAuth: true, role: ['superadmin', 'supervisor', 'manager'] },
      children: [
        {
          path: 'ta',
          name: 'TARequest',
          component: TARequest,
        },
        {
          path: 'vehicle',
          name: 'VehicleRequest',
          component: VehicleRequest,
        },
        {
          path: 'maagap',
          name: 'MaagapRequest',
          component: MaagapRequest,
        },
        {
          path: 'magiting',
          name: 'MagitingRequest',
          component: MagitingRequest,
        },
        {
          path: 'seminar',
          name: 'SeminarRequest',
          component: SeminarRequest,
        },
        {
          path: 'ato',
          name: 'AirTravelOrderRequest',
          component: AirTravelOrderRequest,
        },
        {
          path: 'entry',
          name: 'EntryRequest',
          component: EntryRequest,
        },
        {
          path: 'parking',
          name: 'ParkingRequest',
          component: ParkingRequest,
        },
        {
          path: 'janitorial',
          name: 'JanitorialRequest',
          component: JanitorialRequest,
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
        {
          path: '/view-requests/officialVehicleRequest',
          name: 'ViewVehicleRequest',
          component: ViewRequestVehicle,
        },
        {
          path: '/view-requests/buildingAndGroundsTARequest',
          name: 'ViewBuildingAndGroundsTARequest',
          component: ViewRequestBuildingandGround,
        },
        {
          path: '/view-requests/conferenceRoomRequest',
          name: 'ViewConferenceRoomRequest',
          component: ViewRequestConference,
        },
        {
          path: '/view-requests/airTransportOrderRequest',
          name: 'ViewAirTransportOrderRequest',
          component: ViewRequestAirTransport,
        },
        {
          path: '/view-requests/entryToDSWDPremisesRequest',
          name: 'ViewEntryToDSWDPremisesRequest',
          component: ViewRequestEntry,
        },
        {
          path: '/view-requests/overnightParkingRequest',
          name: 'ViewOvernightParkingRequest',
          component: ViewRequestParking,
        },
        {
          path: '/view-requests/janitorialServicesRequest',
          name: 'ViewJanitorialServicesRequest',
          component: ViewRequestJanitorial,
        },
        {
          path: '/calendar-views/vehicle-schedule',
          name: 'vehicleschedule',
          component: VehicleSchedule,
        },
        {
          path: '/calendar-views/maagap-schedule',
          name: 'maagapschedule',
          component: MaagapSchedule,
        },
        {
          path: '/calendar-views/magiting-schedule',
          name: 'magitingschedule',
          component: MagitingSchedule,
        },
        {
          path: '/calendar-views/seminar-hall-schedule',
          name: 'seminarhallschedule',
          component: SeminarHallSchedule,
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
  const authStore = useAuthStore()

  // Fetch user only if token exists and user is not yet loaded
  if (authStore.token && !authStore.user && !authStore.loading) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      authStore.token = null
      localStorage.removeItem('token')
    }
  }

  // Requires authentication
  if (to.meta.requiresAuth && !authStore.user) {
    return next({ name: 'login' })
  }

  // Guest-only page (login, register)
  if (to.meta.requiresGuest && authStore.user) {
    // Redirect based on role
    const roles = authStore.user.roles || []
    if (roles.includes('superadmin') || roles.includes('supervisor') || roles.includes('manager')) {
      return next({ name: 'dashboard' })
    } else if (roles.includes('client')) {
      return next({ name: 'clientview' })
    } else {
      return next({ name: 'unauthorized' })
    }
  }

  // Role-based access control
  if (to.meta.role && authStore.user) {
    const allowedRoles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]
    const userRoles = authStore.user.roles || []

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
