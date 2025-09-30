<template>
  <FullScreenLoader :visible="signatoryFormStore.loadingaction" message="" />
  <div v-if="!signatoryFormStore.loadingaction" class="px-4 sm:px-6 lg:px-10 py-6">
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Signatory Information -->
      <div
        class="w-full lg:w-1/2 shadow-sm rounded-lg p-5 overflow-y-auto flex flex-col bg-white max-h-[600px]"
      >
        <h3 class="text-lg font-semibold mb-4 sticky top-0 bg-white z-10 pb-2">
          Signatory Information
        </h3>

        <dl class="space-y-2 text-sm sm:text-base flex-grow">
          <div
            v-for="(value, label) in signatoryInfo"
            :key="label"
            class="flex justify-between border-b border-gray-400 py-1"
          >
            <dt class="font-semibold">{{ label }}:</dt>
            <dd class="text-green-600">{{ value || 'N/A' }}</dd>
          </div>
        </dl>
      </div>

      <!-- Update Form -->
      <div
        class="w-full lg:w-1/2 shadow-sm rounded-lg p-5 overflow-y-auto flex flex-col bg-white max-h-[600px]"
      >
        <h3 class="text-lg font-semibold mb-7 sticky top-0 bg-white z-10 pb-2">
          {{ signatoryFormStore.addSignatory ? 'Add' : 'Update' }} Signatory Information
        </h3>

        <div class="flex flex-col w-full gap-8 bg-white">
          <!-- Row 1: Names -->
          <div class="grid grid-cols-1 gap-4 sm:gap-6">
            <div>
              <FloatLabel>
                <InputText
                  id="signatoryFullName"
                  v-model="signatoryFormStore.full_name"
                  class="w-full"
                />
                <label for="signatoryFullName">Complete Name</label>
              </FloatLabel>
              <small v-if="v$.full_name.$error" class="text-red-500">
                Complete Name is required.
              </small>
            </div>

            <div>
              <FloatLabel>
                <InputText id="position" v-model="signatoryFormStore.position" class="w-full" />
                <label for="position">Position</label>
              </FloatLabel>
              <small v-if="v$.position.$error" class="text-red-500"> Position is required. </small>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="sticky bottom-0 mt-6 flex justify-between">
          <Button
            label="Back"
            icon="pi pi-arrow-left"
            class="p-button-outlined p-button-secondary w-full sm:w-auto"
            @click="back"
          />

          <Button
            :label="signatoryFormStore.addSignatory ? 'Add Signatory' : 'Save Changes'"
            class="w-full sm:w-auto"
            severity="success"
            :loading="signatoryFormStore.submitting"
            @click="submitForm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { useSignatoryFormStore } from '@/stores/signatoryFormStore'
import { useAuthStore } from '@/stores/auth'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const signatoryFormStore = useSignatoryFormStore()
const authStore = useAuthStore()

// Alias for readability
const signatory = signatoryFormStore.selectedSignatory

onMounted(async () => {
  signatoryFormStore.loadingaction = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
  } catch (error) {
    console.error('Error on mount:', error)
  } finally {
    signatoryFormStore.loadingaction = false
  }
})

function back() {
  signatoryFormStore.updateSignatory = false
  signatoryFormStore.addSignatory = false
}

// Custom email validator with domain restriction
function emailWithDomain(value) {
  if (!value) return false
  const allowedDomains = ['@gmail.com', '@dswd.gov.ph']
  const trimmed = value.trim().toLowerCase()
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
    allowedDomains.some((domain) => trimmed.endsWith(domain))
  )
}

// Validation rules
const rules = {
  full_name: { required },
  position: { required },
}

const v$ = useVuelidate(rules, signatoryFormStore)

const signatoryInfo = computed(() => ({
  Name: signatoryFormStore?.full_name,
  Position: signatoryFormStore?.position,
}))

async function submitForm() {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  const original = signatoryFormStore.selectedSignatory || {}
  const current = {
    full_name: signatoryFormStore.full_name,
    position: signatoryFormStore.position,
  }

  const hasChanged = Object.keys(current).some(
    (key) => (current[key] || '') !== (original[key] || ''),
  )

  if (!signatoryFormStore.addSignatory && !hasChanged) {
    window.alert('No changes detected. Please update some fields before saving.')
    return
  }

  signatoryFormStore.submitting = true
  let errorOccurred = false
  try {
    await signatoryFormStore.submitForm()
  } catch (error) {
    console.error('Form submission failed:', error)
    errorOccurred = true
  } finally {
    if (!errorOccurred) {
      if (signatoryFormStore.addSignatory) {
        window.alert('Signatory information successfully added.')
      } else {
        window.alert('Signatory information successfully updated.')
      }
      window.location.reload()
      signatoryFormStore.addSignatory = false
      signatoryFormStore.updateSignatory = false
      signatoryFormStore.submitting = false
    } else {
      window.alert('Form submission failed. Please try again.')
    }
  }
}
</script>
