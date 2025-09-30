<template>
  <FullScreenLoader :visible="form.loading" message="Loading Air Travel Order Request Form..." />

  <div v-if="!form.loading">
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

      <div class="flex flex-col gap-8">
        <!-- Requesting Office / Fund / Date -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel>
              <InputText
                v-model="form.requesting_office"
                class="w-full"
                :class="{ 'p-invalid': v$.requesting_office.$error }"
              />
              <label>Requesting Office/Unit <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requesting_office.$error" class="text-red-500 text-xs">
              Requested by is required.
            </small>
          </div>
          <div class="flex-1">
            <FloatLabel>
              <InputText
                v-model="form.fund_source"
                class="w-full"
                :class="{ 'p-invalid': v$.fund_source.$error }"
              />
              <label>Source of Fund <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.fund_source.$error" class="text-red-500 text-xs">
              Fund Source is required.
            </small>
          </div>
          <div class="flex-1">
            <FloatLabel>
              <DatePicker
                v-model="form.requested_date"
                class="w-full"
                showIcon
                fluid
                iconDisplay="input"
                :class="{ 'p-invalid': v$.requested_date.$error }"
              />
              <label>Date Requested <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requested_date.$error" class="text-red-500 text-xs"> Required. </small>
          </div>
        </div>

        <hr class="border-gray-300" />

        <!-- Guests -->
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-4">Passenger List</h2>
          <div v-for="(guest, index) in form.guests" :key="index" class="mb-4">
            <div class="border border-gray-300 p-5 rounded-2xl bg-white">
              <div class="grid gap-3 md:grid-cols-2">
                <!-- First Name -->
                <div>
                  <FloatLabel variant="on">
                    <InputText
                      v-model="guest.first_name"
                      class="w-full"
                      :class="{ 'p-invalid': form.errors.guests[index]?.first_name }"
                    />
                    <label>First Name</label>
                  </FloatLabel>
                  <small v-if="form.errors.guests[index]?.first_name" class="text-red-500 text-xs">
                    {{ form.errors.guests[index].first_name }}
                  </small>
                </div>
                <!-- Last Name -->
                <div>
                  <FloatLabel variant="on">
                    <InputText
                      v-model="guest.last_name"
                      class="w-full"
                      :class="{ 'p-invalid': form.errors.guests[index]?.last_name }"
                    />
                    <label>Last Name</label>
                  </FloatLabel>
                  <small v-if="form.errors.guests[index]?.last_name" class="text-red-500 text-xs">
                    {{ form.errors.guests[index].last_name }}
                  </small>
                </div>
                <!-- Birth Date -->
                <div>
                  <FloatLabel variant="on">
                    <DatePicker
                      v-model="guest.birth_date"
                      showIcon
                      class="w-full"
                      :class="{ 'p-invalid': form.errors.guests[index]?.birth_date }"
                    />
                    <label>Birth Date</label>
                  </FloatLabel>
                  <small v-if="form.errors.guests[index]?.birth_date" class="text-red-500 text-xs">
                    {{ form.errors.guests[index].birth_date }}
                  </small>
                </div>
                <!-- Position -->
                <div>
                  <FloatLabel variant="on">
                    <InputText
                      v-model="guest.position"
                      class="w-full"
                      :class="{ 'p-invalid': form.errors.guests[index]?.position }"
                    />
                    <label>Position</label>
                  </FloatLabel>
                  <small v-if="form.errors.guests[index]?.position" class="text-red-500 text-xs">
                    {{ form.errors.guests[index].position }}
                  </small>
                </div>
                <!-- Email -->
                <div>
                  <FloatLabel variant="on">
                    <InputText
                      v-model="guest.email"
                      class="w-full"
                      :class="{ 'p-invalid': form.errors.guests[index]?.email }"
                    />
                    <label>Email</label>
                  </FloatLabel>
                  <small v-if="form.errors.guests[index]?.email" class="text-red-500 text-xs">
                    {{ form.errors.guests[index].email }}
                  </small>
                </div>
                <!-- Contact -->
                <div>
                  <FloatLabel variant="on">
                    <InputMask
                      v-model="guest.contact_number"
                      mask="0999 999 9999"
                      class="w-full"
                      :class="{ 'p-invalid': form.errors.guests[index]?.contact_number }"
                    />
                    <label>Contact Number</label>
                  </FloatLabel>
                  <small
                    v-if="form.errors.guests[index]?.contact_number"
                    class="text-red-500 text-xs"
                  >
                    {{ form.errors.guests[index].contact_number }}
                  </small>
                </div>
              </div>
            </div>
            <Button
              v-if="form.guests.length > 1"
              icon="pi pi-times"
              severity="danger"
              class="mt-2"
              @click="removeGuest(index)"
            />
          </div>
          <Button label="Add Guest" icon="pi pi-plus" @click="addGuest" />
        </div>

        <hr class="border-gray-300" />

        <!-- Flights -->
        <div class="flex border border-gray-300 rounded-xl justify-center py-2 bg-white" >
        <SelectButton class="border border-gray-400" v-model="trip_type" :options="form.options_type" aria-labelledby="basic" allowEmpty :invalid="value === null"  />
        </div>
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-4">Flight Information</h2>

          <div
            v-for="(flight, index) in form.flights"
            :key="index"
            class="border border-gray-300 p-4 rounded-xl mb-4 bg-white"
          >
            <div class="flex justify-between">
              <h3 class="font-bold text-blue-700 mb-3">Flight {{ index + 1 }}</h3>

              <!-- Remove Flight -->
              <Button
                v-if="form.flights.length > 1"
                icon="pi pi-times"
                severity="danger"
                class="mt-2"
                @click="removeFlight(index)"
              />
            </div>

            <!-- Destination -->
            <div class="mb-3">
              <label class="block mb-1 font-medium">Destination</label>
              <div class="flex gap-5">
                <FloatLabel class="flex-1" variant="on">
                  <InputText
                    v-model="flight.destination_from"
                    class="w-full"
                    :class="{ 'p-invalid': form.errors.flights[index]?.destination }"
                  />
                  <label for="">From</label>
                </FloatLabel>
                <FloatLabel class="flex-1" variant="on">
                  <InputText
                    v-model="flight.destination_to"
                    class="w-full"
                    :class="{ 'p-invalid': form.errors.flights[index]?.destination }"
                  />
                  <label for="">To</label>
                </FloatLabel>
              </div>
              <small v-if="form.errors.flights[index]?.destination" class="text-red-500 text-xs">
                {{ form.errors.flights[index].destination }}
              </small>
            </div>

            <!-- Trip -->
            <div class="grid grid-cols-1 gap-4 mb-3">
              <div>
                <label class="block mb-1 font-medium">Trip</label>
                <SelectButton class="w-full" v-model="flight.trip_type" :options="form.options_mode" aria-labelledby="basic" allowEmpty :invalid="value === null"  />
              </div>
            </div>

            <!-- Departure -->
            <div class="grid grid-cols-1 gap-4 mb-3">
              <div>
                <label class="block mb-1 font-medium">Date</label>
                <DatePicker v-model="flight.date_departure" showIcon class="w-full" />
              </div>
            </div>

            <!-- Departure & Arrival Times -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <div>
                <label class="block mb-1 font-medium">Estimated Time Departure</label>
                <DatePicker
                  v-model="flight.departure_etd"
                  showIcon
                  class="w-full"
                  hourFormat="12"
                  iconDisplay="input"
                  timeOnly
                >
                  <template #inputicon="slotProps">
                    <i class="pi pi-clock" @click="slotProps.clickCallback" />
                  </template>
                </DatePicker>
              </div>
              <div>
                <label class="block mb-1 font-medium">Estimated Time Arrival</label>
                <DatePicker
                  v-model="flight.departure_eta"
                  showIcon
                  class="w-full"
                  hourFormat="12"
                  iconDisplay="input"
                  timeOnly
                >
                  <template #inputicon="slotProps">
                    <i class="pi pi-clock" @click="slotProps.clickCallback" />
                  </template>
                </DatePicker>
              </div>
            </div>
          </div>

          <!-- Add Flight -->
          <Button label="Add Flight" icon="pi pi-plus" @click="addFlight" />
        </div>

        <hr class="border-gray-300" />

        <!-- Requester Info -->
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-1">
            <FloatLabel>
              <InputText
                v-model="form.requester_name"
                class="w-full"
                :class="{ 'p-invalid': v$.requester_name.$error }"
              />
              <label>Requested by <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_name.$error" class="text-red-500 text-xs"
              >Requester is required.</small
            >
          </div>
          <div class="flex-1">
            <FloatLabel>
              <InputText
                v-model="form.requester_position"
                class="w-full"
                :class="{ 'p-invalid': v$.requester_position.$error }"
              />
              <label>Position <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_position.$error" class="text-red-500 text-xs"
              >Requester Position is required.</small
            >
          </div>
          <div class="flex-1">
            <FloatLabel>
              <InputMask
                v-model="form.requester_contact_number"
                mask="0999 999 9999"
                class="w-full"
                :class="{ 'p-invalid': v$.requester_contact_number.$error }"
              />
              <label>Contact No. <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_contact_number.$error" class="text-red-500 text-xs"
              >Requester Contact Number is required.</small
            >
          </div>
          <div class="flex-1">
            <FloatLabel>
              <InputText
                v-model="form.requester_email"
                type="email"
                class="w-full"
                :class="{ 'p-invalid': v$.requester_email.$error }"
              />
              <label>Email of Requester <span class="text-red-500">*</span></label>
            </FloatLabel>
            <small v-if="v$.requester_email.$error" class="text-red-500 text-xs">{{
              v$.requester_email.$errors[0]?.$message
            }}</small>
          </div>
        </div>

        <!-- File Uploads -->
        <div class="flex flex-col sm:flex-row gap-6">
          <!-- Special Order PDF -->
          <div class="flex-1">
            <div class="flex flex-col gap-6 items-center">
              <FileUpload
                id="pdfUploadSpecialOrder"
                mode="basic"
                name="special_order_file"
                customUpload
                auto
                accept="application/pdf"
                @select="onSpecialOrderSelect"
                chooseLabel="Choose Special Order PDF"
                class="w-full sm:w-auto"
                :class="{ 'p-invalid': form.errors.files.specialOrderFile }"
              />
              <div v-if="form.specialOrderFileName" class="mt-2 text-sm text-gray-700">
                Selected: {{ form.specialOrderFileName }}
              </div>
              <div v-if="form.errors.files.specialOrderFile" class="text-red-500 mt-2 text-sm">
                {{ form.errors.files.specialOrderFile }}
              </div>
              <div v-if="!form.specialOrderFileName" class="text-sm text-gray-500 mt-2">
                Upload your Special Order here (optional)
              </div>
            </div>
          </div>

          <!-- Travel Order PDF -->
          <div class="flex-1">
            <div class="flex flex-col gap-6 items-center">
              <FileUpload
                id="pdfUploadTravelOrder"
                mode="basic"
                name="travel_order_file"
                customUpload
                auto
                accept="application/pdf"
                @select="onTravelOrderSelect"
                chooseLabel="Choose Travel Order PDF"
                class="w-full sm:w-auto"
                :class="{ 'p-invalid': form.errors.files.travelOrderFile }"
              />
              <div v-if="form.travelOrderFileName" class="mt-2 text-sm text-gray-700">
                Selected: {{ form.travelOrderFileName }}
              </div>
              <div v-if="form.errors.files.travelOrderFile" class="text-red-500 mt-2 text-sm">
                {{ form.errors.files.travelOrderFile }}
              </div>
              <div v-if="!form.travelOrderFileName" class="text-sm text-gray-500 mt-2">
                Upload your Travel Order here (optional)
              </div>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-center mt-8">
          <Button
            label="Submit Request"
            icon="pi pi-check"
            severity="primary"
            class="w-full sm:w-auto"
            :disabled="form.submitting"
            @click="submitRequest"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAirTravelOrderFormStore } from '@/stores/airTravelOrderFormStore'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { computed, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

const form = useAirTravelOrderFormStore()

// ✅ Custom email validator
const emailWithDomain = helpers.withMessage('Email must be @gmail.com or @dswd.gov.ph', (value) => {
  if (!value) return false
  const trimmed = value.trim().toLowerCase()
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
    (trimmed.endsWith('@gmail.com') || trimmed.endsWith('@dswd.gov.ph'))
  )
})

