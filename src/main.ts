import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

import App from './App.vue'
import './style.css'
import router from './router'

const app = createApp(App)

// Базовая настройка для всплывающих уведомлений
app.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 5,
  newestOnTop: true,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  toastClassName: 'custom-toast',
})

// Базовая настройка для тултипов
app.use(VueTippy, {
  defaultProps: {
    theme: 'simple',
    placement: 'top',
    animation: 'fade',
    arrow: true,
    delay: [100, 0],
    duration: [150, 100],
    offset: [0, 8],
  },
})

app.use(createPinia())
app.use(router)

app.mount('#app')
