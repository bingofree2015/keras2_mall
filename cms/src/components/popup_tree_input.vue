<template>
    <div class="popup-tree">
        <el-popover ref="popover" :placement="placement" trigger="click">
            <template #reference>
                <el-input
                    :placeholder="placeholderText"
                    :readonly="true"
                    style="cursor: pointer"
                    :model-value="modelValue"
                />
            </template>
            <template #default>
                <div>
                    <el-tree
                        ref="popupTree"
                        :data="data"
                        :default-expand-all="defaultExpandAll"
                        :expand-on-click-node="false"
                        :highlight-current="true"
                        :props="props"
                        :node-key="nodeKey"
                        @node-click="handleNodeClick"
                    />
                </div>
            </template>
        </el-popover>
    </div>
</template>

<script>
export default {
    name: 'PopupTreeInput',
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        props: {
            type: Object,
            default: () => {},
        },
        modelValue: {
            type: String,
            default: '',
        },
        nodeKey: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '',
        },
        placement: {
            type: String,
            default: 'right-start',
        },
        defaultExpandAll: {
            type: Boolean,
            default: false,
        },
        currentChangeHandle: {
            type: Function,
            default: null,
        },
    },
    computed: {
        placeholderText() {
            return this.placeholder || this.$t('popupTreeInput.clickToSelect');
        },
    },
    methods: {
        handleNodeClick(data, node) {
            console.log('popup-tree-input handleNodeClick 被调用:', data, node);
            // 手动设置当前节点
            this.$refs.popupTree.setCurrentKey(data.id);
            // 调用父组件传入的回调函数
            if (this.currentChangeHandle) {
                console.log('调用父组件回调函数');
                this.currentChangeHandle(data, node);
            } else {
                console.log('currentChangeHandle 不存在');
            }
            // 选择后关闭 popover
            this.$refs.popover.hide();
        },
    },
};
</script>

<style scoped lang="scss"></style>
