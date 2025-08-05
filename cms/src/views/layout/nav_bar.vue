<template>
    <div
        :class="['menu-bar-container', { collapse }]"
        :style="{ background: themeColor, width: collapse ? '65px' : '200px' }"
    >
        <!-- logo -->
        <div class="logo" @click="$router.push('/')">
            <img v-if="collapse" src="@/assets/image/logo.png" />
            <div v-else>
                {{ appName }}
            </div>
        </div>
        <!-- 导航菜单 -->
        <el-menu
            ref="navMenu"
            :background-color="themeColor"
            :collapse="collapse"
            :collapse-transition="false"
            :unique-opened="true"
            active-text-color="#ffd04b"
            default-active="1"
            text-color="#fff"
            class="nav-menu"
            @close="closeMenu"
            @open="openMenu"
            @select="selectMenu"
        >
            <menu-tree v-for="item in navTree" :key="item.id" :menu="item" />
        </el-menu>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import menuTree from '@/components/menu_tree.vue';

export default {
    components: {
        menuTree,
    },
    emits: ['activeTab'],
    computed: {
        ...mapState({
            appName: (state) => state.app.appName,
            themeColor: (state) => state.app.themeColor,
            themeTintColor: (state) => state.app.themeTintColor,
            collapse: (state) => state.app.collapse,
            navTree: (state) => state.menu.navTree,
            mainTabs: (state) => state.tab.mainTabs,
            mainActiveTab: (state) => state.tab.mainActiveTab,
        }),
    },
    watch: {
        $route: 'openTab',
    },
    mounted() {
        this.openTab(this.$route);
    },
    methods: {
        ...mapActions(['updateMainTabs', 'updateMainActiveTab']),
        openMenu() {},
        closeMenu() {},
        selectMenu() {},
        // 路由操作处理
        openTab(route) {
            let _activeTab = this.mainTabs.find((item) => item.name === route.name);
            if (!_activeTab) {
                _activeTab = {
                    name: route.name,
                    path: route.path,
                    icon: route.meta.icon,
                    closable: route.name !== '控制面板',
                    query: route.query,
                };
                let _mainTabs = this.mainTabs.concat(_activeTab);
                this.updateMainTabs(_mainTabs);
            }
            this.updateMainActiveTab(_activeTab);
            this.$emit('activeTab', _activeTab.name);
            if (this.$refs.navMenu !== null) {
                this.$refs.navMenu.activeIndex = '' + route.meta.index;
            }
        },
    },
};
</script>

<style scoped lang="scss">
.menu-bar-container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1020;
    width: 200px;
    transition: width 0.2s;
    display: flex;
    flex-direction: column;
    background: #222;
    &.collapse {
        width: 65px;
    }
    .logo {
        height: 60px;
        line-height: 60px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
            width: 40px;
            height: 40px;
            border-radius: 0px;
            margin: 10px;
        }
        div {
            font-size: 25px;
            color: white;
            text-align: left;
            padding-left: 20px;
        }
    }
    .nav-menu {
        flex: 1;
        border-right: none;
        background: transparent;
        .el-menu {
            background: transparent;
        }
    }
}
</style>
