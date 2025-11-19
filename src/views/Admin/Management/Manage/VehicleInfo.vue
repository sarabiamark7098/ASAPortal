<template>
  <FullScreenLoader :visible="vehicleFormStore.loadingaction" message="" />
  <div v-if="!vehicleFormStore.loadingaction" class="px-3 sm:px-6 lg:px-10 py-4 sm:py-6">
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Vehicle Information -->
      <div
        class="w-full lg:w-1/2 shadow-sm rounded-lg p-5 overflow-y-auto flex flex-col bg-white max-h-[400px] sm:max-h-[500px] lg:max-h-[600px]"
      >
        <h3 class="text-lg font-semibold mb-4 sticky top-0 bg-white z-10 pb-2">
          Vehicle Information
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
          {{ vehicleFormStore.addVehicle ? 'Add' : 'Update' }} Vehicle Information
        </h3>

        <div class="flex flex-col w-full gap-6">
          <!-- Row 1 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </FloatLabel>
              <small v-if="v$.brand.$error" class="text-red-500"> Brand is required. </small>
            </div>
          </div>

          <!-- Row 2 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FloatLabel>
                <Select
                  v-model="vehicleFormStore.unit_type"
                  :options="vehicleTypeList"
                  option-label="label"
                  option-value="value"
                  id="unit_type"
                  class="w-full"
                />
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
              </FloatLabel>
              <small v-if="v$.model.$error" class="text-red-500"> Model is required. </small>
            </div>
          </div>

          <!-- Row 3 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FloatLabel>
              <InputMask
                class="w-full"
                id="purchase_year"
                v-model="vehicleFormStore.purchase_year"
                mask="9999"
              />
              <label for="purchase_year">Year of Purchase</label>
            </FloatLabel>
            <FloatLabel>
              <InputMask
                class="w-full"
                id="model_year"
                v-model="vehicleFormStore.model_year"
                mask="9999"
              />
              <label for="model_year">Year Model</label>
            </FloatLabel>
          </div>

          <!-- Row 4 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FloatLabel>
              <InputText
                id="chassis_number"
                v-model="vehicleFormStore.chassis_number"
                class="w-full"
              />
              <label for="chassis_number">Chassis Number</label>
            </FloatLabel>
            <FloatLabel>
              <InputText
                id="engine_number"
                v-model="vehicleFormStore.engine_number"
                class="w-full"
              />
              <label for="engine_number">Engine Number</label>
            </FloatLabel>
          </div>

          <!-- Row 5 -->
          <FloatLabel>
            <Select
              v-model="vehicleFormStore.drivers"
              :options="driverList"
              option-label="full_name"
              option-value="id"
              id="driver"
              class="w-full"
            />
            <label for="driver">Driver</label>
          </FloatLabel>
        </div>

        <!-- Actions -->
        <div
          class="sticky bottom-0 mt-6 flex flex-col sm:flex-row gap-3 sm:gap-6 bg-white pt-3 justify-between"
        >
          <Button
            label="Back"
            icon="pi pi-arrow-left"
            class="p-button-outlined p-button-secondary w-full sm:w-auto"
            @click="back"
          />
          <Button
            :label="vehicleFormStore.addVehicle ? 'Add Vehicle' : 'Save Changes'"
            class="w-full sm:w-auto"
            severity="success"
            :loading="vehicleFormStore.submitting"
            @click="submitForm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { useVehicleFormStore } from '@/stores/vehicleFormStore'
import { useDropdownStore } from '@/stores/dropdown'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const vehicleFormStore = useVehicleFormStore()
const dropdownStore = useDropdownStore()
const { driverList, vehicleTypeList } = storeToRefs(dropdownStore)

const authStore = useAuthStore()
// Alias for readability
if (vehicleFormStore.selectedVehicle && vehicleFormStore.selectedVehicle.vehicle_assignment) {
  vehicleFormStore.selectedDriver = vehicleFormStore.selectedVehicle.vehicle_assignment.driver
  vehicleFormStore.drivers = vehicleFormStore.selectedDriver.id
  vehicleFormStore.driver = vehicleFormStore.selectedDriver.full_name
  vehicleFormStore.contact_number = vehicleFormStore.selectedDriver.contact_number || ''
  vehicleFormStore.email = vehicleFormStore.selectedDriver.email || ''
}

