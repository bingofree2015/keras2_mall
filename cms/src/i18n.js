import { createI18n } from 'vue-i18n';
import zhCN from '@/assets/languages/zh_cn.json';
import enUS from '@/assets/languages/en_us.json';

const messages = {
    zh_cn: zhCN,
    en_us: enUS,
};

// 从本地存储获取语言设置，如果没有则默认为中文
const savedLocale = localStorage.getItem('locale') || 'zh_cn';

const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    messages,
});

export default i18n;
