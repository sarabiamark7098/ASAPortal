import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const useVehicleFormStore = defineStore('vehicleForm', {
  state: () => ({
    plateNumber: '',
    vehicleModel: '',
    brand: '',
    unitType: '',
    lastName: '',
    firstName: '',
    driverPosition: '',
    officialStation: '',
    email: '',
    contactNumber: '',
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

    async submitApprovalForm(id, availability) {
      try {
        const authStore = useAuthStore()

        const isAvailable = availability === 'Available'

        const formData = {
          vehicle_assignment_id: isAvailable ? this.vehicleAssigned : 'N/A',
          is_vehicle_available: isAvailable,
          signatories: [],
        }

        if (isAvailable) {
          formData.signatories = [
            {
              id: this.checkedSignatory,
              label: 'Dispatcher',
            },
            {
              id: this.requestingSignatory,
              label: 'GSS Head',
            },
            {
              id: this.approvalSignatory,
              label: 'Division Chief',
            },
            {
              id: this.SOSignatory,
              label: 'Approval Officer',
            },
          ]
        } else {
          formData.signatories = [
            {
              id: this.checkedSignatory,
              label: 'Dispatcher',
            },
            {
              id: this.approvalSignatory,
              label: 'Division Chief',
            },
            {
              id: this.CNASSignatory,
              label: 'CNAS Approving',
            },
          ]
        }

        const isEmpty = Object.values(formData).some(
          (value) => value === null || value === '' || value === undefined,
        )

        if (isEmpty) {
          throw new Error('Form contains empty fields.')
        }

        const response = await axios.post(`/api/vehicle-requests/${id}/process`, formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })
        this.selectedRequest = response.data
        return response.data
      } catch (error) {
        throw error
      }
    },
    async putApprovalStatus(id, status) {
      try {
        const authStore = useAuthStore()
        const response = await axios.put(
          `/api/vehicle-requests/${id}`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          },
        )
        this.selectedRequest = response.data
        return response.data
      } catch (error) {
        throw error
      }
    },

    async getVehicleTransactions(token) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/vehicle-requests', {
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

    async getVehicleRequests(token, page, perPage, query = '', sortBy = '', sortDir = '') {
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
