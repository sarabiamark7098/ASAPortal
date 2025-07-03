import { defineStore } from 'pinia'
import axios from 'axios'

export const useDropdownStore = defineStore('dropdown', {
  state: () => ({
    division: [],
    office: [],
    error: null,
  }),

  getters: {
    divisionList: (state) => state.division,
    officeList: (state) => state.office,
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
  },
})
