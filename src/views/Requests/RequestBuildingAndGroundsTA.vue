<template>
  <div
    class="flex flex-col p-4 sm:p-6 md:p-9 lg:p-12 bg-gray-100 rounded-3xl max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto mt-12"
  >
    <!-- Header -->
    <div class="mb-6 text-center w-full">
      <h1 class="text-2xl sm:text-3xl font-bold">
        REQUEST FOR TECHNICAL ASSISTANCE RELATIVE TO BUILDING AND GROUNDS MANAGEMENT
      </h1>
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
          <InputText id="drn" class="w-full" v-model="drn" />
          <label for="drn">DRN</label>
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

      <!-- Row 2 -->
      <div class="flex flex-col sm:flex-row gap-6">
        <div class="flex-1">
          <label for="RequestType">Type of Request <span class="text-red-500">*</span></label>
          <div id="RequestType" class="flex flex-col pt-2">
            <div
              v-for="category in RequestTypeCategories"
              :key="category.key"
              class="flex items-center gap-2"
            >
              <Checkbox
                v-model="selectedRequestTypeCategories"
                :inputId="category.key"
                name="RequestTypeCategories"
                :value="category.name"
              />
              <label :for="category.key">{{ category.name }}</label>
            </div>
          </div>
        </div>
        <div class="flex-1">
          <label for="RequestNature">Nature of Request <span class="text-red-500">*</span></label>
          <div id="RequestNature" class="flex flex-col pt-2">
            <div
              v-for="category of RequestNatureCategories"
              :key="category.key"
              class="flex items-center gap-2"
            >
              <Checkbox
                v-model="selectedRequestNatureCategories"
                :inputId="category.key"
                name="RequestNatureCategories"
                :value="category.name"
              />
              <label :for="category.key">{{ category.name }}</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 3  -->
      <div>
        <FloatLabel>
          <Textarea
            id="requestDetail"
            class="w-full"
            v-model="requestDetail"
            :class="{ 'p-invalid': showErrors && !requestDetail }"
            autoResize
            rows="2"
          />
          <label for="requestDetail"
            >Complete Details of the Request <span class="text-red-500">*</span></label
          >
        </FloatLabel>
      </div>

      <!-- Row 4 -->
      <div class="flex flex-col sm:flex-row gap-6">
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
          <InputText
            id="position"
            class="w-full"
            v-model="position"
            :class="{ 'p-invalid': showErrors && !position }"
          />
          <label for="position">Position <span class="text-red-500">*</span></label>
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

      <!-- Row 5 -->
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
        <div class="text-sm text-gray-500 mt-2">
          Upload your e-signature (PNG, JPG, JPEG) - Max size: 1MB
          <span class="text-red-500">*</span
          ><span v-if="showErrors && !src" class="text-red-500 block"
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
import { ref } from 'vue'

const requestingOffice = ref('')
const drn = ref('')
const dateRequested = ref(new Date())
const requestDetail = ref('')
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

  const errors = []

  if (!requestingOffice.value) errors.push('Requesting Office/Unit is required.')
  if (!dateRequested.value) errors.push('Date Requested is required.')
  if (!selectedRequestTypeCategories.value.length)
    errors.push('Please select at least one Type of Request.')
  if (!selectedRequestNatureCategories.value.length)
    errors.push('Please select at least one Nature of Request.')
  if (!requestDetail.value) errors.push('Complete request details are required.')
  if (!requestedBy.value) errors.push('Requested by is required.')
  if (!position.value) errors.push('Position is required.')
  if (!contactNo.value) errors.push('Contact number is required.')
  if (!emailOfRequester.value || !isValidEmail(emailOfRequester.value))
    errors.push('A valid email (gmail.com or dswd.gov.ph) is required.')
  if (!src.value) errors.push('E-signature is required.')

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
