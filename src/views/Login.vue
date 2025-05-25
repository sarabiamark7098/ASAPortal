<template>
  <div
    class="bg-white bg-center bg-cover bg-no-repeat h-screen w-screen relative flex items-center justify-center"
  >
    <!-- Overlay -->
    <div class="absolute inset-0 bg-gray-100 opacity-30"></div>

    <!-- Login Card -->
    <div
      class="relative z-10 text-black text-center flex flex-col gap-4 border-2 rounded-md px-6 py-10 w-full max-w-md bg-blue-100 border-gray-400 shadow-xl shadow-gray-400 mx-4"
    >
      <h1 class="text-2xl uppercase font-semibold">Login Page</h1>

      <!-- Error Message -->
      <div v-if="errorMessage" class="text-red-600 font-medium text-sm">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
        <!-- Username -->
        <div class="flex flex-col gap-2">
          <label class="text-xl font-semibold" for="username">Username</label>
          <input
            class="outline-none px-4 py-2 rounded-full bg-transparent border-2 text-black"
            type="text"
            v-model="username"
            id="username"
            required
          />
        </div>

        <!-- Password -->
        <div class="flex flex-col gap-2">
          <label class="text-xl font-semibold" for="password">Password</label>
          <input
            class="outline-none px-4 py-2 rounded-full bg-transparent border-2 text-black"
            type="password"
            v-model="password"
            id="password"
            required
          />
        </div>

        <!-- Remember + Forgot -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
          <label for="rememberMe" class="flex items-center gap-2">
            <input type="checkbox" v-model="rememberMe" id="rememberMe" />
            Remember Me
          </label>
          <RouterLink class="hover:underline text-blue-400" to="/forgot-password">
            Forgot Password?
          </RouterLink>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="loading"
          class="relative bg-blue-600 border-blue-500 text-white px-4 py-2 rounded-md text-lg w-full border-2 transition duration-200"
          :class="{
            'hover:bg-transparent hover:border-blue-800 hover:text-black': !loading,
            'opacity-70 cursor-not-allowed': loading
          }"
        >
          <span v-if="!loading">Login</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Logging in...
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await auth.login({ email: username.value, password: password.value })
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>
