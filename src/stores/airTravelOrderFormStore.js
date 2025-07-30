import { defineStore } from 'pinia'
import axios from 'axios'

export const useAirTravelOrderFormStore = defineStore('airTravelOrderForm', {
  state: () => ({
    requestingOffice: '',
    fundSource: '',
    dateRequested: new Date(),
    roundTrip: false,
    connectingFlight: false,
    guests: [{ name: '' }],
    flights: [
      {
        destination: '',
        dateDeparture: null,
        departureETD: '',
        departureETA: '',
        dateArrival: null,
        arrivalETD: '',
        arrivalETA: '',
      },
    ],
    requestedBy: '',
    position: '',
    contactNo: '',
    emailOfRequester: '',
    specialOrderFile: null,
    specialOrderFileName: '',
    travelOrderFile: null,
    travelOrderFileName: '',
  }),

  actions: {
    async submitForm() {
      try {
        const formData = new FormData()

        formData.append('requestingOffice', this.requestingOffice)
        formData.append('fundSource', this.fundSource)
        formData.append('dateRequested', this.dateRequested.toISOString())
        formData.append('roundTrip', this.roundTrip ? '1' : '0')
        formData.append('connectingFlight', this.connectingFlight ? '1' : '0')
        formData.append('requestedBy', this.requestedBy)
        formData.append('position', this.position)
        formData.append('contactNo', this.contactNo)
        formData.append('emailOfRequester', this.emailOfRequester)
        formData.append('guests', JSON.stringify(this.guests))

        const formattedFlights = this.flights.map((flight) => ({
          ...flight,
          dateDeparture: flight.dateDeparture ? new Date(flight.dateDeparture).toISOString() : null,
          dateArrival: flight.dateArrival ? new Date(flight.dateArrival).toISOString() : null,
        }))
        formData.append('flights', JSON.stringify(formattedFlights))

        if (this.specialOrderFile) {
          formData.append('specialOrderFile', this.specialOrderFile)
          formData.append(
            'specialOrderFileName',
            this.specialOrderFileName || this.specialOrderFile.name,
          )
        }

        if (this.travelOrderFile) {
          formData.append('travelOrderFile', this.travelOrderFile)
          formData.append(
            'travelOrderFileName',
            this.travelOrderFileName || this.travelOrderFile.name,
          )
        }

        const response = await axios.post('/api/air-travel-request', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        return response.data
      } catch (error) {
        console.error('Air Travel Order form submission failed:', error)
        throw error
      }
    },

    reset() {
      this.requestingOffice = ''
      this.fundSource = ''
      this.dateRequested = new Date()
      this.roundTrip = false
      this.connectingFlight = false
      this.guests = [{ name: '' }]
      this.flights = [
        {
          destination: '',
          dateDeparture: null,
          departureETD: '',
          departureETA: '',
          dateArrival: null,
          arrivalETD: '',
          arrivalETA: '',
        },
      ]
      this.requestedBy = ''
      this.position = ''
      this.contactNo = ''
      this.emailOfRequester = ''
      this.specialOrderFile = null
      this.specialOrderFileName = ''
      this.travelOrderFile = null
      this.travelOrderFileName = ''
    },
  },
})
