<template>
  <div class="h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
    <h1 class="text-5xl font-bold text-red-600 mb-4">403</h1>
    <p class="text-xl text-gray-700 mb-2">Unauthorized Access</p>
    <p class="text-gray-500 mb-6">You don’t have permission to view this page.</p>
    <router-link to="/" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Go Back Home
    </router-link>
  </div>
</template>

<script setup></script>
