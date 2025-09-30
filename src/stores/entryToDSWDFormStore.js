import { defineStore } from 'pinia'
import axios from 'axios'

export const usePremisesFormStore = defineStore('premisesForm', {
  state: () => ({
    requesting_office: '',
    dateRequested: null,
    dateNeeded: null,
    requestedBy: '',
    position: '',
    contactNo: '',
    emailOfRequester: '',
    src: null, // base64 of e-signature
    guests: [{ name: '', project: '' }], // initialize with one guest
  }),

  getters: {
    isComplete: (state) =>
      !!state.requesting_office &&
      !!state.dateRequested &&
      !!state.dateNeeded &&
      !!state.requestedBy &&
      !!state.position &&
      !!state.contactNo &&
      !!state.emailOfRequester &&
      !!state.src &&
      state.guests.length > 0 &&
      state.guests.every((g) => g.name && g.project),
  },

  actions: {
    resetForm() {
      this.requesting_office = ''
      this.dateRequested = null
      this.dateNeeded = null
      this.requestedBy = ''
      this.position = ''
      this.contactNo = ''
      this.emailOfRequester = ''
      this.src = null
      this.guests = [{ name: '', project: '' }]
    },

    addGuest() {
      if (this.guests.length < 20) {
        this.guests.push({ name: '', project: '' })
      }
    },

    removeGuest(index) {
      if (this.guests.length > 1) {
        this.guests.splice(index, 1)
      }
    },

    async submitForm() {
      try {
        const formData = {
          requesting_office: this.requesting_office,
          dateRequested: this.dateRequested,
          dateNeeded: this.dateNeeded,
          position: this.position,
          requestedBy: this.requestedBy,
          contactNo: this.contactNo,
          emailOfRequester: this.emailOfRequester,
          src: this.src,
          guests: this.guests,
        }

        const response = await axios.post('/api/premises-entry-request', formData)
        return response.data
      } catch (error) {
        throw error
      }
    },
  },
})
