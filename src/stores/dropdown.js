import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const useDropdownStore = defineStore('dropdown', {
  state: () => ({
    division: [],
    office: [],
    error: null,
    signatory: [],
    vehicle: [],
    vehicleType: [],
    drivers: [],
  }),

  getters: {
    divisionList: (state) => state.division,
    officeList: (state) => state.office,
    signatoryList: (state) => state.signatory,
    vehicleList: (state) => state.vehicle,
    vehicleTypeList: (state) => state.vehicleType,
    driverList: (state) => state.drivers,
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
        const response = await axios.get('/api/signatories/fetch', {
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
    async fetchVehicleTypes() {
      try {
        const authStore = useAuthStore()
        const response = await axios.get('/api/vehicles/type',{
          headers: { Authorization: `Bearer ${authStore.token}` },
        })
        this.vehicleType = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch Vehicle Types'
        console.error('Error fetching Vehicle Types:', this.error)
      }
    },
    async fetchDrivers() {
      try {
        const authStore = useAuthStore()
        const response = await axios.get('/api/drivers/fetch', {
          headers: { Authorization: `Bearer ${authStore.token}` },
        })
        this.drivers = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch Drivers'
        console.error('Error fetching Drivers:', this.error)
      }
    },
  },
})
