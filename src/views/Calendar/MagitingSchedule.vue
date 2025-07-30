<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

import { useTransactionsFormStore } from '@/stores/transactionsStoreForm'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'

// Stores
const authStore = useAuthStore()
const transactionStore = useTransactionsFormStore()

// Dialog & Event State
const selectedEvent = ref(null)
const showDialog = ref(false)
const events = ref([])
const currentView = ref('week')
const loading = ref(true)

function getEventById(id) {
  return events.value.find((e) => e.id === id)
}

function onEventClick(event) {
  selectedEvent.value = events.value.find((e) => e.id == event.id)
  showDialog.value = true
}

function onViewChange(viewInfo) {
  currentView.value = viewInfo.view
}

function transformRequestsToEvents(requests) {
  return requests.map((request) => ({
    start: dayjs(request.requested_start).format('YYYY-MM-DD'),
    end: dayjs(request.requested_end).format('YYYY-MM-DD'),
    title: `<b>Requested by:</b> ${request.requester_name || 'Unknown'}<br><b>Purpose:</b> ${request.purpose || 'No purpose provided'}<br><b>Destination:</b> ${request.destination || 'No Destination Indicated'}`,
    plainTitle: `${request.requester_name || 'Unknown'} - ${request.purpose || 'No purpose'}`,
    body: `<b>Requested by:</b> ${request.requester_name || 'Unknown'}<br><b>Purpose:</b> ${request.purpose || 'No purpose provided'}<br><b>Destination:</b> ${request.destination || 'No Destination Indicated'}`,
    id: request.id,
    class: 'primary',
    content: '<i class="pi pi-car"></i>',
  }))
}

// Fetch and transform data
onMounted(async () => {
  const token = authStore.token
  await transactionStore.getallVehicleTransactions(token)

  events.value = transformRequestsToEvents(transactionStore.vehicleRequests)

  // Set view AFTER next DOM tick
  await nextTick()
  currentView.value = 'week'
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
  loading.value = false
})

watch(
  () => transactionStore.vehicleRequests,
  (newRequests) => {
    events.value = transformRequestsToEvents(newRequests)
  },
  { deep: true },
)
</script>

<template>
  <FullScreenLoader :visible="loading" message="Loading Vehicle Requests Schedule..." />

  <div v-if="!loading">
    <div class="h-screen pt-24 pb-12 max-w-full rounded-xl">
      <VueCal
        :events="events"
        :time="false"
        :views="['year', 'month', 'week', 'day']"
        :view="currentView"
        @event-click="onEventClick"
        @view-change="onViewChange"
        start-week-on-sunday
        events-on-month-view
        style="height: 100%"
        class="rounded-xl"
      >
        <template #title="view">
          <code v-html="view.title" class="text-xl text-black font-extrabold"></code>
        </template>

        <template #event="{ event }">
          <div
            v-if="currentView === 'month'"
            class="text-white text-center truncate"
            :title="getEventById(event.id).plainTitle"
          >
            <span v-html="getEventById(event.id).content" /> {{ getEventById(event.id).plainTitle }}
          </div>
          <div v-else-if="currentView === 'week'" class="text-white px-2 py-1">
            <div v-html="getEventById(event.id).title" class="px-2 py-1 text-white" />
          </div>
          <div
            v-else-if="currentView === 'day'"
            class="text-white px-2 py-2 border border-gray-400 rounded"
          >
            <strong>Request ID:</strong> {{ getEventById(event.id).id }}<br />
            <strong>Date Needed (Start):</strong> {{ getEventById(event.id).start || 'Unknown'
            }}<br />
            <strong>Date Needed (End):</strong> {{ getEventById(event.id).end || 'Unknown' }}<br />
            <div v-html="getEventById(event.id).title" class="px-2 py-1 text-white" />
          </div>
          <div v-else v-html="getEventById(event.id).title" class="px-2 py-1 text-white" />
        </template>
      </VueCal>

      <Dialog v-model:visible="showDialog" modal header="Event Details" :style="{ width: '400px' }">
        <template v-if="selectedEvent">
          <div class="mb-3"><strong>Date Needed (Start): </strong> {{ selectedEvent.start }}</div>
          <div class="mb-3"><strong>Date Needed (End): </strong> {{ selectedEvent.end }}</div>
          <div v-html="selectedEvent.body"></div>
        </template>
        <template #footer>
          <Button
            label="Close"
            icon="pi pi-times"
            @click="showDialog = false"
            class="p-button-text"
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>
<style>
.vuecal__event {
  color: white;
  border: 1px solid;
  border-radius: 6px;
  width: fit-content;
  max-width: 90%;
  margin: 10px auto; /* ✅ center horizontally */
  padding: 4px 8px;
  font-size: 0.85rem;
  text-align: center; /* ✅ center text inside */
  white-space: normal;
  display: block;
}

.vuecal__event.primary {
  background-color: #007bff;
  border-color: #0056b3;
}
</style>
