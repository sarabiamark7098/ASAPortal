import { defineStore } from 'pinia'
import axios from 'axios'

export const useOvernightFormStore = defineStore('overnightForm', {
  state: () => ({
    requestingOffice: '',
    dateRequested: null,
    dateNeeded: null,
    dateEnding: null,
    requestedBy: '',
    position: '',
    contactNo: '',
    emailOfRequester: '',
    division: null,
    plateNumber: '',
    justification: '',
    startTime: null,
    src: null, // base64 string for e-signature
    supportingDocument: null,
    supportingDocumentFileName: '',
  }),

  getters: {
    isComplete: (state) =>
      !!state.requestingOffice &&
      !!state.dateRequested &&
      !!state.dateNeeded &&
      !!state.dateEnding &&
      !!state.requestedBy &&
      !!state.position &&
      !!state.contactNo &&
      !!state.emailOfRequester &&
      !!state.division &&
      !!state.plateNumber &&
      !!state.justification &&
      !!state.startTime &&
      !!state.src &&
      !!state.supportingDocument &&
      !!state.supportingDocumentFileName,
  },

  actions: {
    resetForm() {
      this.requestingOffice = ''
      this.dateRequested = null
      this.dateNeeded = null
      this.dateEnding = null
      this.requestedBy = ''
      this.position = ''
      this.contactNo = ''
      this.emailOfRequester = ''
      this.division = null
      this.plateNumber = ''
      this.justification = ''
      this.startTime = null
      this.src = null
      this.supportingDocument = null
      this.supportingDocumentFileName = ''
    },

    async submitForm() {
      try {
        const formData = new FormData()

        formData.append('requestingOffice', this.requestingOffice)
        formData.append('dateRequested', this.dateRequested)
        formData.append('dateNeeded', this.dateNeeded)
        formData.append('dateEnding', this.dateEnding)
        formData.append('requestedBy', this.requestedBy)
        formData.append('position', this.position)
        formData.append('contactNo', this.contactNo)
        formData.append('emailOfRequester', this.emailOfRequester)
        formData.append('division', this.division)
        formData.append('plateNumber', this.plateNumber)
        formData.append('justification', this.justification)
        formData.append('startTime', this.startTime)

        // E-signature base64 string
        formData.append('src', this.src)

        // Supporting document file if available
        if (this.supportingDocument) {
          formData.append('supportingDocument', this.supportingDocument)
        }

        const response = await axios.post('/api/overnight-parking-request', formData, {
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
