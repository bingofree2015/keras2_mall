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
                            :placeholder="$t('permission.pleaseEnterContent')"
                        >
                            <template #prepend>
                                <el-select
                                    v-model="filters.key"
                                    class="search-prepend"
                                    :placeholder="$t('permission.pleaseSelect')"
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
                                    perms="pay:user_to_cash:view"
                                    type="primary"
                                    @click="handleRefresh"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip :content="$t('permission.refresh')" placement="top">
                                <el-button round @click="handleRefresh">
                                    <i class="el-icon-ali-shuaxin"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="$t('permission.export')" placement="top">
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
            alias-name="user_to_cash"
            :columns="columns"
            :count="paginated.attrs.count"
            :data="paginated.list"
            :operations="operations"
            :operation-width="operationWidth"
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
    inject: ['reload'],

    data() {
        return {
            normalSize: 'default',
            miniSize: 'default',
            filters: {
                key: 'name',
                value: '',
            },
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.pass', // 按钮上显示的文字
                    icon: 'el-icon-ali-tongguo', // 按钮文字前面的图标
                    perms: 'pay:user_to_cash:edit', // 权限标识
                    size: this.size, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.$confirm(this.$t('pay.confirmPass'), this.$t('common.tip'), {}).then(
                            async () => {
                                const data = { id: row.id, type: 2 };
                                this.updateUserToCash(data);
                            }
                        );
                    },
                },
                {
                    label: 'action.reject', // 按钮上显示的文字
                    icon: 'el-icon-ali-yibohui', // 按钮文字前面的图标
                    perms: 'pay:user_to_cash:edit', // 权限标识
                    size: this.size, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.$confirm(this.$t('pay.confirmReject'), this.$t('common.tip'), {}).then(
                            async () => {
                                const data = { id: row.id, type: 3 };
                                this.updateUserToCash(data);
                            }
                        );
                    },
                },
            ],
        };
    },
    computed: {
        operationWidth: {
            get() {
                let _operationWidth = 0;
                if (Array.isArray(this.operations)) {
                    _operationWidth += this.operations.length * 120;
                }
                return _operationWidth;
            },
        },
        // 响应式的 props 配置
        props() {
            return [{ prop: 'name', label: this.$t('pay.paymentMethodName') }];
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'user.username', label: this.$t('common.user'), minWidth: 98 },
                { prop: 'money', label: this.$t('pay.amount'), minWidth: 80 },
                { prop: 'withdrawals', label: this.$t('pay.serviceFee'), minWidth: 90 },
                { prop: 'accountBank', label: this.$t('pay.bankName'), minWidth: 100 },
                { prop: 'accountName', label: this.$t('pay.accountName'), minWidth: 90 },
                { prop: 'cardNumber', label: this.$t('pay.cardNumber'), minWidth: 120 },
                {
                    prop: 'type',
                    label: this.$t('common.type'),
                    minWidth: 90,
                    formatter: this.env.columnFormatter,
                },
                { prop: 'createdAt', label: this.$t('common.createTime'), minWidth: 140 },
            ];
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
            const _result = await this.$api.userToCash.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        async updateUserToCash(data) {
            const _result = await this.$api.userToCash.save(data);
            if (_result.succeed === 1 && _result.code === 200) {
                const _userToCash = this.paginated.list.find((v) => v.id === _result.data.id);
                if (!_userToCash) {
                    this.paginated.list.unshift(_result.data);
                } else {
                    Object.assign(_userToCash, _result.data);
                }
                this.$notify({
                    title: this.$t('common.success'),
                    message: _result.description,
                    type: 'success',
                });
            } else {
                this.$notify.error({
                    title: this.$t('common.error'),
                    message: _result.description,
                });
            }
        },
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },
    },
};
</script>

<style scoped lang="scss"></style>
