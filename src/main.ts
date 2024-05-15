import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

library.add(fas,far)
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(Antd)
app.mount('#app')