<template>
    <div class="container">
        <!-- 导航菜单栏 -->
        <nav-bar @active-tab="setActiveTab" />
        <!-- 头部区域 -->
        <head-bar />
        <!-- 主内容区域 -->
        <main-content :active-tab-name="activeTabName" />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import headBar from '@/views/layout/head_bar.vue';
import navBar from '@/views/layout/nav_bar.vue';
import mainContent from '@/views/layout/main_content.vue';
import { loadDynamicMenuAndRoutes } from '@/utils/menu_route_loader.js';
export default {
    components: {
        headBar,
        navBar,
        mainContent,
    },
    data() {
        return {
            activeTabName: '',
        };
    },
    computed: {
        ...mapState(['loginUser']),
    },
    async mounted() {
        await this.getGlobalVariables();
        await loadDynamicMenuAndRoutes(this.loginUser.id);
    },
    methods: {
        ...mapActions(['setGlobalVariables']),

        async getGlobalVariables() {
            const _result = await this.$api.setting.get({ key: 'global_variables' });
            if (_result.succeed === 1 && _result.code === 200) {
                this.setGlobalVariables(_result.data);
            }
        },

        setActiveTab(name) {
            this.activeTabName = name;
        },
    },
};
</script>

<style scoped lang="scss">
.container {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
}
</style>
