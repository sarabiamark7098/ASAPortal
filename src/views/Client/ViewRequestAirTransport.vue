<template>
  <FullScreenLoader :visible="loading" message="Loading Air Travel Order Requests..." />

  <div v-if="!loading">
    <div
      class="lg:flex max-w-full bg-[url(@/assets/bluecolor.png)] bg-cover bg-center bg-no-repeat relative items-center justify-center rounded-3xl shadow-2xl"
    >
      <div class="justify-center h-full pt-32 pb-12 w-full px-6 sm:px-24">
        <div class="flex flex-col items-center text-center">
          <p class="text-3xl sm:text-5xl lg:text-5xl font-bold">Air Travel Order Requests</p>
        </div>
        <div
          class="p-[2px] rounded-3xl bg-gradient-to-br from-white to-gray-200 w-full max-w-8xl mx-auto mt-9 relative z-20 inset-shadow-sm inset-shadow-gray-100"
        >
          <div
            class="flex flex-wrap gap-5 bg-[white] bg-opacity-90 rounded-[calc(1.5rem-2px)] px-9 py-8"
          >
            <ClientViewTable />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ClientViewTable from '@/views/Client/RequestViewTable/ViewTableVehicleRequests.vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'

const quantity = 100
const loading = ref(true)

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
  loading.value = false
})

const scrollToTop = () => {
  const el = document.getElementById('request')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.snow-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, #001f3f, #0074d9);
  overflow: hidden;
}
</style>
