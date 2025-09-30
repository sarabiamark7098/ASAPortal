<template>
  <div class="flex flex-col gap-8">
    <p class="text-xl font-bold">Vehicle</p>
    <!-- Row 1 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <Select
          v-model="form.vehicleAssigned"
          :options="form.vehicleOptions"
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
          id="model"
          :value="form.model"
          readonly
          disabled
        />
        <label for="model">Model</label>
      </FloatLabel>
    </div>
    <!-- Row 2 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="brand"
          :value="form.brand"
          readonly
          disabled
        />
        <label for="brand">Brand</label>
      </FloatLabel>
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="unit_type"
          :value="form.unit_type"
          readonly
          disabled
        />
        <label for="unit_type">Unit Type</label>
      </FloatLabel>
    </div>

    <p class="text-xl font-bold">Driver</p>
    <!-- Row 3 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="last_name"
          :value="form.last_name"
          readonly
          disabled
        />
        <label for="last_name">Last Name</label>
      </FloatLabel>
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="first_name"
          :value="form.first_name"
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
          :value="form.driver_position"
          readonly
          disabled
        />
        <label for="driverposition">Position</label>
      </FloatLabel>
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="official_station"
          :value="form.official_station"
          readonly
          disabled
        />
        <label for="official_station">Official Station</label>
      </FloatLabel>
    </div>

    <!-- Row 5 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="email"
          :value="form.email"
          readonly
          disabled
        />
        <label for="email">Email</label>
      </FloatLabel>
      <FloatLabel class="flex-1 label">
        <InputText
          class="w-full"
          id="contact_number"
          :value="form.contact_number"
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
import { useVehicleRequestFormStore } from '@/stores/vehicleRequestFormStore'
import { useAuthStore } from '@/stores/auth'
import { useDropdownStore } from '@/stores/dropdown'

const form = useVehicleRequestFormStore()
const authStore = useAuthStore()
const dropdownStore = useDropdownStore()

onMounted(async () => {
  await dropdownStore.fetchVehicleAssignments(authStore.token)
})

// Update options and selected vehicle reactively
watchEffect(() => {
  form.vehicleOptions = (dropdownStore.vehicle?.data || []).map((a) => ({
    label: a.vehicle.plate_number,
    value: a.id,
    original: a,
  }))

  form.selectedVehicle =
    form.vehicleOptions.find(
      (v) => v.value === form.vehicleAssigned,
    )?.original || null

  form.model = form.selectedVehicle?.vehicle.model || ''
  form.brand = form.selectedVehicle?.vehicle.brand || ''
  form.unit_type =
    form.selectedVehicle?.vehicle.unit_type || ''
  form.last_name =
    form.selectedVehicle?.driver.last_name || ''
  form.first_name =
    form.selectedVehicle?.driver.first_name || ''
  form.driver_position =
    form.selectedVehicle?.driver.position || ''
  form.official_station =
    form.selectedVehicle?.driver.official_station || ''
  form.email = form.selectedVehicle?.driver.email || ''
  form.contact_number =
    form.selectedVehicle?.driver.contact_number || ''
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
