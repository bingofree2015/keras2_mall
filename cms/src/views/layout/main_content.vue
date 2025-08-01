/** * 主内容区域组件 * * 功能特性： * 1. 多标签页管理 * 2. 页面刷新功能 * 3. 路由视图渲染 * *
使用示例： * // 在子组件中使用刷新功能 * export default { * inject: ['reload', 'reloadWithLoading'],
* methods: { * handleRefresh() { * // 基础刷新 * this.reload(); * // 或者带加载状态的刷新 *
this.reloadWithLoading(); * } * } * } */
<template>
    <div
        id="main-container"
        :class="collapse ? 'position-collapse-left' : 'position-left'"
        class="main-container"
    >
        <!-- 导航栏 -->
        <div :class="collapse ? 'position-collapse-left' : 'position-left'" class="main-tabs">
            <!-- 标签页 -->
            <el-tabs v-model="currTabName" @tab-click="clickTab" @tab-remove="removeTab">
                <el-tab-pane
                    v-for="item in mainTabs"
                    :key="item.name"
                    :closable="item.closable"
                    :label="item.name"
                    :name="item.name"
                    :style="{ background: themeColor }"
                >
                    <template #label>
                        <span>
                            <i :class="item.icon"></i>
                            {{ item.name }}
                        </span>
                    </template>
                </el-tab-pane>
            </el-tabs>

            <el-dropdown :show-timeout="0" :size="normalSize">
                <i style="font-size: 32px" class="el-icon-ali-qita2"></i>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="closeCurrentTab">
                            <i class="el-icon-ali-dangqianweizhi2"></i>
                            关闭当前
                        </el-dropdown-item>
                        <el-dropdown-item @click="closeOtherTabs">
                            <i class="el-icon-ali-qita2"></i>
                            关闭其它
                        </el-dropdown-item>
                        <el-dropdown-item @click="closeAllTabs">
                            <i class="el-icon-ali-quanbu1"></i>
                            全部关闭
                        </el-dropdown-item>
                        <el-dropdown-item divided @click="refreshCurrentTab">
                            <i class="el-icon-ali-shuaxin1"></i>
                            刷新当前
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

        <!-- 主内容区域 -->
        <div class="main-content">
            <router-view v-if="isRouterAlive" v-slot="{ Component }">
                <keep-alive>
                    <transition mode="out-in" name="fade">
                        <component :is="Component" />
                    </transition>
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    /**
     * 提供全局刷新功能给子组件
     * @returns {Object} 包含刷新方法的对象
     * - reload: 基础刷新方法，直接刷新页面
     * - reloadWithLoading: 带加载状态的刷新方法，提供更好的用户体验
     */
    provide() {
        return {
            reload: this.reload,
            reloadWithLoading: this.reloadWithLoading,
        };
    },
    props: {
        activeTabName: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            normalSize: 'default',
            isRouterAlive: true,
            currTabName: this.activeTabName,
        };
    },
    computed: {
        ...mapState({
            themeColor: (state) => state.app.themeColor,
            collapse: (state) => state.app.collapse,
            mainTabs: (state) => state.tab.mainTabs,
            mainActiveTab: (state) => state.tab.mainActiveTab,
        }),
    },
    watch: {
        activeTabName(val) {
            this.currTabName = val;
        },
    },
    methods: {
        ...mapActions(['updateMainTabs', 'updateMainActiveTab']),
        /**
         * 基础页面刷新方法
         * 通过控制 isRouterAlive 状态来销毁和重建 router-view 组件
         * 实现页面的完全刷新，包括组件的重新挂载和数据重新加载
         */
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                this.isRouterAlive = true;
            });
        },
        /**
         * 带加载状态的页面刷新方法
         * 提供更好的用户体验，在刷新过程中显示加载动画
         * 适用于需要用户等待的刷新场景
         */
        reloadWithLoading() {
            const loading = this.$loading({
                lock: true,
                text: '页面刷新中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            });

            this.isRouterAlive = false;
            this.$nextTick(() => {
                setTimeout(() => {
                    this.isRouterAlive = true;
                    loading.close();
                }, 300); // 给一点时间让组件完全销毁
            });
        },
        // 选中tab
        clickTab(tab) {
            let currTab = this.mainTabs.find((item) => item.name === tab.props.name);
            if (currTab) {
                // 使用路径跳转而不是路由名称，避免动态路由未加载的问题
                this.$router.push({ path: currTab.path }, () => {
                    this.updateMainActiveTab(currTab);
                });
            }
        },
        // tabs, 删除tab
        removeTab(tabName) {
            // 删除 name  为 tabName 的选项
            let _mainTabs = this.mainTabs.filter((item) => item.name !== tabName);
            this.updateMainTabs(_mainTabs);
            let _tabsLength = _mainTabs.length;
            if (_tabsLength > 0) {
                // 如果当前选中tab被删除，则当前项是被删除元素的前一项
                if (tabName === this.mainActiveTab.name) {
                    this.$router.push({ name: _mainTabs[_tabsLength - 1].name }, () => {
                        // 将当前激活的路由信息对象存进state
                        this.updateMainActiveTab(this.$route);
                    });
                }
            } else {
                this.$router.push('/');
            }
        },
        // tabs关闭当前
        closeCurrentTab() {
            if (this.mainActiveTab.closable) {
                this.removeTab(this.mainActiveTab.name);
            }
        },
        // tabs, 关闭其它
        closeOtherTabs() {
            let _mainTabs = this.mainTabs.filter(
                (item) => item.name === this.mainActiveTab.name || item.closable === false
            );
            this.updateMainTabs(_mainTabs);
        },
        // tabs, 关闭全部
        closeAllTabs() {
            let _mainTabs = this.mainTabs.filter((item) => item.closable === false);
            this.updateMainTabs(_mainTabs);
            if (_mainTabs.length > 0) {
                this.$router.push({ name: _mainTabs[_mainTabs.length - 1].name }, () => {
                    this.updateMainActiveTab(this.$route);
                });
            } else {
                this.$router.push('/');
            }
        },
        // tabs, 刷新当前
        refreshCurrentTab() {
            this.reloadWithLoading();
        },
    },
};
</script>

<style scoped lang="scss">
.el-icon-arrow-down {
    font-size: 15px;
    width: 40px;
    text-align: center;
}
.main-container {
    padding: 0 5px 5px;
    position: absolute;
    top: 60px;
    left: 1px;
    right: 1px;
    bottom: 0px;
    .main-tabs {
        position: fixed;
        top: 60px;
        right: 1px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ccc;
        padding: 0 20px;
        .el-tabs {
            max-width: 80%;
        }
        :deep(.el-tabs__header) {
            padding: 0 10px;
            margin: 0;
        }

        .el-dropdown {
            cursor: pointer;
        }
    }
    .main-content {
        position: absolute;
        top: 45px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        padding: 5px;
        overflow-y: auto;
    }
}
.position-left {
    left: 200px;
}
.position-collapse-left {
    left: 65px;
}
//消失时间持续0.5s
.fade-enter-active {
    transition: all 0.5s;
}
//显示时间持续0.25s
.fade-leave-active {
    transition: all 0.25s;
}
.fade-enter,
.fade-leave-active {
    opacity: 0;
}
</style>
