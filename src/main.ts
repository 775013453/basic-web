import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCN from 'element-plus/dist/locale/zh-cn.mjs';
import App from './App.vue';
import './_style.scss';
import router from './router';
import { commonFunc } from './utils/common-func';
import { vueThis } from './utils/send-http';
import { SYSTEM_CONFIG } from './utils/system-config';

const pinia = createPinia();

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(pinia);
app.use(router);
app.use(ElementPlus, { locale: zhCN });
vueThis(app);
app.config.globalProperties['$uuid'] = commonFunc.uuid;
app.config.globalProperties['$dictSwitch'] = commonFunc.dictSwitch;
document.title = SYSTEM_CONFIG.systemName;
app.mount('#app'); // 挂载放于最后
