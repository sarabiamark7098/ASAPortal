<template>
  <div class="flex flex-col min-h-screen md:flex-row">
    <!-- Sidebar (shown only if authenticated) -->
    <SideNavBar class="w-full md:w-64" />

    <!-- Main content -->
    <main class="flex-1 w-screen md:w-auto bg-gray-100">
      <TopNavBar />

      <div class="p-4 overflow-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import SideNavBar from '@/components/SideNavBar.vue'
import TopNavBar from '@/components/TopNavBar.vue';
</script>
