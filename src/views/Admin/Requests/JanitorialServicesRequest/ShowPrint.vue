<template>
  <div class="flex flex-col gap-8">
    <!-- Row 1 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <InputText
          id="controlNumber_print"
          class="w-full"
          v-model="form.selectedRequest.control_number"
          readonly
        />
        <label for="controlNumber_print"> Control Number </label>
      </FloatLabel>

      <FloatLabel class="flex-1">
        <InputText
          id="requestingOffice_print"
          class="w-full"
          v-model="form.selectedRequest.requesting_office"
          readonly
        />
        <label for="requestingOffice_print"> Requesting Office/Unit </label>
      </FloatLabel>

      <FloatLabel class="flex-1">
        <DatePicker
          id="dateNeeded"
          class="w-full"
          v-model="form.selectedRequest.date_requested"
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
        v-if="
          form.selectedRequest.status === 'processed' || form.selectedRequest.status === 'approved'
        "
        id="printJanitorialRequest"
        class="w-1/4"
        label="Print Janitorial Request"
        @click="openPrint"
        icon="pi pi-print"
      />
    </div>
  </div>
</template>

<script setup>
import { useJanitorialRequestFormStore } from '@/stores/janitorialRequestFormStore'
import axios from 'axios'

const form = useJanitorialRequestFormStore()

function openPrint() {
  if (!form.selectedRequest) return
  const id = form.selectedRequest.id
  window.open(`${axios.defaults.baseURL}/api/pdf/janitorial-request/${id}`, '_blank')
}
</script>
