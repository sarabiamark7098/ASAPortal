import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const useVehicleFormStore = defineStore('vehicleForm', {
  state: () => ({
    plateNumber: '',
    unitType: '',
    vehicleModel: '',
    brand: '',
    
    driverName: '',
    vehicleList: [],
    selectedVehicle: '',
    loading: false,
    loading2: false,
    error: null,

    // Table interaction refs
    rows: 20,
    first: 0,
    searchInput: '',
    sortField: null,
    sortOrder: null,
    totalRecords: 0,

    visible: false,
    submitting: false,
    showErrors: false,
  }),
  getters: {
    isComplete: (state) =>
      !!state.requestingOffice &&
      !!state.purpose &&
      !!state.passengers &&
      !!state.dateNeeded &&
      !!state.dateEnding &&
      !!state.startTime &&
      !!state.placeOfTravel &&
      !!state.requestedBy &&
      !!state.position &&
      !!state.contactNo &&
      !!state.emailOfRequester &&
      !!state.src,
  },
  actions: {
    resetForm() {

    },

    async submitForm() {
      try {
        const authStore = useAuthStore()
        const formData = {
          date_requested: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          requesting_office: this.requestingOffice,
          purpose: this.purpose,
          passengers: this.passengers,
          requested_start: dayjs(this.dateNeeded).format('YYYY-MM-DD'),
          requested_time: dayjs(this.startTime).format('HH:mm:ss'),
          requested_end: dayjs(this.dateEnding).format('YYYY-MM-DD'),
          destination: this.placeOfTravel,
          requester_name: this.requestedBy,
          requester_position: this.position,
          requester_contact_number: this.contactNo,
          requester_email: this.emailOfRequester,
        }

        const isEmpty = Object.values(formData).some(
          (value) => value === null || value === '' || value === undefined,
        )

        if (isEmpty) {
          throw new Error('Form contains empty fields.')
        }

        const response = await axios.post('/api/vehicle-requests', formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })
        return response.data
      } catch (error) {
        throw error
      }
    },

    async getAllVehicles(token) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/vehicle', {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.vehicleRequests = response.data.data || response.data
      } catch (err) {
        this.error = err
        console.error('Failed to fetch:', err)
      } finally {
        this.loading = false
      }
    },

    async getVehicle(token, page, perPage, query = '', sortBy = '', sortDir = '') {
      const response = await axios.get('/api/vehicle-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          per_page: perPage,
          query,
          sort_by: sortBy,
          sort_order: sortDir,
        },
      })
      this.vehicleRequests = response.data.data
      this.totalRecords = response.data.total
    },

    async getApprovedVehicleRequestsEachMonth(token, query = '') {
      const response = await axios.get('/api/vehicle-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          query,
        },
      })
      this.vehicleRequests = response.data.data
      this.totalRecords = response.data.total
    },
  },
})
