<template>
  <div class="p-4 sm:p-6">
    <FullScreenLoader :visible="driverFormStore.loading" message="Loading Drivers..." />

    <div v-if="!driverFormStore.loading" class="flex flex-col gap-6">
      <!-- Header Row -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold">Drivers Management</h1>
          <p class="text-gray-600 text-sm sm:text-base">Manage drivers directory</p>
        </div>
        <div class="flex justify-end">
          <Button
            class="px-4 py-2 rounded-xl shadow-sm w-full sm:w-auto"
            severity="success"
            icon="pi pi-plus"
            label="Add New Driver"
          />
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Left Section -->
        <div
          class="w-full lg:w-1/3 shadow-sm rounded-lg p-5 overflow-y-auto flex flex-col bg-white max-h-[400px] sm:max-h-[500px] lg:max-h-[600px]"
        >
          <h3 class="text-lg font-semibold mb-4 sticky top-0 bg-white z-10 pb-2">
            Driver Information
          </h3>

          <dl class="space-y-2 text-sm sm:text-base flex-grow">
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">First Name:</dt>
              <dd class="text-green-600">
                {{ driverFormStore.selectedDriver?.first_name || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Middle Name:</dt>
              <dd class="text-green-600">
                {{ driverFormStore.selectedDriver?.middle_name || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Last Name:</dt>
              <dd class="text-green-600">
                {{ driverFormStore.selectedDriver?.last_name || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Extension Name:</dt>
              <dd class="text-green-600">
                {{ driverFormStore.selectedDriver?.extension_name || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Position:</dt>
              <dd class="text-green-600">
                {{ driverFormStore.selectedDriver?.driver_position || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Designation:</dt>
              <dd class="text-green-600">
                {{ driverFormStore.selectedDriver?.designation || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Official Station:</dt>
              <dd class="text-green-600">
                {{ driverFormStore.selectedDriver?.official_station || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Email:</dt>
              <dd class="text-green-600">
                {{ driverFormStore.selectedDriver?.email || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Contact Number:</dt>
              <dd class="text-green-600">
                {{ driverFormStore.selectedDriver?.contact_number || 'N/A' }}
              </dd>
            </div>
          </dl>

          <Button
            class="mt-4 self-end w-full sm:w-1/2"
            size="small"
            :disabled="!driverFormStore.selectedDriver"
            severity="success"
            @click="$emit('edit-driver', driverFormStore.selectedDriver)"
          >
            Update
          </Button>
        </div>

        <!-- Right Section - Table -->
        <div class="w-full lg:w-2/3 shadow-sm rounded-lg bg-white flex flex-col max-h-[600px]">
          <div class="bg-white rounded-xl h-full relative flex flex-col">
            <!-- Loading Overlay -->
            <div
              v-if="driverFormStore.loading2"
              class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10"
            >
              <i class="pi pi-spinner pi-spin text-blue-500 text-3xl" />
            </div>

            <!-- Header -->
            <div
              class="sticky top-0 z-20 bg-white px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 gap-2"
            >
              <h4 class="text-base sm:text-lg font-semibold">Drivers</h4>
              <div
                class="flex items-center border border-gray-300 rounded-lg px-3 py-1 w-full sm:w-auto"
              >
                <i class="pi pi-search mr-2 text-gray-500" />
                <input
                  v-model="driverFormStore.searchInput"
                  type="text"
                  placeholder="Search..."
                  class="outline-none border-none focus:ring-0 text-sm bg-transparent w-full"
                  @keydown.enter="triggerSearch"
                />
              </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto flex-1 px-4 sm:px-6 pb-4">
              <table
                class="w-full min-w-[400px] table-auto border border-gray-200 text-xs sm:text-sm"
              >
                <thead class="bg-white sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th
                      v-for="col in columns"
                      :key="col.field"
                      @click="sortBy(col.field)"
                      class="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-left cursor-pointer select-none hover:bg-gray-100 transition"
                    >
                      <div class="flex items-center">
                        {{ col.header }}
                        <i
                          v-if="
                            driverFormStore.sortField === col.field &&
                            driverFormStore.sortOrder === 1
                          "
                          class="pi pi-sort-amount-up-alt ml-2 text-xs"
                        />
                        <i
                          v-else-if="
                            driverFormStore.sortField === col.field &&
                            driverFormStore.sortOrder === -1
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
                    v-for="item in drivers"
                    :key="item.id"
                    @click="driverFormStore.selectedDriver = item"
                    :class="[
                      'border-b hover:bg-gray-100 transition cursor-pointer',
                      driverFormStore.selectedDriver?.id === item.id ? 'bg-blue-50' : '',
                    ]"
                  >
                    <td class="px-2 sm:px-4 py-2">{{ item.first_name }}</td>
                    <td class="px-2 sm:px-4 py-2">{{ item.last_name }}</td>
                    <td class="px-2 sm:px-4 py-2">{{ item.position }}</td>
                    <td class="px-2 sm:px-4 py-2">{{ item.contact_number }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div
              class="px-4 sm:px-6 pb-4 sm:pb-6 mt-auto border-t border-gray-200 pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-gray-700 gap-2"
            >
              <p>Showing page {{ currentPage }} of {{ totalPages }}</p>
              <div class="flex flex-wrap items-center gap-1">
                <Button
                  icon="pi pi-angle-left"
                  outlined
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="w-8 sm:w-9 h-8 sm:h-9 p-0"
                />
                <Button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :label="String(page)"
                  :outlined="page !== currentPage"
                  :severity="page === currentPage ? 'primary' : null"
                  class="w-8 sm:w-9 h-8 sm:h-9 p-0 text-xs sm:text-sm font-medium"
                />
                <Button
                  icon="pi pi-angle-right"
                  outlined
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="w-8 sm:w-9 h-8 sm:h-9 p-0"
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
import { onMounted, computed } from 'vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { useAuthStore } from '@/stores/auth'
import { useDriversFormStore } from '@/stores/driversFormStore'

const driverFormStore = useDriversFormStore()
const authStore = useAuthStore()

const viewDriversInfo = (driver) => {
  driverFormStore.selectedDriver = driver
}

const fetchDriversData = async () => {
  try {
    await driverFormStore.getDrivers()
  } catch (error) {
    console.error('Error fetching drivers data:', error)
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      authStore.fetchUser(),
      driverFormStore.getDriversList(),
      new Promise((resolve) => setTimeout(resolve, 1000)), // Delay for UX smoothness
    ])
    loadRequests(1)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    driverFormStore.loading = false
  }
})
console.log(driverFormStore.driverList)
const drivers = computed(() => driverFormStore.driverList)
const totalRecords = computed(() => driverFormStore.totalRecords)
const totalPages = computed(() => Math.ceil(totalRecords.value / driverFormStore.rows))
const currentPage = computed(() => Math.floor(driverFormStore.first / driverFormStore.rows) + 1)

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
  { field: 'first_name', header: 'First Name' },
  { field: 'last_name', header: 'Last Name' },
  { field: 'position', header: 'Position' },
  { field: 'contact_number', header: 'Contact Number' },
]

function insertNewDriver() {
  driverFormStore.addDriver = true
}
function updateDriverInfo(driver) {
  driverFormStore.updateDriver = true
}

function triggerSearch() {
  driverFormStore.first = 0
  loadRequests(1)
}

function sortBy(field) {
  if (driverFormStore.sortField === field) {
    driverFormStore.sortOrder = driverFormStore.sortOrder === 1 ? -1 : 1
  } else {
    driverFormStore.sortField = field
    driverFormStore.sortOrder = 1
  }
  loadRequests(currentPage.value)
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  driverFormStore.first = (page - 1) * driverFormStore.rows
  loadRequests(page)
}

function loadRequests(page = currentPage.value) {
  driverFormStore.loading2 = true
  const search = driverFormStore.searchInput || ''
  const sortBy = driverFormStore.sortField || ''
  const sortDir =
    driverFormStore.sortOrder === 1 ? 'asc' : driverFormStore.sortOrder === -1 ? 'desc' : ''

  driverFormStore
    .getDrivers(authStore.token, page, driverFormStore.rows, search, sortBy, sortDir)
    .finally(() => {
      driverFormStore.loading2 = false
    })
}
</script>

<style scoped></style>
