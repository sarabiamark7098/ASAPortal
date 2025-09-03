<template>
  <div id="top-nav-menubar" class="bg-white shadow-md">
    <!-- Logout Loading Overlay -->
    <div
      v-if="logoutLoading"
      class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50"
    >
      <svg
        class="animate-spin h-10 w-10 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <p class="ml-4 text-gray-700 font-medium" aria-live="polite">Logging out...</p>
    </div>

    <!-- PrimeVue Menubar with router links -->
    <Menubar :model="menuItems" class="shadow-md" id="menubar">
      <!-- Brand/Logo -->
      <template #start>
        <a
          href="https://fo11.dswd.gov.ph"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 pr-8"
        >
          <img src="@/assets/DSWD_Only.png" alt="DSWD FO XI Logo" class="h-12 w-12" />
        </a>
      </template>

      <!-- ROUTERLINK support for items -->
      <template #item="{ item, props }">
        <RouterLink
          v-if="item.to"
          v-bind="props.action"
          :to="item.to"
          class="flex items-center gap-2 px-3 py-2 w-full"
        >
          <span>{{ item.label }}</span>
        </RouterLink>
        <a v-else v-bind="props.action" class="flex items-center gap-2 px-3 py-2 w-full">
          <span>{{ item.label }}</span>
        </a>
      </template>

      <!-- Auth Info & Logout -->
      <template #end>
        <div class="flex items-center gap-4">
          <span class="text-gray-700 text-sm hidden md:inline"
            >Welcome{{ authStore.userEmail ? ', ' + authStore.userEmail : '' }}</span
          >
          <Button
            icon="pi pi-sign-out"
            severity="secondary"
            text
            rounded
            aria-label="Logout"
            @click="handleLogout"
            class="hover:text-blue-600"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const logoutLoading = ref(false)

const handleLogout = async () => {
  if (logoutLoading.value) return
  logoutLoading.value = true
  try {
    await authStore.logout()
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Logout failed', error)
  } finally {
    logoutLoading.value = false
  }
}

// Base menu items (excluding Admin View)
const baseMenuItems = [
  {
    label: 'Request Forms',
    items: [
      {
        label: 'Request for TA Relative to Building and Grounds Management',
        to: '/request-forms/buildingAndGroundsTARequest',
      },
      { label: 'Request for Use of Vehicle', to: '/request-forms/officialVehicleRequest' },
      {
        label: 'Request for Use of DSWD Conference Room',
        to: '/request-forms/conferenceRoomRequest',
      },
      { label: 'Request for Air Transport Order', to: '/request-forms/airTransportOrderRequest' },
      {
        label: 'Request for Entry to DSWD Premises',
        to: '/request-forms/entryToDSWDPremisesRequest',
      },
      { label: 'Request for Overnight Parking', to: '/request-forms/overnightParkingRequest' },
      { label: 'Request for Janitorial Services', to: '/request-forms/janitorialServicesRequest' },
    ],
  },
  {
    label: 'View Requests',
    items: [
      {
        label: 'Request for TA Relative to Building and Grounds Management',
        to: '/view-requests/buildingAndGroundsTARequest',
      },
      { label: 'Request for Use of Vehicle', to: '/view-requests/officialVehicleRequest' },
      {
        label: 'Request for Use of DSWD Conference Room',
        to: '/view-requests/conferenceRoomRequest',
      },
      { label: 'Request for Air Transport Order', to: '/view-requests/airTransportOrderRequest' },
      {
        label: 'Request for Entry to DSWD Premises',
        to: '/view-requests/entryToDSWDPremisesRequest',
      },
      { label: 'Request for Overnight Parking', to: '/view-requests/overnightParkingRequest' },
      { label: 'Request for Janitorial Services', to: '/view-requests/janitorialServicesRequest' },
    ],
  },
  {
    label: 'Calendar Views',
    items: [
      { label: 'Vehicle Schedule', to: '/calendar-views/vehicle-schedule' },
      { label: 'Maagap Conference Room Schedule', to: '/calendar-views/maagap-schedule' },
      {
        label: 'Magiting Conference Room Schedule',
        to: '/calendar-views/magiting-schedule',
      },
      {
        label: 'Seminar Hall - Conference Room Schedule',
        to: '/calendar-views/seminar-hall-schedule',
      },
    ],
  },
]

// Conditionally add Admin View if user is admin
const menuItems = computed(() => {
  if (authStore.userRole === 'superadmin') {
    return [...baseMenuItems, { label: 'Admin View', to: '/dashboard' }]
  }
  return baseMenuItems
})
</script>

<style scoped>
#top-nav-menubar {
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
}
#menubar {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;

  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 24px;

  width: 80%;
  height: 64px;

  padding: 0 24px;
  display: flex;
  align-items: center;
  animation: fadeInDown 0.4s ease-in-out;
}
@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>
