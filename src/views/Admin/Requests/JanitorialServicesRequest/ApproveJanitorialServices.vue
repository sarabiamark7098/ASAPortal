<template>
  <div class="card flex justify-center px-24">
    <Stepper value="1" class="basis-full" linear>
      <StepList>
        <Step value="1">Preview</Step>
        <Step value="2">Janitors</Step>
        <Step value="3">Approval</Step>
        <Step value="4">Printing</Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="1">
          <div class="flex flex-col min-h-[400px] border-4 border-double rounded p-9 gap-4">
            <PreviewJanitorialServices />
          </div>
          <div class="flex pt-6 justify-between">
            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="Menu()" />
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="activateCallback('2')"
            />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2">
          <div class="flex flex-col min-h-[400px] border-4 border-double rounded p-9 gap-4">
            <JanitorialServices />
          </div>
          <div class="flex pt-6 justify-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('1')"
            />

            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="activateCallback('3')"
            />
          </div>
        </StepPanel>

        <StepPanel v-slot="{ activateCallback }" value="3">
          <div class="flex flex-col min-h-[400px] border-4 border-double rounded p-9 gap-4">
            <SignatoryJanitorialServices />
          </div>
          <div class="flex pt-6 justify-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('2')"
            />

            <Button
              label="Submit"
              :disabled="submitting"
              @click="handleSubmit(activateCallback)"
              icon="pi pi-check"
              iconPos="left"
            />
          </div>
        </StepPanel>
        <StepPanel value="4">
          <div class="flex flex-col min-h-[400px] border-4 border-double rounded p-9 gap-4">
            <ShowPrint />
          </div>
          <div class="flex pt-6 justify-end">
            <Button label="Done" @click="Done" icon="pi pi-check" iconPos="left" />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useJanitorialRequestFormStore } from '@/stores/janitorialRequestFormStore'
import { useAuthStore } from '@/stores/auth'
import PreviewJanitorialServices from './PreviewJanitorialServices.vue'
import SignatoryJanitorialServices from './SignatoryJanitorialServices.vue'
import JanitorialServices from './JanitorialServices.vue'
import ShowPrint from './ShowPrint.vue'

const form = useJanitorialRequestFormStore()
const authStore = useAuthStore()

const submitting = ref(false)

function Menu() {
  form.editMode = false
}

function Done() {
  setTimeout(() => {
    window.location.reload()
  }, 2000)
}

const handleSubmit = (activateCallback) => {
  form.showErrors = true

  const errors = []

  if (!form.checkedSignatory) {
    errors.push('Checked By is required')
  }
  if (!form.approvalSignatory) {
    errors.push('Request Approval is required')
  }
  for (let i = 0; i < form.selectedRequest.count_utility; i++) {
    if (!form.janitors[i] || form.janitors[i].trim() === '') {
      errors.push(`Janitor ${i + 1} is required`)
    }
  }

  if (errors.length > 0) {
    alert('Please fill in required fields:\n' + errors.join('\n'))
    return
  }

  form.submitting = true

  setTimeout(async () => {
    try {
      await form.submitApprovalForm(form.selectedRequest.id)
      alert('Form successfully submitted!')
      activateCallback('4')
      form.resetForm()
    } catch (error) {
      console.error('Form submission failed:', error)
      alert('There was an error submitting the form. Please try again.')
    } finally {
      form.submitting = false
    }
  }, 1500)
}
</script>
