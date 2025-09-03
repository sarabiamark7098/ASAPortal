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
            v-for="(value, label) in vehicleInfo"
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
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <FloatLabel>
                <InputText
                  id="plate_number"
                  v-model="vehicleFormStore.plate_number"
                  class="w-full"
                />
                <label for="plate_number">Plate Number</label>
              </FloatLabel>
              <small v-if="v$.plate_number.$error" class="text-red-500">
                Plate Number is required.
              </small>
            </div>
            <div>
              <FloatLabel>
                <InputText id="brand" v-model="vehicleFormStore.brand" class="w-full" />
                <label for="brand">Brand</label>
                <small v-if="v$.brand.$error" class="text-red-500"> Brand is required. </small>
              </FloatLabel>
            </div>
            <div>
              <FloatLabel>
                <InputText id="unit_type" v-model="vehicleFormStore.unit_type" class="w-full" />
                <label for="unit_type">Unit Type</label>
              </FloatLabel>
              <small v-if="v$.unit_type.$error" class="text-red-500">
                Unit Type is required.
              </small>
            </div>
            <div>
              <FloatLabel>
                <InputText id="model" v-model="vehicleFormStore.model" class="w-full" />
                <label for="model">Model</label>

                <small v-if="v$.model.$error" class="text-red-500"> Model is required. </small>
              </FloatLabel>
            </div>
          </div>

          <!-- Row 2: Work Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <FloatLabel>
                <InputText
                  id="purchase_year"
                  v-model="vehicleFormStore.purchase_year"
                  class="w-full"
                />
                <label for="purchase_year">Year of Purchase</label>
              </FloatLabel>
            </div>

            <div>
              <FloatLabel>
                <InputText id="model_year" v-model="vehicleFormStore.model_year" class="w-full" />
                <label for="model_year">Year Model</label>
              </FloatLabel>
            </div>

            <div>
              <FloatLabel>
                <InputText
                  id="chasis_number"
                  v-model="vehicleFormStore.chasis_number"
                  class="w-full"
                />
                <label for="chasis_number">Chassis Number</label>
              </FloatLabel>
            </div>
          </div>

          <!-- Row 3: Contact -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <FloatLabel>
                <InputText
                  id="engine_number"
                  v-model="vehicleFormStore.engine_number"
                  class="w-full"
                />
                <label for="engine_number">Engine Number</label>
              </FloatLabel>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="sticky bottom-0 mt-6 flex justify-between">
          <Button
            label="Back"
            icon="pi pi-arrow-left"
            class="p-button-outlined p-button-secondary w-full sm:w-auto"
            @click="driverFormStore.updateDriver = false"
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
import { useVehicleFormStore } from '@/stores/vehicleFormStore'
import { useDriverFormStore } from '@/stores/driverFormStore'
import { useAuthStore } from '@/stores/auth'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const vehicleFormStore = useVehicleFormStore()
const driverFormStore = useDriverFormStore()
const authStore = useAuthStore()

// Alias for readability
const vehicle = vehicleFormStore.selectedVehicle

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
  plate_number: { required },
  model: { required },
  unit_type: { required },
  brand: { required },
  driver: { required },
  email: { required, emailWithDomain },
  contact_number: { required },
}

const v$ = useVuelidate(rules, vehicleFormStore)

const vehicleInfo = computed(() => ({
  'Plate Number': vehicleFormStore?.plate_number,
  Model: vehicleFormStore?.model,
  'Unit Type': vehicleFormStore?.unit_type,
  Brand: vehicleFormStore?.brand,
  'Year Purchased': vehicleFormStore?.purchase_year,
  'Year Model': vehicleFormStore?.model_year,
  Driver: vehicleFormStore?.driver,
  'Contact Number': vehicleFormStore?.contact_number,
  Email: vehicleFormStore?.email,
}))

const emailErrorMessage = computed(() => {
  if (!v$.value.email.required) return 'Email is required.'
  if (!v$.value.email.emailWithDomain) return 'Only Gmail or dswd.gov.ph emails allowed.'
  return 'Invalid email.'
})

async function submitForm() {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  vehicleFormStore.submitting = true
  try {
    await vehicleFormStore.submitForm()
  } catch (error) {
    console.error('Form submission failed:', error)
  } finally {
    if (vehicleFormStore.addVehicle) {
      window.alert('Vehicle information successfully added.')
    } else {
      window.alert('Vehicle information successfully updated.')
    }
    window.location.reload()
    vehicleFormStore.addVehicle = false
    vehicleFormStore.updateVehicle = false
    vehicleFormStore.submitting = false
  }
}
</script>
