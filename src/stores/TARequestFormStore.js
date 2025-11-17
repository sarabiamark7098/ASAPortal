import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'

export const useTARequestFormStore = defineStore('TARequestForm', {
  state: () => ({
    requesting_office: '',
    drn: '',
    date_requested: new Date(),
    request_type: [],
    request_nature: [],
    other_type: '',
    other_nature: '',
    details: '',
    requester_name: '',
    requester_position: '',
    requester_contact_number: '',
    requester_email: '',
    src: null,
    preview: '',

    selectedRequest: '',
    loading: false,
    loading2: false,
    editMode: false,
    printMode: false,
    error: null,

    checkedSignatory: '',
    approvalSignatory: '',

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

  actions: {
    async resetForm() {
      this.requesting_office = ''
      this.drn = ''
      this.date_requested = new Date()
      this.request_type = []
      this.request_nature = []
      this.other_type = ''
      this.other_nature = ''
      this.details = ''
      this.requester_name = ''
      this.requester_position = ''
      this.requester_contact_number = ''
      this.requester_email = ''
      this.src = null
      this.preview = null
    },

    async submitForm() {
      const authStore = useAuthStore()
      try {
        const formData = {
          requesting_office: this.requesting_office,
          drn: this.drn,
          date_requested: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          request_type: this.request_type,
          request_nature: this.request_nature,
          other_type: this.other_type,
          other_nature: this.other_nature,
          details: this.details,
          request_detail: this.request_detail,
          requester_name: this.requester_name,
          requester_position: this.requester_position,
          requester_contact_number: this.requester_contact_number,
          requester_email: this.requester_email,
          files: [
            {
              label: 'Signature',
              file: this.src,
            },
          ],
        }

        const response = await axios.post('/api/assistance-requests', formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'multipart/form-data',
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

        const formData = {
          signatories: [
            {
              id: this.checkedSignatory,
              label: 'Checked by',
            },
            {
              id: this.approvalSignatory,
              label: 'Approving Officer',
            },
          ],
        }

        const isEmpty = Object.values(formData).some(
          (value) => value === null || value === '' || value === undefined,
        )

        if (isEmpty) {
          throw new Error('Form contains empty fields.')
        }

        const response = await axios.post(`/api/assistance-requests/${id}/process`, formData, {
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
          `/api/assistance-requests/${id}`,
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

    async getTARequests(token, page, perPage, query = '', sortBy = '', sortDir = '') {
      const response = await axios.get('/api/assistance-requests', {
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
      this.TARequests = response.data.data
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
