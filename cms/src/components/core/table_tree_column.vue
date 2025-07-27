<template>
    <el-table-column :prop="prop" v-bind="$attrs">
        <template #default="scope">
            <span
                :style="childStyles(scope.row)"
                @click.prevent="toggleHandle(scope.$index, scope.row)"
            >
                <i :class="iconClasses(scope.row)" :style="iconStyles(scope.row)"></i>
                {{ scope.row[prop] }}
            </span>
        </template>
    </el-table-column>
</template>

<script>
export default {
    name: 'TableTreeColumn',
    props: {
        prop: {
            type: String,
            default: 'name',
        },
        treeKey: {
            type: String,
            default: 'id',
        },
        parentKey: {
            type: String,
            default: 'parentId',
        },
        levelKey: {
            type: String,
            default: 'level',
        },
        childKey: {
            type: String,
            default: 'children',
        },
    },
    emits: ['sendTreeData'],
    methods: {
        childStyles(row) {
            return {
                'padding-left': (row[this.levelKey] - 1) * 25 + 'px',
                cursor: 'pointer',
            };
        },
        iconClasses(row) {
            return [!row._expanded ? 'el-icon-caret-right' : 'el-icon-caret-bottom'];
        },
        iconStyles(row) {
            return { visibility: this.hasChild(row) ? 'visible' : 'hidden' };
        },
        hasChild(row) {
            return (Array.isArray(row[this.childKey]) && row[this.childKey].length >= 1) || false;
        },
        // 切换处理
        toggleHandle(index, row) {
            if (this.hasChild(row)) {
                // 通过事件通知父组件处理数据更新
                this.$emit('sendTreeData', {
                    action: 'toggle',
                    index: index,
                    row: row,
                    expanded: !row._expanded,
                });
            }
        },
        // 移除子节点
        removeChildNode(data, parentId) {
            const parentIds = Array.isArray(parentId) ? parentId : [parentId];
            if (parentIds.length <= 0) {
                return data;
            }
            const ids = [];
            for (let i = 0; i < data.length; i++) {
                if (
                    parentIds.indexOf(data[i][this.parentKey]) !== -1 &&
                    parentIds.indexOf(data[i][this.treeKey]) === -1
                ) {
                    ids.push(data.splice(i, 1)[0][this.treeKey]);
                    i--;
                }
            }
            return this.removeChildNode(data, ids);
        },
    },
};
</script>
