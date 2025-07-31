<template>
  <div class="w-full max-w-screen-2xl mx-auto">
    <div class="bg-white rounded-xl p-6 relative">
      <!-- Loading Overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10"
      >
        <i class="pi pi-spinner pi-spin text-blue-500 text-3xl" />
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between mb-4 relative z-20">
        <h4 class="text-2xl font-semibold">Vehicle Requests</h4>
        <div class="flex items-center border border-gray-300 rounded-lg px-3 py-1">
          <i class="pi pi-search mr-2 text-gray-500" />
          <input
            v-model="searchInput"
            type="text"
            placeholder="Search..."
            class="outline-none border-none focus:ring-0 text-sm"
            @keydown.enter="triggerSearch"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="max-h-[calc(100vh-250px)] overflow-y-auto w-full">
        <table class="w-full min-w-max table-auto border border-gray-200 text-sm">
          <thead class="bg-white sticky top-0 z-30 shadow-sm">
            <tr>
              <th
                v-for="col in columns"
                :key="col.field"
                @click="sortBy(col.field)"
                class="px-4 py-3 font-semibold text-left cursor-pointer select-none hover:bg-gray-100 transition bg-white"
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
              <th class="px-4 py-3 text-left text-sm font-semibold bg-white">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in vehicleRequests"
              :key="item.id"
              class="border-b text-sm even:bg-gray-50 hover:bg-gray-100 transition"
            >
              <td class="px-4 py-2 whitespace-nowrap">{{ item.date_requested }}</td>
              <td class="px-4 py-2 whitespace-nowrap">{{ item.control_number }}</td>
              <td class="px-4 py-2 whitespace-nowrap">{{ item.requesting_office }}</td>
              <td class="px-4 py-2 whitespace-nowrap">{{ item.transactable_type }}</td>
              <td class="px-4 py-2 whitespace-nowrap">{{ item.destination }}</td>
              <td class="px-4 py-2 whitespace-nowrap">
                <Tag :value="toUcWords(item.status)" :severity="getStatusLabel(item.status)" />
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <Button icon="pi pi-eye" outlined rounded @click="editTransaction(item)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="mt-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-700 gap-2"
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

    <!-- Transaction Dialog -->
    <Dialog
      v-model:visible="transactionDialog"
      header="Request Details"
      modal
      :style="{ width: '450px' }"
    >
      <div class="flex flex-col gap-4">
        <div v-for="(label, key) in detailFields" :key="key">
          <label class="font-semibold">{{ label }}:</label>
          <p>{{ selectedTransactionData[key] }}</p>
        </div>
        <div>
          <label class="font-semibold">Status:</label>
          <Tag
            :value="toUcWords(selectedTransactionData.status)"
            :severity="getStatusLabel(selectedTransactionData.status)"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2 mt-4">
          <Button label="Close" icon="pi pi-times" text @click="transactionDialog = false" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionsFormStore } from '@/stores/transactionsStoreForm'
import { useAuthStore } from '@/stores/auth'

const transactionStore = useTransactionsFormStore()
const authStore = useAuthStore()

const rows = ref(20)
const first = ref(0)
const searchInput = ref('')
const sortField = ref(null)
const sortOrder = ref(null)
const loading = ref(false)

const selectedTransactionData = ref({})
const transactionDialog = ref(false)

const vehicleRequests = computed(() => transactionStore.vehicleRequests)
const totalRecords = computed(() => transactionStore.totalRecords)
const totalPages = computed(() => Math.ceil(totalRecords.value / rows.value))
const currentPage = computed(() => Math.floor(first.value / rows.value) + 1)

// Pagination: show only a few pages at a time
const visiblePages = computed(() => {
  const pages = []
  const maxButtons = 5
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(start + maxButtons - 1, totalPages.value)

  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const columns = [
  { field: 'date_requested', header: 'Date Requested' },
  { field: 'control_number', header: 'Control Number' },
  { field: 'requesting_office', header: 'Requesting Office' },
  { field: 'transactable_type', header: 'Type of Request' },
  { field: 'destination', header: 'Destination' },
  { field: 'status', header: 'Status' },
]

const detailFields = {
  control_number: 'Control Number',
  requester_name: 'Requested By',
  purpose: 'Purpose',
  date_requested: 'Date Requested',
}

onMounted(() => {
  loadRequests()
})

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
  loading.value = true
  const search = searchInput.value || ''
  const sortBy = sortField.value || ''
  const sortDir = sortOrder.value === 1 ? 'asc' : sortOrder.value === -1 ? 'desc' : ''

  transactionStore
    .getVehicleRequests(authStore.token, page, rows.value, search, sortBy, sortDir)
    .finally(() => {
      loading.value = false
    })
}

function editTransaction(data) {
  selectedTransactionData.value = data
  transactionDialog.value = true
}

function getStatusLabel(status) {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'success'
    case 'pending':
      return 'warn'
    case 'disapproved':
      return 'danger'
    default:
      return 'info'
  }
}

function toUcWords(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>
