<template>
  <div class="flex flex-col gap-8">
    <p class="text-xl font-bold">Vehicle</p>
    <!-- Row 1 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <Select
          v-model="vehicleFormStore.vehicleAssigned"
          :options="vehicleOptions"
          option-label="label"
          option-value="value"
          id="platenumber"
          required
          class="w-full input"
        />
        <label for="platenumber">Plate Number</label>
      </FloatLabel>
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="vehiclemodel"
          :value="vehicleFormStorevehiclemodel"
          readonly
          disabled
        />
        <label for="vehiclemodel">Model</label>
      </FloatLabel>
    </div>
    <!-- Row 2 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 label">
        <InputText class="w-full" id="brand" :value="vehicleFormStore.brand" readonly disabled />
        <label for="brand">Brand</label>
      </FloatLabel>
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="unitType"
          :value="vehicleFormStore.unitType"
          readonly
          disabled
        />
        <label for="unitType">Unit Type</label>
      </FloatLabel>
    </div>

    <p class="text-xl font-bold">Driver</p>
    <!-- Row 3 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="last_name"
          :value="vehicleFormStore.last_name"
          readonly
          disabled
        />
        <label for="last_name">Last Name</label>
      </FloatLabel>
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="first_name"
          :value="vehicleFormStore.first_name"
          readonly
          disabled
        />
        <label for="first_name">First Name</label>
      </FloatLabel>
    </div>

    <!-- Row 4 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="driverposition"
          :value="vehicleFormStore.driver_position"
          readonly
          disabled
        />
        <label for="driverposition">Position</label>
      </FloatLabel>
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="official_station"
          :value="official_station"
          readonly
          disabled
        />
        <label for="official_station">Official Station</label>
      </FloatLabel>
    </div>

    <!-- Row 5 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 label">
        <InputText class="w-full" id="email" :value="vehicleFormStore.email" readonly disabled />
        <label for="email">Email</label>
      </FloatLabel>
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="contact_number"
          :value="vehicleFormStore.contact_number"
          readonly
          disabled
        />
        <label for="contact_number">Contact Number</label>
      </FloatLabel>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useVehicleFormStore } from '@/stores/vehicleRequestFormStore'
import { useAuthStore } from '@/stores/auth'
import { useDropdownStore } from '@/stores/dropdown'

const vehicleFormStore = useVehicleFormStore()
const authStore = useAuthStore()
const dropdownStore = useDropdownStore()
const { vehicleList } = storeToRefs(dropdownStore)
const { fetchVehicleAssignments } = dropdownStore

onMounted(async () => {
  await fetchVehicleAssignments(authStore.token)
})

// Update options and selected vehicle reactively
watchEffect(() => {
  vehicleOptions.value = (vehicleList.value?.data || []).map((a) => ({
    label: a.vehicle.plate_number,
    value: a.id,
    original: a,
  }))

  vehicleFormStore.selectedVehicle =
    vehicleOptions.value.find((v) => v.value === vehicleFormStore.vehicleAssigned)?.original || null

  vehicleFormStore.vehiclemodel = vehicleFormStore.selectedVehicle?.vehicle.model || ''
  vehicleFormStore.brand = vehicleFormStore.selectedVehicle?.vehicle.brand || ''
  vehicleFormStore.unitType = vehicleFormStore.selectedVehicle?.vehicle.unit_type || ''
  vehicleFormStore.last_name = vehicleFormStore.selectedVehicle?.driver.last_name || ''
  vehicleFormStore.first_name = vehicleFormStore.selectedVehicle?.driver.first_name || ''
  vehicleFormStore.driver_position = vehicleFormStore.selectedVehicle?.driver.position || ''
  vehicleFormStore.official_station =
    vehicleFormStore.selectedVehicle?.driver.official_station || ''
  vehicleFormStore.email = vehicleFormStore.selectedVehicle?.driver.email || ''
  vehicleFormStore.contact_number = vehicleFormStore.selectedVehicle?.driver.contact_number || ''
})
</script>

<style scoped>
.label label {
  transition: all 0.2s ease-in-out; /* smooth floating */
  pointer-events: none; /* prevent interfering with input */
}
.label input:disabled ~ label,
.label input[value]:not([value='']) ~ label {
  top: -0.5rem; /* adjust vertical position */
  font-size: 0.75rem; /* smaller text size */
  color: #6b7280; /* gray color */
  background: white; /* optional: ensure label doesn’t overlap border */
  padding: 0 0.25rem; /* optional: space around label */
}
</style>