onMounted(async () => {
  vehicleFormStore.loadingaction = true
  try {
    await dropdownStore.fetchDrivers()
    await dropdownStore.fetchVehicleTypes()
  } catch (error) {
    console.error('Error on mount:', error)
  } finally {
    vehicleFormStore.loadingaction = false
  }
})

watch(
  () => vehicleFormStore.drivers,
  (driverId) => {
    if (!driverId) {
      vehicleFormStore.contact_number = ''
      vehicleFormStore.email = ''
      return
    }

    const selectedDriver = driverList.value.find((d) => d.id === driverId)
    if (selectedDriver) {
      vehicleFormStore.selectedDriver = selectedDriver
      vehicleFormStore.driver = selectedDriver.full_name
      vehicleFormStore.contact_number = selectedDriver.contact_number || ''
      vehicleFormStore.email = selectedDriver.email || ''
    }
  },
)

function back() {
  vehicleFormStore.addVehicle = false
  vehicleFormStore.updateVehicle = false
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

function validYear(value) {
  if (!value) return false
  const year = parseInt(value, 10)
  const currentYear = new Date().getFullYear()
  return year >= 1886 && year <= currentYear
}

// Validation rules
const rules = {
  plate_number: { required },
  model: { required },
  unit_type: { required },
  brand: { required },
  purchase_year: { required, validYear },
  model_year: { required, validYear },
}

const v$ = useVuelidate(rules, vehicleFormStore)

const vehicleInfo = computed(() => ({
  'Plate Number': vehicleFormStore?.plate_number,
  Model: vehicleFormStore?.model,
  'Unit Type': vehicleFormStore?.unit_type,
  Brand: vehicleFormStore?.brand,
  'Year Purchased': vehicleFormStore?.purchase_year,
  'Year Model': vehicleFormStore?.model_year,
  'Chassis Number': vehicleFormStore?.chassis_number,
  'Engine Number': vehicleFormStore?.engine_number,
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

  const original = vehicleFormStore.selectedVehicle || {}
  const current = {
    plate_number: vehicleFormStore.plate_number,
    model: vehicleFormStore.model,
    unit_type: vehicleFormStore.unit_type,
    brand: vehicleFormStore.brand,
    purchase_year: vehicleFormStore.purchase_year,
    model_year: vehicleFormStore.model_year,
    chassis_number: vehicleFormStore.chassis_number,
    engine_number: vehicleFormStore.engine_number,
    driver_id: vehicleFormStore.drivers,
  }
  const originalFlat = {
    plate_number: original.plate_number || '',
    model: original.model || '',
    unit_type: original.unit_type || '',
    brand: original.brand || '',
    purchase_year: original.purchase_year || '',
    model_year: original.model_year || '',
    chassis_number: original.chassis_number || '',
    engine_number: original.engine_number || '',
    driver_id: original.vehicle_assignment?.driver?.id || '',
  }

  const hasChanged = Object.keys(current).some(
    (key) => String(current[key] || '') !== String(originalFlat[key] || ''),
  )

  if (!vehicleFormStore.addVehicle && !hasChanged) {
    window.alert('No changes detected. Please update some fields before saving.')
    return
  }

  vehicleFormStore.submitting = true
  let errorOccurred = false
  try {
    await vehicleFormStore.submitForm()
  } catch (error) {
    console.error('Form submission failed:', error)
    errorOccurred = true
  } finally {
    if (!errorOccurred) {
      if (vehicleFormStore.addVehicle) {
        window.alert('Vehicle information successfully added.')
      } else {
        window.alert('Vehicle information successfully updated.')
      }
      window.location.reload()
      vehicleFormStore.addVehicle = false
      vehicleFormStore.updateVehicle = false
      vehicleFormStore.submitting = false
    } else {
      window.alert('Failed to submit vehicle information.')
    }
  }
}
</script>
