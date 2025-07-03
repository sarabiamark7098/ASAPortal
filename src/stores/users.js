import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

export const useUsersStore = defineStore('users', {
  state: () => ({
    userList: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAllUsers() {
      this.loading = true
      try {
        const res = await axios.get('/api/users')
        this.userList = res.data
      } catch (error) {
        this.userList = []
        this.error = error.response?.data?.message || 'Failed to fetch users'
        console.error('Fetch users error:', error)
      } finally {
        this.loading = false
      }
    },

    async updateUser(id, updatedData) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Authentication token is missing')
        }

        const res = await axios.put(`/api/users/${id}`, updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Trigger reactive update
        const index = this.userList.findIndex((user) => user.id === id)
        if (index !== -1) {
          this.userList.splice(index, 1, res.data)
        }

        return res.data
      } catch (error) {
        console.error('Update user error:', error)
        throw new Error(error.response?.data?.message || 'Failed to update user')
      } finally {
        this.loading = false
      }
    },
  },
})
