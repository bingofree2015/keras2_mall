// 导入所有接口
import axios from '@/api/axios';
import api from '@/api';

const install = (app) => {
    if (install.installed) return;
    install.installed = true;
    app.config.globalProperties.$api = api;
    app.config.globalProperties.$axios = axios;
};

export default install;
