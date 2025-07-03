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
      <p class="ml-4 text-gray-700 font-medium">Logging out...</p>
    </div>

    <!-- PrimeVue Menubar with submenus on the right -->
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

      <!-- Auth Info & Logout -->
      <template #end>
        <div class="flex items-center gap-4">
          <span class="text-gray-700 text-sm hidden md:inline">Welcome, {{ auth.email }}</span>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'

const auth = useAuthStore()
const router = useRouter()
const logoutLoading = ref(false)

const handleLogout = async () => {
  logoutLoading.value = true
  try {
    await auth.logout()
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Logout failed', error)
  } finally {
    logoutLoading.value = false
  }
}

// Menubar items including submenus
const menuItems = ref([
  {
    label: 'Request Forms',
    items: [
      {
        label: 'Request for TA Relative to Building and Grounds Management',
        to: '/client/request-forms/request-ta-building-grounds',
      },
      {
        label: 'Request for Use of DSWD Conference Room',
        to: '/client/request-forms/request-use-conference-room',
      },
      {
        label: 'Request for Use of Vehicle',
        to: '/client/request-forms/officialVehicleRequest',
      },
      {
        label: 'Request for Air Transport Order',
        to: '/client/request-forms/request-air-transport-order',
      },
      {
        label: 'Request for Entry to DSWD Premises',
        to: '/client/request-forms/request-entry-dswd-premises',
      },
      {
        label: 'Request for Overnight Parking',
        to: '/client/request-forms/request-overnight-parking',
      },
      {
        label: 'Request for Janitorial Services',
        to: '/client/request-forms/request-janitorial-services',
      },
    ],
  },
  {
    label: ' View Requests',
    items: [
      {
        label: 'Technical Assistance Requests',
        to: '/client/view-requests/technical-assistance',
      },
      {
        label: 'Magiting Conference Room Requests',
        to: '/client/view-requests/magiting-conference-room',
      },
      {
        label: 'Maagap Conference Room Requests',
        to: '/client/view-requests/maagap-conference-room',
      },
      {
        label: 'Seminar Hall - Conference Room Requests',
        to: '/client/view-requests/seminar-hall-conference-room',
      },
      {
        label: 'Vehicle Requests',
        to: '/client/view-requests/vehicle-requests',
      },
      {
        label: 'Driver Travel Info',
        to: '/client/view-requests/driver-travel-info',
      },
      {
        label: 'Air Transport Orders',
        to: '/client/view-requests/air-transport-order',
      },
      {
        label: 'Entry to DSWD Premises Requests',
        to: '/client/view-requests/entry-dswd-premises',
      },
      {
        label: 'Overnight Parking Requests',
        to: '/client/view-requests/overnight-parking',
      },
      {
        label: 'Janitorial Services Requests',
        to: '/client/view-requests/janitorial-services',
      },
    ],
  },
  {
    label: 'Calendar Views',
    items: [
      {
        label: 'Vehicle Schedule',
        to: '/client/calendar-views/vehicle-schedule',
      },
      {
        label: 'Maagap Conference Room Schedule',
        to: '/client/calendar-views/maagap-conference-room',
      },
      {
        label: 'Magiting Conference Room Schedule',
        to: '/client/calendar-views/magiting-conference-room',
      },
      {
        label: 'Seminar Hall - Conference Room Schedule',
        to: '/client/calendar-views/seminar-hall-conference-room',
      },
      {
        label: 'Air Transport Order Schedule',
        to: '/client/calendar-views/air-transport-order',
      },
    ],
  },
])
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
}
</style>
