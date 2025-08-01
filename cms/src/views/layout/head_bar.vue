<template>
    <div
        :class="collapse ? 'position-collapse-left' : 'position-left'"
        :style="{ background: themeColor }"
        class="headbar"
    >
        <!-- 导航收缩 -->
        <el-icon class="square-icon" @click="onCollapse">
            <hamburger :is-active="collapse" />
        </el-icon>
        <!-- 工具栏 -->
        <div class="headbar-right">
            <!-- 主题切换 -->
            <theme-picker
                :default="themeColor"
                class="theme-picker"
                @on-theme-change="onThemeChange"
            />
            <!-- 语言切换 -->
            <el-popover placement="bottom-start" trigger="click">
                <template #reference>
                    <el-icon class="square-icon">
                        <i
                            class="el-icon-ali-shangjiafuwu_duoyuyanyunfanyi"
                            style="font-size: 32px; color: #fff"
                        ></i>
                    </el-icon>
                </template>
                <ul class="lang-list">
                    <li @click="changeLanguage('zh_cn')">
                        {{ $t('lang.zh_cn') }}
                    </li>
                    <li @click="changeLanguage('en_us')">
                        {{ $t('lang.en_us') }}
                    </li>
                </ul>
            </el-popover>
            <!-- 用户信息 -->
            <el-popover placement="bottom-end" :width="280" trigger="click">
                <template #reference>
                    <span class="user-info">
                        <img
                            v-if="loginUser.attachment"
                            :src="env.getImgUrl(loginUser.attachment.path)"
                        />
                        {{ loginUser.username }}
                    </span>
                </template>
                <personal-panel />
            </el-popover>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import hamburger from '@/components/hamburger.vue';
import themePicker from '@/components/theme_picker.vue';
import personalPanel from '@/components/personal_panel.vue';

export default {
    components: {
        hamburger,
        themePicker,
        personalPanel,
    },
    data() {
        return {
            langVisible: false,
        };
    },
    computed: {
        ...mapState({
            loginUser: (state) => state.loginUser,
            themeColor: (state) => state.app.themeColor,
            collapse: (state) => state.app.collapse,
        }),
    },
    methods: {
        openWindow(url) {
            window.open(url);
        },
        // 折叠导航栏
        onCollapse() {
            this.$store.commit('onCollapse');
        },
        // 切换主题
        onThemeChange(themeColor) {
            this.$store.commit('setThemeColor', themeColor);
        },
        // 语言切换
        changeLanguage(lang) {
            const _lang = lang === '' ? 'zh_cn' : lang;
            this.$i18n.locale = _lang;

            // 同时切换 Element Plus 的语言
            const newLocale = this.$elementPlusLocales[_lang];
            if (newLocale) {
                // 更新 Element Plus 的语言配置
                Object.assign(this.$elementPlusLocale, newLocale);
            }

            // 保存语言设置到本地存储
            localStorage.setItem('locale', _lang);

            this.langVisible = false;
        },
    },
};
</script>

<style scoped lang="scss">
i {
    font-style: normal;
}
.headbar {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
    right: 0;
    z-index: 1030;
    height: 60px;
    line-height: 60px;
    border-color: rgba(180, 190, 190, 0.8);
    border-left-width: 1px;
    border-left-style: solid;
}
.square-icon {
    margin: 0 20px;
    font-size: 24px;
    cursor: pointer;
}
.headbar-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 20px;
    gap: 8px;
}
.lang-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0;
    margin: 0;
    font-size: 14px;
    li {
        cursor: pointer;
        &:hover {
            border-bottom: 1px solid #b0d6ce4d;
        }
    }
}
.user-info {
    font-size: 18px;
    color: #fff;
    cursor: pointer;
    img {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        margin: 10px 0px 10px 10px;
        float: right;
    }
}
.badge {
    line-height: 18px;
}
.position-left {
    left: 200px;
}
.position-collapse-left {
    left: 65px;
}
</style>
