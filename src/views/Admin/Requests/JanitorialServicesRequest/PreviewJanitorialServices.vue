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
          id="requestingOffice"
          class="w-full"
          v-model="form.selectedRequest.requesting_office"
          readonly
        />
        <label for="requestingOffice"> Requesting Office/Unit </label>
      </FloatLabel>
    </div>

    <!-- Row 3 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <Textarea id="purpose" class="w-full" v-model="form.selectedRequest.purpose" readonly />
        <label for="purpose">Purpose</label>
      </FloatLabel>
    </div>

    <!-- Row 3 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <InputText
          id="countUtility"
          class="w-full"
          v-model="form.selectedRequest.count_utility"
          readonly
        />
        <label for="countUtility">Number of Utility Workers</label>
      </FloatLabel>
      <FloatLabel class="flex-1">
        <InputText
          id="requestDate"
          class="w-full"
          v-model="form.selectedRequest.requested_date"
          :value="form.formatDate(form.selectedRequest.requested_date)"
          readonly
        />
        <label for="requestDate">Requested Date</label>
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

    <!-- Row 3 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <InputText
          id="assignment"
          class="w-full"
          v-model="form.selectedRequest.location"
          readonly
        />
        <label for="assignment">Place of Assignment</label>
      </FloatLabel>
      <FloatLabel class="flex-1">
        <InputText
          id="fundSource"
          class="w-full"
          v-model="form.selectedRequest.fund_source"
          readonly
        />
        <label for="fundSource">Source of Fund for Overtime</label>
      </FloatLabel>
    </div>

    <!-- Row 4 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <InputText
          id="officeHead"
          class="w-full"
          v-model="form.selectedRequest.office_head"
          readonly
        />
        <label for="officeHead">Head of Requesting Office</label>
      </FloatLabel>
    </div>

    <!-- Row 4 -->
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

    <!-- Row 5 -->
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
  </div>
</template>

<script setup>
import { useJanitorialRequestFormStore } from '@/stores/janitorialRequestFormStore'

const form = useJanitorialRequestFormStore()
</script>
