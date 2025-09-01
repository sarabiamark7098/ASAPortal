<template>
  <FullScreenLoader :visible="loading" message="Loading Janitorial Request Form..." />

  <div v-if="!loading">
    <div
      class="flex flex-col p-4 sm:p-6 md:p-9 lg:p-12 bg-gray-100 rounded-3xl max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto mt-12"
    >
      <!-- Header -->
      <div class="mb-6 text-center w-full">
        <h1 class="text-2xl sm:text-3xl font-bold">REQUEST FOR JANITORIAL SERVICES</h1>
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
              v-model="janitorialFormStore.requestingOffice"
              :class="{ 'p-invalid': showErrors && !janitorialFormStore.requestingOffice }"
            />
            <label for="requestingOffice"
              >Requesting Office/Unit <span class="text-red-500">*</span></label
            >
          </FloatLabel>

          <FloatLabel class="flex-1">
            <InputText
              id="purpose"
              class="w-full"
              v-model="janitorialFormStore.purpose"
              :class="{ 'p-invalid': showErrors && !janitorialFormStore.purpose }"
            />
            <label for="purpose">Purpose <span class="text-red-500">*</span></label>
          </FloatLabel>
        </div>

        <!-- Row 3: Date & Time -->
        <div class="flex flex-col sm:flex-row gap-6">
          <FloatLabel class="flex-1">
            <InputText
              id="utilityWorker"
              class="w-full"
              v-model="janitorialFormStore.utilityWorker"
              :class="{ 'p-invalid': showErrors && !janitorialFormStore.utilityWorker }"
              type="number"
            />
            <label for="utilityWorker"
              >Number of Utility Workers <span class="text-red-500">*</span></label
            >
          </FloatLabel>

          <FloatLabel class="flex-1">
            <DatePicker
              id="dateNeeded"
              class="w-full"
              v-model="janitorialFormStore.dateNeeded"
              :class="{ 'p-invalid': showErrors && !janitorialFormStore.dateNeeded }"
              showIcon
              fluid
              iconDisplay="input"
            />
            <label for="dateNeeded">Date Needed <span class="text-red-500">*</span></label>
          </FloatLabel>

          <FloatLabel class="flex-1">
            <DatePicker
              id="startTime"
              class="w-full"
              v-model="janitorialFormStore.startTime"
              :class="{ 'p-invalid': showErrors && !janitorialFormStore.startTime }"
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
            <label for="startTime">Time Needed <span class="text-red-500">*</span></label>
          </FloatLabel>
        </div>

        <!-- Row 4 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <FloatLabel class="flex-1">
            <InputText
              id="assignment"
              class="w-full"
              v-model="janitorialFormStore.assignment"
              :class="{ 'p-invalid': showErrors && !janitorialFormStore.assignment }"
              autoResize
              rows="2"
            />
            <label for="assignment">Place of Assignment <span class="text-red-500">*</span></label>
          </FloatLabel>

          <FloatLabel class="flex-1">
            <InputText
              id="fund"
              class="w-full"
              v-model="janitorialFormStore.fund"
              autoResize
              rows="2"
            />
            <label for="fund">Fund to charge payment for Overtime (if any)</label>
          </FloatLabel>
        </div>

        <!-- Row 5 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <FloatLabel class="flex-1">
            <InputText
              id="officeHead"
              class="w-full"
              v-model="janitorialFormStore.officeHead"
              :class="{ 'p-invalid': showErrors && !janitorialFormStore.officeHead }"
            />
            <label for="officeHead"
              >Head of Requesting Office <span class="text-red-500">*</span></label
            >
          </FloatLabel>
        </div>

        <!-- Row 5 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <FloatLabel class="flex-1">
            <InputText
              id="requestedBy"
              class="w-full"
              v-model="janitorialFormStore.requestedBy"
              :class="{ 'p-invalid': showErrors && !janitorialFormStore.requestedBy }"
            />
            <label for="requestedBy">Requested by <span class="text-red-500">*</span></label>
          </FloatLabel>
          <FloatLabel class="flex-1">
            <InputText
              id="position"
              class="w-full"
              v-model="janitorialFormStore.position"
              :class="{ 'p-invalid': showErrors && !janitorialFormStore.position }"
            />
            <label for="position">Position <span class="text-red-500">*</span></label>
          </FloatLabel>
          <FloatLabel class="flex-1">
            <InputMask
              id="contactNo"
              class="w-full"
              v-model="janitorialFormStore.contactNo"
              mask="0999 999 9999"
              :class="{ 'p-invalid': showErrors && !janitorialFormStore.contactNo }"
            />
            <label for="contactNo">Contact No. <span class="text-red-500">*</span></label>
          </FloatLabel>

          <FloatLabel class="flex-1">
            <InputText
              id="emailOfRequester"
              v-model="janitorialFormStore.emailOfRequester"
              class="w-full"
              type="email"
              :class="{
                'p-invalid': showErrors && !isValidEmail(janitorialFormStore.emailOfRequester),
              }"
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
            :class="{ 'p-invalid': showErrors && !janitorialFormStore.src }"
          />

          <div v-if="janitorialFormStore.src" class="mt-4 sm:mt-0">
            <img
              :key="janitorialFormStore.src"
              :src="janitorialFormStore.src"
              alt="E-Signature Preview"
              class="shadow-md rounded-xl w-full sm:w-32"
              style="filter: grayscale(100%)"
            />
          </div>
          <div class="text-sm text-gray-500 mt-2">
            Upload your e-signature (PNG, JPG, JPEG) - Max size: 1MB
            <span class="text-red-500">*</span
            ><span v-if="showErrors && !janitorialFormStore.src" class="text-red-500 block"
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
  </div>
