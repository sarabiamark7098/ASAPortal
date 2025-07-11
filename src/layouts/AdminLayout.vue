<template>
  <div class="fixed top-0 left-0 right-0 flex flex-col min-h-screen md:flex-row">
    <SideNavBar class="w-full md:w-64" />
      <main class="fixed top-0 left-64 right-0 flex-1 w-screen md:w-auto">
      <TopNavBar />

      <div class="p-4 overflow-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import SideNavBar from '@/components/SideNavBar.vue'
import TopNavBar from '@/components/TopNavBar.vue'
</script>
