<template>
  <FullScreenLoader :visible="loading" message="Loading Vehicle Request Form..." />

  <div v-if="!loading">
    <div
      class="flex flex-col p-4 sm:p-6 md:p-9 lg:p-12 bg-gray-100 rounded-3xl max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto mt-12"
    >
      <!-- Header -->
      <div class="mb-6 text-center w-full">
        <h1 class="text-2xl sm:text-3xl font-bold">REQUEST FOR USE OF VEHICLE</h1>
      </div>

      <!-- Sticky Note Warning -->
      <div class="mb-10 w-full flex justify-center">
        <div
          class="text-red-900 font-semibold rounded-lg shadow-md border-l-4 border-yellow-500 bg-yellow-200 p-3 text-sm w-full sm:w-[90%] max-w-3xl sm:text-center sm:text-base sm:p-4"
        >
          Note: Request for use of vehicle shall be made at least two (2) days from the intended
          date of use. Failure to use the vehicle at the given date/time forfeits one’s right to use
          the vehicle assigned.
        </div>
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
          <!-- Requesting Office -->
          <div class="flex-1">
            <FloatLabel class="relative w-full">
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
            <small v-if="v$.requesting_office.$error" class="text-red-500 text-xs block mt-1">
              Requesting Office/Unit is required.
            </small>
          </div>

          <!-- Purpose -->
          <div class="flex-1">
            <FloatLabel class="relative w-full">
              <InputText
                id="purpose"
                v-model="form.purpose"
                class="w-full"
                :class="{ 'p-invalid': v$.purpose.$error }"
              />
              <label for="purpose"> Purpose of Trip <span class="text-red-500">*</span> </label>
            </FloatLabel>
            <small v-if="v$.purpose.$error" class="text-red-500 text-xs block mt-1">
              Purpose is required.
            </small>
          </div>
        </div>

        <!-- Row 2 -->
        <div class="relative">
          <FloatLabel>
            <Textarea
              id="passengers"
              v-model="form.passengers"
              class="w-full"
              :class="{ 'p-invalid': v$.passengers.$error }"
              autoResize
              rows="2"
            />
            <label for="passengers">Name of Passengers <span class="text-red-500">*</span></label>
          </FloatLabel>
          <small v-if="v$.passengers.$error" class="text-red-500 text-xs"
            >Passengers are required.</small
          >
        </div>

        <!-- Row 3: Date & Time -->
        <div class="flex flex-col sm:flex-row gap-6">
          <!-- Start Date -->
          <div class="flex-1">
            <FloatLabel class="w-full">
              <DatePicker
                id="dateNeeded"
                v-model="form.requested_start"
                class="w-full"
                showIcon
                fluid
                iconDisplay="input"
                :class="{ 'p-invalid': v$.requested_start.$error }"
              />
              <label for="dateNeeded"
                >Date Needed (Start) <span class="text-red-500">*</span></label
              >
            </FloatLabel>
            <small v-if="v$.requested_start.$error" class="text-red-500 text-xs block mt-1">
              Start date is required.
            </small>
          </div>

          <!-- Start Time -->
          <div class="flex-1">
            <FloatLabel class="w-full">
              <DatePicker
                id="startTime"
                v-model="form.requested_time"
                class="w-full"
                showIcon
                fluid
                hourFormat="12"
                iconDisplay="input"
                timeOnly
                :class="{ 'p-invalid': v$.requested_time.$error }"
              >
                <template #inputicon="slotProps">
                  <i class="pi pi-clock" @click="slotProps.clickCallback" />
                </template>
              </DatePicker>
              <label for="startTime">Time Needed (Start) <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requested_time.$error" class="text-red-500 text-xs block mt-1">
              Start time is required.
            </small>
          </div>

          <!-- End Date -->
          <div class="flex-1">
            <FloatLabel class="w-full">
              <DatePicker
                id="dateEnding"
                v-model="form.requested_end"
                class="w-full"
                showIcon
                fluid
                iconDisplay="input"
                :class="{ 'p-invalid': v$.requested_end.$error || isDateInvalid }"
              />
              <label for="dateEnding">Date Needed (End) <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requested_end.$error" class="text-red-500 text-xs block mt-1">
              End date is required.
            </small>
            <small v-if="isDateInvalid" class="text-red-500 text-xs block mt-1">
              End date must be after start date.
            </small>
          </div>
        </div>

        <!-- Row 4 -->
        <div class="relative">
          <FloatLabel>
            <Textarea
              id="placeOfTravel"
              v-model="form.destination"
              class="w-full"
              :class="{ 'p-invalid': v$.destination.$error }"
              autoResize
              rows="2"
            />
            <label for="placeOfTravel">Place of Travel <span class="text-red-500">*</span></label>
          </FloatLabel>
          <small v-if="v$.destination.$error" class="text-red-500 text-xs"
            >Destination is required.</small
          >
        </div>

        <!-- Row 5 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <!-- Requested By -->
          <div class="flex-1">
            <FloatLabel class="w-full">
              <InputText
                id="requestedBy"
                v-model="form.requester_name"
                class="w-full"
                :class="{ 'p-invalid': v$.requester_name.$error }"
              />
              <label for="requestedBy">Requested by <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_name.$error" class="text-red-500 text-xs">
              Requested by is required.
            </small>
          </div>

          <!-- Position -->
          <div class="flex-1">
            <FloatLabel class="w-full">
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
          </div>

          <!-- Contact No -->
          <div class="flex-1">
            <FloatLabel class="w-full">
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
          </div>

          <!-- Email -->
          <div class="flex-1">
            <FloatLabel class="w-full">
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
              {{ v$.requester_email.$errors[0]?.$message }}
            </small>
          </div>
        </div>

        <!-- Row 6 -->
        <div class="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
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
          <div v-if="form.src" class="mt-4 sm:mt-0">
            <img
              :src="form.src"
              alt="E-Signature Preview"
              class="shadow-md rounded-xl w-full sm:w-32"
              style="filter: grayscale(100%)"
            />
          </div>
          <div class="text-sm text-gray-500 mt-2">
            Upload your e-signature (PNG, JPG, JPEG) - Max size: 1MB
            <span class="text-red-500">*</span>
            <span v-if="v$.src.$error" class="text-red-500 block">E-signature is required.</span>
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
import { useVehicleRequestFormStore } from '@/stores/vehicleRequestFormStore'
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'

