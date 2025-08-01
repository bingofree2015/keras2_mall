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
                            :placeholder="$t('permission.pleaseEnterContent')"
                        >
                            <template #prepend>
                                <el-select
                                    v-model="filters.key"
                                    class="search-prepend"
                                    :placeholder="$t('permission.pleaseSelect')"
                                >
                                    <el-option
                                        v-for="item in searchProps"
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
                                    perms="order:view"
                                    type="primary"
                                    @click="handleRefresh"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <ext-button
                            :label="$t('action.batchPay')"
                            icon="el-icon-ali-piliangzhifu"
                            perms="order:pay"
                            type="primary"
                            @click="handleBatchPay"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip :content="$t('permission.refresh')" placement="top">
                                <el-button round @click="handleRefresh">
                                    <i class="el-icon-ali-shuaxin"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="$t('permission.export')" placement="top">
                                <el-button round @click="handleExport">
                                    <i class="el-icon-ali-daochu"></i>
                                </el-button>
                            </el-tooltip>
                        </el-button-group>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <!--分页列表-->
        <el-tabs
            v-model="activeName"
            class="tab-container"
            type="border-card"
            @tab-click="handleClick"
        >
            <el-tab-pane v-for="tab in orderTabs" :key="tab.name" :name="tab.name">
                <template #label>
                    <span>
                        <el-badge :value="paginated[tab.name].attrs.count" class="item">
                            <i :class="tab.icon"></i>
                            {{ $t(tab.label) }}
                        </el-badge>
                    </span>
                </template>
                <!--表格内容栏-->
                <order-table
                    :batch-delete="batchDelete"
                    :count="paginated[tab.name].attrs.count"
                    :operation-width="operationWidth"
                    :order-data="paginated[tab.name].list"
                    :page-size="paginated[tab.name].attrs.limit"
                    :perms-batch-delete="permsBatchDelete"
                    :type="tab.name"
                    @handle-action="handleAction"
                    @handle-print="handlePrint"
                    @query-for-paginated-list="queryForPaginatedList"
                />
            </el-tab-pane>
        </el-tabs>

        <order-delivery-dialog :order-id="orderId" :model-value="deliveryDialogVisible" />
        <order-detail-dialog :order-id="orderId" :model-value="viewDialogVisible" />
        <order-edit-dialog :order-id="orderId" :model-value="editDialogVisible" />
    </div>
</template>

<script>
import breadCrumb from '@/components/bread_crumb.vue';
import orderTable from '@/components/order_table.vue';

import orderDeliveryDialog from '@/components/order_delivery_dialog.vue';
import orderDetailDialog from '@/components/order_detail_dialog.vue';
import orderEditDialog from '@/components/order_edit_dialog.vue';
import extButton from '@/components/core/ext_button.vue';

