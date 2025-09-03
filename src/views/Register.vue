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
    class="bg-[url(@/assets/dswd_fo_xi_logo.jpg)] bg-center bg-cover bg-no-repeat h-screen w-screen relative flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-gray-300 opacity-50"></div>
    <div
      class="relative z-10 max-w-screen-lg mx-auto mt-0 p-4 sm:p-6 bg-gray-50 shadow-lg rounded-lg overflow-y-auto max-h-[90vh]"
    >
      <h2 class="text-2xl font-bold mb-12 text-center">Register</h2>
      <form @submit.prevent="register" class="flex flex-col gap-8">
        <div class="flex flex-col gap-8">
          <div class="flex flex-col sm:flex-row gap-6">
            <FloatLabel class="flex-1">
              <InputText
                v-model="authStore.username"
                type="text"
                id="username"
                autocomplete="username"
                required
                class="w-full input"
                :class="{ 'p-invalid': error && !authStore.username && !authStore.email }"
              />
              <label for="username" class="font-medium block mb-1">Username</label>
            </FloatLabel>

            <FloatLabel class="flex-1">
              <InputText
                v-model="authStore.email"
                type="email"
                id="email"
                required
                class="w-full input"
                :class="{ 'p-invalid': error && !authStore.username && !authStore.email }"
              />
              <label for="email" class="font-medium block mb-1">Email</label>
            </FloatLabel>
          </div>
          <div class="flex flex-col sm:flex-row gap-6">
            <FloatLabel class="flex-1 relative">
              <InputText
                :type="showPassword ? 'text' : 'password'"
                v-model="authStore.password"
                id="password"
                autocomplete="new-password"
                required
                class="w-full pr-12"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
              <label for="password" class="font-medium block mb-1">Password</label>
            </FloatLabel>

            <FloatLabel class="flex-1 relative">
              <InputText
                :type="showPassword1 ? 'text' : 'password'"
                v-model="authStore.password_confirmation"
                id="password_confirmation"
                class="w-full pr-12"
                autocomplete="new-password"
                required
              />
              <button
                type="button"
                @click="showPassword1 = !showPassword1"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                <i :class="showPassword1 ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
              <label for="password_confirmation" class="font-medium block mb-1">
                Confirm Password
              </label>
            </FloatLabel>
          </div>
          <div class="flex flex-col sm:flex-row gap-6">
            <FloatLabel class="flex-1">
              <InputText
                v-model="authStore.firstName"
                type="text"
                id="firstName"
                required
                class="w-full input"
              />
              <label for="firstName" class="font-medium block mb-1">First Name</label>
            </FloatLabel>

            <FloatLabel class="flex-1">
              <InputText
                v-model="authStore.middleName"
                type="text"
                id="middleName"
                class="w-full input"
              />
              <label for="middleName" class="font-medium block mb-1">Middle Name</label>
            </FloatLabel>

            <FloatLabel class="flex-1">
              <InputText
                v-model="authStore.lastName"
                type="text"
                id="lastName"
                required
                class="w-full input"
              />
              <label for="lastName" class="font-medium block mb-1">Last Name</label>
            </FloatLabel>

            <FloatLabel class="flex-1">
              <label for="extensionName" class="font-medium block mb-1">Extension Name</label>
              <InputText
                v-model="authStore.extensionName"
                type="text"
                id="extensionName"
                class="w-full input"
              />
            </FloatLabel>
          </div>
          <div class="flex flex-col sm:flex-row gap-6">
            <FloatLabel class="flex-1">
              <DatePicker
                v-model="authStore.birthDate"
                inputId="birthDate"
                showIcon
                required
                class="w-full"
              />
              <label for="birthDate" class="font-medium block mb-1">Birth Date</label>
            </FloatLabel>

            <FloatLabel class="flex-1">
              <InputMask
                v-model="authStore.contactNumber"
                id="contactNumber"
                required
                class="w-full"
                mask="0999 999 9999"
              />
              <label for="contactNumber" class="font-medium block mb-1">Contact Number</label>
            </FloatLabel>

            <FloatLabel class="flex-1">
              <InputText
                v-model="authStore.position"
                type="text"
                id="position"
                required
                class="w-full input"
              />
              <label for="position" class="font-medium block mb-1">Position</label>
            </FloatLabel>
          </div>
          <div class="flex flex-col sm:flex-row gap-6">
            <FloatLabel class="flex-1">
              <Select
                v-model="authStore.division"
                :options="divisionList"
                option-label="name"
                option-value="id"
                id="division"
                required
                class="w-full input"
              />
              <label for="division" class="font-medium block mb-1">Division</label>
            </FloatLabel>

            <FloatLabel class="flex-1">
              <Select
                v-model="authStore.office"
                :options="officeList"
                option-label="name"
                option-value="id"
                id="office"
                required
                class="w-full input"
                :disabled="!authStore.division"
              />
              <label for="office" class="font-medium block mb-1">Office</label>
            </FloatLabel>
          </div>
          <div class="flex flex-col sm:flex-row gap-6">
            <Button
              label="Back to Login"
              icon="pi pi-home"
              severity="info"
              @click="router.push('/')"
              class="flex-1 w-full bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
            />
            <Button
              type="submit"
              label="Register"
              icon="pi pi-check"
              severity="success"
              class="flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              :loading="submitting"
              :disabled="submitting"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
