import { createApp } from 'vue'
import './style.css'
import App from './App'
import router from "./router/index";
import store from "@/store/index";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';// 额外引入图标库
import '@arco-design/web-vue/dist/arco.css';
const app = createApp(App)
app.use(router)
// 挂载pinia
app.use(store);
app.use(ArcoVueIcon);
app.use(ArcoVue, {
    // 用于改变使用组件时的前缀名称
    componentPrefix: 'a'
});
app.mount('#app')
