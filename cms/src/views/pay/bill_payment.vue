<template>
    <div class="page-container">
        <!--导航与工具栏-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :model="filters" :size="normalSize">
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
                                    perms="pay:bill_payment:view"
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
            title="编辑"
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
                    <el-col :span="12">
                        <el-form-item label="支付单号:" prop="paymentId">
                            {{ formData.paymentId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户:" prop="user.username">
                            {{ formData.user.username }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="支付方式:" prop="paymentCode">
                            {{ formData.paymentCode }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="支付金额:" prop="money">
                            {{ formData.money }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型:" prop="type">
                            {{ env.columnFormatter(formData.type, 'bill_payment', 'type') }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态:" prop="state">
                            {{ env.columnFormatter(formData.state, 'bill_payment', 'state') }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="创建时间:" prop="isOnline">
                            {{ formData.createdAt }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="更新时间:" prop="isOnline">
                            {{ formData.updatedAt }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table
                            :data="formData.billPaymentItems"
                            :size="miniSize"
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column
                                label="单号"
                                min-width="360"
                                prop="sourceId"
                                show-overflow-tooltip
                            />
                            <el-table-column label="金额" min-width="100" prop="money" />
                        </el-table>
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
            normalSize: 'large',
            miniSize: 'default',
            filters: {
                key: 'paymentId',
                value: '',
            },
            props: [{ prop: 'paymentId', label: '支付单号' }],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'paymentId', label: '支付单号', minWidth: 120 },
                {
                    prop: 'state',
                    label: '状态',
                    minWidth: 80,
                    formatter: this.env.columnFormatter,
                },
                { prop: 'paymentCode', label: '支付方式', minWidth: 98 },
                {
                    prop: 'type',
                    label: '单据类型',
                    minWidth: 98,
                    formatter: this.env.columnFormatter,
                },
                { prop: 'user.username', label: '用户', minWidth: 80 },
                { prop: 'money', label: '金额', minWidth: 80 },
                { prop: 'trade_no', label: '第三方支付单号', minWidth: 140 },
                { prop: 'updatedAt', label: '支付时间', minWidth: 140 },
            ],
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.view', // 按钮上显示的文字
                    icon: 'el-icon-ali-chakan1', // 按钮文字前面的图标
                    perms: 'pay:bill_payment:view', // 权限标识
                    size: this.size, // 按钮大小
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
                    _operationWidth += this.operations.length * 100;
                }
                return _operationWidth;
            },
        },
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
