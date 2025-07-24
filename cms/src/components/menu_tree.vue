<template>
    <el-sub-menu
        v-if="menu.children && menu.children.length >= 1"
        :index="'' + menu.id"
        class="submenu"
    >
        <template #title>
            <i :class="menu.icon"></i>
            <span style="margin-left: 6px">{{ menu.name }}</span>
        </template>
        <menu-tree v-for="item in menu.children" :key="item.id" :menu="item" />
    </el-sub-menu>
    <el-menu-item v-else :index="'' + menu.id" class="menuitem" @click="handleRoute(menu)">
        <i :class="menu.icon"></i>
        <span>{{ menu.name }}</span>
    </el-menu-item>
</template>

<script>
import { parseIFrameRoutePath } from '@/utils/iframe_route_utils';

export default {
    name: 'MenuTree',
    props: {
        menu: {
            type: Object,
            required: true,
        },
    },
    methods: {
        /**
         * Handle menu route navigation
         * @param {Object} menu
         */
        handleRoute(menu) {
            // 如果是嵌套页面，转换成iframe的path
            let path = parseIFrameRoutePath(menu.url);
            if (!path) {
                path = menu.url;
            }
            // 通过菜单URL跳转至指定路由
            this.$router.push('/' + path).catch((err) => {
                this.$message && this.$message.error('页面不存在或加载失败');
                console.error(err);
            });
        },
    },
};
</script>

<style scoped lang="scss">
.submenu :deep(.el-sub-menu__title) {
    height: 42px;
    line-height: 42px;
}
.menuitem {
    font-size: 13px;
    height: 32px;
    line-height: 32px;
}
</style>
