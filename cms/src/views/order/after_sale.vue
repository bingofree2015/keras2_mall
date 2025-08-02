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
                                    perms="order:after_sale:view"
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
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--售后单查看界面-->
        <el-dialog
            :close-on-click-modal="false"
            :model-value="viewDialogVisible"
            :title="$t('afterSale.viewTitle')"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :size="normalSize"
                label-width="80px"
                class="dialog-container"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('afterSale.afterSaleId') + ':'" prop="afterSaleId">
                            {{ formData.afterSaleId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('afterSale.orderId') + ':'" prop="orderId">
                            {{ formData.orderId }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('afterSale.username') + ':'" prop="user">
                            {{ formData.user.username }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('afterSale.refundAmount') + ':'" prop="refund">
                            {{ formData.refund }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('afterSale.afterSaleType') + ':'" prop="type">
                            {{ formData.type }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('afterSale.refundStatus') + ':'" prop="status">
                            {{ formData.status }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('afterSale.reason') + ':'" prop="reason">
                            {{ formData.reason }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('afterSale.remark') + ':'" prop="mark">
                            {{ formData.mark }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table
                            :data="formData.billAfterSaleItems"
                            :size="normalSize"
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column
                                label="货品名称"
                                min-width="360"
                                prop="name"
                                show-overflow-tooltip
                            />
                            <el-table-column label="发货数量" min-width="100" prop="num" />
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
                key: 'afterSaleId',
                value: '',
            },
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.view', // 按钮上显示的文字
                    icon: 'el-icon-ali-bianji', // 按钮文字前面的图标
                    perms: 'order:after_sale:view', // 权限标识
                    size: this.normalSize, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.viewDialogVisible = true;
                        this.formData = Object.assign(this.formData, row);
                    },
                },
            ],
            viewDialogVisible: false, // 编辑界面是否显示
            // 浏览界面数据
            formData: {
                id: 0,
                afterSaleId: '', // 售后单号
                orderId: '', // 订单号
                userId: 0,
                user: {
                    id: 0,
                    username: '', // 用户名
                }, // 用户
                refund: 0, // 退款金额
                type: 1, // 售后类型
                status: 1, // 退款状态
                reason: '', // 原因
                attachments: [], // 图片
                shopItems: [], // 退货商品
                mark: '', // 备注
                billAfterSaleItems: [],
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
        searchFields() {
            return [
                { prop: 'afterSaleId', label: this.$t('afterSale.afterSaleId') },
                { prop: 'orderId', label: this.$t('afterSale.orderId') },
                { prop: 'user.username', label: this.$t('afterSale.username') },
                { prop: 'refund', label: this.$t('afterSale.refundAmount') },
                { prop: 'type', label: this.$t('afterSale.afterSaleType') },
                { prop: 'status', label: this.$t('afterSale.refundStatus') },
                { prop: 'createdAt', label: this.$t('afterSale.applicationTime') },
            ];
        },
        columns() {
            return [
                {
                    prop: 'afterSaleId',
                    label: this.$t('afterSale.afterSaleId'),
                    minWidth: 120,
                },
                {
                    prop: 'orderId',
                    label: this.$t('afterSale.orderId'),
                    minWidth: 120,
                },
                {
                    prop: 'user.username',
                    label: this.$t('afterSale.username'),
                    minWidth: 100,
                },
                {
                    prop: 'refund',
                    label: this.$t('afterSale.refundAmount'),
                    minWidth: 100,
                },
                {
                    prop: 'type',
                    label: this.$t('afterSale.afterSaleType'),
                    minWidth: 100,
                },
                {
                    prop: 'status',
                    label: this.$t('afterSale.refundStatus'),
                    minWidth: 100,
                },
                {
                    prop: 'createdAt',
                    label: this.$t('afterSale.applicationTime'),
                    minWidth: 130,
                    formatter: this.env.formatDateTime,
                },
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
            const _result = await this.$api.afterSale.list(this.paginated.attrs);
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
