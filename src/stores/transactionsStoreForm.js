import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useTARequestFormStore } from './TARequestFormStore'
import { useVehicleRequestFormStore } from './vehicleRequestFormStore'
import { useConferenceRequestFormStore } from './conferenceRequestFormStore'
import { useAirTravelOrderFormStore } from './airTravelOrderFormStore'
import { usePremisesFormStore } from './entryToDSWDFormStore'
import { useOvernightFormStore } from './overnightParkingFormStore'
import { useJanitorialRequestFormStore } from './janitorialRequestFormStore'
import dayjs from 'dayjs'

export const useTransactionsFormStore = defineStore('transactionForm', {
  state: () => ({}),
  actions: {},
})