const rules = computed(() => ({
  requesting_office: { required },
  fund_source: { required },
  requested_date: { required },
  requester_name: { required },
  requester_position: { required },
  requester_contact_number: { required },
  requester_email: { required, email, emailWithDomain },
}))

const v$ = useVuelidate(rules, form)

onMounted(() => {
  setTimeout(() => {
    form.loading = false
  }, 1000)
})

// Guests
function addGuest() {
  if (form.guests.length < form.maxGuests) {
    form.guests.push({
      first_name: '',
      last_name: '',
      birth_date: null,
      position: '',
      email: '',
      contact_number: '',
    })
    form.errors.guests.push({})
  }
}
function removeGuest(index) {
  if (form.guests.length > 1) {
    form.guests.splice(index, 1)
    form.errors.guests.splice(index, 1)
  }
}

// Flights
function addFlight() {
  if (form.flights.length < form.maxFlights) {
    form.flights.push({
      destination: '',
      date_departure: null,
      date_arrival: null,
      departure_etd: '',
      departure_eta: '',
      arrival_etd: '',
      arrival_eta: '',
    })
    form.errors.flights.push({})
  }
}
function removeFlight(index) {
  if (form.flights.length > 1) {
    form.flights.splice(index, 1)
    form.errors.flights.splice(index, 1)
  }
}

// File Uploads
const onSpecialOrderSelect = (event) => {
  const file = event.files[0]
  form.specialOrderFile = file || null
  form.specialOrderFileName = file?.name || ''
}
const onTravelOrderSelect = (event) => {
  const file = event.files[0]
  form.travelOrderFile = file || null
  form.travelOrderFileName = file?.name || ''
}

// Submit
async function submitRequest() {
  const isValidVuelidate = await v$.value.$validate()
  const isValidManual = form.validateForm()

  if (!isValidVuelidate || !isValidManual) {
    alert('Fix validation errors before submitting.')
    return
  }

  form.submitting = true
  try {
    await form.submitForm()
    form.reset()
    v$.value.$reset()
    alert('Form submitted successfully!')
  } catch (err) {
    console.error('Submission failed:', err)
    alert('Submission failed. Please try again.')
  } finally {
    form.submitting = false
  }
}
</script>
