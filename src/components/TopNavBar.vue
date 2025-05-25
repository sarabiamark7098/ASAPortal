<template>
  <div>
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

    <!-- Header -->
    <header class="bg-white shadow-md flex items-center justify-between px-4 py-2">
      <!-- Logo / Title -->
      <a
        href="https://fo11.dswd.gov.ph"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-8 w-8 text-blue-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m9 7.5 3 4.5m0 0 3-4.5M12 12v5.25M15 12H9m6 3H9m12-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <span class="text-xl font-bold text-gray-800">ASAPortal</span>
      </a>

      <!-- Right Section -->
      <div class="flex items-center gap-4">
        <span class="text-gray-700 text-sm hidden md:inline">Welcome, {{ auth.email }}</span>
        <button class="text-gray-600 hover:text-blue-600 focus:outline-none" @click="handleLogout">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        </button>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const logoutLoading = ref(false)

const handleLogout = async () => {
  logoutLoading.value = true
  try {
    await auth.logout()
  } catch (error) {
    console.error('Logout error:', error)
    alert('Logout failed. Please try again.')
  } finally {
    logoutLoading.value = false
  }
}
</script>
