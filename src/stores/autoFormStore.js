import { defineStore } from 'pinia'
import axios from 'axios'

export const useDriversFormStore = defineStore('driverForm', {
  state: () => ({
    plate_number: "",
    Unit_type: "",
    brand: "",
    model: "",
    year_purchase: null,
    year_model: null,
    engine_number: "",
    chasis_number: "",
  }),
  getters: () => ({}),
  actions: () => ({}),
})
