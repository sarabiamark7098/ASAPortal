<template>
  <FullScreenLoader :visible="loading" message="Loading Conference Room Request Form..." />

  <div v-if="!loading">
    <div
      class="flex flex-col p-4 sm:p-6 md:p-9 lg:p-12 bg-gray-100 rounded-3xl max-w-full sm:max-w-7xl mx-auto mt-12"
    >
      <!-- Header -->
      <div class="mb-6 text-center">
        <h1 class="text-2xl sm:text-3xl font-bold">REQUEST FOR USE OF CONFERENCE ROOM</h1>
      </div>

      <RouterLink
        class="mb-6 w-1/6 bg-gray-600 text-white p-2 rounded-lg shadow-md text-center"
        to="/client"
      >
        <i class="pi pi-arrow-left" /> Back to Requests
      </RouterLink>

      <hr class="mb-6 border-gray-300" />

      <!-- Input Fields -->
      <div class="flex flex-col gap-8">
        <!-- Row 1 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel class="w-full">
              <InputText
                id="requestingOffice"
                v-model="form.requesting_office"
                class="w-full"
                :class="{ 'p-invalid': v$.requesting_office.$error }"
              />
              <label for="requestingOffice">
                Requesting Office/Unit <span class="text-red-500">*</span>
              </label>
            </FloatLabel>
            <small v-if="v$.requesting_office.$error" class="text-red-500 text-xs">
              Requesting Office/Unit is required.
            </small>
          </div>

          <div class="flex-1">
            <FloatLabel class="w-full">
              <DatePicker
                id="dateRequested"
                v-model="form.date_requested"
                class="w-full"
                :class="{ 'p-invalid': v$.date_requested.$error }"
                showIcon
                fluid
                iconDisplay="input"
              />
              <label for="dateRequested">Date Requested <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.date_requested.$error" class="text-red-500 text-xs">
              Requested Date is required.
            </small>
          </div>
        </div>

        <!-- Row 2 -->

        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel class="w-full">
              <Textarea
                id="purpose"
                v-model="form.purpose"
                class="w-full"
                :class="{ 'p-invalid': v$.purpose.$error }"
                autoResize
                rows="2"
              />
              <label for="purpose">Purpose <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.purpose.$error" class="text-red-500 text-xs"
              >Purpose is required.</small
            >
          </div>
        </div>

        <!-- Row 3: Dates -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel class="w-full">
              <DatePicker
                id="dateNeeded"
                v-model="form.requested_start"
                class="w-full"
                :class="{ 'p-invalid': v$.requested_start.$error }"
                showIcon
                fluid
                iconDisplay="input"
              />
              <label for="dateNeeded"
                >Date Needed (Start) <span class="text-red-500">*</span></label
              >
            </FloatLabel>
            <small v-if="v$.requested_start.$error" class="text-red-500 text-xs"
              >Date Needed is required.</small
            >
          </div>

          <div class="flex-1">
            <FloatLabel class="w-full">
              <DatePicker
                id="dateEnding"
                v-model="form.requested_end"
                class="w-full"
                :class="{ 'p-invalid': v$.requested_end.$error || invalidDate }"
                showIcon
                fluid
                iconDisplay="input"
              />
              <label for="dateEnding">
                Date Needed (End) <span class="text-red-500">*</span>
              </label>
            </FloatLabel>
            <small v-if="v$.requested_end.$error" class="text-red-500 text-xs">
              End date is required.
            </small>
            <small v-if="invalidDate" class="text-red-500 text-xs">
              End date must be after start date.
            </small>
          </div>
        </div>

        <!-- Row 4: Time -->
        <div class="flex flex-col sm:flex-row gap-6">
          <!-- Start Time -->
          <div class="flex-1">
            <FloatLabel class="w-full">
              <DatePicker
                id="timeNeeded"
                v-model="form.requested_time_start"
                class="w-full"
                :class="{ 'p-invalid': v$.requested_time_start.$error }"
                showIcon
                fluid
                hourFormat="12"
                iconDisplay="input"
                timeOnly
              >
                <template #inputicon="{ clickCallback }">
                  <i class="pi pi-clock" @click="clickCallback" />
                </template>
              </DatePicker>
              <label for="timeNeeded">
                Time Needed (Start) <span class="text-red-500">*</span>
              </label>
            </FloatLabel>
            <small v-if="v$.requested_time_start.$error" class="text-red-500 text-xs">
              Start time is required.
            </small>
          </div>

          <!-- End Time -->
          <div class="flex-1">
            <FloatLabel class="w-full">
              <DatePicker
                id="timeEnding"
                v-model="form.requested_time_end"
                class="w-full"
                :class="{ 'p-invalid': v$.requested_time_end.$error || invalidTime }"
                showIcon
                fluid
                hourFormat="12"
                iconDisplay="input"
                timeOnly
              >
                <template #inputicon="{ clickCallback }">
                  <i class="pi pi-clock" @click="clickCallback" />
                </template>
              </DatePicker>
              <label for="timeEnding">
                Time Needed (End) <span class="text-red-500">*</span>
              </label>
            </FloatLabel>
            <small v-if="v$.requested_time_end.$error" class="text-red-500 text-xs">
              End time is required.
            </small>
            <small v-if="invalidTime" class="text-red-500 text-xs">
              End time must be after start time.
            </small>
          </div>
        </div>

        <!-- Row 5 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <!-- No. of Persons -->
          <div class="flex-1">
            <FloatLabel class="w-full">
              <InputText
                id="numberOfPersons"
                v-model="form.number_of_persons"
                class="w-full"
                :class="{ 'p-invalid': v$.number_of_persons.$error }"
              />
              <label for="numberOfPersons">
                No. of Persons <span class="text-red-500">*</span>
              </label>
            </FloatLabel>
            <small v-if="v$.number_of_persons.$error" class="text-red-500 text-xs">
              Number of persons is required.
            </small>
          </div>

          <!-- Focal Person -->
          <div class="flex-1">
            <FloatLabel class="w-full">
              <InputText
                id="focal"
                v-model="form.focal"
                class="w-full"
                :class="{ 'p-invalid': v$.focal.$error }"
              />
              <label for="focal"> Focal Person <span class="text-red-500">*</span> </label>
            </FloatLabel>
            <small v-if="v$.focal.$error" class="text-red-500 text-xs">
              Focal Person is required.
            </small>
          </div>
        </div>

        <hr class="border-gray-300" />

        <!-- Conference Room -->
        <div>
          <Select
            id="selectedConferenceRoom"
            v-model="form.conference_room"
            :options="Rooms"
            optionValue="code"
            optionLabel="name"
            placeholder="Select Conference Room"
            class="w-full"
            :class="{ 'p-invalid': v$.conference_room.$error }"
          />
          <small v-if="v$.conference_room.$error" class="text-red-500 text-xs">
            Conference room selection is required.
          </small>
        </div>

        <hr class="border-gray-300" />

        <!-- Contact Details -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1 flex flex-col gap-6">
            <!-- Requested By -->
            <FloatLabel class="flex-1">
              <InputText
                id="requestedBy"
                v-model="form.requester_name"
                class="w-full"
                :class="{ 'p-invalid': v$.requester_name.$error }"
              />
              <label for="requestedBy">Requested by <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_name.$error" class="text-red-500 text-xs">
              Requester name is required.
            </small>

            <!-- Position -->
            <FloatLabel class="flex-1">
              <InputText
                id="position"
                v-model="form.requester_position"
                class="w-full"
                :class="{ 'p-invalid': v$.requester_position.$error }"
              />
              <label for="position">Position <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_position.$error" class="text-red-500 text-xs">
              Position is required.
            </small>

            <!-- Contact No -->
            <FloatLabel class="flex-1">
              <InputMask
                id="contactNo"
                v-model="form.requester_contact_number"
                mask="0999 999 9999"
                class="w-full"
                :class="{ 'p-invalid': v$.requester_contact_number.$error }"
              />
              <label for="contactNo">Contact No. <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_contact_number.$error" class="text-red-500 text-xs">
              Contact number is required.
            </small>

            <!-- Email -->
            <FloatLabel class="flex-1">
              <InputText
                id="emailOfRequester"
                v-model="form.requester_email"
                type="email"
                class="w-full"
                :class="{ 'p-invalid': v$.requester_email.$error }"
              />
              <label for="emailOfRequester">
                Email of Requester <span class="text-red-500">*</span>
              </label>
            </FloatLabel>
            <small v-if="v$.requester_email.$error" class="text-red-500 text-xs">
              Valid email is required (Gmail or DSWD only).
            </small>
          </div>

          <!-- E-signature -->
          <div class="flex-1">
            <div class="flex gap-6">
              <FileUpload
                id="esign"
                mode="basic"
                accept="image/png,image/jpeg"
                name="esignature"
                customUpload
                auto
                @select="onFileSelect"
                chooseLabel="Choose File"
                class="w-full sm:w-auto"
                :class="{ 'p-invalid': v$.src.$error }"
              />

              <div v-if="form.preview" class="mt-4 sm:mt-0">
                <img
                  :key="form.preview"
                  :src="form.preview"
                  alt="E-Signature Preview"
                  class="shadow-md rounded-xl w-full sm:w-32 grayscale"
                />
              </div>

              <div v-else class="text-sm text-gray-500 mt-2">
                Upload your e-signature (PNG, JPG, JPEG) - Max size: 1MB
                <span class="text-red-500">*</span>
                <span v-if="v$.src.$error" class="text-red-500 block">
                  E-signature is required.
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center mt-8">
          <Button
            label="Submit Request"
            icon="pi pi-check"
            severity="primary"
            class="w-full sm:w-auto"
            :disabled="submitting"
            @click="submitRequest"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { useConferenceRequestFormStore } from '@/stores/conferenceRequestFormStore'
