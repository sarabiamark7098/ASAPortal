import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    email: (state) => state.user?.email || null,
  },

  actions: {
    async fetchUser() {
      this.loading = true
      try {
        const res = await axios.get('/api/user', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        this.user = res.data
      } catch {
        this.user = null
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      this.loading = true
      console.log('Logging in with credentials:', credentials)
      try {
        await axios.get('/sanctum/csrf-cookie')
        const response = await axios.post('/api/login', credentials)
        this.token = response.data.access_token
        localStorage.setItem('token', this.token)
        await this.fetchUser()
        router.push('/dashboard') // ✅ Redirect after login
        console.log('Login successful, user:', this.user)
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        await axios.post('/api/logout', null, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        this.user = null
        this.token = null
        localStorage.removeItem('token') 
        router.push({ name: 'login' }) // ✅ Redirect after logout
      } catch {
        this.error = 'Logout failed'
      } finally {
        this.loading = false
      }
    },
  },
})
