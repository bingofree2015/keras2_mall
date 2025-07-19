<template>
    <div :class="collapse?'position-collapse-left':'position-left'" class="main-container" id="main-container">
        <!-- 标签页 -->
        <el-tabs :class="collapse?'position-collapse-left':'position-left'" @tab-click="clickTab"
            @tab-remove="removeTab" class="tabs" v-model="currTabName">
            <el-dropdown :show-timeout="0" :size="normalSize" class="tabs-tools">
                <i class="el-icon-arrow-down  el-icon--right"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="closeCurrentTab" icon="el-icon-ali-dangqianweizhi2">关闭当前
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="closeOtherTabs" icon="el-icon-ali-qita2">关闭其它</el-dropdown-item>
                    <el-dropdown-item @click.native="closeAllTabs" icon="el-icon-ali-quanbu1">全部关闭</el-dropdown-item>
                    <el-dropdown-item @click.native="refreshCurrentTab" divided icon="el-icon-ali-shuaxin1">刷新当前
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-tab-pane :closable="item.closable" :key="item.name" :label="item.name" :name="item.name"
                :style="{'background':themeColor}" v-for="item in mainTabs">
                <span slot="label">
                    <i :class="item.icon"></i>
                    {{item.name}}
                </span>
            </el-tab-pane>
        </el-tabs>
        <!-- 主内容区域 -->
        <div class="main-content">
            <keep-alive>
                <transition mode="out-in" name="fade">
                    <router-view v-if="isRouterAlive" />
                </transition>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    provide () {
        return {
            reload: this.reload
        }
    },
    props: {
        activeTabName: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            normalSize: 'small',
            miniSize: 'mini',
            isRouterAlive: true,
            currTabName: this.activeTabName
        }
    },
    watch: {
        activeTabName (val) {
            this.currTabName = val
        }
    },
    computed: {
        ...mapState({
            themeColor: state => state.app.themeColor,
            collapse: state => state.app.collapse,
            mainTabs: state => state.tab.mainTabs,
            mainActiveTab: state => state.tab.mainActiveTab
        }),
    },
    methods: {
        ...mapActions(['updateMainTabs', 'updateMainActiveTab']),
        reload () {
            this.isRouterAlive = false
            this.$nextTick(function () {
                this.isRouterAlive = true
            })
        },
        // 选中tab
        clickTab (tab) {
            let currTab = this.mainTabs.find(item => item.name === tab.name)
            if (currTab) {
                this.$router.push({ name: tab.name }, () => {
                    this.updateMainActiveTab(this.$route)
                })
            }
        },
        // tabs, 删除tab
        removeTab (tabName) {
            // 删除 name  为 tabName 的选项
            let _mainTabs = this.mainTabs.filter(item => item.name !== tabName)
            this.updateMainTabs(_mainTabs)
            let _tabsLength = _mainTabs.length
            if (_tabsLength > 0) {
                // 如果当前选中tab被删除，则当前项是被删除元素的前一项
                if (tabName === this.mainActiveTab.name) {
                    this.$router.push({ name: _mainTabs[_tabsLength - 1].name }, () => {
                        // 将当前激活的路由信息对象存进state
                        this.updateMainActiveTab(this.$route)
                    })
                }
            } else {
                this.$router.push('/')
            }
        },
        // tabs关闭当前
        closeCurrentTab () {
            if (this.mainActiveTab.closable) {
                this.removeTab(this.mainActiveTab.name)
            }
        },
        // tabs, 关闭其它
        closeOtherTabs () {
            let _mainTabs = this.mainTabs.filter(item => item.name === this.mainActiveTab.name || item.closable === false)
            this.updateMainTabs(_mainTabs)
        },
        // tabs, 关闭全部
        closeAllTabs () {
            let _mainTabs = this.mainTabs.filter(item => item.closable === false)
            this.updateMainTabs(_mainTabs)
            if (_mainTabs.length > 0) {
                this.$router.push({ name: _mainTabs[_mainTabs.length - 1].name }, () => {
                    this.updateMainActiveTab(this.$route)
                })
            } else {
                this.$router.push('/')
            }
        },
        // tabs, 刷新当前
        refreshCurrentTab () {
            this.reload()
        }
    }
}
</script>

<style scoped lang="scss">
.el-icon-arrow-down {
    font-size: 15px;
    width: 40px;
    text-align: center;
}

.tabs {
    margin-left: 8px;
    ::v-deep .el-tabs__item {
        //background: #ccc;
        //width: 130px;
        border-radius: 4px 4px 0 0;
    }
}

.main-container {
    padding: 0 5px 5px;
    position: absolute;
    top: 60px;
    left: 1px;
    right: 1px;
    bottom: 0px;
    .tabs {
        position: fixed;
        top: 60px;
        right: 39px;
    }
    .tabs-tools {
        position: fixed;
        top: 60px;
        right: 0;
        height: 38px;
        line-height: 38px;
        cursor: pointer;
        border-color: rgba(200, 206, 206, 0.5);
        border-bottom-width: 2px;
        border-bottom-style: solid;
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
