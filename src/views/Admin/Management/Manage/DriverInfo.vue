<template>
  <div class="px-4 sm:px-6 lg:px-10 py-6">
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Driver Information -->
      <div
        class="w-full lg:w-1/2 shadow-sm rounded-lg p-5 overflow-y-auto flex flex-col bg-white max-h-[600px]"
      >
        <h3 class="text-lg font-semibold mb-4 sticky top-0 bg-white z-10 pb-2">
          Driver Information
        </h3>

        <dl class="space-y-2 text-sm sm:text-base flex-grow">
          <div
            v-for="(value, label) in driverInfo"
            :key="label"
            class="flex justify-between border-b border-gray-400 py-1"
          >
            <dt class="font-semibold">{{ label }}:</dt>
            <dd class="text-green-600">{{ value || 'N/A' }}</dd>
          </div>
        </dl>
      </div>

      <!-- Update Form -->
      <div
        class="w-full lg:w-1/2 shadow-sm rounded-lg p-5 overflow-y-auto flex flex-col bg-white max-h-[600px]"
      >
        <h3 class="text-lg font-semibold mb-7 sticky top-0 bg-white z-10 pb-2">
          Update Driver Information
        </h3>

        <div class="flex flex-col w-full gap-8 bg-white">
          <!-- Row 1: Names -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <FloatLabel>
                <InputText id="driverLastName" v-model="driverFormStore.last_name" class="w-full" />
                <label for="driverLastName">Last Name</label>
              </FloatLabel>
              <small v-if="v$.last_name.$error" class="text-red-500">
                Last Name is required.
              </small>
            </div>
            <div>
              <FloatLabel>
                <InputText
                  id="driverFirstName"
                  v-model="driverFormStore.first_name"
                  class="w-full"
                />
                <label for="driverFirstName">First Name</label>
              </FloatLabel>
              <small v-if="v$.first_name.$error" class="text-red-500">
                First Name is required.
              </small>
            </div>

            <FloatLabel>
              <InputText
                id="driverMiddleName"
                v-model="driverFormStore.middle_name"
                class="w-full"
              />
              <label for="driverMiddleName">Middle Name</label>
            </FloatLabel>

            <FloatLabel>
              <InputText
                id="driverExtensionName"
                v-model="driverFormStore.extension_name"
                class="w-full"
              />
              <label for="driverExtensionName">Extension Name</label>
            </FloatLabel>
          </div>

          <!-- Row 2: Work Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <FloatLabel>
                <InputText id="driverPosition" v-model="driverFormStore.position" class="w-full" />
                <label for="driverPosition">Position</label>
              </FloatLabel>
              <small v-if="v$.position.$error" class="text-red-500"> Position is required. </small>
            </div>

            <div>
              <FloatLabel>
                <InputText
                  id="driverOfficialStation"
                  v-model="driverFormStore.official_station"
                  class="w-full"
                />
                <label for="driverOfficialStation">Official Station</label>
              </FloatLabel>
              <small v-if="v$.official_station.$error" class="text-red-500">
                Official Station is required.
              </small>
            </div>

            <div>
              <FloatLabel>
                <InputText
                  id="driverDesignation"
                  v-model="driverFormStore.designation"
                  class="w-full"
                />
                <label for="driverDesignation">Designation</label>
              </FloatLabel>
              <small v-if="v$.designation.$error" class="text-red-500">
                Designation is required.
              </small>
            </div>
          </div>

          <!-- Row 3: Contact -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <FloatLabel>
                <InputText id="driverEmail" v-model="driverFormStore.email" class="w-full" />
                <label for="driverEmail">Email</label>
              </FloatLabel>
              <small v-if="v$.email.$error" class="text-red-500">
                {{ emailErrorMessage }}
              </small>
            </div>

            <div>
              <FloatLabel>
                <InputMask
                  id="driverContactNumber"
                  v-model="driverFormStore.contact_number"
                  mask="0999 999 9999"
                  class="w-full"
                />
                <label for="driverContactNumber">Contact Number</label>
              </FloatLabel>
              <small v-if="v$.contact_number.$error" class="text-red-500">
                Contact Number is required.
              </small>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="sticky bottom-0 mt-6 flex justify-between">
          <Button
            label="Back"
            icon="pi pi-arrow-left"
            class="p-button-outlined p-button-secondary w-full sm:w-auto"
            @click="back"
          />

          <Button
            :label="driverFormStore.addDriver ? 'Add Driver' : 'Save Changes'"
            class="w-full sm:w-auto"
            severity="success"
            :loading="driverFormStore.submitting"
            @click="submitForm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDriverFormStore } from '@/stores/driverFormStore'
import { useAuthStore } from '@/stores/auth'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const driverFormStore = useDriverFormStore()
const authStore = useAuthStore()

// Alias for readability
const driver = driverFormStore.selectedDriver

function back() {
  driverFormStore.updateDriver = false
  driverFormStore.addDriver = false
}

// Custom email validator with domain restriction
function emailWithDomain(value) {
  if (!value) return false
  const allowedDomains = ['@gmail.com', '@dswd.gov.ph']
  const trimmed = value.trim().toLowerCase()
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
    allowedDomains.some((domain) => trimmed.endsWith(domain))
  )
}

// Validation rules
const rules = {
  first_name: { required },
  last_name: { required },
  position: { required },
  official_station: { required },
  designation: { required },
  email: { required, emailWithDomain },
  contact_number: { required },
}

const v$ = useVuelidate(rules, driverFormStore)

const driverInfo = computed(() => ({
  'First Name': driverFormStore?.first_name,
  'Middle Name': driverFormStore?.middle_name,
  'Last Name': driverFormStore?.last_name,
  'Extension Name': driverFormStore?.extension_name,
  Position: driverFormStore?.position,
  Designation: driverFormStore?.designation,
  'Official Station': driverFormStore?.official_station,
  Email: driverFormStore?.email,
  'Contact Number': driverFormStore?.contact_number,
}))

const emailErrorMessage = computed(() => {
  if (!v$.value.email.required) return 'Email is required.'
  if (!v$.value.email.emailWithDomain) return 'Only Gmail or dswd.gov.ph emails allowed.'
  return 'Invalid email.'
})

async function submitForm() {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  const original = driverFormStore.selectedDriver || {}
  const current = {
    first_name: driverFormStore.first_name,
    middle_name: driverFormStore.middle_name,
    last_name: driverFormStore.last_name,
    extension_name: driverFormStore.extension_name,
    position: driverFormStore.position,
    designation: driverFormStore.designation,
    official_station: driverFormStore.official_station,
    email: driverFormStore.email,
    contact_number: driverFormStore.contact_number,
  }

  const hasChanged = Object.keys(current).some(
    (key) => (current[key] || '') !== (original[key] || ''),
  )

  if (!driverFormStore.addDriver && !hasChanged) {
    window.alert('No changes detected. Please update some fields before saving.')
    return
  }

  driverFormStore.submitting = true
  let errorOccurred = false
  try {
    await driverFormStore.submitForm()
  } catch (error) {
    console.error('Form submission failed:', error)
    errorOccurred = true
  } finally {
    if (!errorOccurred) {
      if (driverFormStore.addDriver) {
        window.alert('Driver information successfully added.')
      } else {
        window.alert('Driver information successfully updated.')
      }
      window.location.reload()
      driverFormStore.addDriver = false
      driverFormStore.updateDriver = false
      driverFormStore.submitting = false
    } else {
      window.alert('Form submission failed. Please try again.')
    }
  }
}
</script>
