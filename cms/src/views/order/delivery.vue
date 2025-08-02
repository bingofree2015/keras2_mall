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
                                    perms="order:delivery:view"
                                    type="primary"
                                    @click="handleRefresh"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
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

        <!--发货单查看界面-->
        <el-dialog
            :close-on-click-modal="false"
            :model-value="viewDialogVisible"
            :title="$t('order.deliveryView')"
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
                        <el-form-item :label="$t('order.deliveryId') + ':'" prop="deliveryId">
                            {{ formData.deliveryId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.orderId') + ':'" prop="orderId">
                            {{ formData.orderId }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.userName') + ':'" prop="user">
                            {{ formData.user.name }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.shipName') + ':'" prop="shipName">
                            {{ formData.shipName }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.logistics') + ':'" prop="logistics">
                            {{ formData.logistics.logiName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.logiNo') + ':'" prop="logiNo">
                            {{ formData.logiNo }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.shipMobile') + ':'" prop="shipMobile">
                            {{ formData.shipMobile }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('common.createdAt') + ':'" prop="createdAt">
                            {{ formData.createdAt }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('order.shipAddress') + ':'" prop="shipAddress">
                            {{ formData.shipAddress }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('order.memo') + ':'" prop="memo">
                            {{ formData.memo }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table
                            :data="formData.billDeliveryItems"
                            :size="normalSize"
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column
                                :label="$t('order.goodsName')"
                                min-width="360"
                                prop="orderItem.name"
                                show-overflow-tooltip
                            />
                            <el-table-column
                                :label="$t('order.deliveryNum')"
                                min-width="100"
                                prop="num"
                            />
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
                key: 'deliveryId',
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
                    perms: 'order:delivery:view', // 权限标识
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
                deliveryId: '', // 发货单号
                orderId: '', // 订单号
                userId: 0,
                user: {
                    id: '',
                    name: '', // 用户名
                }, // 用户
                shipName: '', // 收货人
                logiCode: '',
                logistics: {
                    logiCode: '',
                    logiName: '', // 快递公司
                }, // 快递
                logiNo: '', // 快递单号
                shipMobile: '', // 收货电话
                createdAt: '', // 创建时间
                shipAddress: '', // 收货地址
                memo: '', // 发货备注
                billDeliveryItems: [],
            },
        };
    },
    computed: {
        // 响应式的搜索字段配置
        searchFields() {
            return [{ prop: 'deliveryId', label: this.$t('order.deliveryId') }];
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'deliveryId', label: this.$t('order.deliveryId'), minWidth: 120 },
                { prop: 'orderId', label: this.$t('order.orderId'), minWidth: 120 },
                { prop: 'user.name', label: this.$t('order.userName'), minWidth: 100 },
                { prop: 'logistics.logiName', label: this.$t('order.logistics'), minWidth: 100 },
                { prop: 'logiNo', label: this.$t('order.logiNo'), minWidth: 120 },
                { prop: 'shipAddress', label: this.$t('order.shipAddress'), minWidth: 200 },
                { prop: 'shipMobile', label: this.$t('order.shipMobile'), minWidth: 140 },
                { prop: 'createdAt', label: this.$t('common.createdAt'), minWidth: 140 },
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
            const _result = await this.$api.delivery.list(this.paginated.attrs);
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
