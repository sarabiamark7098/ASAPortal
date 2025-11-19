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
          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="requestingOffice"
                class="w-full"
                v-model="form.requesting_office"
                :class="{ 'p-invalid': v$.requesting_office.$error }"
              />
              <label for="requestingOffice"
                >Requesting Office/Unit <span class="text-red-500">*</span></label
              >
            </FloatLabel>
            <small v-if="v$.requesting_office.$error" class="text-red-500">Required</small>
          </div>
          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="purpose"
                class="w-full"
                v-model="form.purpose"
                :class="{ 'p-invalid': v$.purpose.$error }"
              />
              <label for="purpose">Purpose <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.purpose.$error" class="text-red-500">Required</small>
          </div>
        </div>

        <!-- Row 2 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="utilityWorker"
                class="w-full"
                type="number"
                v-model.number="form.count_utility"
                :class="{ 'p-invalid': v$.count_utility.$error }"
                min="1"
                max="3"
              />
              <label for="utilityWorker">
                Number of Utility Workers <span class="text-red-500">*</span>
              </label>
            </FloatLabel>

            <small v-if="v$.count_utility.$error" class="text-red-500">
              <span v-if="v$.count_utility.$errors.some((e) => e.$validator === 'required')">
                This field is required
              </span>
              <span v-if="v$.count_utility.$errors.some((e) => e.$validator === 'minValue')">
                Must be at least 1
              </span>
              <span v-if="v$.count_utility.$errors.some((e) => e.$validator === 'maxValue')">
                Must not exceed 3
              </span>
            </small>
          </div>
          <div class="flex-1">
            <FloatLabel>
              <DatePicker
                id="dateNeeded"
                class="w-full"
                v-model="form.requested_date"
                :class="{ 'p-invalid': v$.requested_date.$error }"
                showIcon
                fluid
                iconDisplay="input"
              />
              <label for="dateNeeded">Date Needed <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requested_date.$error" class="text-red-500">Required</small>
          </div>

          <div class="flex-1">
            <FloatLabel>
              <DatePicker
                id="startTime"
                class="w-full"
                v-model="form.requested_time"
                :class="{ 'p-invalid': v$.requested_time.$error }"
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
            <small v-if="v$.requested_time.$error" class="text-red-500">Required</small>
          </div>
        </div>

        <!-- Row 3 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="assignment"
                class="w-full"
                v-model="form.location"
                :class="{ 'p-invalid': v$.location.$error }"
              />
              <label for="assignment"
                >Place of Assignment <span class="text-red-500">*</span></label
              >
            </FloatLabel>
            <small v-if="v$.location.$error" class="text-red-500">Required</small>
          </div>
          <div class="flex-1">
            <FloatLabel>
              <InputText id="fund" class="w-full" v-model="form.fund_source" />
              <label for="fund">Fund to charge payment for Overtime (if any)</label>
            </FloatLabel>
          </div>
        </div>

        <!-- Row 4 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="officeHead"
                class="w-full"
                v-model="form.office_head"
                :class="{ 'p-invalid': v$.office_head.$error }"
              />
              <label for="officeHead"
                >Head of Requesting Office <span class="text-red-500">*</span></label
              >
            </FloatLabel>
            <small v-if="v$.office_head.$error" class="text-red-500">Required</small>
          </div>
        </div>

        <!-- Row 5 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="requestedBy"
                class="w-full"
                v-model="form.requester_name"
                :class="{ 'p-invalid': v$.requester_name.$error }"
              />
              <label for="requestedBy">Requested by <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_name.$error" class="text-red-500">Required</small>
          </div>

          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="position"
                class="w-full"
                v-model="form.requester_position"
                :class="{ 'p-invalid': v$.requester_position.$error }"
              />
              <label for="position">Position <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_position.$error" class="text-red-500">Required</small>
          </div>

          <div class="flex-1">
            <FloatLabel>
              <InputMask
                id="contactNo"
                class="w-full"
                mask="0999 999 9999"
                v-model="form.requester_contact_number"
                :class="{ 'p-invalid': v$.requester_contact_number.$error }"
              />
              <label for="contactNo">Contact No. <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_contact_number.$error" class="text-red-500">Required</small>
          </div>

          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="emailOfRequester"
                v-model="form.requester_email"
                class="w-full"
                type="email"
                :class="{ 'p-invalid': v$.requester_email.$error }"
              />
              <label for="emailOfRequester"
                >Email of Requester <span class="text-red-500">*</span></label
              >
            </FloatLabel>
            <small v-if="v$.requester_email.$error" class="text-red-500">
              {{ v$.requester_email.$errors[0].$message }}
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

          <div v-if="form.preview" class="mt-4 sm:mt-0">
            <img
              :key="form.preview"
              :src="form.preview"
              alt="E-Signature Preview"
              class="shadow-md rounded-xl w-full sm:w-32"
              style="filter: grayscale(100%)"
            />
          </div>
          <div class="text-sm text-gray-500 mt-2">
            <div>
              Upload your e-signature (PNG, JPG, JPEG) - Max size: 1MB
              <span class="text-red-500">*</span>
            </div>
            <div>
              <small v-if="v$.src.$error" class="text-red-500">E-signature is required</small>
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
import { useJanitorialRequestFormStore } from '@/stores/janitorialRequestFormStore'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { required, email, helpers, numeric, minValue, maxValue } from '@vuelidate/validators'

const form = useJanitorialRequestFormStore()
const router = useRouter()

const submitting = ref(false)
const loading = ref(true)

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  loading.value = false
})

// Custom email domain validator
const emailDomain = helpers.withMessage('Email must be gmail.com or dswd.gov.ph', (value) => {
  if (!value) return false
  const trimmed = value.trim().toLowerCase()
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
    (trimmed.endsWith('@gmail.com') || trimmed.endsWith('@dswd.gov.ph'))
  )
})

const rules = computed(() => ({
  requesting_office: { required },
  purpose: { required },
  count_utility: { required, numeric, minValue: minValue(1), maxValue: maxValue(3) },
  requested_date: { required },
  requested_time: { required },
  location: { required },
  office_head: { required },
  requester_name: { required },
  requester_position: { required },
  requester_contact_number: { required },
  requester_email: { required, email, emailDomain },
  src: { required },
}))

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
    form.preview = null
    return
  }

  form.src = file

  const reader = new FileReader()
  reader.onload = (e) => (form.preview = e.target.result)
  reader.readAsDataURL(file)
}

async function submitRequest() {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    alert('Please fix the errors before submitting.')
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
