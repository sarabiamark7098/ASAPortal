import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import DefaultTheme from 'vitepress/theme'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import './index.css'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({ components, directives })
const app = createApp(App).mount('#app')

app.use(vuetify);
app.use(createPinia())
app.use(router)

app.mount('#app')
