<template>
  <div class="flex flex-col gap-8">
    <!-- Row 1 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <InputText
          id="controlNumber_print"
          class="w-full"
          v-model="vehicleRequestFormStore.selectedRequest.control_number"
          readonly
        />
        <label for="controlNumber_print"> Control Number </label>
      </FloatLabel>

      <FloatLabel class="flex-1">
        <InputText
          id="requestingOffice_print"
          class="w-full"
          v-model="vehicleRequestFormStore.selectedRequest.requesting_office"
          readonly
        />
        <label for="requestingOffice_print"> Requesting Office/Unit </label>
      </FloatLabel>

      <FloatLabel class="flex-1">
        <DatePicker
          id="dateNeeded"
          class="w-full"
          v-model="vehicleRequestFormStore.selectedRequest.date_requested"
          showIcon
          fluid
          iconDisplay="input"
          readonly
        />
        <label for="dateNeeded">Date Requested</label>
      </FloatLabel>
    </div>
    <div class="flex flex-col sm:flex-row gap-6 justify-center mt-12">
      <Button
        id="printVehicleRequest"
        class="w-1/4"
        label="Print Vehicle Request"
        @click="openPrint"
        icon="pi pi-print"
      />
      <Button
        v-if="
          vehicleRequestFormStore.selectedRequest.status === 'processed' ||
          vehicleRequestFormStore.selectedRequest.status === 'approved'
        "
        id="printTravelOrder"
        class="w-1/4"
        label="Print Travel Order"
        @click="openPrintTO"
        icon="pi pi-print"
      />
      <Button
        v-if="vehicleRequestFormStore.selectedRequest.status === 'no_available'"
        id="printCNAS"
        class="w-1/4"
        label="Print CNAS"
        @click="openPrintCNAS"
        icon="pi pi-print"
      />
    </div>
  </div>
</template>

<script setup>
import { useVehicleRequestFormStore } from '@/stores/vehicleRequestFormStore'
import axios from 'axios'

const vehicleRequestFormStore = useVehicleRequestFormStore()

function openPrint() {
  if (!vehicleRequestFormStore.selectedRequest) return
  const id = vehicleRequestFormStore.selectedRequest.id
  window.open(`${axios.defaults.baseURL}/api/pdf/vehicle-request/${id}`, '_blank')
}
function openPrintTO() {
  if (!vehicleRequestFormStore.selectedRequest) return
  const id = vehicleRequestFormStore.selectedRequest.id
  window.open(`${axios.defaults.baseURL}/api/pdf/travel-order/${id}`, '_blank')
}
function openPrintCNAS() {
  if (!vehicleRequestFormStore.selectedRequest) return
  const id = vehicleRequestFormStore.selectedRequest.id
  window.open(`${axios.defaults.baseURL}/api/pdf/vehicle-cnas/${id}`, '_blank')
}
</script>
