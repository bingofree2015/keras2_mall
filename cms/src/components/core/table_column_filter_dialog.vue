<template>
    <!--表格显示列界面-->
    <el-dialog
        v-model:visible="dialogVisible"
        :close-on-click-modal="false"
        title="表格显示列"
        width="40%"
    >
        <el-table
            ref="fitlerTable"
            :data="columns"
            :size="size"
            align="left"
            header-align="left"
            height="330px"
            style="width: 100%"
            tooltip-effect="dark"
            @selection-change="selectionChange"
        >
            <el-table-column type="selection" width="40" />
            <el-table-column label="属性">
                <template #default="scope">
                    {{ scope.row.prop }}
                </template>
            </el-table-column>
            <el-table-column label="列名">
                <template #default="scope">
                    <el-input v-model="scope.row.label" :size="size" />
                </template>
            </el-table-column>
            <el-table-column label="最小宽度">
                <template #default="scope">
                    <el-input v-model="scope.row.minWidth" :size="size" />
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <div class="dialog-footer">
                <el-button :size="size" round @click="dialogVisible = false">
                    {{ $t('action.cancel') }}
                </el-button>
                <el-button :size="size" round type="primary" @click="handleFilterColumns">
                    {{ $t('action.comfirm') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
export default {
    name: 'TableColumnFilterDialog',
    components: {},
    props: {
        columns: {
            type: Array,
            default: () => [],
        },
        size: {
            type: String,
            default: 'mini',
        },
    },
    emits: ['handleFilterColumns'],
    data() {
        return {
            selections: () => [], // 列表选中列
            dialogVisible: false,
        };
    },
    methods: {
        // 选择切换
        selectionChange: function (selections) {
            this.selections = selections;
        },
        // 设置可见性
        setDialogVisible: function (visible) {
            this.dialogVisible = visible;
        },
        // 处理表格列过滤显示
        handleFilterColumns: function () {
            const filterColumns = [];
            for (let i = 0; i < this.columns.length; i++) {
                const column = this.columns[i];
                if (this.hasColumn(column)) {
                    filterColumns.push(column);
                }
            }
            this.$emit('handleFilterColumns', {
                filterColumns: JSON.parse(JSON.stringify(filterColumns)),
            });
        },
        hasColumn: function (column) {
            for (let i = 0; i < this.selections.length; i++) {
                const col = this.selections[i];
                if (column.prop === col.prop) {
                    return true;
                }
            }
            return false;
        },
    },
};
</script>

<style scoped lang="scss"></style>
