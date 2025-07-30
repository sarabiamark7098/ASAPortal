import { defineStore } from 'pinia'
import axios from 'axios'

export const useJanitorialFormStore = defineStore('janitorialForm', {
  state: () => ({
    requestingOffice: '',
    purpose: '',
    utilityWorker: null,        // Number of utility workers (number)
    dateNeeded: null,           // Date object
    startTime: null,            // Date object (time only)
    assignment: '',
    fund: '',
    officeHead: '',
    requestedBy: '',
    position: '',
    contactNo: '',
    emailOfRequester: '',
    src: null,                  // base64 string for e-signature
  }),

  getters: {
    // Checks all required fields for form completeness
    isComplete: (state) =>
      !!state.requestingOffice &&
      !!state.purpose &&
      state.utilityWorker !== null &&
      !!state.dateNeeded &&
      !!state.startTime &&
      !!state.assignment &&
      !!state.officeHead &&
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
      this.utilityWorker = null
      this.dateNeeded = null
      this.startTime = null
      this.assignment = ''
      this.fund = ''
      this.officeHead = ''
      this.requestedBy = ''
      this.position = ''
      this.contactNo = ''
      this.emailOfRequester = ''
      this.src = null
    },

    async submitForm() {
      try {
        const formData = new FormData()

        formData.append('requestingOffice', this.requestingOffice)
        formData.append('purpose', this.purpose)
        formData.append('utilityWorker', this.utilityWorker ?? '')
        formData.append('dateNeeded', this.dateNeeded ? this.dateNeeded.toISOString().split('T')[0] : '')
        formData.append('startTime', this.startTime ? this.startTime.toISOString() : '')
        formData.append('assignment', this.assignment)
        formData.append('fund', this.fund ?? '')
        formData.append('officeHead', this.officeHead)
        formData.append('requestedBy', this.requestedBy)
        formData.append('position', this.position)
        formData.append('contactNo', this.contactNo)
        formData.append('emailOfRequester', this.emailOfRequester)

        // E-signature base64 string
        formData.append('src', this.src)

        // Submit to your backend API
        const response = await axios.post('/api/janitorial-services-request', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        return response.data
      } catch (error) {
        throw error
      }
    },
  },
})
