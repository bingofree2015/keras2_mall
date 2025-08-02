<template>
    <el-container>
        <!--表格栏-->
        <el-main>
            <el-table
                v-loading="loading"
                :align="align"
                :border="border"
                :data="orderData"
                :element-loading-text="$t('action.loading')"
                :highlight-current-row="highlightCurrentRow"
                :max-height="maxHeight"
                :size="normalSize"
                :stripe="stripe"
                style="width: 100%"
                @current-change="handleCurrentRowChange"
                @selection-change="selectionChange"
            >
                <el-table-column min-width="60" type="selection" />
                <el-table-column :label="$t('orderTable.orderId')" min-width="130" prop="orderId" />
                <el-table-column
                    align="center"
                    :label="$t('orderTable.print')"
                    min-width="180"
                    prop="orderId"
                >
                    <template #default="scope">
                        <el-link icon="el-icon-ali-mai" @click="handlePrint(scope.row, 'shopping')">
                            {{ $t('orderTable.buy') }}
                        </el-link>
                        <el-link
                            icon="el-icon-ali-icon209"
                            @click="handlePrint(scope.row, 'distribution')"
                        >
                            {{ $t('orderTable.delivery') }}
                        </el-link>
                        <el-link icon="el-icon-ali-lian" @click="handlePrint(scope.row, 'union')">
                            {{ $t('orderTable.contact') }}
                        </el-link>
                        <el-link icon="el-icon-ali-send" @click="handlePrint(scope.row, 'express')">
                            {{ $t('orderTable.express') }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    :formatter="
                        (row, column) => {
                            return env.formatDateTime(row[column.property]);
                        }
                    "
                    :label="$t('orderTable.orderTime')"
                    min-width="150"
                    prop="createdAt"
                />
                <el-table-column
                    :label="$t('orderTable.orderStatus')"
                    min-width="90"
                    prop="progress"
                />
                <el-table-column
                    :label="$t('orderTable.afterSaleStatus')"
                    min-width="180"
                    prop="afterSaleState"
                    show-overflow-tooltip
                />
                <el-table-column
                    :label="$t('orderTable.username')"
                    min-width="90"
                    prop="user.username"
                />
                <el-table-column
                    :label="$t('orderTable.receiverPhone')"
                    min-width="120"
                    prop="shipMobile"
                />
                />
                <el-table-column
                    :label="$t('orderTable.receiverAddress')"
                    min-width="240"
                    prop="shipAddress"
                    show-overflow-tooltip
                />
                <el-table-column
                    :label="$t('orderTable.paymentStatus')"
                    min-width="90"
                    prop="payState"
                />
                <el-table-column
                    :label="$t('orderTable.deliveryStatus')"
                    min-width="90"
                    prop="shipState"
                />
                <el-table-column
                    :label="$t('orderTable.orderAmount')"
                    min-width="90"
                    prop="orderAmount"
                />
                <el-table-column label="订单来源" min-width="90" prop="source" />

                <el-table-column
                    :label="$t('action.operation')"
                    :min-width="operationWidth"
                    fixed="right"
                >
                    <template #default="scope">
                        <template v-for="(item, idx) in scope.row['operatings']" :key="idx">
                            <ext-button
                                :icon="item.icon"
                                :label="$t(item.action)"
                                :perms="item.perms"
                                @click="handleAction(scope.row, item.action)"
                            />
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <!--分页栏-->
        <el-footer style="height: 42px">
            <ext-button
                v-if="batchDelete"
                :disabled="selections.length === 0"
                :label="$t('action.batchDelete')"
                :perms="permsBatchDelete"
                :size="normalSize"
                style="float: left"
                type="danger"
                @click="handleBatchDelete()"
            />
            <el-pagination
                :current-page="attrs.currPage"
                :page-size="pageSize"
                :total="count"
                layout="total, prev, pager, next, jumper"
                style="float: right"
                @current-change="handleCurrentChange"
            />
        </el-footer>
    </el-container>
</template>

<script>
import extButton from '@/components/core/ext_button.vue';
export default {
    name: 'OrderTable',
    components: {
        extButton,
    },
    props: {
        orderData: {
            type: Array,
            default: () => [],
        }, // 表格分页数据
        operationWidth: {
            type: Number,
            default: 0,
        }, // 列宽
        normalSize: {
            type: String,
            default: 'small',
        },
        align: {
            // 文本对齐方式
            type: String,
            default: 'left',
        },
        maxHeight: {
            // 表格最大高度
            type: Number,
            default: 480,
        },
        border: {
            // 是否显示边框
            type: Boolean,
            default: false,
        },
        stripe: {
            // 是否显示斑马线
            type: Boolean,
            default: true,
        },
        highlightCurrentRow: {
            // 是否高亮当前行
            type: Boolean,
            default: true,
        },
        showOverflowTooltip: {
            // 是否单行显示
            type: Boolean,
            default: true,
        },
        batchDelete: {
            // 批删除操作
            type: Function,
            default: null,
            required: false,
        },
        permsBatchDelete: {
            type: String,
            default: '',
        },
        type: {
            // 订单类型
            type: String,
            default: 'all',
        },
        pageSize: {
            // 每页记录数
            type: Number,
            default: 9,
        },
        count: {
            // 总记录数
            type: Number,
            default: 0,
        },
    },
    emits: ['queryForPaginatedList', 'handlePrint', 'handleAction', 'handleCurrentRowChange'],
    data() {
        return {
            actions: 0,
            // 分页信息
            attrs: {
                type: this.type,
                searchKey: {},
                currPage: 1,
                offset: 0,
                limit: this.pageSize,
            },
            loading: false, // 加载标识
            selections: [], // 列表选中列
        };
    },
    computed: {},
    mounted() {
        this.handleCurrentChange(1);
    },
    methods: {
        // 分页查询
        queryForPaginatedList() {
            this.loading = true;
            const cb = () => {
                this.loading = false;
            };
            this.$emit('queryForPaginatedList', { attrs: this.attrs, cb });
        },
        // 当选择项发生变化时会触发该事件
        selectionChange(selections) {
            this.selections = selections;
        },
        // 调用打印方法
        handlePrint(row, type) {
            this.$emit('handlePrint', { row, type });
        },
        // 执行方法
        handleAction(row, action) {
            this.$emit('handleAction', { row, action });
        },
        // 当表格的当前行发生变化的时候会触发该事件
        handleCurrentRowChange(row) {
            this.$emit('handleCurrentRowChange', row);
        },
        // 换页刷新
        handleCurrentChange(currPage) {
            this.attrs.currPage = currPage;
            this.attrs.offset = (currPage - 1) * this.pageSize;
            this.queryForPaginatedList();
        },
        // 批量删除
        handleBatchDelete() {
            this.$confirm(this.$t('permission.confirmDeleteSelected'), this.$t('common.tip'), {
                type: 'warning',
            }).then(() => {
                const _ids = [];
                this.selections.map((item) => {
                    _ids.push(item.id);
                });
                if (this.batchDelete) {
                    this.batchDelete(_ids);
                }
            });
        },
    },
};
</script>

<style scoped lang="scss"></style>
