<template>
  <div class="flex flex-col min-h-screen md:flex-row">
    <main class="fixed top-0 right-0 flex-1 w-screen md:w-auto z-50">
      <TopNavBar />
    </main>

    <div class="bg-white w-screen pt-4 px-24 rounded-lg">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import TopNavBar from '@/components/TopNavMenubar.vue'
</script>
