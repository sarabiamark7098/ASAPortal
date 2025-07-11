import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/main.css'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'

import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'
import FloatLabel from 'primevue/floatlabel'
import DataView from 'primevue/dataview'
import Menubar from 'primevue/menubar'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
import InputMask from 'primevue/inputmask'
import FileUpload from 'primevue/fileupload'
import Checkbox from 'primevue/checkbox'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_URL

export default axios

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
  ripple: true,
  inputStyle: 'outlined',
  router: true,
})

app.component('Button', Button)
app.component('InputText', InputText)
app.component('Card', Card)
app.component('Select', Select)
app.component('Dialog', Dialog)
app.component('FloatLabel', FloatLabel)
app.component('DataView', DataView)
app.component('Menubar', Menubar)
app.component('Textarea', Textarea)
app.component('DatePicker', DatePicker)
app.component('InputMask', InputMask)
app.component('FileUpload', FileUpload)
app.component('Checkbox', Checkbox)
app.component('DataTable', DataTable)
app.component('Column', Column)

app.mount('#app')
