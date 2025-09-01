<template>
  <div class="p-4 sm:p-6">
    <FullScreenLoader :visible="vehicleFormStore.loading" message="Loading Vehicle Request..." />

    <div v-if="!vehicleFormStore.loading">
      <!-- Header -->
      <div class="mb-4">
        <h1 class="text-2xl sm:text-3xl font-bold">Vehicle Requests</h1>
        <span class="text-sm sm:text-base">Manage Vehicle Requests</span>
      </div>

      <!-- Conditional Edit/Print Modes -->
      <div v-if="vehicleFormStore.editMode" class="flex flex-col md:flex-row gap-4">
        <ApproveVehicle
          :request="vehicleFormStore.editingRequest"
          @cancel="handleCancelEdit"
          @updated="handleUpdated"
          class="w-full"
        />
      </div>

      <div v-else-if="vehicleFormStore.editModeCNAS" class="flex flex-col md:flex-row gap-4">
        <NonAvailability
          :request="vehicleFormStore.editingRequest"
          @cancel="handleCancelEdit"
          @updated="handleUpdated"
          class="w-full"
        />
      </div>

      <div v-else-if="vehicleFormStore.printMode" class="flex flex-col md:flex-row gap-4">
        <PrintTransaction
          :request="vehicleFormStore.editingRequest"
          @cancel="handleCancelEdit"
          @updated="handleUpdated"
          class="w-full"
        />
      </div>

      <!-- Main View -->
      <div v-else class="flex flex-col md:flex-row gap-4">
        <!-- Left Section: Request Summary -->
        <div class="w-full md:w-1/3 shadow-sm rounded-lg overflow-hidden">
          <!-- Collapsible Summary Header for Mobile -->
          <div
            class="bg-white px-5 py-3 flex justify-between items-center md:hidden cursor-pointer"
            @click="summaryCollapsed = !summaryCollapsed"
          >
            <h3 class="text-lg font-semibold">Request Summary</h3>
            <i :class="summaryCollapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'"></i>
          </div>

          <div
            :class="[
              'overflow-y-auto max-h-[80vh] bg-white transition-all duration-300',
              summaryCollapsed ? 'h-0 p-0' : 'p-5',
            ]"
          >
            <dl class="space-y-3 text-base">
              <div
                v-for="(value, label) in requestSummary"
                :key="label"
                class="grid grid-cols-2 border-b border-gray-300 py-1"
              >
                <dt class="font-semibold">{{ label }}:</dt>
                <dd class="text-green-600 text-right">{{ value }}</dd>
              </div>
            </dl>

            <!-- Action Buttons for Mobile -->
            <div class="flex flex-wrap gap-2 mt-4 md:hidden">
              <template v-if="vehicleFormStore.selectedRequest">
                <Button
                  v-if="vehicleFormStore.selectedRequest.status === 'pending'"
                  size="small"
                  severity="success"
                  @click="handleAvailableClick"
                >
                  <i class="pi pi-check mr-2"></i> Available
                </Button>
                <Button
                  v-if="vehicleFormStore.selectedRequest.status === 'pending'"
                  size="small"
                  severity="danger"
                  @click="handleNotAvailableClick"
                >
                  <i class="pi pi-times mr-2"></i> Not Available
                </Button>
                <Button
                  v-if="vehicleFormStore.selectedRequest.status === 'processed'"
                  size="small"
                  severity="success"
                  @click="handleApproved"
                >
                  <i class="pi pi-check mr-2"></i> Approved
                </Button>
                <Button
                  v-if="vehicleFormStore.selectedRequest.status === 'processed'"
                  size="small"
                  severity="danger"
                  @click="handleDisapproved"
                >
                  <i class="pi pi-times mr-2"></i> Disapproved
                </Button>
                <Button
                  v-if="
                    ['disapproved', 'approved', 'no_available', 'cancelled'].includes(
                      vehicleFormStore.selectedRequest.status,
                    )
                  "
                  size="small"
                  severity="info"
                  @click="handlePrint"
                >
                  <i class="pi pi-print mr-2"></i> Print
                </Button>
              </template>
            </div>
          </div>

          <!-- Sticky Action Buttons for Desktop -->
          <div
            class="hidden md:flex sticky bottom-0 bg-white z-10 px-5 pb-5 pt-5 flex-wrap gap-2 justify-between shadow-md rounded-t-lg"
          >
            <template v-if="vehicleFormStore.selectedRequest">
              <Button
                v-if="vehicleFormStore.selectedRequest.status === 'pending'"
                size="small"
                severity="success"
                @click="handleAvailableClick"
              >
                <i class="pi pi-check mr-2"></i> Available
              </Button>
              <Button
                v-if="vehicleFormStore.selectedRequest.status === 'pending'"
                size="small"
                severity="danger"
                @click="handleNotAvailableClick"
              >
                <i class="pi pi-times mr-2"></i> Not Available
              </Button>
              <Button
                v-if="vehicleFormStore.selectedRequest.status === 'processed'"
                size="small"
                severity="success"
                @click="handleApproved"
              >
                <i class="pi pi-check mr-2"></i> Approved
              </Button>
              <Button
                v-if="vehicleFormStore.selectedRequest.status === 'processed'"
                size="small"
                severity="danger"
                @click="handleDisapproved"
              >
                <i class="pi pi-times mr-2"></i> Disapproved
              </Button>
              <Button
                v-if="
                  ['disapproved', 'approved', 'no_available', 'cancelled'].includes(
                    vehicleFormStore.selectedRequest.status,
                  )
                "
                size="small"
                severity="info"
                @click="handlePrint"
              >
                <i class="pi pi-print mr-2"></i> Print
              </Button>
            </template>
          </div>
        </div>

        <!-- Right Section: DataTable -->
        <div class="w-full md:w-2/3 shadow-sm rounded-lg bg-white flex flex-col max-h-[80vh]">
          <div class="relative flex-1 overflow-y-auto">
            <!-- Loading Overlay -->
            <div
              v-if="vehicleFormStore.loading2"
              class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10"
            >
              <i class="pi pi-spinner pi-spin text-blue-500 text-3xl" />
            </div>

            <!-- Header with Search -->
            <div
              class="sticky top-0 z-20 bg-white px-4 sm:px-6 pt-4 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 gap-2"
            >
              <h4 class="text-lg font-semibold">Vehicle Requests</h4>
              <div
                class="flex items-center border border-gray-300 rounded-lg px-2 sm:px-3 py-1 w-full sm:w-auto"
              >
                <i class="pi pi-search mr-2 text-gray-500" />
                <input
                  v-model="vehicleFormStore.searchInput"
                  type="text"
                  placeholder="Search..."
                  class="outline-none border-none focus:ring-0 text-sm bg-transparent w-full"
                  @keydown.enter="triggerSearch"
                />
              </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full min-w-max table-auto border border-gray-200 text-sm">
                <thead class="bg-white sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th
                      v-for="col in columns"
                      :key="col.field"
                      @click="sortBy(col.field)"
                      class="px-2 sm:px-4 py-2 font-semibold text-left cursor-pointer hover:bg-gray-100 transition"
                    >
                      <div class="flex items-center gap-1">
                        {{ col.header }}
                        <i
                          v-if="
                            vehicleFormStore.sortField === col.field &&
                            vehicleFormStore.sortOrder === 1
                          "
                          class="pi pi-sort-amount-up-alt text-xs"
                        />
                        <i
                          v-else-if="
                            vehicleFormStore.sortField === col.field &&
                            vehicleFormStore.sortOrder === -1
                          "
                          class="pi pi-sort-amount-down text-xs"
                        />
                        <i v-else class="pi pi-sort-alt text-xs text-gray-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in vehicleRequests"
                    :key="item.id"
                    @click="vehicleFormStore.selectedRequest = item"
                    :class="[
                      'border-b even:bg-gray-50 hover:bg-gray-100 transition cursor-pointer',
                      vehicleFormStore.selectedRequest?.id === item.id ? 'bg-blue-50' : '',
                    ]"
                  >
                    <td class="px-2 sm:px-4 py-2">{{ item.date_requested }}</td>
                    <td class="px-2 sm:px-4 py-2">{{ item.control_number }}</td>
                    <td class="px-2 sm:px-4 py-2">{{ item.requesting_office }}</td>
                    <td class="px-2 sm:px-4 py-2">
                      <Tag
                        :value="
                          item.status === 'no_available' ? 'Not Available' : toUcWords(item.status)
                        "
                        :severity="getStatusLabel(item.status)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div
              class="px-4 sm:px-6 pb-4 mt-auto border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-700 gap-2"
            >
              <p>Showing page {{ currentPage }} of {{ totalPages }}</p>
              <div class="flex flex-wrap items-center gap-1">
                <Button
                  icon="pi pi-angle-left"
                  outlined
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="w-8 h-8 sm:w-9 sm:h-9 p-0"
                />
                <Button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :label="String(page)"
                  :outlined="page !== currentPage"
                  :severity="page === currentPage ? 'primary' : null"
                  class="w-8 h-8 sm:w-9 sm:h-9 p-0 text-sm font-medium"
                />
                <Button
                  icon="pi pi-angle-right"
                  outlined
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="w-8 h-8 sm:w-9 sm:h-9 p-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Dialog
      v-model:visible="vehicleFormStore.visible"
      modal
      header="Edit Approval"
      :style="{ width: '25rem' }"
      @hide="handleCancelEdit"
    >
      <template #header>
        <div class="inline-flex items-center justify-center gap-2">
          <span class="font-bold whitespace-nowrap">Request</span>
        </div>
      </template>
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Are you sure you want to "{{
          vehicleFormStore.approveDisapprove === 'approved' ? 'Approve' : 'Disapprove'
        }}" this request?
      </span>

      <template #footer>
        <Button label="No" text variant="outlined" @click="handleCancelEdit()" autofocus />
        <Button
          label="Yes"
          variant="outlined"
          severity="success"
          @click="handleSubmit()"
          autofocus
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import ApproveVehicle from '@/views/Admin/Requests/VehicleRequest/ApproveVehicle.vue'
import NonAvailability from '@/views/Admin/Requests/VehicleRequest/NonAvailability.vue'
import PrintTransaction from '@/views/Admin/Requests/VehicleRequest/PrintTransaction.vue'
import { useAuthStore } from '@/stores/auth'
import { useVehicleFormStore } from '@/stores/vehicleRequestFormStore'

