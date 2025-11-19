import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'

export const useAirTransportOrderFormStore = defineStore('airTransportOrderForm', {
  state: () => ({
    requesting_office: '',
    fund_source: '',
    requested_date: new Date(),
    trip_ticket_type: null,

    passengers: [
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
        trip_mode: null,
        date_departure: null,
        etd: '',
        eta: '',
      },
    ],
    signatories: [],
    requester_name: '',
    requester_position: '',
    requester_contact_number: '',
    requester_email: '',

    specialOrderFile: null,
    specialOrderFileName: '',
    travelOrderFile: null,
    travelOrderFileName: '',

    maxPassengers: 10,
    maxFlights: 10,

    options_type: ['One-Way', 'Round-Trip'],
    options_mode: ['Depart', 'Return'],

    errors: {
      passengers: [],
      flights: [],
      files: {},
    },

    selectedRequest: '',
    loading: false,
    loading2: false,
    printMode: false,
    error: null,

    approveDisapprove: '',
    editingRequest: null,

    // Table interaction refs
    rows: 20,
    first: 0,
    searchInput: '',
    sortField: null,
    sortOrder: null,
    totalRecords: 0,

    visible: false,
    submitting: false,
  }),

  actions: {
    validateForm() {
      this.errors = { passengers: [], flights: [], files: {} }
      let valid = true

      // ✅ Passengers Validation
      this.passengers.forEach((passenger, index) => {
        const passengerErrors = {}

        if (!passenger.first_name) passengerErrors.first_name = 'First name is required.'
        if (!passenger.last_name) passengerErrors.last_name = 'Last name is required.'
        if (!passenger.birth_date) passengerErrors.birth_date = 'Birth date is required.'
        if (!passenger.position) passengerErrors.position = 'Position is required.'

        if (!passenger.email) {
          passengerErrors.email = 'Email is required.'
        } else if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email) ||
          !(passenger.email.endsWith('@gmail.com') || passenger.email.endsWith('@dswd.gov.ph'))
        ) {
          passengerErrors.email = 'Invalid email domain. Use Gmail or DSWD email.'
        }

        if (!passenger.contact_number)
          passengerErrors.contact_number = 'Contact number is required.'

        this.errors.passengers[index] = passengerErrors
        if (Object.keys(passengerErrors).length > 0) valid = false
      })

      // ✅ Flights Validation
      this.flights.forEach((flight, index) => {
        const flightErrors = {}

        if (!flight.destination_from || !flight.destination_to) {
          flightErrors.destination = 'Both destinations are required.'
        }

        if (!flight.trip_mode) flightErrors.trip_mode = 'Trip type is required.'
        if (!flight.date_departure) flightErrors.date_departure = 'Departure date is required.'

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

    resetForm() {
      this.requesting_office = ''
      this.fund_source = ''
      this.requested_date = new Date()
      this.trip_ticket_type = null

      this.passengers = [
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
          trip_mode: null,
          date_departure: null,
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

      this.errors = { passengers: [], flights: [], files: {} }
    },

    async submitForm() {
      const authStore = new useAuthStore()
      if (!this.validateForm()) {
        console.warn('Form validation failed', this.errors)
        return false
      }

      const formattedPassengers = this.passengers.map((passenger) => ({
        ...passenger,
        birth_date: passenger.birth_date ? dayjs(passenger.birth_date).format('YYYY-MM-DD') : null,
      }))

      const formattedFlights = this.flights.map((flight) => ({
        ...flight,
        departure_date: dayjs(flight.date_departure).format('YYYY-MM-DD'),
        etd: flight.etd ? dayjs(flight.etd).format('HH:mm:ss') : null,
        eta: flight.eta ? dayjs(flight.eta).format('HH:mm:ss') : null,
      }))

      try {
        this.submitting = true
        const files = []
        if (this.specialOrderFile) {
          files.push({
            label: 'Special Order',
            file: this.specialOrderFile,
          })
        }
        if (this.travelOrderFile) {
          files.push({
            label: 'Travel Order',
            file: this.travelOrderFile,
          })
        }
        const formData = {
          requesting_office: this.requesting_office,
          fund_source: this.fund_source,
          date_requested: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          trip_ticket_type: this.trip_ticket_type,
          requester_name: this.requester_name,
          requester_position: this.requester_position,
          requester_contact_number: this.requester_contact_number,
          requester_email: this.requester_email,
          passengers: formattedPassengers,
          flights: formattedFlights,
          signatories: this.signatories,
          files: files,
        }

        const response = await axios.post('/api/air-transport-requests', formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        this.selectedRequest = response.data
        return response.data
      } catch (error) {
        console.error('Air Transport Order form submission failed:', error)
        throw error
      } finally {
        this.submitting = false
      }
    },

    async putApprovalStatus(id, status) {
      try {
        const authStore = useAuthStore()
        const response = await axios.put(
          `/api/air-transport-requests/${id}`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          },
        )
        this.selectedRequest = response.data
        return response.data
      } catch (error) {
        throw error
      }
    },

    async getAirTransportRequests(token, page, perPage, query = '', sortBy = '', sortDir = '') {
      const response = await axios.get('/api/air-transport-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          per_page: perPage,
          query,
          sort_by: sortBy,
          sort_order: sortDir,
        },
      })
      this.airTransportRequests = response.data.data
      this.totalRecords = response.data.total
    },

    formatDate(value) {
      return value ? dayjs(value).format('MMMM DD, YYYY') : 'N/A'
    },

    formatTime(value) {
      return value ? dayjs(`1970-01-01 ${value}`, 'HH:mm:ss').format('hh:mm A') : 'N/A'
    },
  },
})
