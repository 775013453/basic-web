import App from '@/App.vue';
import { COMMON_FUNC } from '@/components/utils/common-func';
import router from '@/router';
import '@/scss/_main.scss';
import { SYSTEM_CONFIG } from '@/utils/system-config';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCN from 'element-plus/dist/locale/zh-cn.mjs';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(pinia);
app.use(router);
app.use(ElementPlus, { locale: zhCN });
app.config.globalProperties['$uuid'] = COMMON_FUNC.uuid;
app.config.globalProperties['$dictSwitch'] = COMMON_FUNC.dictSwitch;
document.title = SYSTEM_CONFIG.systemName;
app.mount('#app'); // 挂载放于最后