// Stores
import { useDropdownStore } from '@/stores/dropdown'
import { useAuthStore } from '@/stores/auth'

// Router
const router = useRouter()

// State
const showPassword = ref(false)
const showPassword1 = ref(false)
const loading = ref(true)
const error = ref('')

const submitting = ref(false)

// Stores
const authStore = useAuthStore()
const dropdownStore = useDropdownStore()
const { divisionList, officeList } = storeToRefs(dropdownStore)
const { fetchDivisions, fetchOfficesByDivision } = dropdownStore

// Registration handler
const register = async () => {
  error.value = ''
  dropdownStore.error = null

  const auth = authStore
  const errors = []
  if (!authStore.username) errors.push('Username is required.')
  if (!authStore.email) errors.push('Email is required.')
  // Simple email regex check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (authStore.email && !emailRegex.test(authStore.email)) errors.push('Invalid email format.')
  if (!authStore.password) errors.push('Password is required.')
  if (authStore.password !== authStore.password_confirmation) errors.push('Passwords do not match.')
  if (!authStore.firstName) errors.push('First Name is required.')
  if (!authStore.lastName) errors.push('Last Name is required.')

  if (errors.length > 0) {
    error.value = errors.join(' ')
    submitting.value = false
    return
  }

  if (authStore.password !== authStore.password_confirmation) {
    error.value = 'Passwords do not match.'
    return
  }

  // Define registration payload
  const payload = {
    username: authStore.username,
    email: authStore.email,
    password: authStore.password,
    first_name: authStore.firstName,
    middle_name: authStore.middleName,
    last_name: authStore.lastName,
    // extension_name: authStore.extensionName,
    position: authStore.position,
    // division: authStore.division,
    birth_date: authStore.birthDate ? dayjs(authStore.birthDate).format('YYYY-MM-DD') : null,
    // office: authStore.office,
    contact_number: authStore.contactNumber,
  }

  try {
    submitting.value = true
    await authStore.register(payload)
    submitting.value = false
    // Reset form fields
    authStore.username = ''
    authStore.email = ''
    authStore.password = ''
    authStore.password_confirmation = ''
    authStore.firstName = ''
    authStore.middleName = ''
    authStore.lastName = ''
    authStore.extensionName = ''
    authStore.birthDate = ''
    authStore.position = ''
    authStore.division = null
    authStore.office = null
    authStore.contactNumber = ''
  } catch (err) {
    console.error('Registration error:', err)
    const apiError = err.response?.data
    error.value = apiError?.message || 'An unexpected error occurred during registration.'

    // Optional: log field-specific validation errors
    if (apiError?.errors) {
      error.value = Object.values(apiError.errors).flat().join(' ')
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
  () => authStore.division,
  async (newDivisionId) => {
    if (newDivisionId) {
      authStore.office = null
      await fetchOfficesByDivision(newDivisionId)
    } else {
      dropdownStore.office = []
      authStore.office = null
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
