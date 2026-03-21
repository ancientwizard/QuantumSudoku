import { createApp } from 'vue'
import './assets/bootstrap-override.scss'

import App from './App.vue'
import router from './router'

import './assets/main.css'

createApp(App)
  .use(router)
  .mount('#app')

// END
