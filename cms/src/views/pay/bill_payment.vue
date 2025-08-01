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
                                    perms="pay:bill_payment:view"
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
            :columns="columns"
            :count="paginated.attrs.count"
            :data="paginated.list"
            :operations="operations"
            :operation-width="operationWidth"
            :page-size="paginated.attrs.limit"
            alias-name="bill_payment"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--新增编辑界面-->
        <el-dialog
            :close-on-click-modal="false"
            :model-value="viewDialogVisible"
            :title="$t('permission.edit')"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :size="normalSize"
                class="dialog-container"
                label-width="80px"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.paymentId') + ':'" prop="paymentId">
                            {{ formData.paymentId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.user') + ':'" prop="user.username">
                            {{ formData.user.username }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.paymentMethod') + ':'" prop="paymentCode">
                            {{ formData.paymentCode }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.paymentAmount') + ':'" prop="money">
                            {{ formData.money }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.type') + ':'" prop="type">
                            {{ env.columnFormatter(formData.type, 'bill_payment', 'type') }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.status') + ':'" prop="state">
                            {{ env.columnFormatter(formData.state, 'bill_payment', 'state') }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.createTime') + ':'" prop="isOnline">
                            {{ formData.createdAt }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.updateTime') + ':'" prop="isOnline">
                            {{ formData.updatedAt }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table
                            :data="formData.billPaymentItems"
                            :size="normalSize"
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column
                                :label="$t('pay.billId')"
                                min-width="360"
                                prop="sourceId"
                                show-overflow-tooltip
                            />
                            <el-table-column
                                :label="$t('pay.amount')"
                                min-width="100"
                                prop="money"
                            />
                        </el-table>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button
                        :size="normalSize"
                        round
                        type="primary"
                        @click="viewDialogVisible = false"
                    >
                        {{ $t('action.comfirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
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
                key: 'paymentId',
                value: '',
            },
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.view', // 按钮上显示的文字
                    icon: 'el-icon-ali-chakan1', // 按钮文字前面的图标
                    perms: 'pay:bill_payment:view', // 权限标识
                    size: this.normalSize, // 按钮大小
                    // type: 'primary',                // 按钮类型
                    func: (row) => {
                        this.viewDialogVisible = true;
                        this.formData = Object.assign(this.formData, row);
                    },
                },
            ],

            viewDialogVisible: false, // 新增编辑界面是否显示
            // 新增编辑界面数据
            formData: {
                id: 0,
                paymentId: '', // 支付类型名称
                user: {
                    id: 0,
                    username: '',
                }, // 用户
                paymentCode: '', // 支付方式
                money: null, // 支付金额
                type: 0, // 类型
                status: 0, // 状态
                billPaymentItems: [], // 明细
                createdAt: '', // 创建时间
                updatedAt: '', // 更新时间
            },
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
        // 响应式的搜索字段配置
        searchFields() {
            return [{ prop: 'paymentId', label: this.$t('pay.paymentId') }];
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'paymentId', label: this.$t('pay.paymentId'), minWidth: 120 },
                {
                    prop: 'state',
                    label: this.$t('common.status'),
                    minWidth: 80,
                    formatter: this.env.columnFormatter,
                },
                { prop: 'paymentCode', label: this.$t('pay.paymentMethod'), minWidth: 98 },
                {
                    prop: 'type',
                    label: this.$t('pay.billType'),
                    minWidth: 98,
                    formatter: this.env.columnFormatter,
                },
                { prop: 'user.username', label: this.$t('common.user'), minWidth: 80 },
                { prop: 'money', label: this.$t('pay.amount'), minWidth: 80 },
                { prop: 'trade_no', label: this.$t('pay.thirdPartyPaymentId'), minWidth: 140 },
                { prop: 'updatedAt', label: this.$t('pay.paymentTime'), minWidth: 140 },
            ];
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
            const _result = await this.$api.billPayment.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
    },
};
</script>

<style scoped lang="scss"></style>
