import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'

export const useJanitorialRequestFormStore = defineStore('janitorialRequestForm', {
  state: () => ({
    requesting_office: '',
    purpose: '',
    count_utility: null, // Number of utility workers (number)
    requested_date: null, // Date object
    requested_time: null, // Date object (time only)
    fund_source: '',
    office_head: '',
    location: '',
    requester_name: '',
    requester_position: '',
    requester_contact_number: '',
    requester_email: '',
    src: null,

    selectedRequest: '',
    loading: false,
    loading2: false,
    editMode: false,
    printMode: false,
    error: null,

    checkedSignatory: '',
    approvalSignatory: '',
    janitors: ['', '', ''],

    checkedSignatoryPosition: '',
    approvalSignatoryPosition: '',

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
  }),

  getters: {
    // Checks all required fields for form completeness
    isComplete: (state) =>
      !!state.requesting_office &&
      !!state.purpose &&
      state.utilityWorker !== null &&
      !!state.dateNeeded &&
      !!state.startTime &&
      !!state.location &&
      !!state.officeHead &&
      !!state.requestedBy &&
      !!state.position &&
      !!state.contactNo &&
      !!state.emailOfRequester &&
      !!state.src,
  },

  actions: {
    resetForm() {
      this.requesting_office = ''
      this.purpose = ''
      this.count_utility = null
      this.requested_date = null
      this.requested_time = null
      this.fund_source = ''
      this.location = ''
      this.office_head = ''
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
          count_utility: this.count_utility,
          requested_date: dayjs(this.requested_date).format('YYYY-MM-DD'),
          requested_time: dayjs(this.requested_time).format('HH:mm:ss'),
          location: this.location,
          fund_source: this.fund_source,
          office_head: this.office_head,
          requester_name: this.requester_name,
          requester_position: this.requester_position,
          requester_contact_number: this.requester_contact_number,
          requester_email: this.requester_email,
        }

        const response = await axios.post('/api/janitorial-requests', formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })
        return response.data
      } catch (error) {
        throw error
      }
    },

    async submitApprovalForm(id) {
      try {
        const authStore = useAuthStore()

        const formData = {
          signatories: [
            {
              id: this.checkedSignatory,
              label: 'Noted by',
            },
            {
              id: this.approvalSignatory,
              label: 'Approving Officer',
            },
          ],
          janitors: this.janitors
            .filter((j) => j && j.trim() !== '')
            .map((j) => ({ full_name: j })),
        }

        const hasEmptySignatory = formData.signatories.some((s) => !s.id || s.id === '')

        const hasEmptyJanitor = formData.janitors.some(
          (j) => !j.full_name || j.full_name.trim() === '',
        )

        if (hasEmptySignatory || hasEmptyJanitor) {
          throw new Error('Form contains empty fields.')
        }

        const response = await axios.post(`/api/janitorial-requests/${id}/process`, formData, {
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
          `/api/janitorial-requests/${id}`,
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

    async getJanitorialRequests(token, page, perPage, query = '', sortBy = '', sortDir = '') {
      const response = await axios.get('/api/janitorial-requests', {
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
      this.janitorialRequests = response.data.data
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
