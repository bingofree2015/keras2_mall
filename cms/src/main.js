import { createApp } from 'vue';
import App from '@/app.vue';
import router from '@/router';
import vueApi from '@/api/vue_api';
import i18n from '@/i18n';
import store from '@/store';
import * as env from '@/env';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/assets/styles/common.scss';

window.AMapKey = '9a592976bd79ff285350f616bfe43c8f';

const app = createApp(App);

app.use(ElementPlus);
app.use(vueApi);
app.use(router);
app.use(store);
app.use(i18n);

app.config.globalProperties.env = env;

app.mount('#app');
