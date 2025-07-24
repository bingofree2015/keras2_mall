import { createI18n } from 'vue-i18n';
// import locale from 'element-ui/lib/locale';
// import enLocale from 'element-ui/lib/locale/lang/en';
// import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
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

// locale.i18n((key, value) => i18n.global.t(key, value)); // element-plus 后续适配

export default i18n;
