import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const useSignatoryFormStore = defineStore('signatoriesForm', {
  state: () => ({
    full_name: '',
    position: '',
    signatoryList: [],
    selectedSignatory: null,

    loading: true,
    loading2: false,
    loadingaction: false,

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

    addSignatory: false,
    updateSignatory: false,
  }),
  actions: {
    async resetForm() {
      this.full_name = ''
      this.position = ''
      this.selectedSignatory = null
    },

    setSignatory(signatory) {
      this.updateSignatory = true
      this.full_name = signatory.full_name
      this.position = signatory.position
    },

    async getSignatories(token, page, perPage, query = '', sortBy = '', sortDir = '') {
      const authStore = useAuthStore()
      const response = await axios.get('/api/signatories', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        params: {
          page,
          per_page: perPage,
          query,
          sort_by: sortBy,
          sort_order: sortDir,
        },
      })
      this.signatoryList = response.data.data
      this.totalRecords = response.data.total
    },

    async submitForm() {
      try {
        this.submitting = true
        const authStore = useAuthStore()
        const payload = {
          full_name: this.full_name,
          position: this.position,
        }
        if (this.addSignatory) {
          await axios.post('/api/signatories', payload, {
            headers: { Authorization: `Bearer ${authStore.token}` },
          })
        } else {
          await axios.put(`/api/signatories/${this.selectedSignatory.id}`, payload, {
            headers: { Authorization: `Bearer ${authStore.token}` },
          })
        }
        setTimeout(() => {
          this.resetForm() // clear local state if needed
        }, 2000)
      } catch (error) {
        console.error('Failed to submit form:', error)
        throw error
      } finally {
        this.submitting = false
      }
    },
  },
})
