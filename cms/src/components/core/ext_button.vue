<template>
    <el-button
        :disabled="!hasPerms(perms)"
        :loading="loading"
        :size="size"
        :type="type"
        :circle="circle"
        :round="!circle"
        class="ext-button"
        @click="handleClick"
    >
        <i v-if="icon" :class="icon"></i>
        <span v-if="!circle && label">{{ label }}</span>
        <span v-else-if="circle && !icon">&nbsp;</span>
    </el-button>
</template>

<script>
import { hasPermit } from '@/utils/permit.js';
export default {
    name: 'ExtButton',
    props: {
        label: {
            // 按钮显示文本
            type: String,
            default: '',
        },
        icon: {
            // 按钮显示图标
            type: String,
            default: '',
        },
        size: {
            // 按钮尺寸
            type: String,
            default: 'default',
        },
        type: {
            // 按钮类型
            type: String,
            default: null,
        },
        loading: {
            // 按钮加载标识
            type: Boolean,
            default: false,
        },
        round: {
            type: Boolean,
            default: true,
        },
        circle: {
            type: Boolean,
            default: false,
        },
        disabled: {
            // 按钮是否禁用
            type: Boolean,
            default: false,
        },
        perms: {
            // 按钮权限标识，外部使用者传入
            type: String,
            default: null,
        },
    },
    emits: ['click'],
    data() {
        return {};
    },
    mounted() {},
    methods: {
        handleClick: function (event) {
            // 按钮操作处理函数
            this.$emit('click', event);
        },
        hasPerms: function (perms) {
            // 根据权限标识和外部指示状态进行权限判断
            if (perms) {
                return hasPermit(perms) & !this.disabled;
            } else {
                return true;
            }
        },
    },
};
</script>

<style scoped lang="scss">
.el-button > span {
    gap: 4px;
}
</style>
