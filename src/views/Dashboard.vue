<template>
  <div class="p-6">
    <div v-if="loading" class="text-center">
      <svg
        class="animate-spin h-8 w-8 mx-auto text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
      <p class="text-sm text-gray-600 mt-2">Loading dashboard data...</p>
    </div>

    <div v-else>
      <h1 class="text-2xl font-semibold mb-2">Dashboard</h1>
      <p class="mb-4">Welcome to the dashboard!</p>
      <p v-if="auth.user">Logged in as: {{ auth.email }}</p>
      <p v-else>Please log in to see your dashboard.</p> 
      
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const loading = ref(true)

const fetchDashboardData = async () => {
  try {
    // Simulate API call or fetch other necessary data
    await auth.fetchUser()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  await auth.logout()
}

onMounted(() => {
  fetchDashboardData()
})
</script>
