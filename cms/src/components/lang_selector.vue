<template>
    <div v-popover:popover class="lang-selector" :style="istyle">
        <li :style="iconStyle" :class="icon"></li>
        <el-popover ref="popover" v-model="visible" placement="bottom-start" :trigger="trigger">
            <div class="item" @click="changeLanguage('zh_cn')">
                {{ $t('lang.zh_cn') }}
            </div>
            <div class="item" @click="changeLanguage('en_us')">
                {{ $t('lang.en_us') }}
            </div>
        </el-popover>
    </div>
</template>

<script>
export default {
    name: 'LangSelector',
    props: {
        istyle: {
            type: String,
            default: 'width:60px;',
        },
        icon: {
            type: String,
            default: 'fa fa-language fa-lg',
        },
        iconStyle: {
            type: String,
            default: 'color:#fff;',
        },
        trigger: {
            type: String,
            default: 'click',
        },
    },
    data() {
        return {
            visible: false,
        };
    },
    methods: {
        // 语言切换
        changeLanguage(lang) {
            const _lang = lang === '' ? 'zh_cn' : lang;
            this.$i18n.locale = _lang;

            // 保存语言设置到本地存储
            localStorage.setItem('locale', _lang);

            this.visible = false;
        },
    },
};
</script>
<style scoped lang="scss">
.item {
    font-size: 16px;
    padding-left: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
    cursor: pointer;
}
.lang-selector:hover {
    background: #636b6931;
}
.item:hover {
    font-size: 18px;
    background: #b0d6ce4d;
}
</style>
