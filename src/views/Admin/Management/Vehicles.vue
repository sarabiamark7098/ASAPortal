<template>
  <div class="p-6">
    <FullScreenLoader :visible="vehicleFormStore.loading" message="Loading Vehicles..." />

    <div v-if="!vehicleFormStore.loading">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold">Vehicle Management</h1>
          <p class="text-gray-600 text-sm sm:text-base">Manage vehicles directory</p>
        </div>
        <div class="flex justify-end">
          <Button
            v-if="!vehicleFormStore.updateVehicle && !vehicleFormStore.addVehicle"
            class="px-4 py-2 rounded-xl shadow-sm w-full sm:w-auto"
            severity="success"
            icon="pi pi-plus"
            label="Add New Vehicle"
            @click="addVehicle"
          />
        </div>
      </div>

      <div
        v-if="vehicleFormStore.updateVehicle || vehicleFormStore.addVehicle"
        class="flex flex-col gap-4"
      >
        <VehicleInfo />
      </div>

      <div v-else class="flex gap-4">
        <!-- Left Section Placeholder -->
        <div
          class="w-1/3 inset-shadow-sm shadow-sm h-[600px] rounded-lg p-5 overflow-y-auto flex flex-col bg-white"
        >
          <h3 class="text-lg font-semibold mb-4 sticky top-0 bg-white z-10 pb-2">
            Vehicle Information
          </h3>

          <dl class="space-y-2 text-base flex-grow">
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Plate Number:</dt>
              <dd class="text-green-600">
                {{ vehicleFormStore.selectedVehicle?.plate_number || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Model:</dt>
              <dd class="text-green-600">{{ vehicleFormStore.selectedVehicle?.model || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Unit Type:</dt>
              <dd class="text-green-600">
                {{ vehicleFormStore.selectedVehicle?.unit_type || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Brand:</dt>
              <dd class="text-green-600">{{ vehicleFormStore.selectedVehicle?.brand || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Year Purchased:</dt>
              <dd class="text-green-600">
                {{ vehicleFormStore.selectedVehicle?.purchase_year || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Year Model:</dt>
              <dd class="text-green-600">
                {{ vehicleFormStore.selectedVehicle?.model_year || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Driver:</dt>
              <dd class="text-green-600">
                {{ vehicleFormStore.selectedDriver?.full_name || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Contact Number:</dt>
              <dd class="text-green-600">
                {{ vehicleFormStore.selectedDriver?.contact_number || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Email:</dt>
              <dd class="text-green-600">{{ vehicleFormStore.selectedDriver?.email || 'N/A' }}</dd>
            </div>
          </dl>

          <Button
            class="mt-4 self-end w-full sm:w-1/2"
            label="Update"
            size="small"
            icon="pi pi-pen-to-square"
            :disabled="!vehicleFormStore.selectedVehicle"
            :severity="vehicleFormStore.selectedVehicle ? 'success' : 'secondary'"
            @click="updateVehicleInfo"
          />
        </div>

        <!-- Right Section - DataTable -->
        <div class="w-2/3 h-[600px] shadow-sm inset-shadow-sm rounded-lg bg-white">
          <div class="bg-white rounded-xl h-full relative flex flex-col">
            <!-- Loading Overlay -->
            <div
              v-if="vehicleFormStore.loading2"
              class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10"
            >
              <i class="pi pi-spinner pi-spin text-blue-500 text-3xl" />
            </div>

            <!-- Header -->
            <div
              class="sticky top-0 z-20 bg-white px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-200"
            >
              <h4 class="text-lg font-semibold">Vehicles</h4>
              <div class="flex items-center border border-gray-300 rounded-lg px-3 py-1">
                <i class="pi pi-search mr-2 text-gray-500" />
                <input
                  v-model="vehicleFormStore.searchInput"
                  type="text"
                  placeholder="Search..."
                  class="outline-none border-none focus:ring-0 text-sm bg-transparent"
                  @keydown.enter="triggerSearch"
                />
              </div>
            </div>

            <!-- Table -->
            <div class="overflow-y-auto flex-1 px-6 pb-4">
              <table class="w-full min-w-max table-auto border border-gray-200 text-sm">
                <thead class="bg-white sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th
                      v-for="col in columns"
                      :key="col.field"
                      @click="sortBy(col.field)"
                      class="px-4 py-3 font-semibold text-left cursor-pointer select-none hover:bg-gray-100 transition"
                    >
                      <div class="flex items-center">
                        {{ col.header }}
                        <i
                          v-if="
                            vehicleFormStore.sortField === col.field &&
                            vehicleFormStore.sortOrder === 1
                          "
                          class="pi pi-sort-amount-up-alt ml-2 text-xs"
                        />
                        <i
                          v-else-if="
                            vehicleFormStore.sortField === col.field &&
                            vehicleFormStore.sortOrder === -1
                          "
                          class="pi pi-sort-amount-down ml-2 text-xs"
                        />
                        <i v-else class="pi pi-sort-alt ml-2 text-xs text-gray-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in vehicles"
                    :key="item.id"
                    @click="vehicleFormStore.selectedVehicle = item"
                    :class="[
                      'border-b even:bg-gray-50 hover:bg-gray-100 transition cursor-pointer',
                      vehicleFormStore.selectedVehicle?.id === item.id ? 'bg-blue-50' : '',
                    ]"
                  >
                    <td class="px-4 py-2 w-1">{{ item.model }}</td>
                    <td class="px-4 py-2 w-1">{{ item.plate_number }}</td>
                    <td class="px-4 py-2 w-1">{{ item.unit_type }}</td>
                    <td class="px-4 py-2 w-1">{{ item.brand }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div
              class="px-6 pb-6 mt-auto border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-700 gap-2"
            >
              <p>Showing page {{ currentPage }} of {{ totalPages }}</p>
              <div class="flex flex-wrap items-center gap-1">
                <Button
                  icon="pi pi-angle-left"
                  outlined
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="w-9 h-9 p-0"
                />
                <Button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :label="String(page)"
                  :outlined="page !== currentPage"
                  :severity="page === currentPage ? 'primary' : null"
                  class="w-9 h-9 p-0 text-sm font-medium"
                />
                <Button
                  icon="pi pi-angle-right"
                  outlined
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="w-9 h-9 p-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import VehicleInfo from '@/views/Admin/Management/Manage/VehicleInfo.vue'
import { useAuthStore } from '@/stores/auth'
import { useVehicleFormStore } from '@/stores/vehicleFormStore'
import { useDriverFormStore } from '@/stores/driverFormStore'

const vehicleFormStore = useVehicleFormStore()
const driverFormStore = useDriverFormStore()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    await Promise.all([authStore.fetchUser(), new Promise((resolve) => setTimeout(resolve, 1000))])
    loadRequests(1)
  } catch (error) {
    console.error('Error on mount:', error)
  } finally {
    vehicleFormStore.loading = false
  }
})
function updateVehicleInfo() {
  if (vehicleFormStore.selectedVehicle) {
    driverFormStore.selectedDriver = vehicleFormStore.selectedDriver
    vehicleFormStore.updateVehicle = true
  }
}
function addVehicle() {
  vehicleFormStore.addVehicle = true
  vehicleFormStore.resetForm()
}

const vehicles = computed(() => vehicleFormStore.vehicleList)
const totalRecords = computed(() => vehicleFormStore.totalRecords)
const totalPages = computed(() => Math.ceil(totalRecords.value / vehicleFormStore.rows))
const currentPage = computed(() => Math.floor(vehicleFormStore.first / vehicleFormStore.rows) + 1)

const visiblePages = computed(() => {
  const maxButtons = 5
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(start + maxButtons - 1, totalPages.value)
  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1)
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const columns = [
  { field: 'model', header: 'Model' },
  { field: 'plate_number', header: 'Plate Number' },
  { field: 'unit_type', header: 'Unit Type' },
  { field: 'brand', header: 'Brand' },
]

function triggerSearch() {
  vehicleFormStore.first = 0
  loadRequests(1)
}

function sortBy(field) {
  if (vehicleFormStore.sortField === field) {
    vehicleFormStore.sortOrder = vehicleFormStore.sortOrder === 1 ? -1 : 1
  } else {
    vehicleFormStore.sortField = field
    vehicleFormStore.sortOrder = 1
  }
  loadRequests(currentPage.value)
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  vehicleFormStore.first = (page - 1) * vehicleFormStore.rows
  loadRequests(page)
}

function loadRequests(page = currentPage.value) {
  vehicleFormStore.loading2 = true
  const search = vehicleFormStore.searchInput || ''
  const sortBy = vehicleFormStore.sortField || ''
  const sortDir =
    vehicleFormStore.sortOrder === 1 ? 'asc' : vehicleFormStore.sortOrder === -1 ? 'desc' : ''

  vehicleFormStore
    .getVehicles(authStore.token, page, vehicleFormStore.rows, search, sortBy, sortDir)
    .finally(() => {
      vehicleFormStore.loading2 = false
    })
}
</script>

<style scoped></style>