// Vuelidate imports
import useVuelidate from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

const vehicleRequestFormStore = useVehicleRequestFormStore()
const form = vehicleRequestFormStore

const showErrors = ref(false)
const submitting = ref(false)
const loading = ref(true)
const router = useRouter()

const isDateInvalid = computed(() => {
  if (!form.requested_start || !form.requested_end) return false
  return new Date(form.requested_end) < new Date(form.requested_start)
})

onMounted(async () => {
  setTimeout(() => {
    loading.value = false
  }, 1500)
})

// Custom email domain validator
const validEmailDomain = helpers.withMessage(
  'Email must be @gmail.com or @dswd.gov.ph',
  (value) => {
    if (!value) return false
    const allowedDomains = ['@gmail.com', '@dswd.gov.ph']
    return allowedDomains.some((domain) => value.toLowerCase().endsWith(domain))
  },
)

// Validation rules
const rules = {
  requesting_office: { required },
  purpose: { required },
  passengers: { required },
  requested_start: { required },
  requested_time: { required },
  requested_end: { required },
  destination: { required },
  requester_name: { required },
  requester_position: { required },
  requester_contact_number: { required },
  requester_email: { required, email, validEmailDomain },
  src: { required },
}

// Attach Vuelidate
const v$ = useVuelidate(rules, form)

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
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => (form.src = e.target.result)
  reader.readAsDataURL(file)
}

// Submit handler
async function submitRequest() {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    alert('Please correct the highlighted errors.')
    return
  }

  if (isDateInvalid.value) {
    alert('End date must be after start date.')
    return
  }

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
