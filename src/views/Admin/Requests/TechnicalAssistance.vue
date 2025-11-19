<template>
  <div class="p-4 sm:p-6">
    <FullScreenLoader
      :visible="form.loading"
      message="Loading Building and Grounds Management Request..."
    />

    <div v-if="!form.loading">
      <!-- Header -->
      <div class="mb-4">
        <h1 class="text-2xl sm:text-3xl font-bold">Building and Grounds Management Requests</h1>
        <span class="text-sm sm:text-base">Manage Requests</span>
      </div>

      <!-- Conditional Edit/Print Modes -->
      <div v-if="form.editMode" class="flex flex-col md:flex-row gap-4">
        <ApproveTechnicalAssistance
          :request="form.editingRequest"
          @cancel="handleCancelEdit"
          @updated="handleUpdated"
          class="w-full"
        />
      </div>

      <div v-else-if="form.printMode" class="flex flex-col md:flex-row gap-4">
        <PrintTransaction
          :request="form.editingRequest"
          @cancel="handleCancelEdit"
          @updated="handleUpdated"
          class="w-full"
        />
      </div>

      <!-- Main View -->
      <div v-else class="flex flex-col md:flex-row gap-4">
        <!-- Left Section: Request Summary -->
        <div class="w-full md:w-1/3 shadow-sm rounded-lg overflow-hidden flex flex-col">
          <!-- Collapsible Summary Header (Mobile Only) -->
          <div
            class="bg-white px-4 py-3 flex justify-between items-center md:hidden cursor-pointer border-b border-gray-200"
            @click="summaryCollapsed = !summaryCollapsed"
          >
            <h3 class="text-lg font-semibold">Request Summary</h3>
            <i :class="summaryCollapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'"></i>
          </div>

          <!-- Scrollable Summary Content -->
          <div
            :class="[
              'overflow-y-auto flex-1 bg-white transition-all duration-300',
              summaryCollapsed ? 'h-0 p-0' : 'p-4',
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

            <!-- Action Buttons (Mobile Only) -->
            <div v-if="form.selectedRequest" class="flex flex-wrap gap-2 mt-4 md:hidden">
              <Button
                v-if="form.selectedRequest.status === 'pending'"
                label="Process"
                size="small"
                icon="pi pi-book"
                severity="info"
                @click="handleAvailableClick"
                class="w-full"
              />
              <Button
                v-if="form.selectedRequest.status === 'processed'"
                label="Approved"
                size="small"
                icon="pi pi-check"
                severity="success"
                @click="handleApproved"
                class="w-full"
              />
              <Button
                v-if="form.selectedRequest.status === 'processed'"
                label="Disapproved"
                size="small"
                icon="pi pi-times"
                severity="danger"
                @click="handleDisapproved"
                class="w-full"
              />
              <Button
                v-if="
                  ['disapproved', 'approved', 'no_available', 'cancelled'].includes(
                    form.selectedRequest.status,
                  )
                "
                label="Print"
                size="small"
                icon="pi pi-print"
                severity="info"
                @click="handlePrint"
                class="w-full"
              />
            </div>
          </div>

          <!-- Sticky Action Buttons (Desktop Only) -->
          <div
            v-if="form.selectedRequest"
            class="hidden md:flex sticky bottom-0 bg-white z-10 px-4 py-4 flex-wrap gap-2 justify-between border-t border-gray-200"
          >
            <Button
              v-if="form.selectedRequest.status === 'pending'"
              label="Process"
              size="small"
              icon="pi pi-book"
              severity="info"
              @click="handleAvailableClick"
            />
            <Button
              v-if="form.selectedRequest.status === 'processed'"
              label="Approved"
              size="small"
              icon="pi pi-check"
              severity="success"
              @click="handleApproved"
            />
            <Button
              v-if="form.selectedRequest.status === 'processed'"
              label="Disapproved"
              size="small"
              icon="pi pi-times"
              severity="danger"
              @click="handleDisapproved"
            />
            <Button
              v-if="['approved'].includes(form.selectedRequest.status)"
              label="Print"
              size="small"
              icon="pi pi-print"
              severity="info"
              @click="handlePrint"
            />
          </div>
        </div>

        <!-- Right Section: DataTable -->
        <div
          class="w-full md:w-2/3 shadow-sm rounded-lg bg-white flex flex-col min-h-[65vh] max-h-[80vh]"
        >
          <div class="relative flex-1 overflow-y-auto">
            <!-- Loading Overlay -->
            <div
              v-if="form.loading2"
              class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10"
            >
              <i class="pi pi-spinner pi-spin text-blue-500 text-3xl" />
            </div>

            <!-- Header with Search -->
            <div
              class="sticky top-0 z-20 bg-white px-4 sm:px-6 pt-4 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 gap-2"
            >
              <h4 class="text-lg font-semibold">Requests</h4>
              <div
                class="flex items-center border border-gray-300 rounded-lg px-2 sm:px-3 py-1 w-full sm:w-auto"
              >
                <i class="pi pi-search mr-2 text-gray-500" />
                <input
                  v-model="form.searchInput"
                  type="text"
                  placeholder="Search..."
                  class="outline-none border-none focus:ring-0 text-sm bg-transparent w-full"
                  @keydown.enter="triggerSearch"
                />
              </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto max-h-[60vh]">
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
                          v-if="form.sortField === col.field && form.sortOrder === 1"
                          class="pi pi-sort-amount-up-alt text-xs"
                        />
                        <i
                          v-else-if="form.sortField === col.field && form.sortOrder === -1"
                          class="pi pi-sort-amount-down text-xs"
                        />
                        <i v-else class="pi pi-sort-alt text-xs text-gray-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in TARequests"
                    :key="item.id"
                    @click="form.selectedRequest = item"
                    :class="[
                      'border-b even:bg-gray-50 hover:bg-gray-100 transition cursor-pointer',
                      form.selectedRequest?.id === item.id ? 'bg-blue-50' : '',
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
      v-model:visible="form.visible"
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
          form.approveDisapprove === 'approved' ? 'Approve' : 'Disapprove'
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
import ApproveTechnicalAssistance from '@/views/Admin/Requests/TechnicalAssistanceRequest/ApproveTechnicalAssistance.vue'
import PrintTransaction from '@/views/Admin/Requests/TechnicalAssistanceRequest/PrintTransaction.vue'
import { useAuthStore } from '@/stores/auth'
import { useTARequestFormStore } from '@/stores/TARequestFormStore'

