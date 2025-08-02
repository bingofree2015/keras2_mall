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
                                    perms="pay:bill_refund:view"
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
            alias-name="bill_refund"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--退款单审核界面-->
        <el-dialog
            :close-on-click-modal="false"
            :model-value="checkDialogVisible"
            :title="$t('pay.refundAudit')"
            width="40%"
        >
            <el-form ref="formData" :model="formData" :size="miniSize" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.refundId') + ':'" prop="refundId">
                            {{ formData.refundId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.orderId') + ':'" prop="sourceId">
                            {{ formData.sourceId }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('common.user') + ':'" prop="user.username">
                            {{ formData.user.username }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('common.status') + ':'" prop="state">
                            {{ formData.state }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.billType') + ':'" prop="type">
                            {{ formData.type }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.refundAmount') + ':'" prop="money">
                            {{ formData.money }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.refundMethod') + ':'" prop="paymentCode">
                            <el-select
                                v-model="formData.paymentCode"
                                :placeholder="$t('permission.pleaseSelect')"
                            >
                                <el-option
                                    v-for="item in paymentOpts"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.auditResult') + ':'" prop="state">
                            <el-radio-group v-model="formData.state">
                                <el-radio :value="2">
                                    {{ $t('action.pass') }}
                                </el-radio>
                                <el-radio :value="4">
                                    {{ $t('action.reject') }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :size="miniSize" round @click="checkDialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button
                        :loading="loading"
                        :size="miniSize"
                        round
                        type="primary"
                        @click="submitForm"
                    >
                        {{ $t('action.submit') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!--退款单查看界面-->
        <el-dialog
            :close-on-click-modal="false"
            :model-value="viewDialogVisible"
            class="edit-dialog"
            :title="$t('pay.refundView')"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :size="miniSize"
                class="dialog-container"
                label-width="80px"
            >
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('pay.refundId') + ':'" prop="refundId">
                            {{ formData.refundId }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('common.user') + ':'" prop="user.username">
                            {{ formData.user.username }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('common.status') + ':'" prop="state">
                            {{ env.columnFormatter(formData.state, 'bill_refund', 'state') }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.refundAmount') + ':'" prop="money">
                            {{ formData.money }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.refundMethod') + ':'" prop="paymentCode">
                            {{ formData.paymentCode }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.billType') + ':'" prop="type">
                            {{ env.columnFormatter(formData.type, 'bill_refund', 'type') }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('pay.orderId') + ':'" prop="sourceId">
                            {{ formData.sourceId }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button
                        :size="miniSize"
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
import _ from 'lodash';
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
                    label: 'action.refund', // 按钮上显示的文字
                    icon: 'el-icon-ali-tuikuan', // 按钮文字前面的图标
                    perms: 'pay:bill_refund:edit', // 权限标识
                    size: this.size, // 按钮大小
                    // type: 'primary',                // 按钮类型
                    func: (row) => {
                        this.checkDialogVisible = true;
                        this.formData = Object.assign(this.formData, row);
                    },
                },
                {
                    label: 'action.detail', // 按钮上显示的文字
                    icon: 'el-icon-ali-mingxi', // 按钮文字前面的图标
                    perms: 'pay:bill_refund:view', // 权限标识
                    size: this.size, // 按钮大小
                    // type: 'primary',                // 按钮类型
                    func: (row) => {
                        this.viewDialogVisible = true;
                        this.formData = Object.assign(this.formData, row);
                    },
                },
            ],

            checkDialogVisible: false, // 退款单审核界面是否显示
            viewDialogVisible: false,
            loading: false,

            // 退款单审核界面数据
            paymentOpts: [],
            formData: {
                id: 0,
                refundId: '', // 退款单号
                user: {
                    id: 0,
                    username: '',
                }, // 用户
                state: 1, // 状态
                type: 1, // 单据类型
                sourceId: '', // 单号
                money: 0, // 退款金额
                paymentCode: 0, // 退款方式
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
            return [{ prop: 'name', label: this.$t('pay.paymentMethodName') }];
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'refundId', label: this.$t('pay.refundId'), minWidth: 130 },
                { prop: 'money', label: this.$t('pay.amount'), minWidth: 90 },
                { prop: 'paymentCode', label: this.$t('pay.refundMethod'), minWidth: 98 },
                {
                    prop: 'state',
                    label: this.$t('common.status'),
                    minWidth: 80,
                    align: 'center',
                    formatter: this.env.columnFormatter,
                },
                {
                    prop: 'type',
                    label: this.$t('common.type'),
                    minWidth: 80,
                    align: 'center',
                    formatter: this.env.columnFormatter,
                },
                { prop: 'sourceId', label: this.$t('pay.billId'), minWidth: 130 },
                { prop: 'user.username', label: this.$t('common.user'), minWidth: 90 },
                { prop: 'createdAt', label: this.$t('common.createTime'), minWidth: 140 },
            ];
        },
    },
    async mounted() {
        await this.getPaymentOpts();
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
            const _result = await this.$api.billRefund.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        async getPaymentOpts() {
            const _result = await this.$api.pay.list({});
            if (_result.succeed === 1 && _result.code === 200) {
                this.paymentOpts = _result.data.list;
            }
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(
                        this.$t('permission.confirmSubmit'),
                        this.$t('common.tip'),
                        {}
                    ).then(async () => {
                        this.loading = true;
                        const data = _.pick(this.formData, ['id', 'state', 'paymentCode']);
                        const _result = await this.$api.billRefund.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _billRefund = this.paginated.list.find(
                                (v) => v.id === _result.data.id
                            );
                            if (_billRefund) {
                                Object.assign(_billRefund, _result.data);
                            } else {
                                this.paginated.list.unshift(_result.data);
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

                        this.loading = false;
                        this.$refs.formData.resetFields();
                        this.checkDialogVisible = false;
                    });
                }
            });
        },
    },
};
</script>

<style scoped lang="scss"></style>
