<template>
    <div class="page-container">
        <!--导航与工具栏-->
        <el-row justify="space-between" type="flex">
            <el-col :span="14" class="top-bar">
                <el-button @click="displayFilterColumnsDialog"
                    icon="el-icon-ali-Filter" round></el-button>
                <!--表格显示列界面-->
                <table-column-filter-dialog :columns="columns"
                    @handleFilterColumns="handleFilterColumns"
                    ref="tableColumnFilterDialog"></table-column-filter-dialog>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import tableColumnFilterDialog from '@/components/core/table_column_filter_dialog'

export default {
    components: {
        tableColumnFilterDialog
    },
    data () {
        return {
            columns: [],
            filterColumns: []
        }
    },
    methods: {
        // 处理表格列过滤显示
        handleFilterColumns (data) {
            this.columns = data.filterColumns
        },
        // 处理表格列过滤显示
        initColumns () {
            this.columns = [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'username', label: '用户名', minWidth: 100, showOverflowTooltip: true },
                { prop: 'attachment.path', label: '头像', minWidth: 80, propType: 'image', align: 'center' },
                { prop: 'roleNames', label: '角色', minWidth: 210, showOverflowTooltip: true },
                { prop: 'email', label: '邮箱', minWidth: 120, showOverflowTooltip: true },
                { prop: 'mobile', label: '手机', minWidth: 100 },
                { prop: 'state', label: '状态', minWidth: 70, formatter: this.env.formatState, align: 'center' }
            ]
            this.filterColumns = Object.assign([], this.columns)
        }
    },
    mounted () {
        this.initColumns()
    }
}
</script>