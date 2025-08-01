<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow">
                <el-form :inline="true" :model="filters" :size="normalSize" class="search-form">
                    <el-form-item>
                        <el-input
                            v-model="filters.value"
                            :placeholder="$t('common.inputPlaceholder')"
                        >
                            <template #prepend>
                                <el-select
                                    v-model="filters.key"
                                    class="search-prepend"
                                    :placeholder="$t('common.selectPlaceholder')"
                                >
                                    <el-option
                                        v-for="item in props"
                                        :key="item.prop"
                                        :label="item.label"
                                        :value="item.prop"
                                    />
                                </el-select>
                            </template>
                            <template #append>
                                <ext-button
                                    :label="$t('action.search')"
                                    icon="el-icon-ali-chazhaobiaodanliebiao"
                                    perms="preference:task:view"
                                    type="primary"
                                    @click="handleRefresh"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip :content="$t('action.refresh')" placement="top">
                                <el-button round @click="handleRefresh">
                                    <i class="el-icon-ali-shuaxin"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="$t('action.export')" placement="top">
                                <el-button round>
                                    <i class="el-icon-ali-daochu"></i>
                                </el-button>
                            </el-tooltip>
                        </el-button-group>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <!--表格内容栏-->
        <ext-table
            :batch-delete="batchDelete"
            :columns="columns"
            :count="paginated.attrs.count"
            :data="paginated.list"
            :operations="operations"
            :operation-width="operationWidth"
            :page-size="paginated.attrs.limit"
            :perms-batch-delete="permsBatchDelete"
            @query-for-paginated-list="queryForPaginatedList"
        />
    </div>
</template>

<script>
import extTable from '@/components/core/ext_table.vue';
import breadCrumb from '@/components/bread_crumb.vue';
import extButton from '@/components/core/ext_button.vue';
export default {
    components: {
        extTable,
        breadCrumb,
        extButton,
    },
    inject: ['reload'],
    data() {
        return {
            normalSize: 'default',
            filters: {
                key: 'name',
                value: '',
            }, // 默认查询字段与查询内容
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.download', // 按钮上显示的文字
                    icon: 'el-icon-ali-xiazai1', // 按钮文字前面的图标
                    perms: 'preference:task:download', // 权限标识
                    size: this.normalSize, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.$notify({
                            title: this.$t('common.info'),
                            message: this.$t('task.download'),
                            type: 'info',
                        });
                    },
                },
                {
                    label: 'action.delete',
                    icon: 'el-icon-ali-shanchu',
                    perms: 'preference:task:delete',
                    size: this.normalSize,
                    type: 'danger',
                    func: (row) => {
                        this.$confirm(this.$t('common.confirmDelete'), this.$t('common.tip'), {
                            type: 'warning',
                        }).then(async () => {
                            await this.batchDelete([row.id]);
                        });
                    },
                },
            ],
            permsBatchDelete: 'preference:task:delete',
        };
    },
    computed: {
        // 响应式的 props 配置
        props() {
            return [
                { prop: 'name', label: this.$t('task.name') },
                { prop: 'type', label: this.$t('task.type') },
                { prop: 'status', label: this.$t('task.status') },
            ];
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'name', label: this.$t('task.name'), minWidth: 160 },
                { prop: 'type', label: this.$t('task.type'), minWidth: 80 },
                {
                    prop: 'fileName',
                    label: this.$t('task.fileName'),
                    minWidth: 160,
                    showOverflowTooltip: true,
                },
                { prop: 'status', label: this.$t('task.status'), minWidth: 80 },
                { prop: 'fileSize', label: this.$t('task.fileSize'), minWidth: 90 },
                {
                    prop: 'createdAt',
                    label: this.$t('common.createdAt'),
                    minWidth: 140,
                    formatter: this.env.formatDateTime,
                },
            ];
        },
        operationWidth: {
            get() {
                let _operationWidth = 0;
                if (Array.isArray(this.operations)) {
                    _operationWidth += this.operations.length * 120;
                }
                return _operationWidth;
            },
        },
    },
    methods: {
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },
        // 获取分页数据
        async queryForPaginatedList(data) {
            if (data && data.attrs) {
                this.paginated.attrs = data.attrs;
            }
            this.paginated.attrs.searchKey = {};
            if (this.filters.key && this.filters.value) {
                this.paginated.attrs.searchKey[this.filters.key] = this.filters.value;
            }
            const _result = await this.$api.task.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.brand.destroy({ ids });
            if (_result.succeed === 1 && _result.code === 200) {
                for (const id of ids) {
                    const _index = this.paginated.list.findIndex((v) => v.id === id);
                    this.paginated.list.splice(_index, 1);
                }
            }
        },
    },
};
</script>

<style scoped lang="scss"></style>
