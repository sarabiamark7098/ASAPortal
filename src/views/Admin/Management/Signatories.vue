<template>
  <div class="p-4 sm:p-6">
    <FullScreenLoader :visible="signatoryFormStore.loading" message="Loading Signatories..." />

    <div v-if="!signatoryFormStore.loading" class="flex flex-col gap-6">
      <!-- Header Row -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold">Signatories Management</h1>
          <p class="text-gray-600 text-sm sm:text-base">Manage signatories directory</p>
        </div>
        <div class="flex justify-end">
          <Button
            v-if="!signatoryFormStore.updateSignatory && !signatoryFormStore.addSignatory"
            class="px-4 py-2 rounded-xl shadow-sm w-full sm:w-auto"
            severity="success"
            icon="pi pi-plus"
            label="Add New Signatory"
            @click="insertNewSignatory"
          />
        </div>
      </div>

      <div
        v-if="signatoryFormStore.updateSignatory || signatoryFormStore.addSignatory"
        class="flex flex-col gap-4"
      >
        <SignatoryInfo />
      </div>

      <!-- Main Content -->
      <div v-else class="flex flex-col lg:flex-row gap-4">
        <!-- Left Section -->
        <div
          class="w-full lg:w-1/3 shadow-sm rounded-lg p-5 overflow-y-auto flex flex-col bg-white max-h-[400px] sm:max-h-[500px] lg:max-h-[600px]"
        >
          <h3 class="text-lg font-semibold mb-4 sticky top-0 bg-white z-10 pb-2">
            Signatory Information
          </h3>

          <dl class="space-y-2 text-sm sm:text-base flex-grow">
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Name:</dt>
              <dd class="text-green-600">
                {{ signatoryFormStore.selectedSignatory?.full_name || 'N/A' }}
              </dd>
            </div>
            <div class="flex justify-between border-b border-gray-400 py-1">
              <dt class="font-semibold">Position:</dt>
              <dd class="text-green-600">
                {{ signatoryFormStore.selectedSignatory?.position || 'N/A' }}
              </dd>
            </div>
          </dl>

          <Button
            class="mt-4 self-end w-full sm:w-1/2"
            label="Update"
            size="small"
            icon="pi pi-pen-to-square"
            :disabled="!signatoryFormStore.selectedSignatory"
            :severity="signatoryFormStore.selectedSignatory ? 'success' : 'secondary'"
            @click="updateSignatoryInfo"
          />
        </div>

        <!-- Right Section - Table -->
        <div class="w-full lg:w-2/3 shadow-sm rounded-lg bg-white flex flex-col max-h-[600px]">
          <div class="bg-white rounded-xl h-full relative flex flex-col">
            <!-- Loading Overlay -->
            <div
              v-if="signatoryFormStore.loading2"
              class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10"
            >
              <i class="pi pi-spinner pi-spin text-blue-500 text-3xl" />
            </div>

            <!-- Header -->
            <div
              class="sticky top-0 z-20 bg-white px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 gap-2"
            >
              <h4 class="text-base sm:text-lg font-semibold">Signatories</h4>
              <div
                class="flex items-center border border-gray-300 rounded-lg px-3 py-1 w-full sm:w-auto"
              >
                <i class="pi pi-search mr-2 text-gray-500" />
                <input
                  v-model="signatoryFormStore.searchInput"
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
                            signatoryFormStore.sortField === col.field &&
                            signatoryFormStore.sortOrder === 1
                          "
                          class="pi pi-sort-amount-up-alt ml-2 text-xs"
                        />
                        <i
                          v-else-if="
                            signatoryFormStore.sortField === col.field &&
                            signatoryFormStore.sortOrder === -1
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
                    v-for="item in signatories"
                    :key="item.id"
                    @click="signatoryFormStore.selectedSignatory = item"
                    :class="[
                      'border-b hover:bg-gray-100 transition cursor-pointer',
                      signatoryFormStore.selectedSignatory?.id === item.id ? 'bg-blue-50' : '',
                    ]"
                  >
                    <td class="px-2 sm:px-4 py-2">{{ item.full_name }}</td>
                    <td class="px-2 sm:px-4 py-2">{{ item.position }}</td>
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
import { useSignatoryFormStore } from '@/stores/signatoryFormStore'
import SignatoryInfo from '@/views/Admin/Management/Manage/SignatoryInfo.vue'

const signatoryFormStore = useSignatoryFormStore()
const authStore = useAuthStore()

onMounted(async () => {
  signatoryFormStore.loading = true
  try {
    await Promise.all([
      authStore.fetchUser(),
      new Promise((resolve) => setTimeout(resolve, 1000)), // Delay for UX smoothness
    ])
    loadRequests(1)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    signatoryFormStore.loading = false
  }
})

const signatories = computed(() => signatoryFormStore.signatoryList)
const totalRecords = computed(() => signatoryFormStore.totalRecords)
const totalPages = computed(() => Math.ceil(totalRecords.value / signatoryFormStore.rows))
const currentPage = computed(
  () => Math.floor(signatoryFormStore.first / signatoryFormStore.rows) + 1,
)

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
  { field: 'full_name', header: 'Name' },
  { field: 'position', header: 'Position' },
]

function insertNewSignatory() {
  signatoryFormStore.addSignatory = true
  signatoryFormStore.resetForm()
}
function updateSignatoryInfo() {
  const signatory = signatoryFormStore.selectedSignatory
  signatoryFormStore.setSignatory(signatory)
}

function triggerSearch() {
  signatoryFormStore.first = 0
  loadRequests(1)
}

function sortBy(field) {
  if (signatoryFormStore.sortField === field) {
    signatoryFormStore.sortOrder = signatoryFormStore.sortOrder === 1 ? -1 : 1
  } else {
    signatoryFormStore.sortField = field
    signatoryFormStore.sortOrder = 1
  }
  loadRequests(currentPage.value)
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  signatoryFormStore.first = (page - 1) * signatoryFormStore.rows
  loadRequests(page)
}

function loadRequests(page = currentPage.value) {
  signatoryFormStore.loading2 = true
  const search = signatoryFormStore.searchInput || ''
  const sortBy = signatoryFormStore.sortField || ''
  const sortDir =
    signatoryFormStore.sortOrder === 1 ? 'asc' : signatoryFormStore.sortOrder === -1 ? 'desc' : ''

  signatoryFormStore
    .getSignatories(authStore.token, page, signatoryFormStore.rows, search, sortBy, sortDir)
    .finally(() => {
      signatoryFormStore.loading2 = false
    })
}
</script>

<style scoped></style>
