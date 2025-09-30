<template>
  <FullScreenLoader :visible="loading" message="Loading Entry to DSWD Premises Request Form..." />

  <div v-if="!loading">
    <div
      class="flex flex-col p-4 sm:p-6 md:p-9 lg:p-12 bg-gray-100 rounded-3xl max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto mt-12"
    >
      <!-- Header -->
      <div class="mb-6 text-center w-full">
        <h1 class="text-2xl sm:text-3xl font-bold">REQUEST FOR ENTRY TO DSWD PREMISES</h1>
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
              v-model="entryFormStore.requesting_office"
              :class="{ 'p-invalid': showErrors && !entryFormStore.requesting_office }"
            />
            <label for="requestingOffice"
              >Requesting Office/Unit <span class="text-red-500">*</span></label
            >
          </FloatLabel>

          <FloatLabel class="flex-1">
            <DatePicker
              id="dateRequested"
              class="w-full"
              v-model="entryFormStore.dateRequested"
              :class="{ 'p-invalid': showErrors && !entryFormStore.dateRequested }"
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
            <DatePicker
              id="dateNeeded"
              class="w-full"
              v-model="entryFormStore.dateNeeded"
              :class="{ 'p-invalid': showErrors && !entryFormStore.dateNeeded }"
              showIcon
              fluid
              iconDisplay="input"
            />
            <label for="dateNeeded">Expected Date<span class="text-red-500">*</span></label>
          </FloatLabel>
        </div>
        <!-- Row 3 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <FloatLabel class="flex-1">
            <InputText
              id="requestedBy"
              class="w-full"
              v-model="entryFormStore.requestedBy"
              :class="{ 'p-invalid': showErrors && !entryFormStore.requestedBy }"
            />
            <label for="requestedBy">Requested by <span class="text-red-500">*</span></label>
          </FloatLabel>
          <FloatLabel class="flex-1">
            <InputText
              id="position"
              class="w-full"
              v-model="entryFormStore.position"
              :class="{ 'p-invalid': showErrors && !entryFormStore.position }"
            />
            <label for="position">Position <span class="text-red-500">*</span></label>
          </FloatLabel>
          <FloatLabel class="flex-1">
            <InputMask
              id="contactNo"
              class="w-full"
              v-model="entryFormStore.contactNo"
              mask="0999 999 9999"
              :class="{ 'p-invalid': showErrors && !entryFormStore.contactNo }"
            />
            <label for="contactNo">Contact No. <span class="text-red-500">*</span></label>
          </FloatLabel>

          <FloatLabel class="flex-1">
            <InputText
              id="emailOfRequester"
              v-model="entryFormStore.emailOfRequester"
              class="w-full"
              type="email"
              :class="{
                'p-invalid': showErrors && !isValidEmail(entryFormStore.emailOfRequester),
              }"
              required
            />
            <label for="emailOfRequester"
              >Email of Requester <span class="text-red-500">*</span></label
            >
          </FloatLabel>
        </div>

        <!-- Row 4 -->
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
            :class="{ 'p-invalid': showErrors && !entryFormStore.src }"
          />

          <div v-if="entryFormStore.src" class="mt-4 sm:mt-0">
            <img
              :key="entryFormStore.src"
              :src="entryFormStore.src"
              alt="E-Signature Preview"
              class="shadow-md rounded-xl w-full sm:w-32"
              style="filter: grayscale(100%)"
            />
          </div>
          <div class="text-sm text-gray-500 mt-2">
            Upload your e-signature (PNG, JPG, JPEG) - Max size: 1MB
            <span class="text-red-500">*</span
            ><span v-if="showErrors && !entryFormStore.src" class="text-red-500 block"
              >E-signature is required.</span
            >
          </div>
        </div>

        <hr class="mb-6 border-gray-300" />

        <div class="flex flex-col">
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-4">List of Person/s Requesting for Entry</h2>

            <div
              v-for="(guest, index) in entryFormStore.guests"
              :key="index"
              class="mb-2 flex items-center gap-2"
            >
              <FloatLabel class="flex-1" variant="on">
                <InputText id="guest" v-model="entryFormStore.guests[index].name" class="w-full" />
                <label for="guest">Name</label>
              </FloatLabel>
              <FloatLabel class="flex-1" variant="on">
                <InputText
                  id="project"
                  v-model="entryFormStore.guests[index].project"
                  class="w-full"
                />
                <label for="project">Enter Projects/Work to be done</label>
              </FloatLabel>
              <Button
                icon="pi pi-times"
                severity="danger"
                @click="entryFormStore.removeGuest(index)"
                v-if="entryFormStore.guests.length > 1"
              />
            </div>

            <div class="mt-4 flex gap-2">
              <Button label="Add Guest" icon="pi pi-plus" @click="entryFormStore.addGuest" />
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
import { usePremisesFormStore } from '@/stores/entryToDSWDFormStore'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { ref, onMounted } from 'vue'

const maxGuests = 20
const entryFormStore = usePremisesFormStore()
const showErrors = ref(false)
const submitting = ref(false)
const loading = ref(true)

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
  loading.value = false
})

function onFileSelect(event) {
  const file = event.files[0]
  if (!file) return

  const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
  const maxSize = 1 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    alert('Only PNG, JPG, or JPEG files are allowed.')
    entryFormStore.src = null
    return
  }

  if (file.size > maxSize) {
    alert('Maximum file size is 1MB.')
    entryFormStore.src = null
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    entryFormStore.src = e.target.result
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

  const f = entryFormStore
  const errors = []

  if (!f.requesting_office) errors.push('Requesting Office/Unit is required.')
  if (!f.dateRequested) errors.push('Date Requested is required.')
  if (!f.dateNeeded) errors.push('Expected Date is required.')
  if (!f.requestedBy) errors.push('Requested by is required.')
  if (!f.position) errors.push('Position is required.')
  if (!f.contactNo) errors.push('Contact number is required.')
  if (!f.emailOfRequester || !isValidEmail(f.emailOfRequester)) {
    errors.push('A valid email (gmail.com or dswd.gov.ph) is required.')
  }
  if (!f.src) errors.push('E-signature is required.')

  if (!entryFormStore.guests.length || entryFormStore.guests.some((g) => !g.name || !g.project)) {
    errors.push('Each guest must have a name and a project.')
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
