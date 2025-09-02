import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const useDriverFormStore = defineStore('driversForm', {
  state: () => ({
    first_name: '',
    middle_name: '',
    last_name: '',
    extension_name: '',
    position: '',
    designation: '',
    official_station: '',
    email: '',
    contact_number: '',
    driverList: [],
    selectedDriver: null,

    loading: true,
    loading2: false,

    // Table interaction refs
    rows: 20,
    first: 0,
    searchInput: '',
    sortField: null,
    sortOrder: null,
    totalRecords: 0,

    showEditDialog: false,
    editedUser: {},
    submitting: false,

    addDriver: false,
    updateDriver: false,
  }),
  actions: {
    async resetForm() {
      this.first_name = ''
      this.middle_name = ''
      this.last_name = ''
      this.extension_name = ''
      this.position = ''
      this.designation = ''
      this.official_station = ''
      this.email = ''
      this.contact_number = ''
      this.selectedDriver = null
    },

    setDriver(driver) {
      this.updateDriver = true
      this.first_name = driver.first_name
      this.middle_name = driver.middle_name
      this.last_name = driver.last_name
      this.extension_name = driver.extension_name
      this.position = driver.position
      this.official_station = driver.official_station
      this.designation = driver.designation
      this.email = driver.email
      this.contact_number = driver.contact_number
    },

    async getDriversList() {
      try {
        const authStore = useAuthStore()
        this.loading = true
        const response = await axios.get('/api/drivers', {
          headers: { Authorization: `Bearer ${authStore.token}` },
        })
        this.driverList = response.data.data
      } catch (error) {
        console.error('Failed to fetch drivers:', error)
        // Keep sample data if API call fails
      } finally {
        this.loading = false
      }
    },
    async getDrivers(token, page, perPage, query = '', sortBy = '', sortDir = '') {
      const authStore = useAuthStore()
      const response = await axios.get('/api/drivers', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        params: {
          page,
          per_page: perPage,
          query,
          sort_by: sortBy,
          sort_order: sortDir,
        },
      })
      this.driverList = response.data.data
      this.totalRecords = response.data.total
    },

    async submitForm() {
      try {
        this.submitting = true
        const authStore = useAuthStore()
        const payload = {
          first_name: this.first_name,
          middle_name: this.middle_name,
          last_name: this.last_name,
          extension_name: this.extension_name,
          position: this.position,
          designation: this.designation,
          official_station: this.official_station,
          email: this.email,
          contact_number: this.contact_number,
        }
        if (this.addDriver) {
          await axios.post('/api/drivers', payload, {
            headers: { Authorization: `Bearer ${authStore.token}` },
          })
        } else {
          await axios.put(`/api/drivers/${this.selectedDriver.id}`, payload, {
            headers: { Authorization: `Bearer ${authStore.token}` },
          })
        }
        setTimeout(() => {
          this.resetForm() // clear local state if needed
        }, 2000)
      } catch (error) {
        console.error('Failed to submit form:', error)
        throw error
      } finally {
        this.submitting = false
      }
    },
  },
})
