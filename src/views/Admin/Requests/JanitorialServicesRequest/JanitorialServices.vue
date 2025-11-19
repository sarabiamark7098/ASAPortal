<template>
  <div v-if="form.editMode" class="flex flex-col gap-8">
    <div
      v-for="(janitor, index) in form.janitors.slice(0, form.selectedRequest.count_utility)"
      :key="index"
      class="flex flex-col sm:flex-row gap-6"
    >
      <span>{{ index + 1 }}.</span>
      <FloatLabel class="flex-1">
        <InputText :id="`janitor-${index}`" class="w-full" v-model="form.janitors[index]" />
        <label :for="`janitor-${index}`">Full Name</label>
      </FloatLabel>
    </div>
  </div>
</template>

<script setup>
import { useJanitorialRequestFormStore } from '@/stores/janitorialRequestFormStore'
import { useAuthStore } from '@/stores/auth'

const form = useJanitorialRequestFormStore()
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
