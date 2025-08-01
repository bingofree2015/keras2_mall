<template>
    <el-dialog
        :close-on-click-modal="false"
        :modal="false"
        :title="$t('orderDetail.dialogTitle')"
        v-bind="$attrs"
        width="60%"
        @open="openDialog"
        v-on="$attrs"
    >
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('orderDetail.basicInfo')" name="basicInfo">
                <el-form :size="miniSize" class="dialog-container" label-width="100px">
                    <div class="group-container">
                        <el-divider content-position="left">
                            {{ $t('orderDetail.orderInfo') }}
                        </el-divider>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.orderId') + ':'">
                                    {{ viewData.orderId }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.totalAmount') + ':'">
                                    {{ viewData.orderAmount }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.payState') + ':'">
                                    {{ mapAlias.order.pay_state[viewData.payState] }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.shipState') + ':'">
                                    {{ mapAlias.order.ship_state[viewData.shipState] }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.orderState') + ':'">
                                    {{ mapAlias.order.state[viewData.state] }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.payedAmount') + ':'">
                                    {{ viewData.payed }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.paymentMethod') + ':'">
                                    {{ mapAlias.payment_type[viewData.paymentCode] }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.deliveryMethod') + ':'">
                                    {{ viewData.logiName }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.invoiceType') + ':'">
                                    {{ mapAlias.order.tax_type[viewData.taxType] }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.invoiceContent') + ':'">
                                    {{ viewData.taxContent }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.taxCode') + ':'">
                                    {{ viewData.taxCode }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.invoiceTitle') + ':'">
                                    {{ viewData.taxTitle }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.orderDiscount') + ':'">
                                    {{ viewData.orderPmt }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.goodsDiscount') + ':'">
                                    {{ viewData.goodsPmt }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.couponDiscount') + ':'">
                                    {{ viewData.couponPmt }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.pointDiscount') + ':'">
                                    {{ viewData.pointMoney }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.totalWeight') + ':'">
                                    {{ viewData.weight }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.totalPrice') + ':'">
                                    {{ viewData.goodsAmount }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.orderSource') + ':'">
                                    {{ mapAlias.order.source[viewData.source] }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.orderTime') + ':'">
                                    {{ viewData.createdAt }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="$t('orderDetail.deliveryCost') + ':'">
                                    {{ viewData.costFreight }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item :label="$t('orderDetail.confirmStatus') + ':'">
                                    {{ mapAlias.order.confirm[viewData.confirm] }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="group-container">
                        <el-divider content-position="left">
                            {{ $t('orderDetail.receiverInfo') }}
                        </el-divider>
                        <template v-if="viewData.store">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item :label="$t('orderDetail.pickupStoreName') + ':'">
                                        {{ viewData.store.storeName }}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="$t('orderDetail.linkman') + ':'">
                                        {{ viewData.store.linkman }}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item :label="$t('orderDetail.storeAddress') + ':'">
                                        {{ viewData.store.allAddress }}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item :label="$t('orderDetail.storePhone') + ':'">
                                        {{ viewData.store.mobile }}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item :label="$t('orderDetail.pickupName') + ':'">
                                        {{ viewData.store.shipName }}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item :label="$t('orderDetail.pickupPhone') + ':'">
                                        {{ viewData.store.shipMobile }}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </template>
                        <template v-else>
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item :label="$t('orderDetail.receiveTime') + ':'">
                                        {{ viewData.confirmTime }}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item :label="$t('orderDetail.receiverName') + ':'">
                                        {{ viewData.shipName }}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item :label="$t('orderDetail.receiverPhone') + ':'">
                                        {{ viewData.shipMobile }}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item :label="$t('orderDetail.receiveAddress') + ':'">
                                        {{ viewData.shipAddress }}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </template>
                    </div>
                    <div class="group-container">
                        <el-divider content-position="left">
                            {{ $t('orderDetail.buyerRemark') }}
                        </el-divider>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item :label="$t('orderDetail.buyerRemarkContent') + ':'">
                                    {{ viewData.memo }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
            </el-tab-pane>
            <el-tab-pane :label="$t('orderDetail.goodsInfo')" name="goodsInfo">
                <el-table :data="viewData.orderItems" :size="miniSize" stripe style="width: 100%">
                    <el-table-column
                        :label="$t('visualDesign.goodsName')"
                        min-width="180"
                        prop="name"
                        show-overflow-tooltip
                    />
                    <el-table-column
                        :label="$t('orderDetail.unitPrice')"
                        min-width="80"
                        prop="price"
                    />
                    <el-table-column
                        :label="$t('orderDetail.quantity')"
                        min-width="80"
                        prop="num"
                    />
                    <el-table-column
                        :label="$t('orderDetail.totalPrice')"
                        min-width="80"
                        prop="amount"
                    />
                    <el-table-column
                        :label="$t('orderDetail.productCode')"
                        min-width="130"
                        prop="sn"
                    />
                    <el-table-column
                        :label="$t('orderDetail.goodsCode')"
                        min-width="110"
                        prop="bn"
                    />
                    <el-table-column
                        :label="$t('orderDetail.totalWeight')"
                        min-width="80"
                        prop="weight"
                    />
                    <el-table-column
                        :label="$t('orderDetail.shippedQuantity')"
                        min-width="80"
                        prop="sendNum"
                    />
                </el-table>
            </el-tab-pane>
            <el-tab-pane :label="$t('orderDetail.paymentRefundItem')" name="payRefundItem">
                <el-divider content-position="left">
                    {{ $t('orderDetail.paymentBill') }}
                </el-divider>
                <el-table :data="viewData.billPayments" :size="miniSize" stripe style="width: 100%">
                    <el-table-column
                        :label="$t('orderDetail.paymentId')"
                        min-width="90"
                        prop="paymentId"
                    />
                    <el-table-column
                        :formatter="
                            (row, column) => {
                                return env.columnFormatter(row[column.property], 'payment_type');
                            }
                        "
                        :label="$t('orderDetail.paymentMethod')"
                        min-width="80"
                        prop="paymentCode"
                    />
                    <el-table-column
                        :label="$t('orderDetail.thirdPartyPaymentId')"
                        min-width="80"
                        prop="tradeNo"
                    />
                    <el-table-column
                        :label="$t('orderDetail.paymentAmount')"
                        min-width="80"
                        prop="money"
                    />
                    <el-table-column
                        :formatter="
                            (row, column) => {
                                return env.columnFormatter(
                                    row[column.property],
                                    'bill_payment',
                                    column.property
                                );
                            }
                        "
                        align="center"
                        :label="$t('orderDetail.paymentStatus')"
                        min-width="80"
                        prop="state"
                    />
                    <el-table-column
                        :label="$t('orderDetail.paymentTime')"
                        min-width="120"
                        prop="createdAt"
                    />
                </el-table>
                <el-divider content-position="left">
                    {{ $t('orderDetail.refundBill') }}
                </el-divider>
                <el-table :data="viewData.billRefunds" :size="miniSize" stripe style="width: 100%">
                    <el-table-column
                        :label="$t('orderDetail.refundId')"
                        min-width="90"
                        prop="refundId"
                    />
                    <el-table-column
                        :formatter="
                            (row, column) => {
                                return env.columnFormatter(row[column.property], 'payment_type');
                            }
                        "
                        :label="$t('orderDetail.refundMethod')"
                        min-width="80"
                        prop="paymentCode"
                    />
                    <el-table-column
                        :label="$t('orderDetail.thirdPartyPaymentId')"
                        min-width="100"
                        prop="tradeNo"
                    />
                    <el-table-column
                        :label="$t('orderDetail.refundAmount')"
                        min-width="80"
                        prop="money"
                    />
                    <el-table-column
                        :formatter="
                            (row, column) => {
                                return env.columnFormatter(
                                    row[column.property],
                                    'bill_refund',
                                    column.property
                                );
                            }
                        "
                        :label="$t('orderDetail.refundStatus')"
                        min-width="80"
                        prop="state"
                    />
                    <el-table-column
                        :label="$t('orderDetail.applyTime')"
                        min-width="120"
                        prop="createdAt"
                    />
                </el-table>
            </el-tab-pane>
            <el-tab-pane :label="$t('orderDetail.deliveryRefundItem')" name="deliveryRefundItem">
                <el-divider content-position="left">
                    {{ $t('orderDetail.deliveryBill') }}
                </el-divider>
                <el-table
                    :data="viewData.billDeliveries"
                    :size="miniSize"
                    stripe
                    style="width: 100%"
                >
                    <el-table-column
                        :label="$t('orderDetail.deliveryId')"
                        min-width="90"
                        prop="deliveryId"
                    />
                    <el-table-column
                        :label="$t('orderDetail.logisticsCompany')"
                        min-width="80"
                        prop="logiCodeName"
                    />
                    <el-table-column
                        :label="$t('orderDetail.logisticsNo')"
                        min-width="90"
                        prop="logiNo"
                    />
                    <el-table-column
                        :label="$t('orderDetail.receiverName')"
                        min-width="80"
                        prop="shipName"
                    />
                    <el-table-column
                        :label="$t('orderDetail.receiverPhone')"
                        min-width="80"
                        prop="shipMobile"
                    />
                    <el-table-column
                        :label="$t('orderDetail.receiverAddress')"
                        min-width="180"
                        prop="shipAddress"
                    />
                </el-table>
                <el-divider content-position="left">
                    {{ $t('orderDetail.pickupBill') }}
                </el-divider>
                <el-table :data="viewData.billLadings" :size="miniSize" stripe style="width: 100%">
                    <el-table-column :label="$t('orderDetail.pickupId')" min-width="90" prop="id" />
                    <el-table-column
                        :label="$t('orderDetail.pickupStore')"
                        min-width="120"
                        prop="storeIdName"
                    />
                    <el-table-column
                        :label="$t('orderDetail.pickupName')"
                        min-width="100"
                        prop="name"
                    />
                    <el-table-column
                        :label="$t('orderDetail.pickupPhone')"
                        min-width="100"
                        prop="mobile"
                    />
                    <el-table-column
                        :label="$t('orderDetail.pickupStatus')"
                        min-width="80"
                        prop="state"
                    />
                    <el-table-column
                        :label="$t('orderDetail.pickupTime')"
                        min-width="120"
                        prop="updatedAt"
                    />
                    <el-table-column
                        :label="$t('orderDetail.clerk')"
                        min-width="100"
                        prop="clerkIdName"
                    />
                </el-table>
                <el-divider content-position="left">
                    {{ $t('orderDetail.returnBill') }}
                </el-divider>
                <el-table :data="viewData.billReships" :size="miniSize" stripe style="width: 100%">
                    <el-table-column
                        :label="$t('orderDetail.returnId')"
                        min-width="90"
                        prop="reshipId"
                    />
                    <el-table-column
                        :label="$t('orderDetail.logisticsCompany')"
                        min-width="110"
                        prop="logiCodeName"
                    />
                    <el-table-column
                        :label="$t('orderDetail.logisticsNo')"
                        min-width="90"
                        prop="logiNo"
                    />
                    <el-table-column
                        :label="$t('orderDetail.returnStatus')"
                        min-width="80"
                        prop="state"
                    />
                    <el-table-column
                        :label="$t('orderDetail.returnTime')"
                        min-width="120"
                        prop="updatedAt"
                    />
                </el-table>
            </el-tab-pane>
            <el-tab-pane :label="$t('orderDetail.orderRecord')" name="orderRecord">
                <el-table :data="viewData.orderLogs" :size="miniSize" stripe style="width: 100%">
                    <el-table-column
                        :label="$t('orderDetail.orderId')"
                        min-width="90"
                        prop="orderId"
                    />
                    <el-table-column
                        :formatter="
                            (row, column) => {
                                return env.columnFormatter(
                                    row[column.property],
                                    'order_log',
                                    column.property
                                );
                            }
                        "
                        :label="$t('orderDetail.operationType')"
                        min-width="80"
                        prop="type"
                    />
                    <el-table-column
                        :label="$t('orderDetail.description')"
                        min-width="280"
                        prop="msg"
                    />
                    <el-table-column
                        :formatter="
                            (row, column) => {
                                return env.formatDateTime(row[column.property]);
                            }
                        "
                        :label="$t('orderDetail.time')"
                        min-width="110"
                        prop="createdAt"
                    />
                </el-table>
            </el-tab-pane>
            <el-tab-pane :label="$t('orderDetail.orderRemark')" name="orderRemark">
                <el-form
                    ref="formData"
                    :model="formData"
                    :rules="formDataRules"
                    :size="normalSize"
                    label-width="80px"
                >
                    <el-form-item :label="$t('orderDetail.remarkContent')" prop="mark">
                        <el-input
                            v-model="formData.mark"
                            :autosize="{ minRows: 8, maxRows: 16 }"
                            :rows="8"
                            :placeholder="$t('permission.pleaseEnterContent')"
                            type="textarea"
                        />
                    </el-form-item>
                </el-form>
                <div class="dialog-footer">
                    <el-button :size="miniSize" round @click="$emit('update:visible', false)">
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
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';

export default {
    name: 'OrderDetailDialog',
    components: {},
    props: {
        orderId: {
            type: String,
            required: true,
        },
    },
    emits: ['update:visible'],
    computed: {
        ...mapState(['mapAlias']),
    },
    data() {
        return {
            normalSize: 'large',
            miniSize: 'default',

            loading: false,

            activeName: 'basicInfo',
            // 界面显示数据
            viewData: {
                orderId: '', // 订单号
                orderAmount: '', // 总金额
                payState: '', // 支付状态
                shipState: '', // 发货状态
                state: '', // 订单状态
                payed: '', // 已支付金额
                paymentCode: '', // 支付方式
                logiName: '', // 配送方式
                taxType: '', // 发票类型
                taxContent: '', // 发票内容
                taxCode: '', // 税号
                taxTitle: '', // 发票抬头
                orderPmt: '', // 订单优惠金额
                goodsPmt: '', // 商品优惠金额

                couponPmt: '', // 优惠券优惠
                pointMoney: '', // 积分优惠
                weight: '', // 商品总重量
                goodsAmount: '', // 商品总价
                source: '', // 下单来源
                createdAt: '', // 时间

                costFreight: '', // 配送费用
                confirm: '', // 收货状态
                store: {
                    storeName: '', // 自提店铺名
                    linkman: '', // 联系人
                    allAddress: '', // 店铺地址
                    mobile: '', // 店铺联系电话
                    shipName: '', // 提货人姓名
                    shipMobile: '', // 提货人电话
                },
                confirmTime: '', // 收货时间
                shipName: '', // 收货人姓名

                shipMobile: '', // 收货人电话
                shipAddress: '', // 收货地址
                memo: '', // 买家备注

                orderItems: [], // 商品信息
                billPayments: [], // 支付单
                billRefunds: [], // 退款单
                billDeliveries: [], // 发货单
                billLadings: [], // 提货单
                billReships: [], // 退货单
                orderLogs: [], // 订单记录
            },
            // 编辑数据
            formData: {
                id: 0,
                mark: '', // 备注内容
            },
            formDataRules: {
                mark: [
                    {
                        required: true,
                        message: this.$t('orderDetail.pleaseEnterRemark'),
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    async mounted() {
        console.log(this.mapAlias);
    },
    methods: {
        openDialog() {
            this.$nextTick(async () => {
                // 基于 orderId  向服务器请求 订单明细数据
                if (this.orderId) {
                    await this.getOrderDetail(this.orderId);
                }
            });
        },
        async getOrderDetail(orderId) {
            const _result = await this.$api.order.get({ orderId });
            if (_result.succeed === 1 && _result.code === 200) {
                Object.assign(this.viewData, _result.data);
                Object.assign(this.formData, _.pick(_result.data, ['id', 'mark']));
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
                        const data = Object.assign({}, this.formData);
                        const _result = await this.$api.order.save(data);
                        this.loading = false;
                        if (_result.succeed === 1 && _result.code === 200) {
                            this.$notify({
                                title: this.$t('common.success'),
                                message: _result.description,
                                type: 'success',
                            });
                            this.$refs.formData.resetFields();
                            this.$emit('update:visible', false);
                        } else {
                            this.$notify.error({
                                title: this.$t('common.error'),
                                message: _result.description,
                            });
                        }
                    });
                }
            });
        },
    },
};
</script>

<style scoped lang="scss">
.dialog-footer {
    float: right;
}
</style>
