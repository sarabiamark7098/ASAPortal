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
    </div>

    <!-- Row 3 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <!-- Type of Request -->
      <div class="flex-1">
        <label for="RequestType">Type of Request</label>
        <div id="RequestType" class="flex flex-col pt-2">
          <div
            v-for="category in RequestTypeCategories"
            :key="category.key"
            class="flex flex-col sm:flex-row sm:items-center gap-2"
          >
            <div class="flex items-center gap-2">
              <Checkbox
                v-model="form.selectedRequest.request_type"
                :inputId="category.key"
                :value="category.name"
                readonly
              />
              <label :for="category.key">{{ category.name }}</label>
            </div>

            <!-- Show Other input if Other selected -->
            <InputText
              v-if="
                category.name === 'Other' && form.selectedRequest.request_type?.includes('Other')
              "
              :value="form.selectedRequest.other_type"
              class="w-full sm:w-auto"
              readonly
            />
          </div>
        </div>
      </div>

      <!-- Nature of Request -->
      <div class="flex-1">
        <label for="RequestNature">Nature of Request</label>
        <div id="RequestNature" class="flex flex-col pt-2">
          <div
            v-for="category in RequestNatureCategories"
            :key="category.key"
            class="flex flex-col sm:flex-row sm:items-center gap-2"
          >
            <div class="flex items-center gap-2">
              <Checkbox
                v-model="form.selectedRequest.request_nature"
                :inputId="category.key"
                :value="category.name"
                readonly
              />
              <label :for="category.key">{{ category.name }}</label>
            </div>

            <!-- Show Other input if Other selected -->
            <InputText
              v-if="
                category.name === 'Other' && form.selectedRequest.request_nature?.includes('Other')
              "
              :value="form.selectedRequest.other_nature"
              class="w-full sm:w-auto"
              readonly
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <Textarea
          id="details"
          class="w-full"
          v-model="form.selectedRequest.details"
          readonly
        />
        <label for="details">Details</label>
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
import { ref, Text } from 'vue'
import { useTARequestFormStore } from '@/stores/TARequestFormStore'

const form = useTARequestFormStore()

const RequestTypeCategories = ref([
  { name: 'Repair and Maintenance', key: 'Repair and Maintenance' },
  { name: 'Replacement', key: 'Replacement' },
  { name: 'Installation', key: 'Installation' },
  { name: 'Fabrication', key: 'Fabrication' },
  { name: 'Renovation/Improvement', key: 'Renovation/Improvement' },
  { name: 'Construction', key: 'Construction' },
  { name: 'Technical/Material Specification', key: 'Technical/Material Specification' },
  { name: 'Layout/Plans', key: 'Layout/Plans' },
  { name: 'Decoration/Arrangement', key: 'Decoration/Arrangement' },
  { name: 'Assistance/Supervision', key: 'Assistance/Supervision' },
  { name: 'Other', key: 'Other' },
])

const RequestNatureCategories = ref([
  { name: 'Air-conditioning', key: 'Air-conditioning' },
  { name: 'Audio-Visual', key: 'Audio-Visual' },
  { name: 'Carpentry', key: 'Carpentry' },
  { name: 'Drafting/Art Work', key: 'Drafting/Art Work' },
  { name: 'Electrical', key: 'Electrical' },
  { name: 'Masonry', key: 'Masonry' },
  { name: 'Plumbing', key: 'Plumbing' },
  { name: 'Steelworks', key: 'Steelworks' },
  { name: 'Technical Staff/Document', key: 'Technical Staff/Document' },
  { name: 'Telecommunication', key: 'Telecommunication' },
  { name: 'Varnishing/Painting', key: 'Varnishing/Painting' },
  { name: 'Other', key: 'Other' },
])
</script>
