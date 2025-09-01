<template>
  <div v-if="vehicleFormStore.editMode" class="flex flex-col gap-8">
    <!-- Row 1 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <Select
          v-model="vehicleFormStore.checkedSignatory"
          :options="signatoryList"
          option-label="full_name"
          option-value="id"
          id="check"
          required
          class="w-full input"
        />
        <label for="">Checked By</label>
      </FloatLabel>
      <FloatLabel class="flex-1">
        <Select
          v-model="vehicleFormStore.requestingSignatory"
          :options="signatoryList"
          option-label="full_name"
          option-value="id"
          id="check"
          required
          class="w-full input"
        />
        <label for="">Requesting Officer</label>
      </FloatLabel>
    </div>

    <!-- Row 2 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 position-label">
        <InputText
          class="w-full"
          :value="vehicleFormStore.checkedSignatoryPosition"
          readonly
          disabled
        />
        <label>Position</label>
      </FloatLabel>

      <FloatLabel class="flex-1 position-label">
        <InputText
          class="w-full"
          :value="vehicleFormStore.requestingSignatoryPosition"
          readonly
          disabled
        />
        <label>Position</label>
      </FloatLabel>
    </div>

    <!-- Row 3 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <Select
          v-model="vehicleFormStore.approvalSignatory"
          :options="signatoryList"
          option-label="full_name"
          option-value="id"
          id="check"
          required
          class="w-full input"
        />
        <label for="">Request Approval</label>
      </FloatLabel>
      <FloatLabel class="flex-1">
        <Select
          v-model="vehicleFormStore.SOSignatory"
          :options="signatoryList"
          option-label="full_name"
          option-value="id"
          id="check"
          required
          class="w-full input"
        />
        <label for="">Special Order Approval</label>
      </FloatLabel>
    </div>

    <!-- Row 4 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 position-label">
        <InputText
          class="w-full"
          :value="vehicleFormStore.approvalSignatoryPosition"
          readonly
          disabled
        />
        <label>Position</label>
      </FloatLabel>

      <FloatLabel class="flex-1 position-label">
        <InputText class="w-full" :value="vehicleFormStore.SOSignatoryPosition" readonly disabled />
        <label>Position</label>
      </FloatLabel>
    </div>
  </div>
  <div v-if="vehicleFormStore.editModeCNAS" class="flex flex-col gap-8">
    <!-- Row 1 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <Select
          v-model="vehicleFormStore.checkedSignatory"
          :options="signatoryList"
          option-label="full_name"
          option-value="id"
          id="check"
          required
          class="w-full input"
        />
        <label for="">Checked By</label>
      </FloatLabel>
      <FloatLabel class="flex-1">
        <Select
          v-model="vehicleFormStore.approvalSignatory"
          :options="signatoryList"
          option-label="full_name"
          option-value="id"
          id="check"
          required
          class="w-full input"
        />
        <label for="">Request Approval</label>
      </FloatLabel>
    </div>

    <!-- Row 2 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 position-label">
        <InputText
          class="w-full"
          :value="vehicleFormStore.checkedSignatoryPosition"
          readonly
          disabled
        />
        <label>Position</label>
      </FloatLabel>
      <FloatLabel class="flex-1 position-label">
        <InputText
          class="w-full"
          :value="vehicleFormStore.approvalSignatoryPosition"
          readonly
          disabled
        />
        <label>Position</label>
      </FloatLabel>
    </div>

    <!-- Row 3 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <Select
          v-model="vehicleFormStore.CNASSignatory"
          :options="signatoryList"
          option-label="full_name"
          option-value="id"
          id="check"
          required
          class="w-full input"
        />
        <label for="">CNAS Approving</label>
      </FloatLabel>
    </div>

    <!-- Row 4 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 position-label">
        <InputText
          class="w-full"
          :value="vehicleFormStore.CNASSignatoryPosition"
          readonly
          disabled
        />
        <label>Position</label>
      </FloatLabel>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useVehicleFormStore } from '@/stores/vehicleRequestFormStore'
import { useAuthStore } from '@/stores/auth'
import { useDropdownStore } from '@/stores/dropdown'

const vehicleFormStore = useVehicleFormStore()
const dropdownStore = useDropdownStore()
const { signatoryList } = storeToRefs(dropdownStore)
const { fetchSignatories } = dropdownStore
const authStore = useAuthStore()

onMounted(async () => {
  await fetchSignatories(authStore.token)
})

// Watch for changes and update positions
watchEffect(() => {
  const list = signatoryList.value || []

  const checked = list.find((s) => s.id == vehicleFormStore.checkedSignatory)
  vehicleFormStore.checkedSignatoryPosition = checked ? checked.position : ''

  const to = list.find((s) => s.id == vehicleFormStore.requestingSignatory)
  vehicleFormStore.requestingSignatoryPosition = to ? to.position : ''

  const approval = list.find((s) => s.id == vehicleFormStore.approvalSignatory)
  vehicleFormStore.approvalSignatoryPosition = approval ? approval.position : ''

  const so = list.find((s) => s.id == vehicleFormStore.SOSignatory)
  vehicleFormStore.SOSignatoryPosition = so ? so.position : ''

  const cnas = list.find((s) => s.id == vehicleFormStore.CNASSignatory)
  vehicleFormStore.CNASSignatoryPosition = cnas ? cnas.position : ''
})
</script>
<style scoped>
.position-label label {
  transition: all 0.2s ease-in-out; /* smooth floating */
  pointer-events: none; /* prevent interfering with input */
}
.position-label input:disabled ~ label,
.position-label input[value]:not([value='']) ~ label {
  top: -0.5rem; /* adjust vertical position */
  font-size: 0.75rem; /* smaller text size */
  color: #6b7280; /* gray color */
  background: white; /* optional: ensure label doesn’t overlap border */
  padding: 0 0.25rem; /* optional: space around label */
}
</style>
