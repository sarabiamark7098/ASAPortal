import { defineStore } from 'pinia'
import axios from 'axios'

export const useConferenceFormStore = defineStore('conferenceForm', {
  state: () => ({
    requestingOffice: '',
    dateRequested: new Date(),
    purpose: '',
    dateNeeded: null,
    dateEnding: null,
    timeNeeded: null,
    timeEnding: null,
    numberOfPersons: '',
    focal: '',
    selectedConferenceRoom: '',
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
          dateRequested: this.dateRequested,
          purpose: this.purpose,
          dateNeeded: this.dateNeeded,
          dateEnding: this.dateEnding,
          timeNeeded: this.timeNeeded,
          timeEnding: this.timeEnding,
          numberOfPersons: this.numberOfPersons,
          focal: this.focal,
          selectedConferenceRoom: this.selectedConferenceRoom,
          requestedBy: this.requestedBy,
          position: this.position,
          contactNo: this.contactNo,
          emailOfRequester: this.emailOfRequester,
          src: this.src,
        }

        const response = await axios.post('/api/conference-request', formData)
        return response.data
      } catch (error) {
        throw error
      }
    },
  },
})
