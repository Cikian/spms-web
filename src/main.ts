import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'
import {createPinia} from 'pinia'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import 'element-plus/dist/index.css'
import ganttastic from '@infectoone/vue-ganttastic'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

library.add(fas, far)
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(Antd)
app.use(ganttastic)
app.mount('#app')