export default {
    components: {
        breadCrumb,
        orderTable,
        orderDeliveryDialog,
        orderDetailDialog,
        orderEditDialog,
        extButton,
    },
    inject: ['reload'],
    data() {
        return {
            filters: {
                key: 'orderId',
                value: '',
            },
            activeName: 'all',

            paginated: {
                all: {
                    // 全部订单
                    attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                    list: [],
                },
                payment: {
                    // 待支付
                    attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                    list: [],
                },
                delivered: {
                    // 待发货
                    attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                    list: [],
                },
                receive: {
                    // 待收货
                    attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                    list: [],
                },
                evaluated: {
                    // 待评价
                    attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                    list: [],
                },
                cancel: {
                    // 已取消
                    attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                    list: [],
                },
                complete: {
                    // 已完成
                    attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                    list: [],
                },
            },

            operationWidth: 0,
            permsBatchDelete: 'order:delete',

            orderId: '',

            viewDialogVisible: false, // 订单查看
            editDialogVisible: false, // 订单编辑
            deliveryDialogVisible: false, // 订单发货
        };
    },
    computed: {
        // 搜索属性配置
        searchProps() {
            return [{ prop: 'orderId', label: this.$t('order.orderId') }];
        },
        // 订单标签页配置
        orderTabs() {
            return [
                { name: 'all', label: 'order.allOrders', icon: 'el-icon-ali-quanbushangpin' },
                { name: 'payment', label: 'order.pendingPayment', icon: 'el-icon-ali-daizhifu' },
                { name: 'delivered', label: 'order.pendingDelivery', icon: 'el-icon-ali-daifahuo' },
                { name: 'receive', label: 'order.pendingReceive', icon: 'el-icon-ali-daishouhuo' },
                {
                    name: 'evaluated',
                    label: 'order.pendingEvaluation',
                    icon: 'el-icon-ali-daipingjia',
                },
                { name: 'cancel', label: 'order.cancelled', icon: 'el-icon-ali-yiquxiao' },
                { name: 'complete', label: 'order.completed', icon: 'el-icon-ali-yiwancheng' },
            ];
        },
    },
    mounted() {
        // 初始化加载数据
        this.queryForPaginatedList();
    },
    methods: {
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },

        /**
         * 处理标签页点击事件
         * @param {Object} tab - 被点击的标签页对象
         */
        handleClick(tab) {
            if (tab.name !== this.activeName) {
                this.activeName = tab.name;
                this.queryForPaginatedList();
            }
        },

        /**
         * 处理导出功能
         */
        handleExport() {
            this.$message({ message: this.$t('permission.export'), type: 'info' });
        },

        // 获取分页数据
        async queryForPaginatedList(data) {
            try {
                let _type = this.activeName;
                if (data && data.attrs) {
                    _type = data.attrs.type;
                    this.paginated[_type].attrs = data.attrs;
                }

                this.paginated[_type].attrs.searchKey = {};

                // 根据订单类型设置搜索条件
                this.setSearchConditions(_type);

                if (this.filters.key && this.filters.value) {
                    this.paginated[_type].attrs.searchKey[this.filters.key] = this.filters.value;
                }
                console.log(`${_type} -> ${JSON.stringify(this.paginated[_type].attrs.searchKey)}`);

                const _result = await this.$api.order.list(this.paginated[_type].attrs);
                if (_result.succeed === 1 && _result.code === 200) {
                    this.paginated[_type].list = _result.data.list;
                    this.updateOperationWidth(_type);
                    this.paginated[_type].attrs.count = _result.data.count;
                } else {
                    this.$message.error(_result.description || this.$t('common.requestFailed'));
                }
            } catch (error) {
                console.error('查询订单列表失败:', error);
                this.$message.error(this.$t('common.requestFailed'));
            }

            if (data && data.cb) data.cb();
        },

        /**
         * 设置搜索条件
         * @param {string} type - 订单类型
         */
        setSearchConditions(type) {
            const searchKey = this.paginated[type].attrs.searchKey;

            switch (type) {
                case 'payment':
                    // 待付款
                    searchKey.state = 1; // 订单状态正常
                    searchKey.payState = 1; // 未付款
                    break;
                case 'delivered':
                    // 待发货
                    searchKey.state = 1; // 订单状态正常
                    searchKey.payState = 2; // 已付款
                    searchKey.shipState = 1; // 未发货
                    break;
                case 'receive':
                    // 待收货
                    searchKey.state = 1; // 订单状态正常
                    searchKey.shipState = 3; // 已发货
                    searchKey.confirm = 1; // 未确认收货
                    break;
                case 'evaluated':
                    // 待评价
                    searchKey.state = 1; // 订单状态正常
                    searchKey.payState = 2; // 已付款
                    searchKey.shipState = 3; // 已发货
                    searchKey.confirm = 2; // 确认收货
                    searchKey.isComment = 1; // 没有评价
                    break;
                case 'cancel':
                    // 已取消
                    searchKey.state = 3; // 订单状态取消
                    break;
                case 'complete':
                    // 已完成
                    searchKey.state = 2; // 订单状态完成
                    break;
                default:
                    // all - 全部订单，不需要特殊条件
                    break;
            }
        },

        /**
         * 更新操作列宽度
         * @param {string} type - 订单类型
         */
        updateOperationWidth(type) {
            for (const item of this.paginated[type].list) {
                const _actions = Array.isArray(item.operatings) ? item.operatings.length : 0;
                if (_actions * 90 > this.operationWidth) {
                    this.operationWidth = _actions * 90;
                }
            }
        },

        // 批量删除
        async batchDelete(ids) {
            try {
                const _result = await this.$api.order.destroy({ ids });
                if (_result.succeed === 1 && _result.code === 200) {
                    for (const id of ids) {
                        const _index = this.paginated[this.activeName].list.findIndex(
                            (v) => v.id === id
                        );
                        if (_index > -1) {
                            this.paginated[this.activeName].list.splice(_index, 1);
                        }
                    }
                    this.$message.success(this.$t('common.deleteSuccess'));
                } else {
                    this.$message.error(_result.description || this.$t('common.deleteFailed'));
                }
            } catch (error) {
                console.error('批量删除失败:', error);
                this.$message.error(this.$t('common.deleteFailed'));
            }
        },

        // 批量支付
        handleBatchPay() {
            this.$message({ message: this.$t('order.batchPayment'), type: 'info' });
        },

        handleAction(params) {
            const { row, action } = params;
            this.orderId = row.orderId;

            switch (action) {
                case 'action.view':
                    this.viewDialogVisible = true;
                    break;
                case 'action.edit':
                    this.editDialogVisible = true;
                    break;
                case 'action.delivery':
                    this.deliveryDialogVisible = true;
                    break;
                case 'action.finished':
                    this.handleCompleteOrder();
                    break;
                case 'action.cancel':
                    this.handleCancelOrder();
                    break;
                case 'action.delete':
                    this.handleDeleteOrder();
                    break;
                default:
                    this.$message({ message: action, type: 'info' });
            }
        },

        /**
         * 处理完成订单
         */
        async handleCompleteOrder() {
            try {
                await this.$confirm(
                    this.$t('order.confirmComplete', { orderId: this.orderId }),
                    this.$t('common.tip'),
                    {}
                );

                const _result = await this.$api.order.complete({
                    orderId: this.orderId,
                });

                if (_result.succeed === 1 && _result.code === 200) {
                    this.queryForPaginatedList();
                    this.$message.success(this.$t('common.operationSuccess'));
                } else {
                    this.$message.error(_result.description || this.$t('common.operationFailed'));
                }
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('完成订单失败:', error);
                    this.$message.error(this.$t('common.operationFailed'));
                }
            }
        },

        /**
         * 处理取消订单
         */
        async handleCancelOrder() {
            try {
                await this.$confirm(
                    this.$t('order.confirmCancel', { orderId: this.orderId }),
                    this.$t('common.tip'),
                    {}
                );

                const _result = await this.$api.order.cancel({
                    orderIds: [this.orderId],
                });

                if (_result.succeed === 1 && _result.code === 200) {
                    this.queryForPaginatedList();
                    this.$message.success(this.$t('common.operationSuccess'));
                } else {
                    this.$message.error(_result.description || this.$t('common.operationFailed'));
                }
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('取消订单失败:', error);
                    this.$message.error(this.$t('common.operationFailed'));
                }
            }
        },

        /**
         * 处理删除订单
         */
        async handleDeleteOrder() {
            try {
                await this.$confirm(
                    this.$t('order.confirmDelete', { orderId: this.orderId }),
                    this.$t('common.tip'),
                    {}
                );

                const _result = await this.$api.order.destroy({ ids: [this.orderId] });

                if (_result.succeed === 1 && _result.code === 200) {
                    this.queryForPaginatedList();
                    this.$message.success(this.$t('common.deleteSuccess'));
                } else {
                    this.$message.error(_result.description || this.$t('common.deleteFailed'));
                }
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('删除订单失败:', error);
                    this.$message.error(this.$t('common.deleteFailed'));
                }
            }
        },

        handlePrint(params) {
            const { row, type } = params;
            if (['shopping', 'distribution', 'union'].includes(type)) {
                this.$router.push({
                    path: '/order/print',
                    query: { orderId: row.orderId, type: type },
                });
            }
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
