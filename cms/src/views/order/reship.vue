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
                                    perms="order:reship:view"
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

        <!--退货单查看界面-->
        <el-dialog
            :close-on-click-modal="false"
            :model-value="viewDialogVisible"
            :title="$t('reship.viewTitle')"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :size="smallSize"
                label-width="80px"
                class="dialog-container"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('reship.reshipId') + ':'" prop="reshipId">
                            {{ formData.reshipId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('reship.orderId') + ':'" prop="orderId">
                            {{ formData.orderId }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('reship.username') + ':'" prop="user.username">
                            {{ formData.user.username }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('reship.status') + ':'" prop="refund">
                            {{ formData.refund }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('reship.expressCompany') + ':'" prop="logistics">
                            {{ formData.logistics ? formData.logistics.logiName : '' }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            :label="$t('reship.expressTrackingNumber') + ':'"
                            prop="logiNo"
                        >
                            {{ formData.logiNo }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table
                            :data="formData.billReshipItems"
                            :size="smallSize"
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column
                                :label="$t('reship.goodsName')"
                                min-width="360"
                                prop="name"
                                show-overflow-tooltip
                            />
                            <el-table-column
                                :label="$t('reship.shippingQuantity')"
                                min-width="100"
                                prop="num"
                            />
                        </el-table>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button
                        :size="smallSize"
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
        const self = this;
        return {
            normalSize: 'default',
            smallSize: 'small',
            filters: {
                key: 'reshipId',
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
                    perms: 'order:reship:view', // 权限标识
                    size: this.size, // 按钮大小
                    func: (row) => {
                        self.viewDialogVisible = true;
                        self.formData = Object.assign(self.formData, row);
                    },
                },
            ],
            viewDialogVisible: false, // 编辑界面是否显示
            // 浏览界面数据
            formData: {
                id: 0,
                reshipId: '', // 退货单号
                orderId: '', // 订单号
                userId: 0,
                user: {
                    id: '',
                    username: '', // 用户名
                }, // 用户
                status: 1, // 退款状态
                logiCode: '',
                logistics: {
                    logiCode: '',
                    logiName: '', // 快递公司
                }, // 快递
                logiNo: '', // 快递单号
                billReshipItems: [], // 退货商品
            },
        };
    },
    computed: {
        // 响应式的 props 配置
        props() {
            return [{ prop: 'reshipId', label: this.$t('reship.reshipId') }];
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'reshipId', label: this.$t('reship.reshipId'), minWidth: 120 },
                { prop: 'orderId', label: this.$t('reship.orderId'), minWidth: 120 },
                { prop: 'user.username', label: this.$t('reship.user'), minWidth: 120 },
                { prop: 'status', label: this.$t('reship.status'), minWidth: 100 },
                {
                    prop: 'logistics.logiName',
                    label: this.$t('reship.expressCompany'),
                    minWidth: 100,
                },
                { prop: 'logiNo', label: this.$t('reship.expressTrackingNumber'), minWidth: 120 },
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
            const _result = await this.$api.reship.list(this.paginated.attrs);
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
