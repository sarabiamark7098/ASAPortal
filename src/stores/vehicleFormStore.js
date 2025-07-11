import { defineStore } from 'pinia'
import axios from 'axios'

export const useVehicleFormStore = defineStore('vehicleForm', {
  state: () => ({
    requestingOffice: '',
    purpose: '',
    passengers: '',
    dateNeeded: null,
    dateEnding: null,
    startTime: null,
    placeOfTravel: '',
    requestedBy: '',
    contactNo: '',
    emailOfRequester: '',
    src: '',
  }),
  getters: {
    isComplete: (state) =>
      !!state.requestingOffice &&
      !!state.purpose &&
      !!state.passengers &&
      !!state.dateNeeded &&
      !!state.dateEnding &&
      !!state.startTime &&
      !!state.placeOfTravel &&
      !!state.requestedBy &&
      !!state.contactNo &&
      !!state.emailOfRequester &&
      !!state.src,
  },
  actions: {
    resetForm() {
      this.requestingOffice = ''
      this.purpose = ''
      this.passengers = ''
      this.dateNeeded = null
      this.dateEnding = null
      this.startTime = null
      this.placeOfTravel = ''
      this.requestedBy = ''
      this.contactNo = ''
      this.emailOfRequester = ''
      this.src = null
    },

    async submitForm() {
      try {
        const formData = {
          requestingOffice: this.requestingOffice,
          purpose: this.purpose,
          passengers: this.passengers,
          dateNeeded: this.dateNeeded,
          dateEnding: this.dateEnding,
          startTime: this.startTime,
          placeOfTravel: this.placeOfTravel,
          requestedBy: this.requestedBy,
          contactNo: this.contactNo,
          emailOfRequester: this.emailOfRequester,
          src: this.src,
        }

        const response = await axios.post('/api/vehicle-request', formData)
        return response.data
      } catch (error) {
        throw error
      }
    },
  },
})
