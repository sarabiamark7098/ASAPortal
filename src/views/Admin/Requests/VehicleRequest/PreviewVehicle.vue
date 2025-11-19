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
          id="requestingOffice"
          class="w-full"
          v-model="form.selectedRequest.requesting_office"
          readonly
        />
        <label for="requestingOffice"> Requesting Office/Unit </label>
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
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <Textarea
          id="purpose"
          class="w-full"
          v-model="form.selectedRequest.purpose"
          autoResize
          rows="2"
          readonly
        />
        <label for="purpose">Purpose of Trip</label>
      </FloatLabel>
    </div>

    <!-- Row 2 -->
    <div>
      <FloatLabel>
        <Textarea
          id="passengers"
          class="w-full"
          v-model="form.selectedRequest.passengers"
          autoResize
          rows="2"
          readonly
        />
        <label for="passengers">Name of Passengers</label>
      </FloatLabel>
    </div>

    <!-- Row 3: Date & Time -->
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
          id="startTime"
          class="w-full"
          v-model="form.selectedRequest.requested_time"
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

    <!-- Row 4 -->
    <div>
      <FloatLabel>
        <Textarea
          id="placeOfTravel"
          class="w-full"
          v-model="form.selectedRequest.destination"
          autoResize
          rows="2"
          readonly
        />
        <label for="placeOfTravel">Place of Travel</label>
      </FloatLabel>
    </div>

    <!-- Row 5 -->
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
import { useVehicleRequestFormStore } from '@/stores/vehicleRequestFormStore'

const form = useVehicleRequestFormStore()
</script>
