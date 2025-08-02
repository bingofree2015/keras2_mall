<template>
    <el-dialog
        :close-on-click-modal="false"
        :modal="false"
        :title="$t('orderDelivery.dialogTitle')"
        v-bind="$attrs"
        width="60%"
        @open="openDialog"
        v-on="$attrs"
    >
        <div class="group-container">
            <el-divider content-position="left">
                {{ $t('orderDelivery.receiverInfo') }}
            </el-divider>
            <el-form :size="normalSize" class="dialog-container" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('orderDelivery.orderNumber') + ':'">
                            {{ viewData.orderId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('orderDelivery.deliveryMethod') + ':'">
                            {{ viewData.logisticsName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('orderDelivery.deliveryFee') + ':'">
                            {{ viewData.costFreight }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('orderDelivery.totalWeight') + ':'">
                            {{ viewData.weight }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('orderDelivery.receiverName') + ':'">
                            {{ viewData.shipName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('orderDelivery.receiverPhone') + ':'">
                            {{ viewData.shipMobile }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('orderDelivery.receiverArea') + ':'">
                            {{ viewData.shipAreaId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item :label="$t('orderDelivery.receiverAddress') + ':'">
                            {{ viewData.shipAddress }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('orderDelivery.buyerRemark') + ':'">
                            {{ viewData.memo }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-divider content-position="left">
            {{ $t('orderDelivery.goodsDetail') }}
        </el-divider>
                        <el-table :data="viewData.orderItems" :size="normalSize" stripe style="width: 100%">
            <el-table-column
                :label="$t('orderDelivery.goodsName')"
                min-width="180"
                prop="name"
                show-overflow-tooltip
            />
            <el-table-column :label="$t('orderDelivery.goodsCode')" min-width="120" prop="bn" />
            <el-table-column :label="$t('orderDelivery.productCode')" min-width="120" prop="sn" />
            <el-table-column
                :label="$t('orderDelivery.purchaseQuantity')"
                min-width="80"
                prop="num"
            />
            <el-table-column
                :label="$t('orderDelivery.shippedQuantity')"
                min-width="80"
                prop="sendNum"
            />
            <el-table-column :label="$t('orderDelivery.shipQuantity')" min-width="80" prop="num" />
        </el-table>
        <el-form
            ref="formData"
            :model="formData"
            :rules="formDataRules"
            :size="normalSize"
            label-width="80px"
        >
            <el-divider content-position="left">
                {{ $t('orderDelivery.logisticsInfo') }}
            </el-divider>
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="$t('orderDelivery.logisticsCompany')" prop="logisticsId">
                        <el-select
                            v-model="formData.logisticsId"
                            :placeholder="$t('orderDelivery.selectLogistics')"
                        >
                            <el-option
                                v-for="logi in logistics"
                                :key="logi.id"
                                :label="logi.logiName"
                                :value="logi.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('orderDelivery.logisticsNumber')" prop="logi_no">
                        <el-input
                            v-model="formData.logiNo"
                            :placeholder="$t('orderDelivery.inputLogisticsNumber')"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item :label="$t('orderDelivery.shipmentRemark')" prop="memo">
                        <el-input
                            v-model="formData.memo"
                            :placeholder="$t('orderDelivery.inputShipmentRemark')"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button :size="normalSize" round @click="$emit('update:visible', false)">
                    {{ $t('action.cancel') }}
                </el-button>
                <el-button
                    :loading="loading"
                    :size="normalSize"
                    round
                    type="primary"
                    @click="submitForm"
                >
                    {{ $t('action.submit') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import _ from 'lodash';
export default {
    name: 'OrderDeliveryDialog',
    components: {},
    props: {
        orderId: {
            type: String,
            required: true,
        },
    },
    emits: ['update:visible'],
    data() {
        return {
            normalSize: 'default',

            loading: false,
            // 订单发货数据
            logistics: [],
            viewData: {
                id: 0,
                orderId: '', // 订单号
                // 收货人信息
                logisticsName: '', // 配送方式
                costFreight: '', // 配送费用
                weight: '', // 商品总重
                shipName: '', // 收货人姓名
                shipMobile: '', // 收货人电话
                shipAreaId: '', // 收货区域
                shipAddress: '', // 详细收货地址
                memo: '', // 买家备注信息
                // 商品详情
                orderItems: [], // 商品详情
            },
            formData: {
                id: 0,
                // 物流信息
                logisticsId: '', // 物流公司
                logiNo: '', // 物流单号
                memo: '', // 发货备注
            },
        };
    },
    computed: {
        // 响应式的 formDataRules 配置
        formDataRules() {
            return {
                logiName: [
                    {
                        required: true,
                        message: this.$t('orderDelivery.inputLogisticsCompany'),
                        trigger: 'blur',
                    },
                ],
            };
        },
    },
    methods: {
        openDialog() {
            this.$nextTick(async () => {
                // 基于 orderId  向服务器请求 订单明细数据
                if (this.orderId) {
                    await this.getLogistics();
                    await this.getOrderDetail(this.orderId);
                }
            });
        },
        async getLogistics() {
            const _result = await this.$api.logistics.list({});
            if (_result.succeed === 1 && _result.code === 200) {
                this.logistics = _result.data.list;
            }
        },
        async getOrderDetail(orderId) {
            const _result = await this.$api.order.get({ orderId, type: 0 });
            if (_result.succeed === 1 && _result.code === 200) {
                Object.assign(this.viewData, _result.data);
                Object.assign(
                    this.formData,
                    _.pick(_result.data, ['id', 'logisticsId', 'logiNo', 'memo'])
                );
            }
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(this.$t('common.confirmSubmit'), this.$t('common.tip'), {}).then(
                        async () => {
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
                        }
                    );
                }
            });
        },
    },
};
</script>

<style scoped lang="scss"></style>
