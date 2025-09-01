import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const useDriversFormStore = defineStore('driversForm', {
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

      this.loading = true
      this.loading2 = false
      this.rows = 20
      this.first = 0
      this.searchInput = ''
      this.sortField = null
      this.sortOrder = null

      this.submitting = false

      this.addDriver = false
      this.updateDriver = false
    },
    async getDriversList() {
      try {
        const authStore = useAuthStore()
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
    async getDrivers() {
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
  },
})
