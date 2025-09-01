<template>
  <div class="p-6">
    <FullScreenLoader :visible="loading" message="Loading Vehicles..." />

    <div v-if="!loading">
      <h1 class="text-2xl font-bold mb-4">Vehicles Management</h1>
      <p class="mb-4">Manage vehicles directory</p>
      <div class="flex gap-4">
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
              <dd class="text-green-600">{{ selectedVehicle?.plate_number || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Model:</dt>
              <dd class="text-green-600">{{ selectedVehicle?.model || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Unit Type:</dt>
              <dd class="text-green-600">{{ selectedVehicle?.unit_type || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Brand:</dt>
              <dd class="text-green-600">{{ selectedVehicle?.brand || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Year Purchased:</dt>
              <dd class="text-green-600">{{ selectedVehicle?.purchase_year || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Year Model:</dt>
              <dd class="text-green-600">{{ selectedVehicle?.model_year || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Driver:</dt>
              <dd class="text-green-600">
                {{ selectedDriver?.full_name || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Contact Number:</dt>
              <dd class="text-green-600">{{ selectedDriver?.contact_number || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Email:</dt>
              <dd class="text-green-600">{{ selectedDriver?.email || 'N/A' }}</dd>
            </div>
          </dl>

          <Button
            class="mt-4 self-end w-1/2"
            :disabled="!selectedVehicle"
            @click="$emit('edit-vehicle', selectedVehicle)"
          >
            Update
          </Button>
        </div>

        <!-- Right Section - DataTable -->
        <div class="w-2/3 h-[600px] shadow-sm inset-shadow-sm rounded-lg bg-white">
          <div class="bg-white rounded-xl h-full relative flex flex-col">
            <!-- Loading Overlay -->
            <div
              v-if="loading2"
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
                  v-model="searchInput"
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
                          v-if="sortField === col.field && sortOrder === 1"
                          class="pi pi-sort-amount-up-alt ml-2 text-xs"
                        />
                        <i
                          v-else-if="sortField === col.field && sortOrder === -1"
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
                    @click="selectedVehicle = item"
                    :class="[
                      'border-b even:bg-gray-50 hover:bg-gray-100 transition cursor-pointer',
                      selectedVehicle?.id === item.id ? 'bg-blue-50' : '',
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

      <!-- Edit Dialog -->
      <Dialog
        v-model:visible="showEditDialog"
        header="Edit Vehicle"
        modal
        :closable="true"
        :closeOnEscape="true"
        class="w-[90vw] md:w-[30rem]"
      >
        <form @submit.prevent="saveVehicle" class="p-4 space-y-4" novalidate>
          <FloatLabel variant="on">
            <InputText
              id="vehicle_model"
              v-model="editedVehicle.model"
              class="w-full"
              required
              autocomplete="given-name"
              aria-required="true"
            />
            <label for="vehicle_model">Model</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <InputText
              id="vehicle_plate_number"
              v-model="editedVehicle.plate_number"
              class="w-full"
              required
              autocomplete="off"
              aria-required="true"
            />
            <label for="vehicle_plate_number">Plate Number</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <InputText
              id="vehicle_unit_type"
              v-model="editedVehicle.unit_type"
              class="w-full"
              required
              autocomplete="off"
              aria-required="true"
            />
            <label for="vehicle_unit_type">Unit Type</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <InputText
              id="vehicle_brand"
              v-model="editedVehicle.brand"
              class="w-full"
              required
              autocomplete="off"
              aria-required="true"
            />
            <label for="vehicle_brand">Brand</label>
          </FloatLabel>
          <FloatLabel variant="on">
            <InputText
              id="vehicle_purchase_year"
              v-model="editedVehicle.purchase_year"
              class="w-full"
              required
              type="number"
              autocomplete="off"
              aria-required="true"
            />
            <label for="vehicle_purchase_year">Year Purchased</label>
          </FloatLabel>
          <FloatLabel variant="on">
            <InputText
              id="vehicle_model_year"
              v-model="editedVehicle.model_year"
              class="w-full"
              required
              type="number"
              autocomplete="off"
              aria-required="true"
            />
            <label for="vehicle_model_year">Year Model</label>
          </FloatLabel>
          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              @click="showEditDialog = false"
              class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { useAuthStore } from '@/stores/auth'
import { useVehicleFormStore } from '@/stores/vehicleRequestFormStore'

const vehicleFormStore = useVehicleFormStore()
const authStore = useAuthStore()
const loading = ref(true)
const loading2 = ref(false)
const selectedVehicle = ref(null)
// Table interaction refs
const rows = ref(20)
const first = ref(0)
const searchInput = ref('')
const sortField = ref(null)
const sortOrder = ref(null)

const showEditDialog = ref(false)
const editedUser = ref({})
const saving = ref(false)

const viewVehicleInfo = (vehicle) => {
  selectedVehicle.value = vehicle
}

const fetchVehiclesData = async () => {
  try {
    await vehicleFormStore.fetchAllVehicles()
  } catch (error) {
    console.error('Error fetching vehicles data:', error)
  }
}

onMounted(async () => {
  try {
    await Promise.all([authStore.fetchUser(), new Promise((resolve) => setTimeout(resolve, 1500))])
    await fetchVehiclesData()
  } catch (error) {
    console.error('Error on mount:', error)
  } finally {
    loading.value = false
  }
})

const vehicles = computed(() => vehicleFormStore.vehicles)
const totalRecords = computed(() => vehicleFormStore.totalRecords)
const totalPages = computed(() => Math.ceil(totalRecords.value / rows.value))
const currentPage = computed(() => Math.floor(first.value / rows.value) + 1)

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
  first.value = 0
  loadRequests(1)
}

function sortBy(field) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 1 ? -1 : 1
  } else {
    sortField.value = field
    sortOrder.value = 1
  }
  loadRequests(currentPage.value)
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  first.value = (page - 1) * rows.value
  loadRequests(page)
}

function loadRequests(page = currentPage.value) {
  loading2.value = true
  const search = searchInput.value || ''
  const sortBy = sortField.value || ''
  const sortDir = sortOrder.value === 1 ? 'asc' : sortOrder.value === -1 ? 'desc' : ''

  vehicleFormStore
    .getVehicles(authStore.token, page, rows.value, search, sortBy, sortDir)
    .finally(() => {
      loading2.value = false
    })
}
</script>

<style scoped></style>
