import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'

export const useAirTravelOrderFormStore = defineStore('airTravelOrderForm', {
  state: () => ({
    requesting_office: '',
    fund_source: '',
    requested_date: new Date(),
    trip_ticket_type: null,

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
        destination_from: '',
        destination_to: '',
        trip_type: null,
        date_depart: null,
        etd: '',
        eta: '',
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

    submitting: false,
    loading: false,

    options_type: ['One-Way', 'Round-Trip'],
    options_mode: ['Depart', 'Return'],

    errors: {
      guests: [],
      flights: [],
      files: {},
    },
  }),

  actions: {
    validateForm() {
      this.errors = { guests: [], flights: [], files: {} }
      let valid = true

      // ✅ Guests Validation
      this.guests.forEach((guest, index) => {
        const guestErrors = {}

        if (!guest.first_name) guestErrors.first_name = 'First name is required.'
        if (!guest.last_name) guestErrors.last_name = 'Last name is required.'
        if (!guest.birth_date) guestErrors.birth_date = 'Birth date is required.'
        if (!guest.position) guestErrors.position = 'Position is required.'

        if (!guest.email) {
          guestErrors.email = 'Email is required.'
        } else if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email) ||
          !(guest.email.endsWith('@gmail.com') || guest.email.endsWith('@dswd.gov.ph'))
        ) {
          guestErrors.email = 'Invalid email domain. Use Gmail or DSWD email.'
        }

        if (!guest.contact_number) guestErrors.contact_number = 'Contact number is required.'

        this.errors.guests[index] = guestErrors
        if (Object.keys(guestErrors).length > 0) valid = false
      })

      // ✅ Flights Validation
      this.flights.forEach((flight, index) => {
        const flightErrors = {}

        if (!flight.destination_from || !flight.destination_to) {
          flightErrors.destination = 'Both destinations are required.'
        }

        if (!flight.trip_type) flightErrors.trip_type = 'Trip type is required.'
        if (!flight.date_depart) flightErrors.date_depart = 'Departure date is required.'

        this.errors.flights[index] = flightErrors
        if (Object.keys(flightErrors).length > 0) valid = false
      })

      // ✅ File Validation (PDF only)
      const fileErrors = {}
      if (this.specialOrderFile && this.specialOrderFile.type !== 'application/pdf') {
        fileErrors.specialOrderFile = 'Only PDF files are allowed.'
      }
      if (this.travelOrderFile && this.travelOrderFile.type !== 'application/pdf') {
        fileErrors.travelOrderFile = 'Only PDF files are allowed.'
      }
      this.errors.files = fileErrors
      if (Object.keys(fileErrors).length > 0) valid = false

      return valid
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
          date_depart: flight.date_depart ? new Date(flight.date_depart).toISOString() : null,
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
      this.trip_ticket_type = null

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
          destination_from: '',
          destination_to: '',
          trip_type: null,
          date_depart: null,
          etd: '',
          eta: '',
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

      this.errors = { guests: [], flights: [], files: {} }
    },
  },
})
