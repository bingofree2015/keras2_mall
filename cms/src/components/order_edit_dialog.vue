<template>
    <el-dialog
        :close-on-click-modal="false"
        :modal="false"
        :title="$t('orderEdit.dialogTitle')"
        v-bind="$attrs"
        width="50%"
        @open="openDialog"
        v-on="$attrs"
    >
        <el-form ref="formData" :model="formData" :size="normalSize" label-width="120px">
            <template v-if="formData.store">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('orderEdit.orderNumber')" prop="orderId">
                            {{ formData.orderId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('orderEdit.receiveStore')" prop="storeId">
                            <el-select
                                v-model="formData.storeId"
                                :placeholder="$t('permission.pleaseSelect')"
                            >
                                <el-option
                                    v-for="item in stores"
                                    :key="item.id"
                                    :label="item.storeName"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('orderEdit.receiverName')" prop="shipName">
                            <el-input
                                v-model="formData.shipName"
                                :placeholder="$t('orderEdit.inputReceiverName')"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('orderEdit.pickupPhone')" prop="shipMobile">
                            <el-input
                                v-model="formData.shipMobile"
                                :placeholder="$t('orderEdit.inputPickupPhone')"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
            <template v-else>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('orderEdit.orderNumber')" prop="orderId">
                            {{ formData.orderId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('orderEdit.receiveArea')" prop="shipAreaId">
                            <el-cascader
                                v-model="formData.shipAreaId"
                                :options="areas"
                                :props="cascaderProps"
                                :show-all-levels="false"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('orderEdit.receiverName')" prop="shipName">
                            <el-input
                                v-model="formData.shipName"
                                :placeholder="$t('orderEdit.inputReceiverName')"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('orderEdit.receiveAddress')" prop="shipAddress">
                            <el-input
                                v-model="formData.shipAddress"
                                :placeholder="$t('orderEdit.inputReceiveAddress')"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('orderEdit.receiverPhone')" prop="shipMobile">
                            <el-input
                                v-model="formData.shipMobile"
                                :placeholder="$t('orderEdit.inputReceiverPhone')"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('orderEdit.orderTotalAmount')" prop="orderAmount">
                            <el-input
                                v-model="formData.orderAmount"
                                :placeholder="$t('orderEdit.inputOrderAmount')"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
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
export default {
    name: 'OrderEditDialog',
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

            // 编辑界面数据
            stores: [],

            cascaderProps: {
                label: 'name',
                value: 'id',
                children: 'children',
            },
            areas: [],
            formData: {
                id: 0,
                orderId: '', // 订单号
                store: {
                    id: 0,
                }, // 收货门店
                shipName: '', // 收货人姓名
                shipMobile: '', // 提货人电话

                shipAreaId: '', // 收货区域
                shipAddress: '', // 收货地址
                orderAmount: '', // 订单总金额
            },
            formDataRules: {
                shipName: [
                    {
                        required: true,
                        message: this.$t('orderEdit.inputReceiverName'),
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    computed: {},
    methods: {
        openDialog() {
            this.$nextTick(async () => {
                // 基于 orderId  向服务器请求 订单明细数据
                if (this.orderId) {
                    await this.getAreas();
                    await this.getStores();
                    await this.getOrderDetail(this.orderId);
                }
            });
        },
        async getStores() {
            const _result = await this.$api.store.list({});
            if (_result.succeed === 1 && _result.code === 200) {
                this.stores = _result.data.list;
            }
        },
        /**
         * 地区列表
         */
        async getAreas() {
            const _result = await this.$api.area.getTree();
            if (_result.succeed === 1 && _result.code === 200) {
                this.areas = _result.data.list;
            }
        },
        async getOrderDetail(orderId) {
            const _result = await this.$api.order.get({ orderId, type: 0 });
            if (_result.succeed === 1 && _result.code === 200) {
                Object.assign(this.formData, _result.data);
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

<style scoped lang="scss"></style>
