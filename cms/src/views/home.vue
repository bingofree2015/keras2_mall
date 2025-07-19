<template>
    <div class="container">
        <!-- 导航菜单栏 -->
        <nav-bar @activeTab="setActiveTab"></nav-bar>
        <!-- 头部区域 -->
        <head-bar></head-bar>
        <!-- 主内容区域 -->
        <main-content :activeTabName="activeTabName"></main-content>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import headBar from './layout/head_bar'
import navBar from './layout/nav_bar'
import mainContent from './layout/main_content'
import { addDynamicMenuAndRoutes } from "@/utils/load_menu";
export default {
    data () {
        return {
            activeTabName: ''
        }
    },
    computed:{
        ...mapState(['loginUser'])
    },
    components: {
        headBar,
        navBar,
        mainContent
    },
    methods: {
        ...mapActions(['setGlobalVariables']),

        async getGlobalVariables () {
            const _result = await this.$api.setting.get({ key: 'global_variables' })
            if (_result.succeed === 1 && _result.code === 200) {
                this.setGlobalVariables(_result.data)
            }
        },

        setActiveTab (name) {
            this.activeTabName = name
        }
    },
    async mounted () {
        await this.getGlobalVariables()
        await addDynamicMenuAndRoutes(this.loginUser.id)
    }
}
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
