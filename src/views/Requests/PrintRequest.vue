<template>
  <FullScreenLoader :visible="form.loading" message="Loading Print Request..." />

  <div v-if="!form.loading">
    <div
      class="flex flex-col p-4 sm:p-6 md:p-9 lg:p-12 bg-gray-100 rounded-3xl max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto mt-12"
    >
      <!-- Header -->
      <div class="mb-6 text-center w-full">
        <h1 class="text-2xl sm:text-3xl font-bold">Print Request</h1>
      </div>

      <hr class="mb-6 border-gray-300" />

      <div class="flex flex-col gap-8">
        <!-- Requesting Office / Fund / Date -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="requestingOffice"
                v-model="form.selectedRequest.requesting_office"
                class="w-full"
                readonly
              />
              <label for="requestingOffice"
                >Requesting Office/Unit <span class="text-red-500">*</span></label
              >
            </FloatLabel>
          </div>
          <div class="flex-1">
            <FloatLabel>
              <DatePicker
                id="requestedDate"
                v-model="form.selectedRequest.date_requested"
                class="w-full"
                showIcon
                fluid
                iconDisplay="input"
                readonly
              />
              <label for="requestedDate">Date Requested <span class="text-red-500">*</span></label>
            </FloatLabel>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-6 justify-center mt-12">
          <Button
            id="printRequest"
            class="w-1/4"
            label="Print Request"
            @click="openPrint"
            icon="pi pi-print"
          />
        </div>

        <!-- Done -->
        <div class="flex flex-col sm:flex-row gap-6 justify-center mt-12">
          <Button
            label="Done"
            class="w-1/4"
            icon="pi pi-check"
            severity="primary"
            :disabled="form.submitting"
            @click="Done"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAirTransportOrderFormStore } from '@/stores/airTransportOrderFormStore'
import { usePremisesFormStore } from '@/stores/entryToDSWDFormStore'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const printview = route.params.printview
console.log(printview)
let form = ''
if (printview === 'entry-request') {
  form = usePremisesFormStore()
} else {
  form = useAirTransportOrderFormStore()
}
onMounted(() => {
  form.loading = true
  setTimeout(() => {
    form.loading = false
  }, 1500)
})

function Done() {
  form.submitting = true
  setTimeout(() => {
    form.submitting = false
  }, 1500)
  router.push({ name: 'clientview' }).then(() => {
    window.location.reload()
  })
}

function openPrint() {
  if (!form.selectedRequest) return
  const id = form.selectedRequest.id
  console.log('Printing request ID:', id)

  // Optional: choose different API endpoints based on route param
  const endpoint =
    printview === 'entry-request'
      ? `${axios.defaults.baseURL}/api/pdf/entry-request/${id}`
      : `${axios.defaults.baseURL}/api/pdf/air-transport-request/${id}`

  window.open(endpoint, '_blank')
}
</script>
