<template>
  <div
    class="flex flex-col p-4 sm:p-6 md:p-9 lg:p-12 bg-gray-100 rounded-3xl max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto mt-12"
  >
    <!-- Header -->
    <div class="mb-6 text-center w-full">
      <h1 class="text-2xl sm:text-3xl font-bold">REQUEST FOR AIR TRANSPORT ORDER</h1>
    </div>

    <RouterLink
      class="mb-6 w-1/6 bg-gray-600 text-white p-2 rounded-lg shadow-md text-center"
      to="/client"
    >
      <i class="pi pi-arrow-left" /> Back to Requests
    </RouterLink>
    <hr class="mb-6 border-gray-300" />
    <!-- Input Fields -->
    <div class="flex flex-col gap-8">
      <!-- Row 1 -->
      <div class="flex flex-col sm:flex-row gap-6">
        <FloatLabel class="flex-1">
          <InputText
            id="requestingOffice"
            class="w-full"
            v-model="requestingOffice"
            :class="{ 'p-invalid': showErrors && !requestingOffice }"
          />
          <label for="requestingOffice"
            >Requesting Office/Unit <span class="text-red-500">*</span></label
          >
        </FloatLabel>

        <FloatLabel class="flex-1">
          <DatePicker
            id="dateRequested"
            class="w-full"
            v-model="dateRequested"
            :class="{ 'p-invalid': showErrors && !dateRequested }"
            showIcon
            fluid
            iconDisplay="input"
          />
          <label for="dateRequested">Date Requested <span class="text-red-500">*</span></label>
        </FloatLabel>
      </div>

      <hr class="border-gray-300" />
      <!-- Row 2 -->
      <div class="flex flex-col">
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-4">Passenger List</h2>

          <div v-for="(guest, index) in guests" :key="index" class="mb-2 flex items-center gap-2">
            <InputText v-model="guest.name" placeholder="Enter guest full name" class="w-full" />
            <Button
              icon="pi pi-times"
              severity="danger"
              @click="removeGuest(index)"
              v-if="guests.length > 1"
            />
          </div>

          <div class="mt-4 flex gap-2">
            <Button label="Add Guest" icon="pi pi-plus" @click="addGuest" />
          </div>
        </div>
      </div>

      <hr class="border-gray-300" />
      <!-- Row 3 -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1 flex justify-center">
            <div class="flex items-center gap-6">
              <Checkbox
                v-model="roundTrip"
                inputId="roundTrip"
                name="roundTrip"
                value="roundTrip"
                size="large"
              />
              <label for="roundTrip" class="text-lg">Round Trip</label>
            </div>
          </div>

        <div class="flex-1 flex justify-center">
            <div class="flex items-center gap-6">
          <div class="flex items-center gap-6">
            <Checkbox
              v-model="connectingFlight"
              inputId="connectingFlight"
              name="connectingFlight"
              value="connectingFlight"
              size="large"
            />
            <label for="connectingFlight" class="text-lg">Connecting Flight</label>
          </div>
        </div>
      </div>
      </div>

      <!-- Row 4 -->
      <div class="flex flex-col sm:flex-row gap-6">
        <div class="p-4 space-y-6 w-full">
          <h2 class="text-xl font-semibold">Flight Information</h2>

          <div
            v-for="(flight, index) in flights"
            :key="index"
            class="p-4 border border-gray-300 rounded-xl space-y-4 bg-white shadow-sm"
          >
            <!-- Flight Header -->
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-lg text-blue-700">Flight {{ index + 1 }}</h3>
              <Button
                icon="pi pi-times"
                severity="danger"
                size="small"
                @click="removeFlight(index)"
                v-if="flights.length > 1"
                class="ml-2"
              />
            </div>

            <!-- Responsive Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
              <!-- Destination -->
              <div class="sm:col-span-2 md:col-span-3">
                <label class="block mb-1 font-medium">Destination</label>
                <InputText v-model="flight.destination" class="w-full" />
              </div>

              <!-- Date of Departure -->
              <div>
                <label class="block mb-1 font-medium">Date of Departure</label>
                <DatePicker
                  id="dateDeparture"
                  class="w-full"
                  v-model="flight.dateDeparture"
                  :class="{ 'p-invalid': showErrors && !flight.dateDeparture }"
                  showIcon
                  fluid
                  iconDisplay="input"
                />
              </div>

              <!-- Departure ETD -->
              <div>
                <label class="block mb-1 font-medium">Departure ETD</label>
                <DatePicker
                  id="departureETD"
                  class="w-full"
                  v-model="flight.departureETD"
                  :class="{ 'p-invalid': showErrors && !departureETD }"
                  showIcon
                  fluid
                  hourFormat="12"
                  iconDisplay="input"
                  timeOnly
                  ><template #inputicon="slotProps">
                    <i class="pi pi-clock" @click="slotProps.clickCallback" /> </template
                ></DatePicker>
              </div>

              <!-- Departure ETA -->
              <div>
                <label class="block mb-1 font-medium">Departure ETA</label>
                <DatePicker
                  id="departureETA"
                  class="w-full"
                  v-model="flight.departureETA"
                  :class="{ 'p-invalid': showErrors && !departureETA }"
                  showIcon
                  fluid
                  hourFormat="12"
                  iconDisplay="input"
                  timeOnly
                  ><template #inputicon="slotProps">
                    <i class="pi pi-clock" @click="slotProps.clickCallback" /> </template
                ></DatePicker>
              </div>

              <!-- Date of Arrival -->
              <div>
                <label class="block mb-1 font-medium">Date of Arrival</label>
                <DatePicker
                  id="dateArrival"
                  class="w-full"
                  v-model="flight.dateArrival"
                  showIcon
                  fluid
                  iconDisplay="input"
                />
              </div>

              <!-- Arrival ETD -->
              <div>
                <label class="block mb-1 font-medium">Arrival ETD</label>
                <DatePicker
                  id="arrivalETD"
                  class="w-full"
                  v-model="flight.arrivalETD"
                  showIcon
                  fluid
                  hourFormat="12"
                  iconDisplay="input"
                  timeOnly
                  ><template #inputicon="slotProps">
                    <i class="pi pi-clock" @click="slotProps.clickCallback" /> </template
                ></DatePicker>
              </div>

              <!-- Arrival ETA -->
              <div>
                <label class="block mb-1 font-medium">Arrival ETA</label>
                <DatePicker
                  id="arrivalETA"
                  class="w-full"
                  v-model="flight.arrivalETA"
                  showIcon
                  fluid
                  hourFormat="12"
                  iconDisplay="input"
                  timeOnly
                  ><template #inputicon="slotProps">
                    <i class="pi pi-clock" @click="slotProps.clickCallback" /> </template
                ></DatePicker>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3">
            <Button
              label="Add Flight"
              icon="pi pi-plus"
              @click="addFlight"
              :disabled="flights.length >= maxFlights"
            />
          </div>

          <!-- Max Limit Notice -->
          <p class="text-sm text-gray-500" v-if="flights.length >= maxFlights">
            You have reached the maximum of 10 flights.
          </p>
        </div>
      </div>

      <hr class="border-gray-300" />
      <!-- Row 1 -->
      <div class="flex flex-col sm:flex-row gap-6">
        <FloatLabel class="flex-1">
          <InputText
            id="requestedBy"
            class="w-full"
            v-model="requestedBy"
            :class="{ 'p-invalid': showErrors && !requestedBy }"
          />
          <label for="requestedBy">Requested by <span class="text-red-500">*</span></label>
        </FloatLabel>
        <FloatLabel class="flex-1">
          <InputMask
            id="contactNo"
            class="w-full"
            v-model="contactNo"
            mask="0999 999 9999"
            :class="{ 'p-invalid': showErrors && !contactNo }"
          />
          <label for="contactNo">Contact No. <span class="text-red-500">*</span></label>
        </FloatLabel>

        <FloatLabel class="flex-1">
          <InputText
            id="emailOfRequester"
            v-model="emailOfRequester"
            class="w-full"
            type="email"
            :class="{ 'p-invalid': showErrors && !isValidEmail(emailOfRequester) }"
            required
          />
          <label for="emailOfRequester"
            >Email of Requester <span class="text-red-500">*</span></label
          >
        </FloatLabel>
      </div>

      <!-- Row 2 -->
      <div class="flex flex-col sm:flex-row gap-6">
        <div class="flex-1">
          <div class="flex gap-6">
            <FileUpload
              id="pdfUploadSO"
              mode="basic"
              name="special_order_file"
              customUpload
              auto
              accept="application/pdf"
              @select="onSpecialOrderSelect"
              chooseLabel="Choose PDF"
              class="w-full sm:w-auto"
              :class="{ 'p-invalid': showErrors && showSpecialOrderError }"
            />
            <div v-if="specialOrderFileName" class="mt-2 text-sm text-gray-700">
              Selected: {{ specialOrderFileName }}
            </div>
            <div v-if="showErrors && showSpecialOrderError" class="text-red-500 mt-2 text-sm">
              Only PDF files are allowed.
            </div>
            <div v-if="!specialOrderFileName" class="text-sm text-gray-500 mt-2">
              Upload your Special Order Here (optional)
            </div>
          </div>
        </div>
        <div class="flex-1">
          <div class="flex gap-6">
            <FileUpload
              id="pdfUploadTO"
              mode="basic"
              name="travel_order_file"
              customUpload
              auto
              accept="application/pdf"
              @select="onTravelOrderSelect"
              chooseLabel="Choose PDF"
              class="w-full sm:w-auto"
              :class="{ 'p-invalid': showErrors && showTravelOrderError }"
            />
            <div v-if="travelOrderFileName" class="mt-2 text-sm text-gray-700">
              Selected: {{ travelOrderFileName }}
            </div>
            <div v-if="showErrors && showTravelOrderError" class="text-red-500 mt-2 text-sm">
              Only PDF files are allowed.
            </div>
            <div v-if="!travelOrderFileName" class="text-sm text-gray-500 mt-2">
              Upload your Travel Order Here (optional)
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center mt-8">
        <Button
          label="Submit Request"
          icon="pi pi-check"
          severity="primary"
          class="w-full sm:w-auto"
          :disabled="submitting"
          @click="submitRequest"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const requestingOffice = ref('')
