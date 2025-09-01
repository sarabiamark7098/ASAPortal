import { defineStore } from 'pinia'
import axios from 'axios'

export const useDropdownStore = defineStore('dropdown', {
  state: () => ({
    division: [],
    office: [],
    error: null,
    signatory: [],
    vehicle: [],
  }),

  getters: {
    divisionList: (state) => state.division,
    officeList: (state) => state.office,
    signatoryList: (state) => state.signatory,
    vehicleList: (state) => state.vehicle,
  },

  actions: {
    async fetchDivisions() {
      try {
        const response = await axios.get('/api/divisions')
        this.division = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch divisions'
        console.error('Error fetching divisions:', this.error)
      }
    },
    async fetchOfficesByDivision(division_Id) {
      try {
        const response = await axios.get(`/api/offices/${division_Id}`)
        this.office = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch offices'
        console.error('Error fetching offices:', this.error)
      }
    },
    async fetchSignatories(token) {
      try {
        const response = await axios.get('/api/signatories', {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.signatory = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch Signatories'
        console.error('Error fetching signatories:', this.error)
      }
    },
    async fetchVehicleAssignments(token) {
      try {
        const response = await axios.get('/api/vehicle-assignments', {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.vehicle = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch Vehicle Assignments'
        console.error('Error fetching Vehicle Assignments:', this.error)
      }
    },
  },
})
