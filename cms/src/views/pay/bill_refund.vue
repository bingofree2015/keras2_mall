<template>
    <div class="page-container">
        <!--导航与工具栏-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :model="filters" :size="largeSize">
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
                                    perms="pay:bill_refund:view"
                                    type="primary"
                                    @click="queryForPaginatedList()"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip content="刷新" placement="top">
                                <el-button round @click="queryForPaginatedList()">
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
            title="退款单审核"
            width="40%"
        >
            <el-form ref="formData" :model="formData" :size="miniSize" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="退款单号:" prop="refundId">
                            {{ formData.refundId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单单号:" prop="sourceId">
                            {{ formData.sourceId }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户:" prop="user.username">
                            {{ formData.user.username }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态:" prop="state">
                            {{ formData.state }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="单据类型:" prop="type">
                            {{ formData.type }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退款金额:" prop="money">
                            {{ formData.money }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="退款方式:" prop="paymentCode">
                            <el-select v-model="formData.paymentCode" placeholder="请选择">
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
                        <el-form-item label="审核结果:" prop="state">
                            <el-radio-group v-model="formData.state">
                                <el-radio :label="2">通过</el-radio>
                                <el-radio :label="4">拒绝</el-radio>
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
            title="退款单查看"
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
                        <el-form-item label="退款单号:" prop="refundId">
                            {{ formData.refundId }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户:" prop="user.username">
                            {{ formData.user.username }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态:" prop="state">
                            {{ env.columnFormatter(formData.state, 'bill_refund', 'state') }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="退款金额:" prop="money">
                            {{ formData.money }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退款方式:" prop="paymentCode">
                            {{ formData.paymentCode }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="单据类型:" prop="type">
                            {{ env.columnFormatter(formData.type, 'bill_refund', 'type') }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单单号:" prop="sourceId">
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
    data() {
        return {
            largeSize: 'large',
            miniSize: 'default',
            filters: {
                key: 'name',
                value: '',
            },
            props: [{ prop: 'name', label: '支付方式名称' }],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'refundId', label: '退款单号', minWidth: 130 },
                { prop: 'money', label: '金额', minWidth: 90 },
                { prop: 'paymentCode', label: '退款方式', minWidth: 98 },
                {
                    prop: 'state',
                    label: '状态',
                    minWidth: 80,
                    align: 'center',
                    formatter: this.env.columnFormatter,
                },
                {
                    prop: 'type',
                    label: '类型',
                    minWidth: 80,
                    align: 'center',
                    formatter: this.env.columnFormatter,
                },
                { prop: 'sourceId', label: '单号', minWidth: 130 },
                { prop: 'user.username', label: '用户', minWidth: 90 },
                { prop: 'createdAt', label: '创建时间', minWidth: 140 },
            ],
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
                    _operationWidth += this.operations.length * 100;
                }
                return _operationWidth;
            },
        },
    },
    async mounted() {
        await this.getPaymentOpts();
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
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
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
                                title: '成功',
                                message: _result.description,
                                type: 'success',
                            });
                        } else {
                            this.$notify.error({
                                title: '错误',
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
