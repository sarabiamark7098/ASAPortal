import { defineStore } from 'pinia'
import axios from 'axios'

export const useTAFormStore = defineStore('TAForm', {
  state: () => ({
    requestingOffice: '',
    drn: '',
    dateRequested: new Date(),
    selectedRequestTypeCategories: [],
    selectedRequestNatureCategories: [],
    otherRequestType: '',
    otherRequestNature: '',
    requestDetail: '',
    requestedBy: '',
    position: '',
    contactNo: '',
    emailOfRequester: '',
    src: null,
  }),

  actions: {
    async submitForm() {
      try {
        const formData = {
          requestingOffice: this.requestingOffice,
          drn: this.drn,
          dateRequested: this.dateRequested,
          selectedRequestTypeCategories: this.selectedRequestTypeCategories,
          selectedRequestNatureCategories: this.selectedRequestNatureCategories,
          otherRequestType: this.otherRequestType,
          otherRequestNature: this.otherRequestNature,
          requestDetail: this.requestDetail,
          requestedBy: this.requestedBy,
          position: this.position,
          contactNo: this.contactNo,
          emailOfRequester: this.emailOfRequester,
          src: this.src,
        }

        const response = await axios.post('/api/ta-request', formData)
        return response.data
      } catch (error) {
        throw error
      }
    },
  },
})
