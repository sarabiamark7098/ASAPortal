import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'

export const useVehicleRequestFormStore = defineStore('vehicleRequestForm', {
  state: () => ({
    requesting_office: '',
    purpose: '',
    passengers: '',
    requested_start: null,
    requested_end: null,
    requested_time: null,
    destination: '',
    requester_name: '',
    requester_position: '',
    requester_contact_number: '',
    requester_email: '',
    src: '',
    vehicleList: [],
    selectedRequest: '',
    loading: false,
    loading2: false,
    editMode: false,
    editModeCNAS: false,
    printMode: false,
    error: null,

    checkedSignatory: '',
    requestingSignatory: '',
    approvalSignatory: '',
    SOSignatory: '',
    CNASSignatory: '',

    vehicleAssigned: '',

    approveDisapprove: '',

    editingRequest: null,

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

    checkedSignatoryPosition: '',
    requestingSignatoryPosition: '',
    approvalSignatoryPosition: '',
    SOSignatoryPosition: '',
    CNASSignatoryPosition: '',

    vehicleOptions: [],
    selectedVehicle: null,
    model: '',
    brand: '',
    unit_type: '',
    last_name: '',
    first_name: '',
    driver_position: '',
    official_station: '',
    email: '',
    contact_number: '',
  }),
  getters: {
    isComplete: (state) =>
      !!state.requesting_office &&
      !!state.purpose &&
      !!state.passengers &&
      !!state.requested_start &&
      !!state.requested_end &&
      !!state.requested_time &&
      !!state.destination &&
      !!state.requester_name &&
      !!state.requester_position &&
      !!state.requester_contact_number &&
      !!state.requester_email &&
      !!state.src,
  },
  actions: {
    resetForm() {
      this.requesting_office = ''
      this.purpose = ''
      this.passengers = ''
      this.requested_start = null
      this.requested_end = null
      this.requested_time = null
      this.destination = ''
      this.requester_name = ''
      this.requester_position = ''
      this.requester_contact_number = ''
      this.requester_email = ''
      this.src = null
    },

    async submitForm() {
      try {
        const authStore = useAuthStore()
        const formData = {
          date_requested: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          requesting_office: this.requesting_office,
          purpose: this.purpose,
          passengers: this.passengers,
          requested_start: dayjs(this.requested_start).format('YYYY-MM-DD'),
          requested_time: dayjs(this.requested_time).format('HH:mm:ss'),
          requested_end: dayjs(this.requested_end).format('YYYY-MM-DD'),
          destination: this.destination,
          requester_name: this.requester_name,
          requester_position: this.requester_position,
          requester_contact_number: this.requester_contact_number,
          requester_email: this.requester_email,
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
  },
})
