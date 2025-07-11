<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const selectedItem = ref(null)
const isLoading = ref(false)

const items = [
  {
    name: 'Building and Grounds TA',
    image: new URL('@/assets/tools.svg', import.meta.url).href,
    description: 'Request technical assistance for building and facility concerns',
    route: '/request-forms/buildingAndGroundsTARequest',
  },
  {
    name: 'Official Vehicle',
    image: new URL('@/assets/vehicle.svg', import.meta.url).href,
    description: 'Request use of an official vehicle for authorized travel',
    route: '/request-forms/officialVehicleRequest',
  },
  {
    name: 'Conference Room',
    image: new URL('@/assets/house.svg', import.meta.url).href,
    description: 'Reserve a conference room for meetings or events',
    route: '/request-forms/conferenceRoomRequest',
  },
  {
    name: 'Air Transport Order',
    image: new URL('@/assets/airplane.svg', import.meta.url).href,
    description: 'Request air travel arrangements for official business',
    route: '/request-forms/airTransportOrderRequest',
  },
  {
    name: 'Entry to DSWD Premises',
    image: new URL('@/assets/key.svg', import.meta.url).href,
    description: 'Request access permission to DSWD Offices or facilities',
    route: '/request-forms/entryToDSWDPremisesRequest',
  },
  {
    name: 'Overnight Parking',
    image: new URL('@/assets/cone.svg', import.meta.url).href,
    description: 'Request approval to park a vehicle overnight on premises',
    route: '/request-forms/overnightParkingRequest',
  },
  {
    name: 'Janitorial Services',
    image: new URL('@/assets/bottle.svg', import.meta.url).href,
    description: 'Request cleaning/sanitation/etc services for office/facility areas',
    route: '/request-forms/janitorialServicesRequest',
  },
]
</script>

<template>
  <RouterLink
    v-for="item in items"
    :key="item.name"
    :to="item.route"
    class="cursor-pointer transition duration-300 max-w-70 mx-auto group"
  >
    <Card
      class="h-80 flex flex-col items-center justify-between text-center p-6 border border-gray-200 shadow-lg transition duration-300"
    >
      <template #header>
        <img
          :src="item.image"
          :alt="item.name"
          class="w-24 h-24 mx-auto mb-4 transition duration-300 group-hover:brightness-0 group-hover:invert"
        />
      </template>

      <template #title>
        <h2 class="text-xl font-bold transition duration-300 group-hover:text-white">
          {{ item.name }}
        </h2>
      </template>

      <template #subtitle>
        <p class="transition duration-300 text-gray-600 group-hover:text-white">
          {{ item.description }}
        </p>
      </template>
    </Card>
  </RouterLink>
</template>

<style scoped>
:deep(.p-card) {
  transition: background-color 0.3s ease;
}
:deep(.p-card) {
  background: linear-gradient(to bottom right, #ffffff, #d1e2fe);
  color: inherit;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}
.group:hover :deep(.p-card) {
  background: #1e40af;
  color: white;
}
</style>
