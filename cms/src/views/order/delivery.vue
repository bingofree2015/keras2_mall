<template>
    <div class="page-container">
        <!--导航与工具栏-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :model="filters">
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
                                    perms="order:delivery:view"
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
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--发货单查看界面-->
        <el-dialog
            :close-on-click-modal="false"
            :model-value="viewDialogVisible"
            title="发货单查看"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :size="miniSize"
                label-width="80px"
                class="dialog-container"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="发货单号:" prop="deliveryId">
                            {{ formData.deliveryId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单号:" prop="orderId">
                            {{ formData.orderId }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户名:" prop="user">
                            {{ formData.user.name }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收货人:" prop="shipName">
                            {{ formData.shipName }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="快递公司:" prop="logistics">
                            {{ formData.logistics.logiName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="快递单号:" prop="logiNo">
                            {{ formData.logiNo }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收货电话:" prop="shipMobile">
                            {{ formData.shipMobile }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="创建时间:" prop="createdAt">
                            {{ formData.createdAt }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="收货地址:" prop="shipAddress">
                            {{ formData.shipAddress }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="发货备注:" prop="memo">
                            prop="memo" >
                            {{ formData.memo }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table
                            :data="formData.billDeliveryItems"
                            :size="miniSize"
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column
                                label="货品名称"
                                min-width="360"
                                prop="orderItem.name"
                                show-overflow-tooltip
                            />
                            <el-table-column label="发货数量" min-width="100" prop="num" />
                            />
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
            normalSize: 'default',
            filters: {
                key: 'deliveryId',
                value: '',
            },
            props: [{ prop: 'deliveryId', label: '发货单号' }],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'deliveryId', label: '发货单号', minWidth: 120 },
                { prop: 'orderId', label: '订单号', minWidth: 120 },
                { prop: 'user.name', label: '用户名', minWidth: 100 },
                { prop: 'logistics.logiName', label: '快递公司', minWidth: 100 },
                { prop: 'logiNo', label: '快递单号', minWidth: 120 },
                {
                    prop: 'shipAddress',
                    label: '收货地址',
                    minWidth: 200,
                    showOverflowTooltip: true,
                },
                { prop: 'shipMobile', label: '电话', minWidth: 140 },
                {
                    prop: 'createdAt',
                    label: '创建时间',
                    minWidth: 140,
                    formatter: this.env.formatDateTime,
                },
            ],
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.view', // 按钮上显示的文字
                    icon: 'el-icon-ali-bianji', // 按钮文字前面的图标
                    perms: 'order:delivery:view', // 权限标识
                    size: this.size, // 按钮大小
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
