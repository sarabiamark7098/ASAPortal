import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'

export const usePremisesFormStore = defineStore('premisesForm', {
  state: () => ({
    date_requested: new Date(),
    requesting_office: '',
    requested_date: null,
    requester_name: '',
    requester_position: '',
    requester_contact_number: '',
    requester_email: '',
    src: null,
    preview: null,
    guests: [{ full_name: '', purpose: '' }],
    maxGuests: 20,
    errors: {
      guests: [],
    },

    selectedRequest: '',
    loading: false,
    loading2: false,
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
  }),

  actions: {
    validateForm() {
      this.errors = { guests: [], files: {} }
      let valid = true

      // ✅ Guests Validation
      this.guests.forEach((guest, index) => {
        const guestErrors = {}

        if (!guest.full_name) guestErrors.full_name = 'Guest name is required.'
        if (!guest.purpose) guestErrors.purpose = 'Purpose is required.'

        this.errors.guests[index] = guestErrors
        if (Object.keys(guestErrors).length > 0) valid = false
      })

      return valid
    },
    resetForm() {
      this.date_requested = null
      this.requesting_office = ''
      this.requested_date = null
      this.requester_name = ''
      this.requester_position = ''
      this.requester_contact_number = ''
      this.requester_email = ''
      this.src = null
      this.preview = null
      this.guests = [{ full_name: '', purpose: '' }]
    },

    addGuest() {
      if (this.guests.length < 20) {
        this.guests.push({ full_name: '', purpose: '' })
      }
    },

    removeGuest(index) {
      if (this.guests.length > 1) {
        this.guests.splice(index, 1)
      }
    },

    async submitForm() {
      try {
        const authStore = useAuthStore()
        const formData = {
          date_requested: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          requesting_office: this.requesting_office,
          requested_date: dayjs(this.requested_date).format('YYYY-MM-DD'),
          requester_name: this.requester_name,
          requester_position: this.requester_position,
          requester_contact_number: this.requester_contact_number,
          requester_email: this.requester_email,
          guests: this.guests,
          signatories: this.signatories,
          files: [{ label: 'Signature', file: this.src }],
        }

        const response = await axios.post('/api/entry-requests', formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'multipart/form-data',
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
          `/api/entry-requests/${id}`,
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

    async getEntryRequests(token, page, perPage, query = '', sortBy = '', sortDir = '') {
      const response = await axios.get('/api/entry-requests', {
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
      this.entryRequests = response.data.data
      this.totalRecords = response.data.total
    },

    formatDate(value) {
      return value ? dayjs(value).format('MMMM DD, YYYY') : 'N/A'
    },

    formatTime(value) {
      return value ? dayjs(`1970-01-01 ${value}`, 'HH:mm:ss').format('hh:mm A') : 'N/A'
    },
  },
})
