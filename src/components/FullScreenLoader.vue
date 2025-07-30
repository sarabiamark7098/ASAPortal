<!-- src/components/FullScreenLoader.vue -->
<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center"
  >
    <svg
      class="animate-spin h-12 w-12 text-blue-600 mb-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
    <p class="text-lg text-gray-800 font-semibold">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  message: {
    type: String,
    default: 'Loading...',
  },
})
</script>
