import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'

export const useVehicleFormStore = defineStore('vehicleForm', {
  state: () => ({
    requestingOffice: '',
    purpose: '',
    passengers: '',
    dateNeeded: null,
    dateEnding: null,
    startTime: null,
    placeOfTravel: '',
    requestedBy: '',
    position: '',
    contactNo: '',
    emailOfRequester: '',
    src: '',
    vehicleList: [],
    loading: false,
    error: null,
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
      this.requestingOffice = ''
      this.purpose = ''
      this.passengers = ''
      this.dateNeeded = null
      this.dateEnding = null
      this.startTime = null
      this.placeOfTravel = ''
      this.requestedBy = ''
      this.position = ''
      this.contactNo = ''
      this.emailOfRequester = ''
      this.src = null
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

    async getallVehicleTransactions(token) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/vehicle-requests', {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.vehicleList = response.data.data || response.data
      } catch (err) {
        this.error = err
        console.error('Failed to fetch:', err)
      } finally {
        this.loading = false
      }
    },
  },
})
