<template>
  <FullScreenLoader :visible="form.loading" message="Loading Overnight Parking Request Form..." />

  <div v-if="!form.loading">
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
            <small v-if="v$.requester_name.$error" class="text-red-500"
              >Requester name is required.</small
            >
          </div>

          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="emailOfRequester"
                v-model="form.requester_email"
                class="w-full"
                type="email"
                :class="{ 'p-invalid': v$.requester_email.$error }"
                required
              />
              <label for="emailOfRequester"
                >Email of Requester <span class="text-red-500">*</span></label
              >
            </FloatLabel>
            <small v-if="v$.requester_email.$errors.length" class="text-red-500">
              {{ v$.requester_email.$errors[0].$message }}
            </small>
          </div>
        </div>

        <!-- Row 2 -->
        <div class="flex flex-col sm:flex-row gap-6">
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
            <small v-if="v$.requester_position.$error" class="text-red-500"
              >Position is required.</small
            >
          </div>

          <div class="flex-1">
            <FloatLabel>
              <InputMask
                id="contactNo"
                class="w-full"
                v-model="form.requester_contact_number"
                mask="0999 999 9999"
                :class="{ 'p-invalid': v$.requester_contact_number.$error }"
              />
              <label for="contactNo">Contact No. <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_contact_number.$error" class="text-red-500"
              >Contact number is required.</small
            >
          </div>
        </div>

        <!-- Row 3 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="office"
                class="w-full"
                v-model="form.office"
                :class="{ 'p-invalid': v$.office.$error }"
              />
              <label for="office">Office <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.office.$error" class="text-red-500">Office is required.</small>
          </div>

          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="model"
                class="w-full"
                v-model="form.model"
                :class="{ 'p-invalid': v$.model.$error }"
              />
              <label for="model">Vehicle Model <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.model.$error" class="text-red-500">Model is required.</small>
          </div>

          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="plateNumber"
                class="w-full"
                v-model="form.plate_number"
                :class="{ 'p-invalid': v$.plate_number.$error }"
              />
              <label for="plateNumber"
                >Vehicle Plate Number <span class="text-red-500">*</span></label
              >
            </FloatLabel>

            <small v-if="v$.plate_number.$error" class="text-red-500"
              >Plate number is required.</small
            >
          </div>
        </div>

        <!-- Row 4: Dates -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel>
              <DatePicker
                id="dateNeeded"
                class="w-full"
                v-model="form.requested_start"
                :class="{ 'p-invalid': v$.requested_start.$error }"
                showIcon
                fluid
                iconDisplay="input"
              />
              <label for="dateNeeded"
                >Date Needed (Start) <span class="text-red-500">*</span></label
              >
            </FloatLabel>
            <small v-if="v$.requested_start.$error" class="text-red-500"
              >Start date is required.</small
            >
          </div>

          <div class="flex-1">
            <FloatLabel>
              <DatePicker
                id="dateEnding"
                class="w-full"
                v-model="form.requested_end"
                :class="{ 'p-invalid': v$.requested_end.$error }"
                showIcon
                fluid
                iconDisplay="input"
              />
              <label for="dateEnding">Date Needed (End) <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requested_end.$error" class="text-red-500">
              {{ v$.requested_end.$errors[0].$message }}
            </small>
          </div>
        </div>

        <!-- Row 5 -->
        <div>
          <div class="flex-1">
            <FloatLabel>
              <Textarea
                id="justification"
                class="w-full"
                v-model="form.justification"
                :class="{ 'p-invalid': v$.justification.$error }"
                autoResize
                rows="2"
              />
              <label for="justification">Justification <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.justification.$error" class="text-red-500"
              >Justification is required.</small
            >
          </div>
        </div>

        <!-- Row 6: Time -->
        <div class="flex flex-col sm:flex-row gap-6">
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
              <label for="startTime">Time Needed (Start) <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requested_time.$error" class="text-red-500"
              >Start time is required.</small
            >
          </div>
        </div>

        <!-- Row 7: Uploads -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
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
            />
            <div class="text-sm text-gray-500 mt-2">
              Upload supporting document (PDF, max 2MB) (Optional)
            </div>
            <div v-if="form.supportingDocumentFileName" class="mt-2 text-sm text-gray-700">
              Selected: {{ form.supportingDocumentFileName }}
            </div>
          </div>
          <div class="flex-1">
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
                :key="form.src"
                :src="form.src"
                alt="E-Signature Preview"
                class="shadow-md rounded-xl w-full sm:w-32"
                style="filter: grayscale(100%)"
              />
            </div>
            <div class="text-sm text-gray-500 mt-2">
              Upload your e-signature (PNG, JPG, JPEG, max 1MB) <span class="text-red-500">*</span>
            </div>
            <small v-if="v$.src.$error" class="text-red-500">E-signature is required.</small>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center mt-8">
          <Button
            label="Submit Request"
            icon="pi pi-check"
            severity="primary"
            class="w-full sm:w-auto"
            :disabled="form.submitting"
            @click="submitRequest"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOvernightParkingRequestFormStore } from '@/stores/overnightParkingRequestFormStore'
import FullScreenLoader from '@/components/FullScreenLoader.vue'

import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

const form = useOvernightParkingRequestFormStore()
const router = useRouter()

// custom validators
const emailDomain = helpers.withMessage('Email must be @gmail.com or @dswd.gov.ph', (value) => {
  if (!value) return false
  const allowedDomains = ['@gmail.com', '@dswd.gov.ph']
  return allowedDomains.some((domain) => value.toLowerCase().endsWith(domain))
})

const endDateAfterStart = helpers.withMessage('End date must be after start date', (value) => {
  if (!value || !form.requested_start) return false
  return new Date(value) >= new Date(form.requested_start)
})

// Validation rules
const rules = {
  requester_name: { required },
  requester_email: { required, email, emailDomain },
  requester_position: { required },
  requester_contact_number: { required },
  office: { required },
  model: { required },
  plate_number: { required },
  requested_start: { required },
  requested_end: { required, endDateAfterStart },
  justification: { required },
  requested_time: { required },
  src: { required },
}

const v$ = useVuelidate(rules, form)

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  form.loading = false
})

function onSupportingDocumentSelect(event) {
  const file = event.files[0]
  if (!file) return

  if (file.type !== 'application/pdf') {
    form.supportingDocumentFileName = null
    alert('Only PDF files are allowed.')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    alert('Maximum PDF size is 2MB.')
    return
  }

  form.supportingDocumentFileName = file.name
  form.supportingDocument = file
}

function onFileSelect(event) {
  const file = event.files[0]
  if (!file) return

  const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
  const maxSize = 1 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    alert('Only PNG, JPG, or JPEG files are allowed.')
    form.src = null
    return
  }
  if (file.size > maxSize) {
    alert('Maximum file size is 1MB.')
    form.src = null
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.src = e.target.result
  }
  reader.readAsDataURL(file)
}

async function submitRequest() {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    alert('Please fix the errors before submitting.')
    return
  }

  form.submitting = true

  try {
    await form.submitForm()
    alert('Form submitted successfully!')
    form.resetForm()
    router.push({ name: 'clientview' })
  } catch (error) {
    console.error('Form submission failed:', error)
    alert('There was an error submitting the form. Please try again.')
  } finally {
    form.submitting = false
  }
}
</script>
