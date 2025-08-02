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
                                        v-for="item in searchFields"
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
                                    perms="goods:view"
                                    type="primary"
                                    @click="handleRefresh"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip :content="$t('action.add')" placement="top">
                                <el-button round @click="handleAdd">
                                    <i class="el-icon-ali-add"></i>
                                </el-button>
                            </el-tooltip>
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

        <el-tabs
            v-model="activeName"
            class="tab-container"
            type="border-card"
            @tab-click="handleClick"
        >
            <el-tab-pane name="all">
                <template #label>
                    <span>
                        <el-badge :value="paginated['all'].attrs.count" class="item">
                            <i class="el-icon-ali-quanbushangpin"></i>
                            {{ $t('goods.allGoods') }}
                        </el-badge>
                    </span>
                </template>
                <!--表格内容栏-->
                <ext-table
                    :batch-delete="batchDelete"
                    :columns="columns"
                    :count="paginated['all'].attrs.count"
                    :data="paginated['all'].list"
                    :operations="operations"
                    :operation-width="operationWidth"
                    :page-size="paginated['all'].attrs.limit"
                    :perms-batch-delete="permsBatchDelete"
                    tab-name="all"
                    @query-for-paginated-list="queryForPaginatedList"
                />
            </el-tab-pane>
            <el-tab-pane name="up">
                <template #label>
                    <span>
                        <el-badge :value="paginated['up'].attrs.count" class="item">
                            <i class="el-icon-ali-shangjiashangpin"></i>
                            {{ $t('goods.upGoods') }}
                        </el-badge>
                    </span>
                </template>
                <!--表格内容栏-->
                <ext-table
                    :batch-delete="batchDelete"
                    :columns="columns"
                    :count="paginated['up'].attrs.count"
                    :data="paginated['up'].list"
                    :operations="operations"
                    :operation-width="operationWidth"
                    :page-size="paginated['up'].attrs.limit"
                    :perms-batch-delete="permsBatchDelete"
                    tab-name="up"
                    @query-for-paginated-list="queryForPaginatedList"
                />
            </el-tab-pane>
            <el-tab-pane name="down">
                <template #label>
                    <span>
                        <el-badge :value="paginated['down'].attrs.count" class="item">
                            <i class="el-icon-ali-xiajiashangpin"></i>
                            {{ $t('goods.downGoods') }}
                        </el-badge>
                    </span>
                </template>
                <!--表格内容栏-->
                <ext-table
                    :batch-delete="batchDelete"
                    :columns="columns"
                    :count="paginated['down'].attrs.count"
                    :data="paginated['down'].list"
                    :operations="operations"
                    :operation-width="operationWidth"
                    :page-size="paginated['down'].attrs.limit"
                    :perms-batch-delete="permsBatchDelete"
                    tab-name="down"
                    @query-for-paginated-list="queryForPaginatedList"
                />
            </el-tab-pane>
            <el-tab-pane name="warn">
                <template #label>
                    <span>
                        <el-badge :value="paginated['warn'].attrs.count" class="item">
                            <i class="el-icon-ali-kucunbaojing"></i>
                            {{ $t('goods.stockWarn') }}
                        </el-badge>
                    </span>
                </template>
                <!--表格内容栏-->
                <ext-table
                    :batch-delete="batchDelete"
                    :columns="columns"
                    :count="paginated['warn'].attrs.count"
                    :data="paginated['warn'].list"
                    :operations="operations"
                    :operation-width="operationWidth"
                    :page-size="paginated['warn'].attrs.limit"
                    :perms-batch-delete="permsBatchDelete"
                    tab-name="warn"
                    @query-for-paginated-list="queryForPaginatedList"
                />
            </el-tab-pane>
        </el-tabs>
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
            },
            activeName: 'all',

            paginated: {
                all: {
                    attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                    list: [],
                },
                up: {
                    attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                    list: [],
                },
                down: {
                    attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                    list: [],
                },
                warn: {
                    attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                    list: [],
                },
            },

            operations: [
                {
                    label: 'action.edit', // 按钮上显示的文字
                    icon: 'el-icon-ali-bianji', // 按钮文字前面的图标
                    perms: 'goods:edit', // 权限标识
                    size: this.normalSize, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.$router.push({
                            path: '/goods/edit',
                            query: { id: row.id, isCreating: false },
                        });
                    },
                },
                {
                    label: 'action.delete',
                    icon: 'el-icon-ali-shanchu',
                    perms: 'goods:delete',
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
            permsBatchDelete: 'good:delete',
        };
    },
    computed: {
        // 响应式的搜索字段配置
        searchFields() {
            return [
                { prop: 'goodsName', label: this.$t('goods.goodsName') },
                { prop: 'price', label: this.$t('goods.price') },
                { prop: 'costPrice', label: this.$t('goods.costPrice') },
                { prop: 'marketPrice', label: this.$t('goods.marketPrice') },
                { prop: 'defaultImage', label: this.$t('goods.defaultImage') },
                { prop: 'category', label: this.$t('goods.category') },
                { prop: 'type', label: this.$t('goods.type') },
                { prop: 'brand', label: this.$t('goods.brand') },
                { prop: 'onSale', label: this.$t('goods.onSale') },
            ];
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'goodsName', label: this.$t('goods.goodsName'), minWidth: 200 },
                { prop: 'price', label: this.$t('goods.price'), minWidth: 100 },
                { prop: 'costPrice', label: this.$t('goods.costPrice'), minWidth: 100 },
                { prop: 'marketPrice', label: this.$t('goods.marketPrice'), minWidth: 100 },
                { prop: 'defaultImage', label: this.$t('goods.defaultImage'), minWidth: 80 },
                { prop: 'category', label: this.$t('goods.category'), minWidth: 100 },
                { prop: 'type', label: this.$t('goods.type'), minWidth: 100 },
                { prop: 'brand', label: this.$t('goods.brand'), minWidth: 100 },
                { prop: 'onSale', label: this.$t('goods.onSale'), minWidth: 80 },
                { prop: 'tag', label: this.$t('goods.tag'), minWidth: 100 },
                { prop: 'createTime', label: this.$t('common.createTime'), minWidth: 140 },
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
        handleClick() {},
        // 获取分页数据
        async queryForPaginatedList(data) {
            let _tabName = this.activeName;
            if (data && data.attrs) {
                _tabName = data.attrs.tabName;
                this.paginated[_tabName].attrs = data.attrs;
            }

            this.paginated[_tabName].attrs.searchKey = {};
            if (_tabName === 'up') {
                this.paginated[_tabName].attrs.searchKey.marketable = true;
            } else if (_tabName === 'down') {
                this.paginated[_tabName].attrs.searchKey.marketable = false;
            } else if (_tabName === 'warn') {
                this.paginated[_tabName].attrs.searchKey.stock = { $lt: 100 };
            }

            if (this.filters.key && this.filters.value) {
                this.paginated[_tabName].attrs.searchKey[this.filters.key] = this.filters.value;
            }
            const _result = await this.$api.goods.list(this.paginated[_tabName].attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated[_tabName].list = _result.data.list;
                this.paginated[_tabName].attrs.count = _result.data.count;
            }

            if (data && data.cb) data.cb();
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.goods.destroy({ ids });
            if (_result.succeed === 1 && _result.code === 200) {
                for (const id of ids) {
                    const _index = this.paginated[this.activeName].list.findIndex(
                        (v) => v.id === id
                    );
                    this.paginated[this.activeName].list.splice(_index, 1);
                }
            }
        },
        // 显示新增界面
        handleAdd() {
            this.$router.push({ path: '/goods/edit', query: { id: 0, isCreating: true } });
        },
    },
};
</script>

<style scoped lang="scss">
.tab-container :deep(.el-tabs__item) {
    padding: 10px 20px;
    height: 50px;
}
</style>
