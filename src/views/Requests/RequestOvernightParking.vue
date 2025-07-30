<template>
  <FullScreenLoader :visible="loading" message="Loading Overnight Parking Request Form..." />

  <div v-if="!loading">
    <div
      class="flex flex-col p-4 sm:p-6 md:p-9 lg:p-12 bg-gray-100 rounded-3xl max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto mt-12"
    >
      <!-- Header -->
      <div class="mb-6 text-center w-full">
        <h1 class="text-2xl sm:text-3xl font-bold">REQUEST FOR OVERNIGHT PARKING OF VEHICLE</h1>
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
          <FloatLabel class="flex-1">
            <InputText
              id="requestedBy"
              class="w-full"
              v-model="formStoreOvernightParking.requestedBy"
              :class="{ 'p-invalid': showErrors && !formStoreOvernightParking.requestedBy }"
            />
            <label for="requestedBy">Requested by <span class="text-red-500">*</span></label>
          </FloatLabel>

          <FloatLabel class="flex-1">
            <InputText
              id="emailOfRequester"
              v-model="formStoreOvernightParking.emailOfRequester"
              class="w-full"
              type="email"
              :class="{
                'p-invalid':
                  showErrors && !isValidEmail(formStoreOvernightParking.emailOfRequester),
              }"
              required
            />
            <label for="emailOfRequester"
              >Email of Requester <span class="text-red-500">*</span></label
            >
          </FloatLabel>

          <FloatLabel class="flex-1">
            <DatePicker
              id="dateRequested"
              class="w-full"
              v-model="formStoreOvernightParking.dateRequested"
              :class="{ 'p-invalid': showErrors && !formStoreOvernightParking.dateRequested }"
              showIcon
              fluid
              iconDisplay="input"
            />
            <label for="dateRequested">Date Requested <span class="text-red-500">*</span></label>
          </FloatLabel>
        </div>

        <!-- Row 2 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <FloatLabel class="flex-1">
            <InputText
              id="position"
              class="w-full"
              v-model="formStoreOvernightParking.position"
              :class="{ 'p-invalid': showErrors && !formStoreOvernightParking.position }"
            />
            <label for="position">Position <span class="text-red-500">*</span></label>
          </FloatLabel>

          <FloatLabel class="flex-1">
            <InputMask
              id="contactNo"
              class="w-full"
              v-model="formStoreOvernightParking.contactNo"
              mask="0999 999 9999"
              :class="{ 'p-invalid': showErrors && !formStoreOvernightParking.contactNo }"
            />
            <label for="contactNo">Contact No. <span class="text-red-500">*</span></label>
          </FloatLabel>

          <FloatLabel class="flex-1">
            <Select
              v-model="formStoreOvernightParking.division"
              :options="divisionList"
              option-label="name"
              option-value="id"
              id="division"
              showClear
              class="w-full"
            />

            <label for="division">Division <span class="text-red-500">*</span></label>
          </FloatLabel>
        </div>

        <!-- Row 2 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <FloatLabel class="flex-2">
            <InputText
              id="plateNumber"
              class="w-full"
              v-model="formStoreOvernightParking.plateNumber"
              :class="{ 'p-invalid': showErrors && !formStoreOvernightParking.plateNumber }"
            />
            <label for="plateNumber"
              >Model and Plate Number of Vehicle <span class="text-red-500">*</span></label
            >
          </FloatLabel>

          <FloatLabel class="flex-1">
            <DatePicker
              id="dateNeeded"
              class="w-full"
              v-model="formStoreOvernightParking.dateNeeded"
              :class="{ 'p-invalid': showErrors && !formStoreOvernightParking.dateNeeded }"
              showIcon
              fluid
              iconDisplay="input"
            />
            <label for="dateNeeded">Date Needed (Start) <span class="text-red-500">*</span></label>
          </FloatLabel>

          <FloatLabel class="flex-1">
            <DatePicker
              id="dateEnding"
              class="w-full"
              v-model="formStoreOvernightParking.dateEnding"
              :class="[
                'w-full',
                (showErrors && !formStoreOvernightParking.dateEnding) || isDateInvalid
                  ? 'p-invalid border border-red-200 ring-1 ring-red-500 focus:ring-red-500 rounded-lg'
                  : '',
              ]"
              showIcon
              fluid
              iconDisplay="input"
            />
            <label for="dateEnding">Date Needed (End) <span class="text-red-500">*</span></label>
          </FloatLabel>
        </div>

        <!-- Row 2 -->
        <div>
          <FloatLabel>
            <Textarea
              id="justification"
              class="w-full"
              v-model="formStoreOvernightParking.justification"
              :class="{ 'p-invalid': showErrors && !formStoreOvernightParking.justification }"
              autoResize
              rows="2"
            />
            <label for="justification">Justification <span class="text-red-500">*</span></label>
          </FloatLabel>
        </div>

        <!-- Row 3: Date & Time -->
        <div class="flex flex-col sm:flex-row gap-6">
          <FloatLabel class="flex-1">
            <DatePicker
              id="startTime"
              class="w-full"
              v-model="formStoreOvernightParking.startTime"
              :class="{ 'p-invalid': showErrors && !formStoreOvernightParking.startTime }"
              showIcon
              fluid
              hourFormat="12"
              iconDisplay="input"
              timeOnly
            >
              <template #inputicon="slotProps">
                <i class="pi pi-clock" @click="slotProps.clickCallback" />
              </template>
            </DatePicker>
            <label for="startTime">Time Needed (Start) <span class="text-red-500">*</span></label>
          </FloatLabel>
        </div>

        <!-- Row 4 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <div class="flex gap-6">
              <FileUpload
                id="pdfUploadSupportingDocument"
                mode="basic"
                name="special_order_file"
                customUpload
                auto
                accept="application/pdf"
                @select="onSupportingDocumentSelect"
                chooseLabel="Choose PDF"
                class="w-full sm:w-auto"
                :class="{ 'p-invalid': showErrors && showSupportingDocumentError }"
              />
              <div
                v-if="formStoreOvernightParking.supportingDocumentFileName"
                class="mt-2 text-sm text-gray-700"
              >
                Selected: {{ formStoreOvernightParking.supportingDocumentFileName }}
              </div>
              <div
                v-if="showErrors && showSupportingDocumentError"
                class="text-red-500 mt-2 text-sm"
              >
                Only PDF files are allowed.
              </div>
              <div
                v-if="!formStoreOvernightParking.supportingDocumentFileName"
                class="text-sm text-gray-500 mt-2"
              >
                Upload your Supporting Document Here (optional)
              </div>
            </div>
          </div>
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
                :class="{ 'p-invalid': showErrors && !formStoreOvernightParking.src }"
              />

              <div v-if="formStoreOvernightParking.src" class="mt-4 sm:mt-0">
                <img
                  :key="formStoreOvernightParking.src"
                  :src="formStoreOvernightParking.src"
                  alt="E-Signature Preview"
                  class="shadow-md rounded-xl w-full sm:w-32"
                  style="filter: grayscale(100%)"
                />
              </div>
              <div v-if="!formStoreOvernightParking.src" class="text-sm text-gray-500 mt-2">
                Upload your e-signature (PNG, JPG, JPEG) - Max size: 1MB
                <span class="text-red-500">*</span
                ><span
                  v-if="showErrors && !formStoreOvernightParking.src"
                  class="text-red-500 block"
                  >E-signature is required.</span
                >
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
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDropdownStore } from '@/stores/dropdown'
import { useOvernightFormStore } from '@/stores/overnightParkingFormStore'
import FullScreenLoader from '@/components/FullScreenLoader.vue'

