<template>
  <div
    class="lg:flex max-w-full bg-[url(@/assets/bluecolor.png)] bg-cover bg-center bg-no-repeat relative items-center justify-center rounded-3xl shadow-2xl"
  >
    <div>
      <Snowflake v-for="i in quantity" :key="i" />
      <!-- <Firefly v-for="i in quantity" :key="i" /> -->
    </div>
    <div class="justify-center h-full pt-32 pb-12 w-full px-6 sm:px-24">
      <div class="flex flex-col items-center text-center">
        <p class="bg-blue-800 px-5 py-1 rounded-full text-white text-sm mb-6" id="request">
          <b>DSWD FO XI</b>
        </p>
        <p class="text-3xl sm:text-5xl lg:text-6xl font-bold">Administrative Services</p>
        <p class="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4">
          All-in-one <span class="text-blue-700">Portal</span>
        </p>
      </div>
      <div
        class="p-[2px] rounded-3xl bg-gradient-to-br from-white to-gray-200 w-full max-w-7xl mx-auto mt-9 relative z-20"
      >
        <div
          class="flex flex-wrap gap-5 bg-[white] bg-opacity-90 rounded-[calc(1.5rem-2px)] px-9 py-8"
        >
          <RequestCard />
        </div>
      </div>
    </div>
  </div>

  <div
    class="lg:flex max-w-full mt-24 bg-[url(@/assets/footer.png)] bg-cover bg-center bg-no-repeat relative items-center justify-center rounded-3xl shadow-2xl"
  >
    <div class="justify-center h-full pt-12 pb-12 w-full px-6 sm:px-24">
      <div class="flex flex-col items-center text-center">
        <p class="text-3xl sm:text-5xl lg:text-6xl font-bold text-white">
          All your office requests, in
        </p>
        <p class="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 text-white">one place.</p>
        <button
          type="button"
          class="mt-4 px-24 py-3 rounded-full bg-gray-200 font-bold hover:bg-black hover:text-white transition-colors duration-300"
          @click="scrollToTop"
        >
          Browse Services
        </button>
      </div>
    </div>
  </div>

  <div class="flex flex-wrap lg:flex-row sm:flex-col max-w-full mt-12 gap-24 mb-12 relative">
    <div
      class="flex-24 bg-gradient-to-r from-zinc-50 to-gray-100 items-center justify-center rounded-3xl shadow-4xl p-12 border-2 border-gray-100 shadow-lg"
    >
      <img src="@/assets/DSWD Field Office XI.png" alt="" class="w-32 h-14 mb-6" />
      <p class="indent-8 text-gray-500 text-lg text-justify">
        Get the latest updates, important advisories, and full access to DSWD’s social welfare
        programs and initiatives.
      </p>
      <a
        href="https://fo11.dswd.gov.ph"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center mt-14 px-6 py-3 rounded-full border border-gray-300 bg-gray-200 text-gray-800 font-semibold text-sm sm:text-base hover:bg-blue-700 hover:text-white transition-colors duration-300 w-full"
      >
        <span>Visit DSWD FO XI</span>
      </a>
    </div>
    <div
      class="flex-64 bg-gradient-to-r from-zinc-50 to-gray-100 items-center justify-center rounded-3xl shadow-4xl p-12 border-2 border-gray-100 shadow-lg relative"
    >
      <div class="flex flex-wrap gap-6">
        <div class="flex-12">
          <p class="text-xl font-semibold">Menu</p>

          <div class="flex flex-col gap-2 mt-2 text-lg">
            <RouterLink to="/request-forms" class="text-gray-600 hover:underline">Request Forms</RouterLink>
            <RouterLink to="/view-requests" class="text-gray-600 hover:underline">View Requests</RouterLink>
            <RouterLink to="/calendar-views" class="text-gray-600 hover:underline">Calendar Views</RouterLink>
          </div>
        </div>
        <div class="flex-12">
          <p class="text-xl font-semibold">Resources</p>
          <div class="flex flex-col gap-2 mt-2 text-lg">
            <RouterLink to="/generalforms" class="text-gray-600 hover:underline">General Forms</RouterLink>
          </div>
        </div>
        <div class="flex-24">
          <p class="text-xl font-semibold">Contact Us</p>
          <div class="flex flex-col gap-3 text-gray-600 text-lg mt-2">
            <div class="flex items-center gap-3">
              <i class="pi pi-phone text-lg"></i>
              <p>(082) 227-1964</p>
            </div>
            <div class="flex items-center gap-3">
              <i class="pi pi-map-marker text-lg"></i>
              <p>Ramon Magsaysay Ave, D Suazo St, Davao City, 8000</p>
            </div>
            <div class="flex items-center gap-3">
              <i class="pi pi-envelope text-lg"></i>
              <p>fo11@dswd.gov.ph</p>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-12 mt-10 py-4 text-gray-700 text-md">
        <p>
          © <span class="font-bold">2025</span> DSWD FO XI · General Services · Terms of Use ·
          Privacy Policy
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Snowflake from '@/assets/Snowflake.vue'
import RequestCard from '@/components/RequestCardLayout.vue'

const quantity = 100

const scrollToTop = () => {
  const el = document.getElementById('request')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.snow-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, #001f3f, #0074d9);
  overflow: hidden;
}
</style>
