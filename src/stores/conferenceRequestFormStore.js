import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'

export const useConferenceRequestFormStore = defineStore('conferenceRequestFormStore', {
  state: () => ({
    requesting_office: '',
    date_requested: new Date(),
    purpose: '',
    requested_start: null,
    requested_end: null,
    requested_time_start: null,
    requested_time_end: null,
    number_of_persons: '',
    focal: '',
    conference_room: '',
    requester_name: '',
    requester_position: '',
    requester_contact_number: '',
    requester_email: '',
    src: null,

    room: '',

    selectedRequest: '',
    loading: false,
    loading2: false,
    editMode: false,
    editModeCNAS: false,
    printMode: false,
    error: null,

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

    checkedSignatory: '',
    requestingSignatory: '',
    approvalSignatory: '',
    SOSignatory: '',
    CNASSignatory: '',

    checkedSignatoryPosition: '',
    requestingSignatoryPosition: '',
    approvalSignatoryPosition: '',
    SOSignatoryPosition: '',
    CNASSignatoryPosition: '',
  }),

  actions: {
    async resetForm() {
      this.requesting_office = ''
      this.purpose = ''
      this.requested_start = null
      this.requested_end = null
      this.requested_time_start = null
      this.requested_time_end = null
      this.number_of_persons = ''
      this.focal = ''
      this.conference_room = ''
      this.requester_name = ''
      this.requester_position = ''
      this.requester_contact_number = ''
      this.requester_email = ''
      this.src = null
    },
    async resetRoutes() {
      this.requesting_office = ''
      this.purpose = ''
      this.requested_start = null
      this.requested_end = null
      this.requested_time_start = null
      this.requested_time_end = null
      this.number_of_persons = ''
      this.focal = ''
      this.conference_room = ''
      this.requester_name = ''
      this.requester_position = ''
      this.requester_contact_number = ''
      this.requester_email = ''
      this.src = null
      this.selectedRequest = ''
      this.loading = false
      this.loading2 = false
      this.editMode = false
      this.editModeCNAS = false
      this.printMode = false
      this.error = null
    },

    async submitForm() {
      try {
        const authStore = useAuthStore()
        const formData = {
          date_requested: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          requesting_office: this.requesting_office,
          purpose: this.purpose,
          requested_start: dayjs(this.requested_start).format('YYYY-MM-DD'),
          requested_time_start: dayjs(this.requested_time_start).format('HH:mm:ss'),
          requested_end: dayjs(this.requested_end).format('YYYY-MM-DD'),
          requested_time_end: dayjs(this.requested_time_end).format('HH:mm:ss'),
          conference_room: this.conference_room,
          number_of_persons: this.number_of_persons,
          focal: this.focal,
          requester_name: this.requester_name,
          requester_position: this.requester_position,
          requester_contact_number: this.requester_contact_number,
          requester_email: this.requester_email,
        }

        const response = await axios.post('/api/conference-requests', formData, {
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
          is_conference_available: isAvailable,
          signatories: [],
        }

        if (isAvailable) {
          formData.signatories = [
            {
              id: this.checkedSignatory,
              label: 'checker',
            },
            {
              id: this.approvalSignatory,
              label: 'Division Chief',
            },
          ]
        } else {
          formData.signatories = [
            {
              id: this.checkedSignatory,
              label: 'checker',
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

        const response = await axios.post(`/api/conference-requests/${id}/process`, formData, {
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
          `/api/conference-requests/${id}`,
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

    async getRoomRequests(token, page, perPage, query = '', sortBy = '', sortDir = '', room = '') {
      const response = await axios.get('/api/conference-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          per_page: perPage,
          query,
          sort_by: sortBy,
          sort_order: sortDir,
          room: room,
        },
      })
      this.conferenceRequests = response.data.data
      this.totalRecords = response.data.total
    },
  },
})
