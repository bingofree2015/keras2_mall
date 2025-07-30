import { createI18n } from 'vue-i18n';
import zhCN from '@/assets/languages/zh_cn.json';
import enUS from '@/assets/languages/en_us.json';

const messages = {
    zh_cn: zhCN,
    en_us: enUS,
};

const i18n = createI18n({
    legacy: false,
    locale: 'zh_cn',
    messages,
});

export default i18n;
