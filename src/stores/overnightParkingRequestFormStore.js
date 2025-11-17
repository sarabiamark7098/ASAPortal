import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'

export const useOvernightParkingRequestFormStore = defineStore('overnightParkingRequestForm', {
  state: () => ({
    date_requested: null,
    requested_start: null,
    requested_end: null,
    requested_time: null,
    office: '',
    model: '',
    plate_number: '',
    justification: '',
    requester_name: '',
    requester_position: '',
    requester_contact_number: '',
    requester_email: '',
    src: null, // base64 string for e-signature
    preview: null,
    supportingDocument: null,
    supportingDocumentFileName: '',

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
    showSupportingDocumentError: false,
  }),

  actions: {
    resetForm() {
      this.date_requested = null
      this.requested_start = null
      this.requested_end = null
      this.requested_time = null
      this.office = ''
      this.model = ''
      this.plate_number = ''
      this.justification = ''
      this.requester_name = ''
      this.requester_position = ''
      this.requester_contact_number = ''
      this.requester_email = ''
      this.src = null
      this.preview = null
      this.supportingDocument = null
      this.supportingDocumentFileName = ''
    },

    async submitForm() {
      try {
        const authStore = useAuthStore()
        const files = []
        if (this.src) {
          files.push({ label: 'Signature', file: this.src })
        }
        if (this.supportingDocument) {
          files.push({
            label: 'Supporting Document',
            file: this.supportingDocument,
          })
        }
        const formData = {
          date_requested: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          requested_start: dayjs(this.requested_start).format('YYYY-MM-DD HH:mm:ss'),
          requested_end: dayjs(this.requested_end).format('YYYY-MM-DD HH:mm:ss'),
          requested_time: dayjs(this.requested_time).format('HH:mm:ss'),
          office: this.office,
          model: this.model,
          plate_number: this.plate_number,
          justification: this.justification,
          requester_name: this.requester_name,
          requester_position: this.requester_position,
          requester_contact_number: this.requester_contact_number,
          requester_email: this.requester_email,
          files: files,
        }

        const response = await axios.post('/api/overnight-parking-requests', formData, {
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
        }

        const hasEmptySignatory = formData.signatories.some((s) => !s.id || s.id === '')

        if (hasEmptySignatory) {
          throw new Error('Form contains empty fields.')
        }

        const response = await axios.post(
          `/api/overnight-parking-requests/${id}/process`,
          formData,
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

    async putApprovalStatus(id, status) {
      try {
        const authStore = useAuthStore()
        const response = await axios.put(
          `/api/overnight-parking-requests/${id}`,
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

    async getOvernightParkingRequests(token, page, perPage, query = '', sortBy = '', sortDir = '') {
      const response = await axios.get('/api/overnight-parking-requests', {
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
      this.overnightParkingRequests = response.data.data
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
