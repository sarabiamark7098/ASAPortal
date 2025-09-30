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
      <FloatLabel class="flex-1">
        <InputText id="focal" class="w-full" v-model="form.selectedRequest.focal" readonly />
        <label for="focal"> Focal Person </label>
      </FloatLabel>
      <FloatLabel class="flex-1">
        <InputText
          id="pax"
          class="w-full"
          v-model="form.selectedRequest.number_of_persons"
          readonly
        />
        <label for="pax"> Number of Pax </label>
      </FloatLabel>
    </div>

    <!-- Row 3A: Date & Time -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <DatePicker
          id="dateNeeded"
          class="w-full"
          v-model="form.selectedRequest.requested_start"
          showIcon
          fluid
          iconDisplay="input"
          readonly
        />
        <label for="dateNeeded">Date Needed (Start)</label>
      </FloatLabel>
      <FloatLabel class="flex-1">
        <DatePicker
          id="dateEnding"
          class="w-full"
          v-model="form.selectedRequest.requested_end"
          showIcon
          fluid
          iconDisplay="input"
          readonly
        />
        <label for="dateEnding">Date Needed (End)</label>
      </FloatLabel>
    </div>

    <!-- Row 3B: Date & Time -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <DatePicker
          id="startTime"
          class="w-full"
          v-model="form.selectedRequest.requested_time_start"
          showIcon
          fluid
          hourFormat="12"
          iconDisplay="input"
          timeOnly
          readonly
        >
          <template #inputicon="slotProps">
            <i class="pi pi-clock" @click="slotProps.clickCallback" />
          </template>
        </DatePicker>
        <label for="startTime">Time Needed (Start)</label>
      </FloatLabel>
      <FloatLabel class="flex-1">
        <DatePicker
          id="startTime"
          class="w-full"
          v-model="form.selectedRequest.requested_time_end"
          showIcon
          fluid
          hourFormat="12"
          iconDisplay="input"
          timeOnly
          readonly
        >
          <template #inputicon="slotProps">
            <i class="pi pi-clock" @click="slotProps.clickCallback" />
          </template>
        </DatePicker>
        <label for="startTime">Time Needed (Start)</label>
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
import { useConferenceRequestFormStore } from '@/stores/conferenceRequestFormStore'

const form = useConferenceRequestFormStore()
</script>
