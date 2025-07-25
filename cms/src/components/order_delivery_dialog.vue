<template>
    <el-dialog
        :close-on-click-modal="false"
        :modal="false"
        title="订单发货"
        v-bind="$attrs"
        width="60%"
        @open="openDialog"
        v-on="$attrs"
    >
        <div class="group-container">
            <el-divider content-position="left">收货人信息</el-divider>
            <el-form :size="miniSize" class="dialog-container" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="订单号:">
                            {{ viewData.orderId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="配送方式:">
                            {{ viewData.logisticsName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="配送费用:">
                            {{ viewData.costFreight }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品总重:">
                            {{ viewData.weight }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="收货人姓名:">
                            {{ viewData.shipName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="收货人电话:">
                            {{ viewData.shipMobile }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="收货区域:">
                            {{ viewData.shipAreaId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="详细收货地址:">
                            {{ viewData.shipAddress }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="买家备注信息:">
                            {{ viewData.memo }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-divider content-position="left">商品详情</el-divider>
        <el-table :data="viewData.orderItems" :size="miniSize" stripe style="width: 100%">
            <el-table-column label="商品名称" min-width="180" prop="name" show-overflow-tooltip />
            <el-table-column label="商品编码" min-width="120" prop="bn" />
            <el-table-column label="货品编码" min-width="120" prop="sn" />
            <el-table-column label="购买量" min-width="80" prop="num" />
            <el-table-column label="已发数量" min-width="80" prop="sendNum" />
            <el-table-column label="发货量" min-width="80" prop="num" />
        </el-table>
        <el-form
            ref="formData"
            :model="formData"
            :rules="formDataRules"
            :size="normalSize"
            label-width="80px"
        >
            <el-divider content-position="left">物流信息</el-divider>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="物流公司" prop="logisticsId">
                        <el-select v-model="formData.logisticsId" placeholder="请选择">
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
                    <el-form-item label="物流单号" prop="logi_no">
                        <el-input v-model="formData.logiNo" placeholder="请输入内容" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="发货备注" prop="memo">
                        <el-input v-model="formData.memo" placeholder="请输入内容" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button :size="miniSize" round @click.native="$emit('update:visible', false)">
                    {{ $t('action.cancel') }}
                </el-button>
                <el-button
                    :loading="loading"
                    :size="miniSize"
                    round
                    type="primary"
                    @click.native="submitForm"
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
    data() {
        return {
            normalSize: 'large',
            miniSize: 'default',

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
            formDataRules: {
                logiName: [{ required: true, message: '请输入物流公司名称', trigger: 'blur' }],
            },
        };
    },
    computed: {},
    async mounted() {},
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
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.loading = true;
                        const data = Object.assign({}, this.formData);
                        const _result = await this.$api.order.save(data);
                        this.loading = false;
                        if (_result.succeed === 1 && _result.code === 200) {
                            this.$notify({
                                title: '成功',
                                message: _result.description,
                                type: 'success',
                            });
                            this.$refs.formData.resetFields();
                            this.$emit('update:visible', false);
                        } else {
                            this.$notify.error({
                                title: '错误',
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
