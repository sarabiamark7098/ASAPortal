<template>
  <FullScreenLoader :visible="loading" message="Loading Conference Room Request Form..." />

  <div v-if="!loading">
    <div
      class="flex flex-col p-4 sm:p-6 md:p-9 lg:p-12 bg-gray-100 rounded-3xl max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto mt-12"
    >
      <!-- Header -->
      <div class="mb-6 text-center w-full">
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
          <FloatLabel class="flex-1">
            <InputText
              id="requestingOffice"
              class="w-full"
              v-model="conferenceFormStore.requestingOffice"
              :class="{ 'p-invalid': showErrors && !conferenceFormStore.requestingOffice }"
            />
            <label for="requestingOffice"
              >Requesting Office/Unit <span class="text-red-500">*</span></label
            >
          </FloatLabel>

          <FloatLabel class="flex-1">
            <DatePicker
              id="dateRequested"
              class="w-full"
              v-model="conferenceFormStore.dateRequested"
              :class="{ 'p-invalid': showErrors && !conferenceFormStore.dateRequested }"
              showIcon
              fluid
              iconDisplay="input"
            />
            <label for="dateRequested">Date Requested <span class="text-red-500">*</span></label>
          </FloatLabel>
        </div>

        <!-- Row 2  -->
        <div>
          <FloatLabel>
            <Textarea
              id="purpose"
              class="w-full"
              v-model="conferenceFormStore.purpose"
              :class="{ 'p-invalid': showErrors && !conferenceFormStore.purpose }"
              autoResize
              rows="2"
            />
            <label for="purpose">Purpose <span class="text-red-500">*</span></label>
          </FloatLabel>
        </div>

        <!-- Row 3 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <FloatLabel class="flex-1">
            <DatePicker
              id="dateNeeded"
              class="w-full"
              v-model="conferenceFormStore.dateNeeded"
              :class="{ 'p-invalid': showErrors && !conferenceFormStore.dateNeeded }"
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
              v-model="conferenceFormStore.dateEnding"
              :class="[
                'w-full',
                (showErrors && !conferenceFormStore.dateEnding) || isDateInvalid
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
        <div class="flex flex-col sm:flex-row gap-6">
          <FloatLabel class="flex-1">
            <DatePicker
              id="timeNeeded"
              class="w-full"
              v-model="conferenceFormStore.timeNeeded"
              :class="{ 'p-invalid': showErrors && !conferenceFormStore.timeNeeded }"
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
            <label for="timeNeeded">Time Needed (Start) <span class="text-red-500">*</span></label>
          </FloatLabel>

          <FloatLabel class="flex-1">
            <DatePicker
              id="timeEnding"
              class="w-full"
              v-model="conferenceFormStore.timeEnding"
              :class="{ 'p-invalid': showErrors && !conferenceFormStore.timeEnding }"
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

            <label for="timeEnding">Time Needed (End) <span class="text-red-500">*</span></label>
          </FloatLabel>
        </div>

        <!-- Row 5 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <FloatLabel class="flex-1">
            <InputText
              id="numberOfPersons"
              v-model="conferenceFormStore.numberOfPersons"
              class="w-full"
              :class="{ 'p-invalid': showErrors && !conferenceFormStore.numberOfPersons }"
              required
              type="text"
            />
            <label for="numberofPersons">No. of Persons <span class="text-red-500">*</span></label>
          </FloatLabel>
          <FloatLabel class="flex-1">
            <InputText
              id="focal"
              v-model="conferenceFormStore.focal"
              class="w-full"
              :class="{ 'p-invalid': showErrors && !conferenceFormStore.focal }"
              required
            />
            <label for="focal">Focal Person<span class="text-red-500">*</span></label>
          </FloatLabel>
        </div>

        <hr class="border-gray-300" />
        <!-- Row 1 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <Select
              id="selectedConferenceRoom"
              v-model="conferenceFormStore.selectedConferenceRoom"
              :options="Rooms"
              showClear
              optionLabel="name"
              placeholder="Select Conference Room"
              class="w-full"
              :class="{ 'p-invalid': showErrors && !conferenceFormStore.selectedConferenceRoom }"
            />
          </div>
        </div>

        <hr class="border-gray-300" />
        <!-- Row 1 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <div class="flex flex-col gap-6">
              <FloatLabel class="flex-1">
                <InputText
                  id="requestedBy"
                  class="w-full"
                  v-model="conferenceFormStore.requestedBy"
                  :class="{ 'p-invalid': showErrors && !conferenceFormStore.requestedBy }"
                />
                <label for="requestedBy">Requested by <span class="text-red-500">*</span></label>
              </FloatLabel>
              <FloatLabel class="flex-1">
                <InputText
                  id="position"
                  class="w-full"
                  v-model="conferenceFormStore.position"
                  :class="{ 'p-invalid': showErrors && !conferenceFormStore.position }"
                />
                <label for="position">Position <span class="text-red-500">*</span></label>
              </FloatLabel>
              <FloatLabel class="flex-1">
                <InputMask
                  id="contactNo"
                  class="w-full"
                  v-model="conferenceFormStore.contactNo"
                  mask="0999 999 9999"
                  :class="{ 'p-invalid': showErrors && !conferenceFormStore.contactNo }"
                />
                <label for="contactNo">Contact No. <span class="text-red-500">*</span></label>
              </FloatLabel>

              <FloatLabel class="flex-1">
                <InputText
                  id="emailOfRequester"
                  v-model="conferenceFormStore.emailOfRequester"
                  class="w-full"
                  type="email"
                  :class="{
                    'p-invalid': showErrors && !isValidEmail(conferenceFormStore.emailOfRequester),
                  }"
                  required
                />
                <label for="emailOfRequester"
                  >Email of Requester <span class="text-red-500">*</span></label
                >
              </FloatLabel>
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
                :class="{ 'p-invalid': showErrors && !conferenceFormStore.src }"
              />

              <div v-if="conferenceFormStore.src" class="mt-4 sm:mt-0">
                <img
                  :key="conferenceFormStore.src"
                  :src="conferenceFormStore.src"
                  alt="E-Signature Preview"
                  class="shadow-md rounded-xl w-full sm:w-32"
                  style="filter: grayscale(100%)"
                />
              </div>
              <div v-if="!conferenceFormStore.src" class="text-sm text-gray-500 mt-2">
                Upload your e-signature (PNG, JPG, JPEG) - Max size: 1MB
                <span class="text-red-500">*</span
                ><span v-if="showErrors && !conferenceFormStore.src" class="text-red-500 block"
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
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { useConferenceFormStore } from '@/stores/conferenceFormStore'
import { ref, onMounted } from 'vue'

