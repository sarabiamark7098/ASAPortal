<template>
  <div class="card flex justify-center px-24">
    <Stepper value="1" class="basis-full" linear>
      <StepList>
        <Step value="1">Printing</Step>
      </StepList>
      <StepPanels>
        <StepPanel value="1">
          <div class="flex flex-col min-h-[400px] border-4 border-double rounded p-9 gap-4">
            <ShowPrint />
          </div>
          <div class="flex pt-6 justify-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="Menu()"
            />
            <Button label="Done" @click="Menu()" icon="pi pi-check" iconPos="left" />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>
<script setup>
import { useOvernightParkingRequestFormStore } from '@/stores/overnightParkingRequestFormStore'
import ShowPrint from './ShowPrint.vue'

const form = useOvernightParkingRequestFormStore()

function Menu() {
  form.printMode = false
}
</script>
