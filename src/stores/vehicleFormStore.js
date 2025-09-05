import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const useVehicleFormStore = defineStore('vehicleForm', {
  state: () => ({
    plate_number: '',
    unit_type: '',
    model: '',
    brand: '',
    model_year: '',
    purchase_year: '',
    engine_number: '',
    chassis_number: '',
    driver: '',
    contact_number: '',
    email: '',
    selectedDriver: '',
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
      this.plate_number = ''
      this.unit_type = ''
      this.model = ''
      this.brand = ''
      this.model_year = ''
      this.purchase_year = ''
      this.engine_number = ''
      this.chassis_number = ''
      this.driver = ''
      this.contact_number = ''
      this.email = ''
      this.selectedDriver = ''
      this.selectedVehicle = ''
      this.drivers = ''
    },

    setVehicle(vehicle) {
      this.updateVehicle = true
      this.plate_number = vehicle.plate_number
      this.unit_type = vehicle.unit_type
      this.model = vehicle.model
      this.brand = vehicle.brand
      this.model_year = vehicle.model_year
      this.purchase_year = vehicle.purchase_year
      this.engine_number = vehicle.engine_number
      this.chassis_number = vehicle.chassis_number
      if (vehicle.driver) {
        console.log('Setting selected driver:', vehicle.driver)
        this.selectedDriver = vehicle.vehicle_assignment.driver
      } else {
        this.selectedDriver = ''
        this.drivers = ''
        this.driver = ''
        this.contact_number = ''
        this.email = ''
      }
    },

    async submitForm() {
      try {
        const authStore = useAuthStore()
        const formData = {
          plate_number: this.plate_number,
          unit_type: this.unit_type,
          model: this.model,
          brand: this.brand,
          model_year: this.model_year,
          purchase_year: this.purchase_year,
          engine_number: this.engine_number,
          chassis_number: this.chassis_number,
        }
        if (this.updateVehicle && this.selectedVehicle) {
          const response = await axios.put(`/api/vehicles/${this.selectedVehicle.id}`, formData, {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          })
          const assignment = {
            vehicle_id: this.selectedVehicle.id,
            driver_id: this.drivers || null,
          }
          const response_assignment = await axios.put(
            `/api/vehicle-assignments/${this.selectedVehicle.id}`,
            assignment,
            {
              headers: {
                Authorization: `Bearer ${authStore.token}`,
              },
            },
          )
        } else {
          const response = await axios.post('/api/vehicles', formData, {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          })
          const assignment = {
            vehicle_id: response.data.id,
            driver_id: this.drivers || null,
          }
          const response_assignment = await axios.post(`/api/vehicle-assignments`, assignment, {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          })
        }
        setTimeout(() => {
          this.resetForm() // clear local state if needed
        }, 2000)
      } catch (error) {
        throw error
      } finally {
        this.submitting = false
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
