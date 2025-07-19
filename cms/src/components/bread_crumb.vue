<template>
<el-breadcrumb separator="/" class="breadcrumb">
    <el-breadcrumb-item v-for="item in $route.meta.nav" :key="item.path">
        <router-link :to="item.path" v-if="item.path">{{ item.name }}</router-link>
        <span v-else>{{ item.name }}</span>
    </el-breadcrumb-item>
</el-breadcrumb>    
</template>

<script>
export default {
    name: 'breadcrumb',
    data () {
        return {
            nav: []
        }
    },
    methods: {},
    mounted () {
        this.nav = this.$route.meta
        console.log(this.nav)
    }
}
</script>

<style scoped lang="scss">
.breadcrumb {
    padding: 10px;
}
</style>