const conferenceFormStore = useConferenceFormStore()

const showErrors = ref(false)
const isDateInvalid = ref(false)
const submitting = ref(false)
const loading = ref(true)

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
  loading.value = false
})

const Rooms = ref([
  { name: 'Magiting Conference Room', code: 'Magiting' },
  { name: 'Maagap Conference Room', code: 'Maagap' },
  { name: 'Seminar Hall', code: 'Seminar' },
])

function isValidEmail(email) {
  const allowedDomains = ['@gmail.com', '@dswd.gov.ph']
  const trimmed = email?.trim().toLowerCase()

  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
    allowedDomains.some((domain) => trimmed.endsWith(domain))
  )
}

function onFileSelect(event) {
  const file = event.files[0]
  if (!file) return

  const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
  const maxSize = 1 * 1024 * 1024 // 1MB

  if (!validTypes.includes(file.type)) {
    alert('Only PNG, JPG, or JPEG files are allowed.')
    conferenceFormStore.src = null
    return
  }

  if (file.size > maxSize) {
    alert('Maximum file size is 1MB.')
    conferenceFormStore.src = null
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    conferenceFormStore.src = e.target.result
  }
  reader.readAsDataURL(file)
}

function submitRequest() {
  showErrors.value = true
  isDateInvalid.value = false

  const errors = []
  const form = conferenceFormStore

  if (!form.requestingOffice) errors.push('Requesting Office/Unit is required.')
  if (!form.dateRequested) errors.push('Date Requested is required.')
  if (!form.purpose) errors.push('Purpose is required.')
  if (!form.dateNeeded) errors.push('Date Needed (Start) is required.')
  if (!form.dateEnding) errors.push('Date Needed (End) is required.')
  if (!form.timeNeeded) errors.push('Time Needed (Start) is required.')
  if (!form.timeEnding) errors.push('Time Needed (End) is required.')
  if (!form.numberOfPersons) errors.push('No. of Persons is required.')
  if (!form.focal) errors.push('Focal Person is required.')
  if (!form.selectedConferenceRoom) errors.push('Please select a Conference Room.')
  if (!form.requestedBy) errors.push('Requested by is required.')
  if (!form.position) errors.push('Position is required.')
  if (!form.contactNo) errors.push('Contact number is required.')
  if (!form.emailOfRequester || !isValidEmail(form.emailOfRequester))
    errors.push('A valid email (gmail.com or dswd.gov.ph) is required.')
  if (!form.src) errors.push('E-signature is required.')

  if (form.dateNeeded && form.dateEnding && form.dateEnding < form.dateNeeded) {
    errors.push('End date cannot be earlier than start date.')
    isDateInvalid.value = true
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