const dateRequested = ref(new Date())
const roundTrip = ref(false)
const connectingFlight = ref(false)
const guests = ref([{ name: '' }])
const flights = ref([
  {
    destination: '',
    dateDeparture: null,
    departureETD: '',
    departureETA: '',
    dateArrival: null,
    arrivalETD: '',
    arrivalETA: '',
  },
])
const maxGuests = 10
const maxFlights = 10
const requestedBy = ref('')
const contactNo = ref('')
const emailOfRequester = ref('')
const specialOrderFile = ref(null)
const specialOrderFileName = ref('')
const travelOrderFile = ref(null)
const travelOrderFileName = ref('')
const showSpecialOrderError = ref(false)
const showTravelOrderError = ref(false)

const showErrors = ref(false)

function addGuest() {
  if (guests.value.length < maxGuests) {
    guests.value.push({ name: '' })
  }
}

function removeGuest(index) {
  if (guests.value.length > 1) {
    guests.value.splice(index, 1)
  }
}

function addFlight() {
  if (flights.value.length < maxFlights) {
    flights.value.push({
      destination: '',
      dateDeparture: null,
      departureETD: '',
      departureETA: '',
      dateArrival: null,
      arrivalETD: '',
      arrivalETA: '',
    })
  }
}

function removeFlight(index) {
  if (flights.value.length > 1) {
    flights.value.splice(index, 1)
  }
}

