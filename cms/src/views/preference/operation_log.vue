<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow">
                <el-form :inline="true" :model="filters" :size="largeSize" class="search-form">
                    <el-form-item>
                        <el-input v-model="filters.value" placeholder="请输入内容">
                            <template #prepend>
                                <el-select
                                    v-model="filters.key"
                                    class="search-prepend"
                                    placeholder="请选择"
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
                                    perms="preference:operation_log:view"
                                    type="primary"
                                    @click="queryForPaginatedList()"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip content="刷新" placement="top">
                                <el-button round @click="handleRefresh">
                                    <i class="el-icon-ali-shuaxin"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="导出" placement="top">
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
            :columns="columns"
            :show-operation="showOperation"
            :count="paginated.attrs.count"
            :data="paginated.list"
            :page-size="paginated.attrs.limit"
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
    data() {
        return {
            largeSize: 'large',
            miniSize: 'default',
            filters: {
                key: 'username',
                value: '',
            },
            props: [
                { prop: 'username', label: '管理员' },
                { prop: 'method', label: '方法' },
                { prop: 'content', label: '参数' },
                { prop: 'ip', label: 'IP' },
            ],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'sysUser.username', label: '管理员', minWidth: 100 },
                { prop: 'method', label: '方法', minWidth: 80 },
                { prop: 'desc', label: '描述', minWidth: 120, showOverflowTooltip: true },
                { prop: 'content', label: '参数', minWidth: 220, showOverflowTooltip: true },
                { prop: 'ip', label: 'IP', minWidth: 100 },
                {
                    prop: 'createdAt',
                    label: '创建时间',
                    minWidth: 130,
                    formatter: this.env.formatDateTime,
                },
            ],
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            showOperation: false,
        };
    },
    mounted() {},
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
            const _result = await this.$api.operationLog.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 刷新数据
        handleRefresh() {
            this.queryForPaginatedList();
        },
    },
};
</script>

<style scoped lang="scss"></style>
