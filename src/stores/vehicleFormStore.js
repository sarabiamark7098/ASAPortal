import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const useVehicleFormStore = defineStore('vehicleForm', {
  state: () => ({
    plateNumber: '',
    unitType: '',
    vehicleModel: '',
    brand: '',
    yearModel: '',
    yearPurchased: '',
    engineNumber: '',
    chassisNumber: '',
    selectedVehicle: '',
    vehicleList: [],
    loading: false,
    loading2: false,
    error: null,

    // Table interaction refs
    rows: 20,
    first: 0,
    searchInput: '',
    sortField: null,
    sortOrder: null,
    totalRecords: 0,

    submitting: false,
    showErrors: false,

    addVehicle: false,
    updateVehicle: false,
  }),
  actions: {
    resetForm() {
      this.plateNumber = ''
      this.unitType = ''
      this.vehicleModel = ''
      this.brand = ''
      this.yearModel = ''
      this.yearPurchased = ''
      this.engineNumber = ''
      this.chassisNumber = ''
    },

    async submitForm() {
      try {
        const authStore = useAuthStore()
        const formData = {
          plate_number: this.plateNumber,
          unit_type: this.unitType,
          vehicle_model: this.vehicleModel,
          brand: this.brand,
          model_year: this.yearModel,
          purchase_year: this.yearPurchased,
          engine_number: this.engineNumber,
          chasis_number: this.chassisNumber,
        }

        const response = await axios.post('/api/vehicles', formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })
        return response.data
      } catch (error) {
        throw error
      }
    },


    async getVehicles(token, page, perPage, query = '', sortBy = '', sortDir = '') {
      const response = await axios.get('/api/vehicles', {
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
      this.vehicleList = response.data.data
      this.totalRecords = response.data.total
    },
  },
})
