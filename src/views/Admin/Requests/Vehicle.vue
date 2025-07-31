<template>
  <div class="p-6">
    <FullScreenLoader :visible="loading" message="Loading Vehicle Request..." />

    <div v-if="!loading">
      <h1 class="text-2xl font-bold mb-4">Vehicle Requests</h1>
      <div class="flex gap-4">
        <!-- Left Section Placeholder -->
        <div class="w-1/3 inset-shadow-sm shadow-sm h-[600px] rounded-lg p-5 overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">Request Detail</h3>
          <div v-if="selectedRequest">
            <p><strong>Requesting Office:</strong> {{ selectedRequest.requesting_office }}</p>
            <p><strong>Destination:</strong> {{ selectedRequest.destination }}</p>
            <p><strong>Start Date:</strong> {{ selectedRequest.requested_start }}</p>
            <p><strong>End Date:</strong> {{ selectedRequest.requested_end }}</p>
          </div>
          <div v-else>
            <p><strong>Requesting Office:</strong> N/A</p>
            <p><strong>Destination:</strong> N/A</p>
            <p><strong>Start Date:</strong> N/A</p>
            <p><strong>End Date:</strong> N/A</p>
          </div>
        </div>

        <!-- Right Section - DataTable -->
        <div class="w-2/3 shadow-sm border h-[600px] rounded-lg p-5 overflow-auto bg-white">
          <table class="min-w-full text-sm text-left">
            <thead class="sticky top-0 z-10 bg-gray-100 text-gray-700 border-b">
              <tr>
                <th class="px-4 py-2">Requesting Office</th>
                <th class="px-4 py-2">Destination</th>
                <th class="px-4 py-2">Start Date</th>
                <th class="px-4 py-2">End Date</th>
                <th class="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in vehicleFormStore.vehicleList"
                :key="item.id"
                class="border-b hover:bg-gray-50 cursor-pointer"
                @click="viewRequest(item)"
              >
                <td class="px-4 py-2">{{ item.requesting_office }}</td>
                <td class="px-4 py-2">{{ item.destination }}</td>
                <td class="px-4 py-2">{{ item.requested_start }}</td>
                <td class="px-4 py-2">{{ item.requested_end }}</td>
                <td class="px-4 py-2">
                  <button
                    class="text-blue-500 border border-blue-500 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition"
                    title="View"
                  >
                    <i class="pi pi-eye" />
                  </button>
                </td>
              </tr>
              <tr v-if="vehicleFormStore.vehicleList.length === 0">
                <td colspan="5" class="text-center text-gray-500 py-4">
                  No vehicle requests found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex gap-4 mt-12">
        <!-- Left Section Placeholder -->
        <div class="w-full inset-shadow-sm shadow-sm h-[600px] rounded-lg p-5 overflow-y-auto">
          <h3>Request</h3>
        </div>

        <!-- Right Section - DataTable -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { useAuthStore } from '@/stores/auth'
import { useVehicleFormStore } from '@/stores/vehicleFormStore'

const authStore = useAuthStore()
const vehicleFormStore = useVehicleFormStore()

const loading = ref(true)
const selectedRequest = ref(null)

const viewRequest = (request) => {
  selectedRequest.value = request
}

onMounted(async () => {
  try {
    await Promise.all([
      authStore.fetchUser(),
      vehicleFormStore.getallVehicleTransactions(authStore.token),
      new Promise((resolve) => setTimeout(resolve, 1000)), // Optional delay
    ])
  } catch (error) {
    console.error('Error fetching vehicle requests:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped></style>