const authStore = useAuthStore()
const vehicleFormStore = useVehicleFormStore()
const summaryCollapsed = ref(false)

// Fetch data on mount
onMounted(async () => {
  try {
    await Promise.all([
      authStore.fetchUser(),
      vehicleFormStore.getVehicleTransactions(authStore.token),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
    loadRequests(1)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    vehicleFormStore.loading = false
  }
})

const vehicleRequests = computed(() => vehicleFormStore.vehicleRequests)
const totalRecords = computed(() => vehicleFormStore.totalRecords)
const totalPages = computed(() => Math.ceil(totalRecords.value / vehicleFormStore.rows))
const currentPage = computed(() => Math.floor(vehicleFormStore.first / vehicleFormStore.rows) + 1)

// Pagination: show only a few pages at a time
const visiblePages = computed(() => {
  const maxButtons = 5
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(start + maxButtons - 1, totalPages.value)
  if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const columns = [
  { field: 'date_requested', header: 'Date Requested' },
  { field: 'control_number', header: 'Control Number' },
  { field: 'requesting_office', header: 'Requesting Office' },
  { field: 'status', header: 'Status' },
]

const requestSummary = computed(() => {
  const req = vehicleFormStore.selectedRequest || {}
  return {
    'Control Number': req.control_number ?? 'N/A',
    'Requesting Office': req.requesting_office ?? 'N/A',
    Destination: req.destination ?? 'N/A',
    'Start Date': req.requested_start ?? 'N/A',
    'Start Time': req.requested_time ?? 'N/A',
    'End Date': req.requested_end ?? 'N/A',
    Purpose: req.purpose ?? 'N/A',
    Passengers: req.passengers ?? 'N/A',
    Requester: req.requester_name ?? 'N/A',
    'Contact Number': req.requester_contact_number ?? 'N/A',
    Email: req.requester_email ?? 'N/A',
  }
})

function handleAvailableClick() {
  vehicleFormStore.editingRequest = vehicleFormStore.selectedRequest
  vehicleFormStore.editMode = true
}

function handleNotAvailableClick() {
  vehicleFormStore.editingRequest = vehicleFormStore.selectedRequest
  vehicleFormStore.editModeCNAS = true
}

function handleApproved() {
  vehicleFormStore.editingRequest = vehicleFormStore.selectedRequest
  vehicleFormStore.visible = true
  vehicleFormStore.approveDisapprove = 'approved'
}

function handleDisapproved() {
  vehicleFormStore.editingRequest = vehicleFormStore.selectedRequest
  vehicleFormStore.visible = true
  vehicleFormStore.approveDisapprove = 'disapproved'
}

const handleSubmit = () => {
  vehicleFormStore.submitting = true
  setTimeout(async () => {
    try {
      await vehicleFormStore.putApprovalStatus(
        vehicleFormStore.selectedRequest.id,
        vehicleFormStore.approveDisapprove,
      )
      alert('The Request has been ' + vehicleFormStore.approveDisapprove + '!')
      vehicleFormStore.resetForm()
    } catch (error) {
      console.error('Request submission failed:', error)
      alert('There was an error submitting the request. Please try again.')
    } finally {
      vehicleFormStore.submitting = false
      handleUpdated()
    }
  }, 1000)
}

function handleCancelEdit() {
  vehicleFormStore.editMode = false
  vehicleFormStore.editModeCNAS = false
  vehicleFormStore.printMode = false
  vehicleFormStore.approveDisapprove = ''
  vehicleFormStore.visible = false
  vehicleFormStore.editingRequest = null
}

function handleUpdated() {
  vehicleFormStore.editMode = false
  vehicleFormStore.editModeCNAS = false
  vehicleFormStore.printMode = false
  vehicleFormStore.approveDisapprove = ''
  vehicleFormStore.visible = false
  loadRequests(currentPage.value)
}

function handlePrint() {
  vehicleFormStore.editingRequest = vehicleFormStore.selectedRequest
  vehicleFormStore.printMode = true
}

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
    .getVehicleRequests(authStore.token, page, vehicleFormStore.rows, search, sortBy, sortDir)
    .catch((err) => {
      console.error('Failed to load vehicle requests:', err)
    })
    .finally(() => {
      vehicleFormStore.loading2 = false
    })
}

function getStatusLabel(status) {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'success'
    case 'pending':
      return 'warn'
    case 'disapproved':
      return 'danger'
    case 'no_available':
      return 'danger'
    case 'cancelled':
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