const dropdownStore = useDropdownStore()
const formStoreOvernightParking = useOvernightFormStore()

const { divisionList } = storeToRefs(dropdownStore)
const { fetchDivisions } = dropdownStore

const showSupportingDocumentError = ref(false)
const showErrors = ref(false)
const isDateInvalid = ref(false)
const submitting = ref(false)
const loading = ref(true)

onMounted(async () => {
  fetchDivisions()
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
  loading.value = false
})

function onSupportingDocumentSelect(event) {
  const file = event.files[0]
  if (!file) return

  if (file.type !== 'application/pdf') {
    formStoreOvernightParking.supportingDocumentFileName = null
    showSupportingDocumentError.value = true
    alert('Only PDF files are allowed.')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    // Optional: size validation
    alert('Maximum PDF size is 2MB.')
    return
  }

  showSupportingDocumentError.value = false
  formStoreOvernightParking.supportingDocumentFileName = file.name
  formStoreOvernightParking.supportingDocument = file
}

// File upload handler
function onFileSelect(event) {
  const file = event.files[0]
  if (!file) return

  const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
  const maxSize = 1 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    alert('Only PNG, JPG, or JPEG files are allowed.')
    formStoreOvernightParking.src = null
    return
  }

  if (file.size > maxSize) {
    alert('Maximum file size is 1MB.')
    formStoreOvernightParking.src = null
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    formStoreOvernightParking.src = e.target.result
  }
  reader.readAsDataURL(file)
}

function isValidEmail(email) {
  const allowedDomains = ['@gmail.com', '@dswd.gov.ph']
  const trimmed = email?.trim().toLowerCase()

  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
    allowedDomains.some((domain) => trimmed.endsWith(domain))
  )
}

function submitRequest() {
  showErrors.value = true
  isDateInvalid.value = false

  const f = formStoreOvernightParking
  const errors = []

  if (!f.requestedBy) errors.push('Requested by is required.')
  if (!f.position) errors.push('Position is required.')
  if (!f.contactNo) errors.push('Contact number is required.')
  if (!f.emailOfRequester || !isValidEmail(f.emailOfRequester))
    errors.push('A valid email (gmail.com or dswd.gov.ph) is required.')
  if (!f.division) errors.push('Division is required.')
  if (!f.plateNumber) errors.push('Model and Plate Number of Vehicle is required.')
  if (!f.dateNeeded) errors.push('Date Needed (Start) is required.')
  if (!f.dateEnding) errors.push('Date Needed (End) is required.')
  if (!f.justification) errors.push('Justification is required.')
  if (!f.startTime) errors.push('Time Needed (Start) is required.')
  if (!f.src) errors.push('E-signature is required.')

  // Date validation
  if (f.dateNeeded && f.dateEnding) {
    const start = new Date(f.dateNeeded)
    const end = new Date(f.dateEnding)
    if (end < start) {
      isDateInvalid.value = true
      errors.push('End date must be after start date.')
    }
  }

  if (errors.length) {
    alert(errors.join('\n'))
    return
  }

  submitting.value = true
  setTimeout(() => {
    alert('Form submitted successfully!')
    showErrors.value = false
    submitting.value = false
  }, 1000)
}
</script>
