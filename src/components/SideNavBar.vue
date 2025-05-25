<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="relative flex min-h-screen">
    <div class="bg-cyan-600 text-cyan-100 w-64">
      <a
        href="https://fo11.dswd.gov.ph"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 p-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-10 w-10"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m9 7.5 3 4.5m0 0 3-4.5M12 12v5.25M15 12H9m6 3H9m12-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          /></svg
        ><span class="text-2xl font-extrabold text-white">ASAPortal</span>
      </a>
      <nav class="flex flex-col gap-2 overflow-y-auto h-screen px-2 pb-4">
        <RouterLink
          to="/dashboard"
          class="flex items-center gap-2 p-4 hover:bg-cyan-700 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 12h18m-9 9V3m0 18L3 12l9 9z"
            />
          </svg>
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink to="/set" class="flex items-center gap-2 p-4 hover:bg-cyan-700 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 12h18m-9 9V3m0 18L3 12l9 9z"
            />
          </svg>
          <span>Settings</span>
        </RouterLink>
      </nav>
    </div>
  </div>
</template>
<style scoped></style>
>
