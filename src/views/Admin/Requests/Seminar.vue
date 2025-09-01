<template>
  <div class="p-6">
    <FullScreenLoader :visible="loading" message="Loading Seminar Hall Request..." />

    <div v-if="!loading"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(true)

onMounted(async () => {
  try {
    // Simulate API delay and fetch user data
    await Promise.all([authStore.fetchUser(), new Promise((resolve) => setTimeout(resolve, 1500))])
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>
