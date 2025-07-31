import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useTAFormStore } from './TAFormStore'
import { useVehicleFormStore } from './vehicleFormStore'
import { useConferenceFormStore } from './conferenceFormStore'
import { useAirTravelOrderFormStore } from './airTravelOrderFormStore'
import { usePremisesFormStore } from './entryToDSWDFormStore'
import { useOvernightFormStore } from './overnightParkingFormStore'
import { useJanitorialFormStore } from './janitorialFormStore'
import dayjs from 'dayjs'

export const useTransactionsFormStore = defineStore('transactionForm', {
  state: () => ({
    vehicleRequests: [],
    loading: false,
    error: null,
  }),
  actions: {
    async getAllTransactions(token) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/vehicle-requests', {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.vehicleRequests = response.data.data || response.data
      } catch (err) {
        this.error = err
        console.error('Failed to fetch:', err)
      } finally {
        this.loading = false
      }
    },
    async getallVehicleTransactions(token) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/vehicle-requests', {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.vehicleRequests = response.data.data || response.data
      } catch (err) {
        this.error = err
        console.error('Failed to fetch:', err)
      } finally {
        this.loading = false
      }
    },
    async getPaginatedTransactions({ token, page = 1, perPage = 5 }) {
      const res = await axios.get(`/api/vehicle-requests`, {
        params: { page, per_page: perPage },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return {
        data: res.data.data, // paginated data
        total: res.data.total, // total records
      }
    },
    async getVehicleRequests(token, page, perPage, search = '', sortBy = '', sortDir = '') {
      const response = await axios.get('/api/vehicle-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          per_page: perPage,
          search,
          sort_by: sortBy,
          sort_dir: sortDir,
        },
      })

      this.vehicleRequests = response.data.data
      this.totalRecords = response.data.total
    },
  },
})