function isValidEmail(email) {
  const allowedDomains = ['@gmail.com', '@dswd.gov.ph']
  const trimmed = email?.trim().toLowerCase()

  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
    allowedDomains.some((domain) => trimmed.endsWith(domain))
  )
}

const onFileSelect = (event) => {
  const file = event.files[0]
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file
    fileName.value = file.name
    showErrors.value = false
  } else {
    selectedFile.value = null
    fileName.value = ''
    showErrors.value = true
  }
}

const onSpecialOrderSelect = (event) => {
  const file = event.files[0]
  if (!file || file.type === 'application/pdf') {
    specialOrderFile.value = file || null
    specialOrderFileName.value = file?.name || ''
    showSpecialOrderError.value = false
  } else {
    specialOrderFile.value = null
    specialOrderFileName.value = ''
    showSpecialOrderError.value = true
  }
}

const onTravelOrderSelect = (event) => {
  const file = event.files[0]
  if (!file || file.type === 'application/pdf') {
    travelOrderFile.value = file || null
    travelOrderFileName.value = file?.name || ''
    showTravelOrderError.value = false
  } else {
    travelOrderFile.value = null
    travelOrderFileName.value = ''
    showTravelOrderError.value = true
  }
}

const submitting = ref(false)

function submitRequest() {
  try {
    submitting.value = true
    showErrors.value = true

    const errors = []

    if (!requestingOffice.value) errors.push('Requesting office is required.')
    if (!requestedBy.value) errors.push('Requested by is required.')
    if (!contactNo.value) errors.push('Contact number is required.')
    if (!emailOfRequester.value || !isValidEmail(emailOfRequester.value)) {
      errors.push('Valid email is required (gmail.com or dswd.gov.ph).')
    }

    if (guests.value.length === 0 || guests.value.some((guest) => !guest.name.trim())) {
      errors.push('All guest fields are required.')
    }

    flights.value.forEach((flight, idx) => {
      if (
        !flight.destination ||
        !flight.dateDeparture ||
        !flight.departureETD ||
        !flight.departureETA
      ) {
        errors.push(`Flight ${idx + 1} is incomplete.`)
      }
    })
    if (errors.length) {
      alert(errors.join('\n'))
      submitting.value = false
      return
    }

    // Simulate request
    setTimeout(() => {
      alert('Request submitted successfully!')
      submitting.value = false
    }, 1000)
  } catch (error) {
    console.error('Submit error:', error)
    alert('An unexpected error occurred.')
    submitting.value = false
  }
}
</script>
<style scoped></style>
