import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useTARequestFormStore } from './TARequestFormStore'
import { useVehicleRequestFormStore } from './vehicleRequestFormStore'
import { useConferenceRequestFormStore } from './conferenceRequestFormStore'
import { useAirTransportOrderFormStore } from './airTransportOrderFormStore'
import { usePremisesFormStore } from './entryToDSWDFormStore'
import { useOvernightParkingRequestFormStore } from './overnightParkingRequestFormStore'
import { useJanitorialRequestFormStore } from './janitorialRequestFormStore'
import dayjs from 'dayjs'

export const useTransactionsFormStore = defineStore('transactionForm', {
  state: () => ({
    loading: false,
    quantity: 100,
    error: null,
    rows: 20,
    first: 0,
    searchInput: '',
    sortField: null,
    sortOrder: null,

    selectedTransactionData: {},
    transactionDialog: false,
  }),
  actions: {
    async getTransactionRequests(token, page, perPage, query = '', sortBy = '', sortDir = '') {
      const response = await axios.get('/api/transaction-requests', {
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
      this.transactionRequests = response.data.data
      this.totalRecords = response.data.total
    },
  },
})
