<template>
    <div>

    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useDriversFormStore } from '@/stores/driversFormStore'
import { useAuthStore } from '@/stores/authStore'

const driversFormStore = useDriversFormStore()
const authStore = useAuthStore()
const newDriver = ref({
  first_name: '',
  middle_name: '',
  last_name: '',
  extension_name: '',
  position: '',
  designation: '',
  official_station: '',
  email: '',
  contact_number: '',
})

</script>