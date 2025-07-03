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
      if (!this.token || this.user) return
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
    hasRole(role) {
      return this.user?.roles?.includes(role)
    },
    hasPermission(permission) {
      return this.user?.permissions?.includes(permission)
    },

    async login(credentials) {
      this.loading = true
      // console.log('Logging in with credentials:', credentials)
      try {
        await axios.get('/sanctum/csrf-cookie')
        const response = await axios.post('/api/login', credentials)
        this.token = response.data.access_token
        localStorage.setItem('token', this.token)
        await this.fetchUser()
        
        // Redirect based on user role
        const roles = this.user?.roles || []
        if (roles.includes('client')) {
          router.push({ name: 'clientview' })
        } else {
          router.push({ name: 'dashboard' })
        }
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
            Authorization: `Bearer ${this.token}`,
          },
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

    async register(userData) {
      this.loading = true
      try {
        await axios.get('/sanctum/csrf-cookie')
        await axios.post('/api/register', userData)
        const loginPayload = {
          login: userData.email,
          password: userData.password,
        }
        await this.login(loginPayload)
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
