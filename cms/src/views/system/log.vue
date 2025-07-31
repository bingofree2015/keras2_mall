<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow">
                <el-form :inline="true" :model="filters" class="search-form">
                    <el-form-item>
                        <el-input
                            v-model="filters.value"
                            :placeholder="$t('common.inputPlaceholder')"
                        >
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
                            <template #append>
                                <ext-button
                                    :label="$t('action.search')"
                                    icon="el-icon-ali-chazhaobiaodanliebiao"
                                    perms="sys:log:view"
                                    type="primary"
                                    @click="handleRefresh"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip :content="$t('report.refresh')" placement="top">
                                <el-button round @click="handleRefresh">
                                    <i class="el-icon-ali-shuaxin"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="$t('report.export')" placement="top">
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
                key: 'userName',
                value: '',
            },
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.delete',
                    icon: 'el-icon-ali-shanchu',
                    perms: 'system:log:delete',
                    size: this.size,
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
            permsBatchDelete: 'system:log:delete',
        };
    },
    computed: {
        // 响应式的 props 配置
        props() {
            return [
                { prop: 'userName', label: this.$t('system.username') },
                { prop: 'method', label: this.$t('system.method') },
                { prop: 'params', label: this.$t('system.parameter') },
                { prop: 'ip', label: this.$t('system.ip') },
                { prop: 'createBy', label: this.$t('system.creator') },
            ];
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'userName', label: this.$t('system.username'), minWidth: 100 },
                {
                    prop: 'method',
                    label: this.$t('system.method'),
                    minWidth: 180,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'params',
                    label: this.$t('system.parameter'),
                    minWidth: 220,
                    showOverflowTooltip: true,
                },
                { prop: 'ip', label: this.$t('system.ip'), minWidth: 120 },
                { prop: 'time', label: this.$t('system.timeConsuming'), minWidth: 80 },
                { prop: 'createBy', label: this.$t('system.creator'), minWidth: 100 },
                {
                    prop: 'createdAt',
                    label: this.$t('common.createTime'),
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
        // 获取分页数据
        async queryForPaginatedList(data) {
            if (data && data.attrs) {
                this.paginated.attrs = data.attrs;
            }
            this.paginated.attrs.searchKey = {};
            if (this.filters.key && this.filters.value) {
                this.paginated.attrs.searchKey[this.filters.key] = this.filters.value;
            }
            const _result = await this.$api.log.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.log.destroy({ ids });
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