import { ref, onMounted, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = useConferenceRequestFormStore()

const submitting = ref(false)
const loading = ref(true)

onMounted(() => setTimeout(() => (loading.value = false), 1500))

const Rooms = [
  { name: 'Magiting Conference Room', code: 'magiting' },
  { name: 'Maagap Conference Room', code: 'maagap' },
  { name: 'Seminar Hall', code: 'seminar' },
]

// Custom email validator
const emailDomain = helpers.withMessage('Email must be Gmail or DSWD domain', (value) => {
  if (!value) return false
  const allowed = ['@gmail.com', '@dswd.gov.ph']
  return allowed.some((d) => value.toLowerCase().endsWith(d))
})

// Validation rules (flattened)
const rules = {
  requesting_office: { required },
  date_requested: { required },
  purpose: { required },
  requested_start: { required },
  requested_end: { required },
  requested_time_start: { required },
  requested_time_end: { required },
  number_of_persons: { required },
  focal: { required },
  conference_room: { required },
  requester_name: { required },
  requester_position: { required },
  requester_contact_number: { required },
  requester_email: { required, email, emailDomain },
  src: { required },
}

const v$ = useVuelidate(rules, form)

// Computed validations
const invalidDate = computed(
  () =>
    form.requested_start &&
    form.requested_end &&
    new Date(form.requested_end) < new Date(form.requested_start),
)
const invalidTime = computed(
  () =>
    form.requested_time_start &&
    form.requested_time_end &&
    new Date(form.requested_time_end) <= new Date(form.requested_time_start),
)

// File upload handler
function validateFile(file) {
  const validTypes = ['image/png', 'image/jpeg']
  const maxSize = 1 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    return 'Only PNG or JPEG files are allowed.'
  }
  if (file.size > maxSize) {
    return 'Maximum file size is 1MB.'
  }
  return null
}

function onFileSelect(event) {
  const file = event.files[0]
  if (!file) return

  const error = validateFile(file)
  if (error) {
    alert(error)
    form.src = null
    form.preview = null
    return
  }

  form.src = file

  const reader = new FileReader()
  reader.onload = (e) => (form.preview = e.target.result)
  reader.readAsDataURL(file)
}

// Submit handler
async function submitRequest() {
  const isValid = await v$.value.$validate()
  if (!isValid) return alert('Please fix the highlighted errors.')
  if (invalidDate.value) return alert('End date must be after start date.')
  if (invalidTime.value) return alert('End time must be after start time.')

  submitting.value = true
  try {
    await form.submitForm()
    alert('Form submitted successfully!')
    form.resetForm()
    router.push({ name: 'clientview' })
  } catch (error) {
    console.error('Form submission failed:', error)
    alert('There was an error submitting the form. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>
