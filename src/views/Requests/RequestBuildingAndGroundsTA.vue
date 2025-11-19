<template>
  <FullScreenLoader :visible="loading" message="Loading Technical Assistance Request Form..." />

  <div v-if="!loading">
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
          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="requestingOffice"
                class="w-full"
                v-model="form.requesting_office"
                :class="{ 'p-invalid': showErrors && v$.requesting_office.$error }"
              />
              <label for="requestingOffice">
                Requesting Office/Unit <span class="text-red-500">*</span>
              </label>
            </FloatLabel>
            <small v-if="showErrors && v$.requesting_office.$error" class="text-red-500">
              Requesting Office/Unit is required.
            </small>
          </div>

          <div class="flex-1">
            <FloatLabel>
              <InputText id="drn" class="w-full" v-model="form.drn" />
              <label for="drn">DRN</label>
            </FloatLabel>
          </div>

          <div class="flex-1">
            <FloatLabel>
              <DatePicker
                id="dateRequested"
                class="w-full"
                v-model="form.date_requested"
                :class="{ 'p-invalid': showErrors && v$.date_requested.$error }"
                showIcon
                fluid
                iconDisplay="input"
              />
              <label for="dateRequested">
                Date Requested <span class="text-red-500">*</span>
              </label>
            </FloatLabel>
            <small v-if="showErrors && v$.date_requested.$error" class="text-red-500">
              Date Requested is required.
            </small>
          </div>
        </div>

        <!-- Row 2 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <!-- Type of Request -->
          <div class="flex-1">
            <label for="RequestType">Type of Request <span class="text-red-500">*</span></label>
            <div id="RequestType" class="flex flex-col pt-2">
              <div
                v-for="category in RequestTypeCategories"
                :key="category.key"
                class="flex flex-col sm:flex-row sm:items-center gap-2"
              >
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="form.request_type"
                    :inputId="category.key"
                    name="RequestTypeCategories"
                    :value="category.name"
                  />
                  <label :for="category.key">{{ category.name }}</label>
                </div>
                <InputText
                  v-if="category.name === 'Other' && form.request_type.includes('Other')"
                  v-model="form.other_type"
                  placeholder="Please specify"
                  class="w-full sm:w-auto"
                />
              </div>
            </div>
            <small v-if="showErrors && v$.request_type.$error" class="text-red-500">
              Please select at least one Type of Request.
            </small>
            <small v-if="showErrors && v$.other_type.$error" class="text-red-500">
              Please specify the other type of request.
            </small>
          </div>

          <!-- Nature of Request -->
          <div class="flex-1">
            <label for="RequestNature">Nature of Request <span class="text-red-500">*</span></label>
            <div id="RequestNature" class="flex flex-col pt-2">
              <div
                v-for="category in RequestNatureCategories"
                :key="category.key"
                class="flex flex-col sm:flex-row sm:items-center gap-2"
              >
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="form.request_nature"
                    :inputId="category.key"
                    name="RequestNatureCategories"
                    :value="category.name"
                  />
                  <label :for="category.key">{{ category.name }}</label>
                </div>
                <InputText
                  v-if="category.name === 'Other' && form.request_nature.includes('Other')"
                  v-model="form.other_nature"
                  placeholder="Please specify"
                  class="w-full sm:w-auto"
                />
              </div>
            </div>
            <small v-if="showErrors && v$.request_nature.$error" class="text-red-500">
              Please select at least one Nature of Request.
            </small>
            <small v-if="showErrors && v$.other_nature.$error" class="text-red-500">
              Please specify the other nature of request.
            </small>
          </div>
        </div>

        <!-- Row 3 -->
        <div class="flex-1">
          <FloatLabel>
            <Textarea
              id="requestDetail"
              class="w-full"
              v-model="form.details"
              :class="{ 'p-invalid': showErrors && v$.details.$error }"
              autoResize
              rows="2"
            />
            <label for="requestDetail">
              Complete Details of the Request <span class="text-red-500">*</span>
            </label>
          </FloatLabel>
          <small v-if="showErrors && v$.details.$error" class="text-red-500">
            Request details are required.
          </small>
        </div>

        <!-- Row 4 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel class="flex-1">
              <InputText
                id="requestedBy"
                class="w-full"
                v-model="form.requester_name"
                :class="{ 'p-invalid': showErrors && v$.requester_name.$error }"
              />
              <label for="requestedBy">Requested by <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="showErrors && v$.requester_name.$error" class="text-red-500">
              Requested by is required.
            </small>
          </div>
          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="position"
                class="w-full"
                v-model="form.requester_position"
                :class="{ 'p-invalid': showErrors && v$.requester_position.$error }"
              />
              <label for="position">Position <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="showErrors && v$.requester_position.$error" class="text-red-500">
              Position is required.
            </small>
          </div>
          <div class="flex-1">
            <FloatLabel>
              <InputMask
                id="contactNo"
                class="w-full"
                v-model="form.requester_contact_number"
                mask="0999 999 9999"
                :class="{ 'p-invalid': showErrors && v$.requester_contact_number.$error }"
              />
              <label for="contactNo">Contact No. <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="showErrors && v$.requester_contact_number.$error" class="text-red-500">
              Contact number is required.
            </small>
          </div>
          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="emailOfRequester"
                v-model="form.requester_email"
                class="w-full"
                type="email"
                :class="{ 'p-invalid': showErrors && v$.requester_email.$error }"
                required
              />
              <label for="emailOfRequester">
                Email of Requester <span class="text-red-500">*</span>
              </label>
            </FloatLabel>
            <small v-if="showErrors && v$.requester_email.$error" class="text-red-500">
              A valid email (gmail.com or dswd.gov.ph) is required.
            </small>
          </div>
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
            :class="{ 'p-invalid': showErrors && v$.src.$error }"
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
            Upload your e-signature (PNG, JPG, JPEG) - Max size: 1MB
            <span class="text-red-500">*</span>
            <span v-if="showErrors && v$.src.$error" class="text-red-500 block">
              E-signature is required.
            </span>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTARequestFormStore } from '@/stores/TARequestFormStore.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { required, requiredIf } from '@vuelidate/validators'

const TAFormStore = useTARequestFormStore()
const router = useRouter()
const form = TAFormStore

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
  { name: 'Varnishing/Painting', key: 'Varnishing/Painting' },
  { name: 'Other', key: 'Other' },
])

const showErrors = ref(false)
const submitting = ref(false)
const loading = ref(true)

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  loading.value = false
})

// Custom email validator
const allowedEmail = (value) => {
  if (!value) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const allowedDomains = ['@gmail.com', '@dswd.gov.ph']
  return emailRegex.test(value) && allowedDomains.some((d) => value.endsWith(d))
}

// Validation rules
const rules = {
  requesting_office: { required },
  date_requested: { required },
  request_type: { required },
  request_nature: { required },
  other_type: {
    required: requiredIf(() => form.request_type.includes('Other')),
  },
  other_nature: {
    required: requiredIf(() => form.request_nature.includes('Other')),
  },
  details: { required },
  requester_name: { required },
  requester_position: { required },
  requester_contact_number: { required },
  requester_email: { required, email: allowedEmail },
  src: { required },
}

const v$ = useVuelidate(rules, form)

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
  showErrors.value = true
  const isValid = await v$.value.$validate()

  if (!isValid) {
    alert('Please fix the errors in the form before submitting.')
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