const authStore = useAuthStore()
const form = useTARequestFormStore()
const summaryCollapsed = ref(false)

// Fetch data on mount
onMounted(async () => {
  try {
    await Promise.all([
      authStore.fetchUser(),
      (form.loading = true),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ])
    loadRequests(1)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    form.loading = false
  }
})

const TARequests = computed(() => form.TARequests)
const totalRecords = computed(() => form.totalRecords)
const totalPages = computed(() => Math.ceil(totalRecords.value / form.rows))
const currentPage = computed(() => Math.floor(form.first / form.rows) + 1)

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
  const req = form.selectedRequest || {}
  return {
    'Control Number': req.control_number ?? 'N/A',
    'Requesting Office': req.requesting_office ?? 'N/A',
    Details: req.details ?? 'N/A',
    'Request Type': Array.isArray(req.request_type)
      ? req.request_type.join(', ')
      : (req.request_type ?? 'N/A'),

    'Request Nature': Array.isArray(req.request_nature)
      ? req.request_nature.join(', ')
      : (req.request_nature ?? 'N/A'),
    'Other Request Type': req.other_type ?? 'N/A',
    'Other Request Nature': req.other_nature ?? 'N/A',
    Requester: req.requester_name ?? 'N/A',
    'Contact Number': req.requester_contact_number ?? 'N/A',
    Email: req.requester_email ?? 'N/A',
  }
})

function handleAvailableClick() {
  form.editingRequest = form.selectedRequest
  form.editMode = true
}

function handleApproved() {
  form.editingRequest = form.selectedRequest
  form.visible = true
  form.approveDisapprove = 'approved'
}

function handleDisapproved() {
  form.editingRequest = form.selectedRequest
  form.visible = true
  form.approveDisapprove = 'disapproved'
}

const handleSubmit = () => {
  form.submitting = true
  setTimeout(async () => {
    try {
      await form.putApprovalStatus(form.selectedRequest.id, form.approveDisapprove)
      alert('The Request has been ' + form.approveDisapprove + '!')
      form.resetForm()
    } catch (error) {
      console.error('Request submission failed:', error)
      alert('There was an error submitting the request. Please try again.')
    } finally {
      form.submitting = false
      handleUpdated()
    }
  }, 1500)
}

function handleCancelEdit() {
  form.editMode = false
  form.printMode = false
  form.approveDisapprove = ''
  form.visible = false
  form.editingRequest = null
}

function handleUpdated() {
  form.editMode = false
  form.printMode = false
  form.approveDisapprove = ''
  form.visible = false
  loadRequests(currentPage.value)
}

function handlePrint() {
  form.editingRequest = form.selectedRequest
  form.printMode = true
}

function triggerSearch() {
  form.first = 0
  loadRequests(1)
}

function sortBy(field) {
  if (form.sortField === field) {
    form.sortOrder = form.sortOrder === 1 ? -1 : 1
  } else {
    form.sortField = field
    form.sortOrder = 1
  }
  loadRequests(currentPage.value)
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  form.first = (page - 1) * form.rows
  loadRequests(page)
}

function loadRequests(page = currentPage.value) {
  form.loading2 = true
  const search = form.searchInput || ''
  const sortBy = form.sortField || ''
  const sortDir = form.sortOrder === 1 ? 'asc' : form.sortOrder === -1 ? 'desc' : ''

  form
    .getTARequests(authStore.token, page, form.rows, search, sortBy, sortDir)
    .catch((err) => {
      console.error('Failed to load Technical Assistance requests:', err)
    })
    .finally(() => {
      form.loading2 = false
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
