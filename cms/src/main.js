//import Vue from 'vue'
import app from "./app";
import router from "./router";
import vueApi from "./api/vue_api";
import i18n from "./i18n";
import store from "./store";
import * as env from "@/env";
//import elementUI from 'element-ui'

// 高德地图配置
window.AMapKey = "9a592976bd79ff285350f616bfe43c8f";

//Vue.use(elementUI)
Vue.use(vueApi);

Vue.prototype.env = env;

// 将el i18n ... 挂载到 vm 下
const vm = new Vue({
    el: "#app",
    i18n,
    router,
    store,
    render: h => h(app)
});
