<template>
  <div class="p-6">
    <FullScreenLoader :visible="loading" message="Loading Dashboard..." />

    <div v-if="!loading">
      <h1 class="text-2xl font-semibold mb-2">Dashboard</h1>
      <p class="mb-4">Welcome to the dashboard!</p>
      <p v-if="auth.user">Logged in as: {{ auth.userEmail }}</p>
      <p v-else>Please log in to see your dashboard.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const loading = ref(true)

onMounted(async () => {
  try {
    // Simulate API delay and fetch user data
    await Promise.all([auth.fetchUser(), new Promise((resolve) => setTimeout(resolve, 1500))])
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
})

const logout = async () => {
  await auth.logout()
}
</script>
