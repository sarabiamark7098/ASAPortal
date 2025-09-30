import { defineStore } from 'pinia'
import axios from 'axios'

export const useAirTravelOrderFormStore = defineStore('airTravelOrderForm', {
  state: () => ({
    requesting_office: '',
    fund_source: '',
    requested_date: new Date(),
    trip: null, // ✅ Start as null for validation
    guests: [
      {
        first_name: '',
        last_name: '',
        birth_date: null,
        position: '',
        email: '',
        contact_number: '',
      },
    ],
    flights: [
      {
        destination: '',
        date_departure: null,
        departure_etd: '',
        departure_eta: '',
        date_arrival: null,
        arrival_etd: '',
        arrival_eta: '',
      },
    ],
    requester_name: '',
    requester_position: '',
    requester_contact_number: '',
    requester_email: '',
    specialOrderFile: null,
    specialOrderFileName: '',
    travelOrderFile: null,
    travelOrderFileName: '',
    maxGuests: 10,
    maxFlights: 10,
    showSpecialOrderError: false,
    showTravelOrderError: false,

    submitting: false,
    loading: false,

    options_type: ['One-Way', 'Round-Trip'],
    options_mode: ['Depart', 'Return'],

    errors: {
      guests: [],
      flights: [],
      requester: {},
      files: {},
      trip: null, // ✅ Add trip error here
    },
  }),

  actions: {
    validateForm() {
      this.errors = { guests: [], flights: [], requester: {}, files: {}, trip: null }

      // Trip validation
      if (this.trip === null) {
        this.errors.trip = 'Please select Yes or No for trip'
      }

      // Guests validation
      this.guests.forEach((g, i) => {
        const gErrors = {}
        if (!g.first_name) gErrors.first_name = 'First name is required'
        if (!g.last_name) gErrors.last_name = 'Last name is required'
        if (!g.birth_date) gErrors.birth_date = 'Birth date is required'
        if (!g.position) gErrors.position = 'Position is required'
        if (!g.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email))
          gErrors.email = 'Valid email is required'
        if (!g.contact_number) gErrors.contact_number = 'Contact number is required'
        this.errors.guests[i] = gErrors
      })

      // Flights validation
      this.flights.forEach((f, i) => {
        const fErrors = {}
        if (!f.destination) fErrors.destination = 'Destination is required'
        this.errors.flights[i] = fErrors
      })

      // Requester validation
      if (!this.requester_name) this.errors.requester.name = 'Requester name is required'
      if (!this.requester_position)
        this.errors.requester.position = 'Requester position is required'
      if (!this.requester_contact_number)
        this.errors.requester.contact_number = 'Contact number is required'
      if (!this.requester_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.requester_email)) {
        this.errors.requester.email = 'Valid email is required'
      }

      // File validation (PDFs only)
      if (this.specialOrderFile && this.specialOrderFile.type !== 'application/pdf') {
        this.errors.files.specialOrderFile = 'Only PDF files allowed'
      }
      if (this.travelOrderFile && this.travelOrderFile.type !== 'application/pdf') {
        this.errors.files.travelOrderFile = 'Only PDF files allowed'
      }

      return (
        this.errors.trip === null && // ✅ ensure trip is selected
        !this.errors.guests.some((e) => Object.keys(e).length > 0) &&
        !this.errors.flights.some((e) => Object.keys(e).length > 0) &&
        Object.keys(this.errors.requester).length === 0 &&
        Object.keys(this.errors.files).length === 0
      )
    },

    async submitForm() {
      if (!this.validateForm()) {
        console.warn('Form validation failed', this.errors)
        return false
      }

      try {
        this.submitting = true
        const formData = new FormData()

        formData.append('requesting_office', this.requesting_office)
        formData.append('fund_source', this.fund_source)
        formData.append('requested_date', this.requested_date?.toISOString())
        formData.append('trip', this.trip) // ✅ true or false once chosen
        formData.append('requester_name', this.requester_name)
        formData.append('requester_position', this.requester_position)
        formData.append('requester_contact_number', this.requester_contact_number)
        formData.append('requester_email', this.requester_email)

        formData.append('guests', JSON.stringify(this.guests))

        const formattedFlights = this.flights.map((flight) => ({
          ...flight,
          date_departure: flight.date_departure
            ? new Date(flight.date_departure).toISOString()
            : null,
          date_arrival: flight.date_arrival ? new Date(flight.date_arrival).toISOString() : null,
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
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        return response.data
      } catch (error) {
        console.error('Air Travel Order form submission failed:', error)
        throw error
      } finally {
        this.submitting = false
      }
    },

    reset() {
      this.requesting_office = ''
      this.fund_source = ''
      this.requested_date = new Date()
      this.trip = null // ✅ reset to null so validation runs
      this.guests = [
        {
          first_name: '',
          last_name: '',
          birth_date: null,
          position: '',
          email: '',
          contact_number: '',
        },
      ]
      this.flights = [
        {
          destination: '',
          date_departure: null,
          departure_etd: '',
          departure_eta: '',
          date_arrival: null,
          arrival_etd: '',
          arrival_eta: '',
        },
      ]
      this.requester_name = ''
      this.requester_position = ''
      this.requester_contact_number = ''
      this.requester_email = ''
      this.specialOrderFile = null
      this.specialOrderFileName = ''
      this.travelOrderFile = null
      this.travelOrderFileName = ''
      this.errors = { guests: [], flights: [], requester: {}, files: {}, trip: null }
    },
  },
})
