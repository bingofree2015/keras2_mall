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
import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css';

initAMapApiLoader({
    key: 'YOUR_AMAP_KEY', // 替换为你的高德地图key
    // 你可以根据需要添加其他配置项
});

window.AMapKey = '9a592976bd79ff285350f616bfe43c8f';

const app = createApp(App);

app.use(ElementPlus);
app.use(vueApi);
app.use(router);
app.use(store);
app.use(i18n);
app.use(VueAMap);

app.config.globalProperties.env = env;

app.mount('#app');