</template>
<script setup>
import { useJanitorialFormStore } from '@/stores/janitorialFormStore' // your Pinia store
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Pinia store holding form data
const janitorialFormStore = useJanitorialFormStore()
const router = useRouter()

const showErrors = ref(false)
const submitting = ref(false)
const loading = ref(true)

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
  loading.value = false
})

// Validate email with custom domain rules (example)
function isValidEmail(email) {
  const allowedDomains = ['@gmail.com', '@dswd.gov.ph']
  const trimmed = email?.trim().toLowerCase()
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
    allowedDomains.some((domain) => trimmed.endsWith(domain))
  )
}

// Handle e-signature file select
function onFileSelect(event) {
  const file = event.files[0]
  if (!file) return

  const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
  const maxSize = 1 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    alert('Only PNG, JPG, or JPEG files are allowed.')
    janitorialFormStore.src = null
    return
  }

  if (file.size > maxSize) {
    alert('Maximum file size is 1MB.')
    janitorialFormStore.src = null
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    janitorialFormStore.src = e.target.result
  }
  reader.readAsDataURL(file)
}

// Form submit handler with validation
function submitRequest() {
  showErrors.value = true
  const f = janitorialFormStore
  const errors = []

  if (!f.requestingOffice) errors.push('Requesting Office/Unit is required.')
  if (!f.purpose) errors.push('Purpose is required.')
  if (!f.utilityWorker) errors.push('Number of Utility Workers is required.')
  if (!f.dateNeeded) errors.push('Date Needed is required.')
  if (!f.startTime) errors.push('Time Needed is required.')
  if (!f.assignment) errors.push('Place of Assignment is required.')
  if (!f.officeHead) errors.push('Head of Requesting Office is required.')
  if (!f.requestedBy) errors.push('Requested by is required.')
  if (!f.position) errors.push('Position is required.')
  if (!f.contactNo) errors.push('Contact No. is required.')
  if (!f.emailOfRequester || !isValidEmail(f.emailOfRequester))
    errors.push('A valid email (gmail.com or dswd.gov.ph) is required.')
  if (!f.src) errors.push('E-signature is required.')

  if (errors.length) {
    alert(errors.join('\n'))
    return
  }

  submitting.value = true

  // Simulate API call or actual submission here
  setTimeout(() => {
    alert('Form submitted successfully!')
    showErrors.value = false
    submitting.value = false
    janitorialFormStore.$reset() // Reset Pinia form state if you want
    router.push('/client') // Redirect after submission
  }, 1000)
}
</script>
