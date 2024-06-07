import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress'

// import Nacos from "./api/app.js"
import 'amfe-flexible'

import 'vant/lib/index.css'; // 引入组件样式
import Vant from 'vant'; //h5UI组件引入

NProgress.start()
// Nacos.getPlatConfig().then((res) => {
// window.Config = res
const app = createApp(App)
app.use(Vant)
app.use(router)
app.use(store)
NProgress.done()
app.mount('#app')
// });

