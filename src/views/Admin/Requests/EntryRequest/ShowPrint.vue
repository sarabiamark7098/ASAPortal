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
          id="requesterName_print"
          class="w-full"
          v-model="form.selectedRequest.requester_name"
          readonly
        />
        <label for="requesterName_print"> Requester </label>
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
        id="printRequest"
        class="w-1/4"
        label="Print Request"
        @click="openPrint"
        icon="pi pi-print"
      />
    </div>
  </div>
</template>

<script setup>
import { usePremisesFormStore } from '@/stores/entryToDSWDFormStore'
import axios from 'axios'

const form = usePremisesFormStore()

function openPrint() {
  if (!form.selectedRequest) return
  const id = form.selectedRequest.id
  window.open(`${axios.defaults.baseURL}/api/pdf/entry-request/${id}`, '_blank')
}
</script>
