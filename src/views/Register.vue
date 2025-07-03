<template>
  <div v-if="loading" class="text-center py-10">
    <svg
      class="animate-spin h-8 w-8 mx-auto text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
    <p class="text-sm text-gray-600 mt-2">Loading Registration Page...</p>
  </div>
  <div
    v-else
    class="bg-[url(@/assets/DSWDFOXI.jpg)] bg-center bg-cover bg-no-repeat h-screen w-screen relative flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-gray-300 opacity-50"></div>
    <div
      class="relative z-10 max-w-screen-lg mx-auto mt-0 p-4 sm:p-6 bg-gray-50 shadow-lg rounded-lg overflow-y-auto max-h-[90vh]"
    >
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
      <form @submit.prevent="register" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="sm:col-span-2">
          <label for="username" class="font-medium block mb-1">Username</label>
          <InputText
            v-model="form.username"
            type="text"
            id="username"
            required
            class="w-full input"
          />
        </div>
        <div class="sm:col-span-2">
          <label for="email" class="font-medium block mb-1">Email</label>
          <InputText v-model="form.email" type="email" id="email" required class="w-full input" />
        </div>
        <div class="sm:col-span-2">
          <label for="password" class="font-medium block mb-1">Password</label>
          <Password
            id="password"
            v-model="form.password"
            toggleMask
            promptLabel="Enter password"
            weakLabel="Weak"
            mediumLabel="Medium"
            strongLabel="Strong"
            required
            class="w-full"
          />
        </div>
        <div class="sm:col-span-2">
          <label for="password_confirmation" class="font-medium block mb-1">Confirm Password</label>
          <Password
            id="password_confirmation"
            v-model="form.password_confirmation"
            toggleMask
            promptLabel="Enter password"
            weakLabel="Weak"
            mediumLabel="Medium"
            strongLabel="Strong"
            required
            class="w-full"
          />
        </div>
        <div>
          <label for="firstName" class="font-medium block mb-1">First Name</label>
          <InputText
            v-model="form.firstName"
            type="text"
            id="firstName"
            required
            class="w-full input"
          />
        </div>
        <div>
          <label for="middleName" class="font-medium block mb-1">Middle Name</label>
          <InputText v-model="form.middleName" type="text" id="middleName" class="w-full input" />
        </div>
        <div>
          <label for="lastName" class="font-medium block mb-1">Last Name</label>
          <InputText
            v-model="form.lastName"
            type="text"
            id="lastName"
            required
            class="w-full input"
          />
        </div>
        <div>
          <label for="extensionName" class="font-medium block mb-1">Extension Name</label>
          <InputText
            v-model="form.extensionName"
            type="text"
            id="extensionName"
            class="w-full input"
          />
        </div>
        <div class="sm:col-span-2">
          <label for="birthDate" class="font-medium block mb-1">Birth Date</label>
          <Calendar
            v-model="form.birthDate"
            inputId="birthDate"
            showIcon
            dateFormat="yy-mm-dd"
            required
            placeholder="Select a date"
            class="w-full"
          />
        </div>
        <div class="sm:col-span-1">
          <label for="contactNumber" class="font-medium block mb-1">Contact Number</label>
          <InputText
            v-model="form.contactNumber"
            type="text"
            id="contactNumber"
            required
            class="w-full input"
          />
        </div>
        <div class="sm:col-span-1">
          <label for="position" class="font-medium block mb-1">Position</label>
          <InputText
            v-model="form.position"
            type="text"
            id="position"
            required
            class="w-full input"
          />
        </div>
        <div class="sm:col-span-2">
          <label for="division" class="font-medium block mb-1">Division</label>
          <Dropdown
            v-model="form.division"
            :options="divisionList"
            option-label="name"
            option-value="id"
            placeholder="Select a Division"
            id="division"
            required
            class="w-full input"
          />
        </div>
        <div class="sm:col-span-2">
          <label for="office" class="font-medium block mb-1">Office</label>
          <Dropdown
            v-model="form.office"
            :options="officeList"
            option-label="name"
            option-value="id"
            placeholder="Select a Office"
            id="office"
            required
            class="w-full input"
            :disabled="!form.division"
          />
        </div>

        <div class="sm:col-span-2 col-span-full mt-4">
          <Button
            label="Back to Home"
            icon="pi pi-home"
            severity="info"
            @click="router.push('/')"
            class="w-full bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
          />
        </div>
        <div class="sm:col-span-2 col-span-full mt-4">
          <Button
            label="Register"
            icon="pi pi-check"
            severity="success"
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          />
        </div>

        <p
          v-if="error || dropdownStore.error"
          class="text-red-600 text-center sm:col-span-full col-span-full mt-2"
        >
          {{ error || dropdownStore.error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// Stores
import { useDropdownStore } from '@/stores/dropdown'
import { useAuthStore } from '@/stores/auth'

// PrimeVue Components
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Password from 'primevue/password'

// Router
const router = useRouter()

// State
const loading = ref(true)
const error = ref('')

// Form state
const form = ref({
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  firstName: '',
  middleName: '',
  lastName: '',
  extensionName: '',
  birthDate: '',
  position: '',
  division: null,
  office: null,
  contactNumber: '',
})

// Stores
const authStore = useAuthStore()
const dropdownStore = useDropdownStore()
const { divisionList, officeList } = storeToRefs(dropdownStore)
const { fetchDivisions, fetchOfficesByDivision } = dropdownStore

// Registration handler
const register = async () => {
  error.value = ''
  dropdownStore.error = null

  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Passwords do not match.'
    return
  }

  // Define registration payload
  const payload = {
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    password_confirmation: form.value.password_confirmation,
    firstName: form.value.firstName,
    middleName: form.value.middleName,
    lastName: form.value.lastName,
    extensionName: form.value.extensionName,
    birthDate: form.value.birthDate,
    position: form.value.position,
    division: form.value.division,
    office: form.value.office,
    contactNumber: form.value.contactNumber,
  }

  try {
    await authStore.register(payload)
    // console.log('Registration successful:', payload)
  } catch (err) {
    console.error('Registration error:', err)
    const apiError = err.response?.data
    error.value = apiError?.message || 'An unexpected error occurred during registration.'

    // Optional: log field-specific validation errors
    if (apiError?.errors) {
      console.warn('Validation errors:', apiError.errors)
    }
  }
}

// Initial load: fetch divisions
onMounted(async () => {
  dropdownStore.error = null
  await fetchDivisions()
  loading.value = false
})

// Watch division change to load offices
watch(
  () => form.value.division,
  async (newDivisionId) => {
    if (newDivisionId) {
      form.value.office = null
      await fetchOfficesByDivision(newDivisionId)
    } else {
      dropdownStore.office = []
      form.value.office = null
    }
  },
)
</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  transition: border-color 0.2s ease;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}
.input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3);
  outline: none;
}

.max-h-\[90vh\] {
  max-height: 90vh;
}
.overflow-y-auto {
  overflow-y: auto;
}
</style>
