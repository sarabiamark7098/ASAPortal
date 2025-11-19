<template>
  <FullScreenLoader
    :visible="form.loading"
    message="Loading Entry to DSWD Premises Request Form..."
  />

  <div v-if="!form.loading">
    <div
      class="flex flex-col p-4 sm:p-6 md:p-9 lg:p-12 bg-gray-100 rounded-3xl max-w-7xl mx-auto mt-12"
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
          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="requestingOffice"
                v-model="form.requesting_office"
                :class="{ 'p-invalid': v$.requesting_office.$error }"
                class="w-full"
              />
              <label for="requestingOffice"
                >Requesting Office/Unit <span class="text-red-500">*</span></label
              >
            </FloatLabel>

            <small v-if="v$.requesting_office.$error" class="text-red-500 text-xs">
              Requesting Office is required.
            </small>
          </div>
          <div class="flex-1">
            <FloatLabel>
              <DatePicker
                id="dateRequested"
                v-model="form.date_requested"
                :class="{ 'p-invalid': v$.date_requested.$error }"
                showIcon
                fluid
                iconDisplay="input"
                class="w-full"
              />
              <label for="dateRequested">Date Requested <span class="text-red-500">*</span></label>
            </FloatLabel>

            <small v-if="v$.date_requested.$error" class="text-red-500 text-xs">
              Date Requested is required.
            </small>
          </div>
        </div>

        <!-- Row 2 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel>
              <DatePicker
                id="dateNeeded"
                v-model="form.requested_date"
                :class="{ 'p-invalid': v$.requested_date.$error }"
                showIcon
                fluid
                iconDisplay="input"
                class="w-full"
              />
              <label for="dateNeeded">Expected Date<span class="text-red-500">*</span></label>
            </FloatLabel>

            <small v-if="v$.requested_date.$error" class="text-red-500 text-xs">
              Expected Date is required.
            </small>
          </div>
        </div>

        <!-- Row 3 -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel class="flex-1">
              <InputText
                id="requestedBy"
                v-model="form.requester_name"
                :class="{ 'p-invalid': v$.requester_name.$error }"
                class="w-full"
              />
              <label for="requestedBy">Requested by <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_name.$error" class="text-red-500 text-xs">
              Requester is required.
            </small>
          </div>

          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="position"
                v-model="form.requester_position"
                :class="{ 'p-invalid': v$.requester_position.$error }"
                class="w-full"
              />
              <label for="position">Position <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_position.$error" class="text-red-500 text-xs">
              Position is required.
            </small>
          </div>

          <div class="flex-1">
            <FloatLabel>
              <InputMask
                id="contactNo"
                v-model="form.requester_contact_number"
                mask="0999 999 9999"
                :class="{ 'p-invalid': v$.requester_contact_number.$error }"
                class="w-full"
              />
              <label for="contactNo">Contact No. <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_contact_number.$error" class="text-red-500 text-xs">
              Contact Number is required.
            </small>
          </div>

          <div class="flex-1">
            <FloatLabel>
              <InputText
                id="emailOfRequester"
                v-model="form.requester_email"
                :class="{ 'p-invalid': v$.requester_email.$error }"
                class="w-full"
                type="email"
              />
              <label for="emailOfRequester"
                >Email of Requester <span class="text-red-500">*</span></label
              >
            </FloatLabel>
            <small v-if="v$.requester_email.$error" class="text-red-500 text-xs">
              Valid Email is required.
            </small>
          </div>
        </div>

        <!-- Row 4 -->
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
              :class="{ 'p-invalid': v$.src.$error }"
            />

            <div v-if="form.preview" class="mt-4 sm:mt-0">
              <img
                :src="form.preview"
                alt="E-Signature Preview"
                class="shadow-md rounded-xl w-full sm:w-32 grayscale"
              />
            </div>

            <div v-else class="text-sm text-gray-500 mt-2">
              Upload your e-signature (PNG, JPG, JPEG) - Max size: 1MB
              <span class="text-red-500">*</span>
              <span v-if="v$.src.$error" class="text-red-500 block">
                E-signature is required.
              </span>
            </div>
          </div>
        </div>

        <hr class="mb-6 border-gray-300" />

        <!-- Guests -->
        <div class="flex flex-col">
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-4">List of Person/s Requesting for Entry</h2>

            <div
              v-for="(guest, index) in form.guests"
              :key="index"
              class="mb-2 flex items-center gap-2"
            >
              <div class="flex-1">
                <FloatLabel variant="on">
                  <InputText
                    v-model="guest.full_name"
                    class="w-full"
                    :class="{ 'p-invalid': form.errors.guests[index]?.full_name }"
                  />
                  <label>Name</label>
                </FloatLabel>

                <small v-if="form.errors.guests[index]?.full_name" class="text-red-500 text-xs">
                  {{ form.errors.guests[index].full_name }}
                </small>
              </div>
              <div class="flex-1">
                <FloatLabel variant="on">
                  <InputText
                    v-model="guest.purpose"
                    class="w-full"
                    :class="{ 'p-invalid': form.errors.guests[index]?.purpose }"
                  />
                  <label>Enter Projects/Work to be done</label>
                </FloatLabel>
                <small v-if="form.errors.guests[index]?.purpose" class="text-red-500 text-xs">
                  {{ form.errors.guests[index].purpose }}
                </small>
              </div>

              <Button
                icon="pi pi-times"
                severity="danger"
                @click="form.removeGuest(index)"
                v-if="form.guests.length > 1"
              />
            </div>

            <div class="mt-4 flex gap-2">
              <Button label="Add Guest" icon="pi pi-plus" @click="form.addGuest" />
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
            :disabled="form.submitting"
            @click="submitRequest"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePremisesFormStore } from '@/stores/entryToDSWDFormStore'
import { useDropdownStore } from '@/stores/dropdown'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { ref, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const form = usePremisesFormStore()
const dropdown = useDropdownStore()
const authStore = useAuthStore()
const router = useRouter()

// ✅ Validation rules
const rules = {
  requesting_office: { required },
  date_requested: { required },
  requested_date: { required },
  requester_name: { required },
  requester_position: { required },
  requester_contact_number: { required },
  requester_email: { required, email },
  src: { required },
}

const v$ = useVuelidate(rules, form)

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  form.loading = false
})

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
  const isValidVuelidate = await v$.value.$validate()
  const isValidManual = form.validateForm()

  if (!isValidVuelidate || !isValidManual) {
    alert('Fix validation errors before submitting.')
    return
  }

  const dc = await dropdown.fetchSignatory(authStore.token, 'Administrative Division')
  form.signatories = [{ id: dc.id, label: 'Approved By' }]

  form.submitting = true
  try {
    await form.submitForm()
    alert('Form submitted successfully!')
    form.resetForm()
    router.push({ name: 'printview', params: { printview: 'entry-request' } })
  } catch (err) {
    console.error('Submission failed:', err)
    alert('Submission failed. Please try again.')
  } finally {
    form.submitting = false
  }
}
</script>
