<template>
    <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item v-for="item in $route.meta.nav" :key="item.path">
            <router-link v-if="item.path" :to="item.path">
                {{ item.name }}
            </router-link>
            <span v-else>{{ item.name }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name: 'Breadcrumb',
    data() {
        return {
            nav: [],
        };
    },
    mounted() {
        this.nav = this.$route.meta;
        console.log(this.nav);
    },
    methods: {},
};
</script>

<style scoped lang="scss">
.breadcrumb {
    padding: 10px;
}
</style>
