<template>
  <div class="flex w-full max-w-screen-2xl mx-auto px-4 py-6">
    <div class="bg-white rounded-xl shadow p-6 w-full">
      <DataTable
        ref="dt"
        v-model:selection="selectedTransaction"
        :value="vehicleRequests"
        dataKey="id"
        stripedRows
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} requests"
      >
        <template #header>
          <div class="flex flex-wrap gap-4 items-center justify-between">
            <h4 class="text-xl font-semibold">Vehicle Requests</h4>
            <div class="flex items-center border border-gray-300 rounded-lg px-3 py-1">
              <i class="pi pi-search mr-2 text-gray-500" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
                class="outline-none border-none focus:ring-0"
              />
            </div>
          </div>
        </template>

        <Column field="date_requested" header="Date Requested" sortable style="width: 200px" />
        <Column field="requester_name" header="Requested By" sortable style="width: 300px" />
        <Column field="purpose" header="Purpose" sortable style="width: 400px" />
        <Column field="status" header="Status" sortable style="width: 150px">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getStatusLabel(slotProps.data.status)" />
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 10rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-eye"
              outlined
              rounded
              class="mr-2"
              @click="editTransaction(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dialog -->
    <Dialog
      v-model:visible="transactionDialog"
      :style="{ width: '450px' }"
      header="Request Details"
      :modal="true"
    >
      <div class="flex flex-col gap-4">
        <div>
          <label class="font-semibold">Requested By:</label>
          <p>{{ selectedTransactionData.requester_name }}</p>
        </div>
        <div>
          <label class="font-semibold">Purpose:</label>
          <p>{{ selectedTransactionData.purpose }}</p>
        </div>
        <div>
          <label class="font-semibold">Date Requested:</label>
          <p>{{ selectedTransactionData.date_requested }}</p>
        </div>
        <div>
          <label class="font-semibold">Status:</label>
          <Tag
            :value="selectedTransactionData.status"
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
import { ref, onMounted, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useTransactionsFormStore } from '@/stores/transactionsStoreForm'
import { useAuthStore } from '@/stores/auth'

const transactionStore = useTransactionsFormStore()
const authStore = useAuthStore()

// Load data on mount
onMounted(() => {
  transactionStore.getAllTransactions(authStore.token)
})

const vehicleRequests = computed(() => transactionStore.vehicleRequests)
const selectedTransaction = ref(null)
const transactionDialog = ref(false)
const selectedTransactionData = ref({})

// PrimeVue search filter
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// Status label coloring
const getStatusLabel = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'success'
    case 'pending':
      return 'warning'
    case 'declined':
      return 'danger'
    default:
      return 'info'
  }
}

// Open details dialog
const editTransaction = (data) => {
  selectedTransactionData.value = data
  transactionDialog.value = true
}
</script>
