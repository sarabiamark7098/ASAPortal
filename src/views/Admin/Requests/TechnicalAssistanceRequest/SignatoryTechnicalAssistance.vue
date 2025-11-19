<template>
  <div v-if="form.editMode" class="flex flex-col gap-8">
    <!-- Row 1 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <Select
          v-model="form.checkedSignatory"
          :options="signatoryList"
          option-label="full_name"
          option-value="id"
          id="check"
          required
          class="w-full input"
        />
        <label for="">Checked By</label>
      </FloatLabel>
    </div>

    <!-- Row 2 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 position-label">
        <InputText class="w-full" :value="form.checkedSignatoryPosition" readonly disabled />
        <label>Position</label>
      </FloatLabel>
    </div>

    <!-- Row 3 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1">
        <Select
          v-model="form.approvalSignatory"
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

    <!-- Row 4 -->
    <div class="flex flex-col sm:flex-row gap-6">
      <FloatLabel class="flex-1 position-label">
        <InputText class="w-full" :value="form.approvalSignatoryPosition" readonly disabled />
        <label>Position</label>
      </FloatLabel>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useTARequestFormStore } from '@/stores/TARequestFormStore'
import { useAuthStore } from '@/stores/auth'
import { useDropdownStore } from '@/stores/dropdown'

const form = useTARequestFormStore()
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

  const checked = list.find((s) => s.id == form.checkedSignatory)
  form.checkedSignatoryPosition = checked ? checked.position : ''

  const approval = list.find((s) => s.id == form.approvalSignatory)
  form.approvalSignatoryPosition = approval ? approval.position : ''
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
