<template>
  <div class="p-6">
    <FullScreenLoader :visible="loading" message="Loading Vehicle Request..." />

    <div v-if="!loading">
      <h1 class="text-2xl font-bold mb-4">Vehicle Requests</h1>
      <div class="flex gap-4">
        <!-- Left Section Placeholder -->
        <div class="w-1/3 inset-shadow-sm shadow-sm h-[600px] rounded-lg p-5 overflow-y-auto">
          
        </div>

        <!-- Right Section - DataTable -->
        <div class="w-2/3 inset-shadow-sm shadow-sm h-[600px] rounded-lg p-5 overflow-auto">
          <DataTable
            :value="vehicleFormStore.vehicleList"
            dataKey="id"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            :loading="vehicleFormStore.loading"
            tableStyle="min-width: 30rem"
            class="w-full"
            :emptyMessage="'No vehicle requests found.'"
          >
            <template #header>
              <div class="flex flex-wrap gap-2 items-center justify-between">
                <h4 class="m-0">Vehicle Requests</h4>
              </div>
            </template>

            <Column field="requesting_office" header="Requesting Office" />
            <Column field="destination" header="Destination" />
            <Column field="requested_start" header="Start Date" />
            <Column field="requested_end" header="End Date" />

            <Column header="Actions" bodyStyle="min-width: 80px;">
              <template #body="slotProps">
                <button
                  class="border border-blue-500 text-blue-500 p-2 rounded hover:bg-blue-500 hover:text-white transition"
                  @click.stop="viewRequest(slotProps.data)"
                  title="View"
                >
                  <i class="pi pi-eye" style="font-size: 1rem" />
                </button>
              </template>
            </Column>
          </DataTable>
        </div>
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

const viewRequest = (request) => {
  console.log('Selected Request:', request)
  // Add navigation or modal logic here
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
