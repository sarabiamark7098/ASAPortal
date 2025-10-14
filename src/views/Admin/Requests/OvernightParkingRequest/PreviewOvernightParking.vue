<template>
  <div class="flex flex-col gap-8">
    <!-- Row 1 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <InputText
          id="controlNumber"
          class="w-full"
          v-model="form.selectedRequest.control_number"
          readonly
        />
        <label for="controlNumber"> Control Number </label>
      </FloatLabel>

      <FloatLabel class="flex-1">
        <InputText
          id="DateRequested"
          class="w-full"
          v-model="form.selectedRequest.date_requested"
          :value="form.formatDate(form.selectedRequest.date_requested)"
          readonly
        />
        <label for="DateRequested">Date Requested</label>
      </FloatLabel>
    </div>

    <!-- Row 2 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <InputText
          id="requestedBy"
          class="w-full"
          v-model="form.selectedRequest.requester_name"
          readonly
        />
        <label for="requestedBy">Requested by</label>
      </FloatLabel>
      <FloatLabel class="flex-1">
        <InputText
          id="position"
          class="w-full"
          v-model="form.selectedRequest.requester_position"
          readonly
        />
        <label for="position">Position</label>
      </FloatLabel>
    </div>

    <!-- Row 3 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <InputMask
          id="contactNo"
          class="w-full"
          v-model="form.selectedRequest.requester_contact_number"
          mask="0999 999 9999"
          readonly
        />
        <label for="contactNo">Contact No.</label>
      </FloatLabel>

      <FloatLabel class="flex-1">
        <InputText
          id="emailOfRequester"
          v-model="form.selectedRequest.requester_email"
          class="w-full"
          type="email"
          required
          readonly
        />
        <label for="emailOfRequester">Email of Requester</label>
      </FloatLabel>
    </div>

    <!-- Row 4 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <InputText
          id="requestDateStart"
          class="w-full"
          v-model="form.selectedRequest.requested_start"
          :value="form.formatDate(form.selectedRequest.requested_start)"
          readonly
        />
        <label for="requestDateStart">Requested Date</label>
      </FloatLabel>
      <FloatLabel class="flex-1">
        <InputText
          id="requestDateEnd"
          class="w-full"
          v-model="form.selectedRequest.requested_end"
          :value="form.formatDate(form.selectedRequest.requested_end)"
          readonly
        />
        <label for="requestDateEnd">Requested Date</label>
      </FloatLabel>
      <FloatLabel class="flex-1">
        <InputText
          id="requestTime"
          class="w-full"
          v-model="form.selectedRequest.requested_time"
          :value="form.formatTime(form.selectedRequest.requested_time)"
          readonly
        />
        <label for="requestTime">Requested Time</label>
      </FloatLabel>
    </div>

    <!-- Row 5 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <InputText
          id="plateNumber"
          class="w-full"
          v-model="form.selectedRequest.plate_number"
          readonly
        />
        <label for="plateNumber">Plate Number</label>
      </FloatLabel>
      <FloatLabel class="flex-1">
        <InputText id="model" class="w-full" v-model="form.selectedRequest.model" readonly />
        <label for="model">Vehicle Model</label>
      </FloatLabel>
    </div>

    <!-- Row 6 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <Textarea
          id="justification"
          class="w-full"
          v-model="form.selectedRequest.justification"
          readonly
        />
        <label for="justification">Justification</label>
      </FloatLabel>
    </div>
  </div>
</template>

<script setup>
import { useOvernightParkingRequestFormStore } from '@/stores/overnightParkingRequestFormStore'

const form = useOvernightParkingRequestFormStore()
</script>
