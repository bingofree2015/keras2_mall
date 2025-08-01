import { createApp } from 'vue';
import App from '@/app.vue';
import router from '@/router';
import vueApi from '@/api/vue_api';
import i18n from '@/i18n';
import store from '@/store';
import * as env from '@/env';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';
import 'element-plus/dist/index.css';
import '@/assets/styles/common.scss';
import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css';
import ExtButton from '@/components/core/ext_button.vue';
import ExtTable from '@/components/core/ext_table.vue';

// 添加全局错误处理
window.AMapErrorHandler = {
    handleError: function (error) {
        console.warn('高德地图API错误:', error);
        if (error && error.info === 'USER_DAILY_QUERY_OVER_LIMIT') {
            return 'API查询次数已达上限，请稍后再试';
        } else if (error && error.info === 'INVALID_USER_KEY') {
            return 'API密钥无效';
        } else {
            return '地图服务暂时不可用';
        }
    },
};

// 初始化高德地图API，添加错误处理和防重复初始化
if (!window.AMapInitialized) {
    try {
        initAMapApiLoader({
            key: '9a592976bd79ff285350f616bfe43c8f', // 高德地图API密钥
            version: '2.0',
            plugins: ['AMap.Geocoder', 'AMap.PlaceSearch', 'AMap.ToolBar', 'AMap.Scale'],
        });
        window.AMapInitialized = true;
    } catch (error) {
        console.warn('高德地图API初始化失败:', error);
    }
}

window.AMapKey = '9a592976bd79ff285350f616bfe43c8f';

const app = createApp(App);

// 从本地存储获取语言设置，如果没有则默认为中文
const savedLocale = localStorage.getItem('locale') || 'zh_cn';

// Element Plus 语言配置
const elementPlusLocale = savedLocale === 'en_us' ? en : zhCn;

app.use(ElementPlus, {
    locale: elementPlusLocale,
});

// 将语言配置挂载到全局，以便动态切换
app.config.globalProperties.$elementPlusLocale = elementPlusLocale;
app.config.globalProperties.$elementPlusLocales = { zh_cn: zhCn, en_us: en };
app.use(vueApi);
app.use(router);
app.use(store);
app.use(i18n);
app.use(VueAMap);

app.config.globalProperties.env = env;

// 全局注册组件
app.component('ExtButton', ExtButton);
app.component('ExtTable', ExtTable);

app.mount('#app');
