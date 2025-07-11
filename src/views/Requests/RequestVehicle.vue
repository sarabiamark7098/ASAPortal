<template>
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
        Note: Request for use of vehicle shall be made at least two (2) days from the intended date
        of use. Failure to use the vehicle at the given date/time forfeits one’s right to use the
        vehicle assigned.
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
        <FloatLabel class="flex-1">
          <InputText
            id="requestingOffice"
            class="w-full"
            v-model="formStoreVehicle.requestingOffice"
            :class="{ 'p-invalid': showErrors && !formStoreVehicle.requestingOffice }"
          />
          <label for="requestingOffice"
            >Requesting Office/Unit <span class="text-red-500">*</span></label
          >
        </FloatLabel>

        <FloatLabel class="flex-1">
          <InputText
            id="purpose"
            class="w-full"
            v-model="formStoreVehicle.purpose"
            :class="{ 'p-invalid': showErrors && !formStoreVehicle.purpose }"
          />
          <label for="purpose">Purpose of Trip <span class="text-red-500">*</span></label>
        </FloatLabel>
      </div>

      <!-- Row 2 -->
      <div>
        <FloatLabel>
          <Textarea
            id="passengers"
            class="w-full"
            v-model="formStoreVehicle.passengers"
            :class="{ 'p-invalid': showErrors && !formStoreVehicle.passengers }"
            autoResize
            rows="2"
          />
          <label for="passengers">Name of Passengers <span class="text-red-500">*</span></label>
        </FloatLabel>
      </div>

      <!-- Row 3: Date & Time -->
      <div class="flex flex-col sm:flex-row gap-6">
        <FloatLabel class="flex-1">
          <DatePicker
            id="dateNeeded"
            class="w-full"
            v-model="formStoreVehicle.dateNeeded"
            :class="{ 'p-invalid': showErrors && !formStoreVehicle.dateNeeded }"
            showIcon
            fluid
            iconDisplay="input"
          />
          <label for="dateNeeded">Date Needed (Start) <span class="text-red-500">*</span></label>
        </FloatLabel>

        <FloatLabel class="flex-1">
          <DatePicker
            id="startTime"
            class="w-full"
            v-model="formStoreVehicle.startTime"
            :class="{ 'p-invalid': showErrors && !formStoreVehicle.startTime }"
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

        <FloatLabel class="flex-1">
          <DatePicker
            id="dateEnding"
            class="w-full"
            v-model="formStoreVehicle.dateEnding"
            :class="[
              'w-full',
              (showErrors && !formStoreVehicle.dateEnding) || isDateInvalid
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

      <!-- Row 4 -->
      <div>
        <FloatLabel>
          <Textarea
            id="placeOfTravel"
            class="w-full"
            v-model="formStoreVehicle.placeOfTravel"
            :class="{ 'p-invalid': showErrors && !formStoreVehicle.placeOfTravel }"
            autoResize
            rows="2"
          />
          <label for="placeOfTravel">Place of Travel <span class="text-red-500">*</span></label>
        </FloatLabel>
      </div>

      <!-- Row 5 -->
      <div class="flex flex-col sm:flex-row gap-6">
        <FloatLabel class="flex-1">
          <InputText
            id="requestedBy"
            class="w-full"
            v-model="formStoreVehicle.requestedBy"
            :class="{ 'p-invalid': showErrors && !formStoreVehicle.requestedBy }"
          />
          <label for="requestedBy">Requested by <span class="text-red-500">*</span></label>
        </FloatLabel>
        <FloatLabel class="flex-1">
          <InputMask
            id="contactNo"
            class="w-full"
            v-model="formStoreVehicle.contactNo"
            mask="0999 999 9999"
            :class="{ 'p-invalid': showErrors && !formStoreVehicle.contactNo }"
          />
          <label for="contactNo">Contact No. <span class="text-red-500">*</span></label>
        </FloatLabel>

        <FloatLabel class="flex-1">
          <InputText
            id="emailOfRequester"
            v-model="formStoreVehicle.emailOfRequester"
            class="w-full"
            type="email"
            :class="{ 'p-invalid': showErrors && !isValidEmail(formStoreVehicle.emailOfRequester) }"
            required
          />
          <label for="emailOfRequester"
            >Email of Requester <span class="text-red-500">*</span></label
          >
        </FloatLabel>
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
          :class="{ 'p-invalid': showErrors && !formStoreVehicle.src }"
        />

        <div v-if="formStoreVehicle.src" class="mt-4 sm:mt-0">
          <img
            :key="formStoreVehicle.src"
            :src="formStoreVehicle.src"
            alt="E-Signature Preview"
            class="shadow-md rounded-xl w-full sm:w-32"
            style="filter: grayscale(100%)"
          />
        </div>
        <div class="text-sm text-gray-500 mt-2">
          Upload your e-signature (PNG, JPG, JPEG) - Max size: 1MB
          <span class="text-red-500">*</span
          ><span v-if="showErrors && !formStoreVehicle.src" class="text-red-500 block"
            >E-signature is required.</span
          >
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
</template>

<script setup>
import { useVehicleFormStore } from '@/stores/vehicleFormStore'
import { ref } from 'vue'

const formStoreVehicle = useVehicleFormStore()

const showErrors = ref(false)
const isDateInvalid = ref(false)
const submitting = ref(false)

// File upload handler
function onFileSelect(event) {
  const file = event.files[0]
  if (!file) return

  const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
  const maxSize = 1 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    alert('Only PNG, JPG, or JPEG files are allowed.')
    formStoreVehicle.src = null
    return
  }

  if (file.size > maxSize) {
    alert('Maximum file size is 1MB.')
    formStoreVehicle.src = null
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    formStoreVehicle.src = e.target.result
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

  const f = formStoreVehicle
  const errors = []

  if (!f.requestingOffice) errors.push('Requesting Office/Unit is required.')
  if (!f.purpose) errors.push('Purpose is required.')
  if (!f.passengers) errors.push('Passenger(s) field is required.')
  if (!f.dateNeeded) errors.push('Date Needed (Start) is required.')
  if (!f.dateEnding) errors.push('Date Needed (End) is required.')
  if (!f.startTime) errors.push('Time Needed (Start) is required.')
  if (!f.placeOfTravel) errors.push('Place of Travel is required.')
  if (!f.requestedBy) errors.push('Requested by is required.')
  if (!f.contactNo) errors.push('Contact number is required.')
  if (!f.emailOfRequester || !isValidEmail(f.emailOfRequester))
    errors.push('A valid email (gmail.com or dswd.gov.ph) is required.')
  if (!f.src) errors.push('E-signature is required.')

  if (f.dateNeeded && f.dateEnding) {
    if (new Date(f.dateEnding) < new Date(f.dateNeeded)) {
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
    submitting.value = false
  }, 1000)
}
</script>
