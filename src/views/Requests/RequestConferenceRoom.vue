<template>
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
            v-model="requestingOffice"
            :class="{ 'p-invalid': showErrors && !requestingOffice }"
          />
          <label for="requestingOffice"
            >Requesting Office/Unit <span class="text-red-500">*</span></label
          >
        </FloatLabel>

        <FloatLabel class="flex-1">
          <DatePicker
            id="dateRequested"
            class="w-full"
            v-model="dateRequested"
            :class="{ 'p-invalid': showErrors && !dateRequested }"
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
            v-model="purpose"
            :class="{ 'p-invalid': showErrors && !purpose }"
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
            v-model="dateNeeded"
            :class="{ 'p-invalid': showErrors && !dateNeeded }"
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
            v-model="dateEnding"
            :class="[
              'w-full',
              (showErrors && !dateEnding) || isDateInvalid
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
            v-model="timeNeeded"
            :class="{ 'p-invalid': showErrors && !timeNeeded }"
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
            v-model="timeEnding"
            :class="{ 'p-invalid': showErrors && !timeEnding }"
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
            v-model="numberOfPersons"
            class="w-full"
            :class="{ 'p-invalid': showErrors && !numberOfPersons }"
            required
            type="text"
          />
          <label for="numberofPersons">No. of Persons <span class="text-red-500">*</span></label>
        </FloatLabel>
        <FloatLabel class="flex-1">
          <InputText
            id="focal"
            v-model="focal"
            class="w-full"
            :class="{ 'p-invalid': showErrors && !focal }"
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
            v-model="selectedConferenceRoom"
            :options="Rooms"
            showClear
            optionLabel="name"
            placeholder="Select Conference Room"
            class="w-full"
            :class="{ 'p-invalid': showErrors && !selectedConferenceRoom }"
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
                v-model="requestedBy"
                :class="{ 'p-invalid': showErrors && !requestedBy }"
              />
              <label for="requestedBy">Requested by <span class="text-red-500">*</span></label>
            </FloatLabel>
            <FloatLabel class="flex-1">
              <InputMask
                id="contactNo"
                class="w-full"
                v-model="contactNo"
                mask="0999 999 9999"
                :class="{ 'p-invalid': showErrors && !contactNo }"
              />
              <label for="contactNo">Contact No. <span class="text-red-500">*</span></label>
            </FloatLabel>

            <FloatLabel class="flex-1">
              <InputText
                id="emailOfRequester"
                v-model="emailOfRequester"
                class="w-full"
                type="email"
                :class="{ 'p-invalid': showErrors && !isValidEmail(emailOfRequester) }"
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
              :class="{ 'p-invalid': showErrors && !src }"
            />

            <div v-if="src" class="mt-4 sm:mt-0">
              <img
                :key="src"
                :src="src"
                alt="E-Signature Preview"
                class="shadow-md rounded-xl w-full sm:w-32"
                style="filter: grayscale(100%)"
              />
            </div>
            <div v-if="!src" class="text-sm text-gray-500 mt-2">
              Upload your e-signature (PNG, JPG, JPEG) - Max size: 1MB
              <span class="text-red-500">*</span
              ><span v-if="showErrors && !src" class="text-red-500 block"
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
</template>

<script setup>
import { ref } from 'vue'

const requestingOffice = ref('')
const dateRequested = ref(new Date())
const purpose = ref('')
const dateNeeded = ref(null)
const dateEnding = ref(null)
const timeNeeded = ref(null)
const timeEnding = ref(null)
const numberOfPersons = ref('')
const focal = ref('')
const selectedConferenceRoom = ref('')
const requestedBy = ref('')
const position = ref('')
const contactNo = ref('')
const emailOfRequester = ref('')
const src = ref(null)

const selectedRequestTypeCategories = ref([])
const selectedRequestNatureCategories = ref([])
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
  { name: 'Varnishing', key: 'Varnishing' },
  { name: 'Other', key: 'Other' },
])

const showErrors = ref(false)
const isDateInvalid = ref(false)

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
    src.value = null
    return
  }

  if (file.size > maxSize) {
    alert('Maximum file size is 1MB.')
    src.value = null
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    src.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const submitting = ref(false)

function submitRequest() {
  showErrors.value = true
  isDateInvalid.value = false

  const errors = []

  if (!requestingOffice.value) errors.push('Requesting Office/Unit is required.')
  if (!dateRequested.value) errors.push('Date Requested is required.')
  if (!purpose.value) errors.push('Purpose is required.')
  if (!dateNeeded.value) errors.push('Date Needed (Start) is required.')
  if (!dateEnding.value) errors.push('Date Needed (End) is required.')
  if (!timeNeeded.value) errors.push('Time Needed (Start) is required.')
  if (!timeEnding.value) errors.push('Time Needed (End) is required.')
  if (!numberOfPersons.value) errors.push('No. of Persons is required.')
  if (!focal.value) errors.push('Focal Person is required.')
  if (!selectedConferenceRoom.value) errors.push('Please select a Conference Room.')
  if (!requestedBy.value) errors.push('Requested by is required.')
  if (!contactNo.value) errors.push('Contact number is required.')
  if (!emailOfRequester.value || !isValidEmail(emailOfRequester.value))
    errors.push('A valid email (gmail.com or dswd.gov.ph) is required.')
  if (!src.value) errors.push('E-signature is required.')

  if (dateNeeded.value && dateEnding.value && dateEnding.value < dateNeeded.value) {
    errors.push('End date cannot be earlier than start date.')
    isDateInvalid.value = true
  }

  if (errors.length) {
    alert(errors.join('\n'))
    return
  }
  submitting.value = true
  // simulate API call
  setTimeout(() => {
    alert('Form submitted successfully!')
    submitting.value = false
  }, 1000)
}
</script>
