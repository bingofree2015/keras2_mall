<template>
    <div class="page-container">
        <!--新增编辑界面-->
        <el-form
            ref="formData"
            :model="formData"
            :rules="formDataRules"
            :size="normalSize"
            class="edit-dialog-container"
            label-width="120px"
            style="width: 80%"
        >
            <el-row>
                <el-col :span="24">
                    <bread-crumb />
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-row>
                        <el-col :span="14">
                            <el-form-item :label="$t('ship.name') + ':'" prop="name">
                                <el-input
                                    v-model="formData.name"
                                    :placeholder="$t('ship.inputName')"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item :label="$t('ship.logistics') + ':'" prop="logiCode">
                                <el-select
                                    v-model="formData.logiCode"
                                    :placeholder="$t('common.selectPlaceholder')"
                                >
                                    <el-option
                                        v-for="logi in logistics"
                                        :key="logi.logiCode"
                                        :label="logi.logiName"
                                        :value="logi.logiCode"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item :label="$t('ship.freePostage') + ':'" prop="freePostage">
                                <el-switch
                                    v-model="formData.freePostage"
                                    :active-text="$t('common.yes')"
                                    :inactive-text="$t('common.no')"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="$t('ship.hasCod') + ':'" prop="hasCod">
                                <el-switch
                                    v-model="formData.hasCod"
                                    :active-text="$t('common.yes')"
                                    :inactive-text="$t('common.no')"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item :label="$t('ship.isDef') + ':'" prop="isDef">
                                <el-switch
                                    v-model="formData.isDef"
                                    :active-text="$t('common.yes')"
                                    :inactive-text="$t('common.no')"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="$t('ship.state') + ':'" prop="state">
                                <el-switch
                                    v-model="formData.state"
                                    :active-text="$t('common.yes')"
                                    :inactive-text="$t('common.no')"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item :label="$t('ship.weightSetting')">
                        <el-col :span="8">
                            {{ $t('ship.firstWeight') }}
                            <el-select
                                v-model="formData.firstUnit"
                                :placeholder="$t('common.selectPlaceholder')"
                            >
                                <el-option
                                    v-for="(val, key, index) in mapAlias.ship_unit"
                                    :key="index"
                                    :label="val"
                                    :value="key"
                                />
                            </el-select>
                        </el-col>
                        <el-col :span="8">
                            {{ $t('ship.continueWeight') }}
                            <el-select
                                v-model="formData.continueUnit"
                                :placeholder="$t('common.selectPlaceholder')"
                            >
                                <el-option
                                    v-for="(val, key, index) in mapAlias.ship_unit"
                                    :key="index"
                                    :label="val"
                                    :value="key"
                                />
                            </el-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item :label="$t('ship.feeSetting')">
                        <el-col :span="6">
                            {{ $t('ship.firstWeight') }}
                            <el-input-number
                                v-model="formData.firstUnitPrice"
                                :max="99999"
                                :min="0"
                                :precision="2"
                                controls-position="right"
                                :label="$t('ship.inputFirstWeightFee')"
                            />
                        </el-col>
                        <el-col :span="6">
                            {{ $t('ship.continueWeight') }}
                            <el-input-number
                                v-model="formData.continueUnitPrice"
                                :max="99999"
                                :min="0"
                                :precision="2"
                                controls-position="right"
                                :label="$t('ship.inputContinueWeightFee')"
                            />
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="$t('ship.sort') + ':'" prop="sort">
                                <el-input-number
                                    v-model="formData.sort"
                                    :max="100"
                                    :min="0"
                                    controls-position="right"
                                    :label="$t('ship.inputSort')"
                                />
                            </el-form-item>
                        </el-col>
                    </el-form-item>

                    <el-form-item :label="$t('ship.goodsMoney')" prop="goodsMoney">
                        <el-input-number
                            v-model="formData.goodsMoney"
                            :max="999999"
                            :min="0"
                            :precision="2"
                            controls-position="right"
                            :label="$t('ship.inputGoodsMoney')"
                        />
                        <span class="tip-info">{{ $t('ship.freeShippingTip') }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('ship.areaType') + ':'" prop="type">
                        <el-col :span="6">
                            <el-radio-group v-model="formData.type">
                                <el-radio :value="1">
                                    {{ $t('ship.all') }}
                                </el-radio>
                                <el-radio :value="2">
                                    {{ $t('ship.part') }}
                                </el-radio>
                            </el-radio-group>
                        </el-col>
                        <span class="tip-info">{{ $t('ship.areaTypeTip') }}</span>
                    </el-form-item>

                    <el-table
                        v-if="formData.type === 2"
                        :data="formData.areaFee"
                        style="width: 100%"
                    >
                        <el-table-column
                            :label="$t('ship.areaList')"
                            min-width="100"
                            prop="areas"
                            show-overflow-tooltip
                        >
                            <template #default="scope">
                                {{ scope.row.areas.map((v) => v.name).join(',') }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('ship.select')" min-width="100" prop="areas">
                            <template #default="scope">
                                <pick-area
                                    :area-ids="scope.row.areas.map((v) => v.id)"
                                    @chosed-areas="
                                        (areaIds) => {
                                            return chosedAreas(areaIds, scope.row);
                                        }
                                    "
                                />
                            </template>
                        </el-table-column>
                        <el-table-column
                            :label="$t('ship.firstWeightFee')"
                            min-width="130"
                            prop="firstUnitAreaPrice"
                        >
                            <template #default="scope">
                                <el-input-number
                                    v-model="scope.row.firstUnitAreaPrice"
                                    :size="normalSize"
                                    :max="99999"
                                    :min="0"
                                    :precision="2"
                                    controls-position="right"
                                    placeholder="请输入首重费用"
                                    style="width: 100px"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column
                            :label="$t('ship.continueWeightFee')"
                            min-width="130"
                            prop="continueUnitAreaPrice"
                        >
                            <template #default="scope">
                                <el-input-number
                                    v-model="scope.row.continueUnitAreaPrice"
                                    :size="normalSize"
                                    :max="99999"
                                    :min="0"
                                    :precision="2"
                                    controls-position="right"
                                    placeholder="请输入续重费用"
                                    style="width: 100px"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            fixed="right"
                            :label="$t('action.operation')"
                            min-width="60"
                        >
                            <template #header>
                                <el-button
                                    round
                                    :size="normalSize"
                                    style="float: right"
                                    type="primary"
                                    @click.prevent="handleAddAreaFee()"
                                >
                                    {{ $t('action.add') }}
                                </el-button>
                            </template>
                            <template #default="scope">
                                <i
                                    class="el-icon-ali-delete"
                                    @click="handleDeleteAreaFee(scope.row.idx)"
                                ></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16" class="footer" style="padding-right: 12px">
                    <el-button :size="normalSize" round @click="resetForm('formData')">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button
                        :loading="editLoading"
                        :size="normalSize"
                        round
                        type="primary"
                        @click="submitForm"
                    >
                        {{ $t('action.submit') }}
                    </el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import breadCrumb from '@/components/bread_crumb.vue';
import pickArea from '@/components/pick_area';
export default {
    components: {
        breadCrumb,
        pickArea,
    },
    data() {
        const checkPrice = (rule, value, callback) => {
            if (value === '' || value === null || value === undefined || value === 0) {
                callback();
                return;
            }
            const reg = /^\d{1,5}(?:\.\d{1,2})?$/;
            if (reg.test(value) && parseFloat(value) >= 0) {
                callback();
            } else {
                callback(new Error('请输入大于等于零小于十万不超过两位小数的数字'));
            }
        };
        return {
            normalSize: 'default',
            isCreating: false, // true:新增, false:编辑
            editLoading: false,
            logistics: [],
            // 新增编辑界面数据
            formData: {
                id: 0, // ID
                name: '', // 配送方式名称
                logiCode: '', // 物流公司
                freePostage: true, // 是否包邮
                hasCod: false, // 货到付款
                isDef: false, // 是否默认
                state: true, // 是否启用
                firstUnit: '', // 首重重量
                continueUnit: '', // 续重重量
                firstUnitPrice: 0, // 首重费用
                continueUnitPrice: 0, // 续重费用

                sort: 1, // 排序
                goodsMoney: 0, // 商品满多少
                type: 1, // 地区类型
                areaFee: [], // 其它地区列表
            },
            formDataRules: {
                name: [{ required: true, message: '请输入配送方式名称', trigger: 'blur' }],
                logiCode: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
                firstUnit: [{ required: true, message: '请选择首重单位', trigger: 'change' }],
                continueUnit: [{ required: true, message: '请选择续重单位', trigger: 'change' }],
                firstUnitPrice: [{ validator: checkPrice, trigger: 'blur' }],
                continueUnitPrice: [{ validator: checkPrice, trigger: 'blur' }],
                goodsMoney: [{ validator: checkPrice, trigger: 'blur' }],
            },
        };
    },
    computed: {
        ...mapState(['mapAlias']),
    },
    async mounted() {
        this.isCreating = this.$route.query.isCreating;
        await this.getLogistics();

        const _id = this.$route.query.shipId;
        if (_id) {
            try {
                const _result = await this.$api.ship.get({ id: _id });
                if (_result.succeed === 1 && _result.code === 200) {
                    const data = Object.assign({}, _result.data);
                    // 强制转换为数字类型，避免 el-input-number 类型警告
                    data.firstUnitPrice = Number(data.firstUnitPrice) || 0;
                    data.continueUnitPrice = Number(data.continueUnitPrice) || 0;
                    data.goodsMoney = Number(data.goodsMoney) || 0;
                    data.sort = Number(data.sort) || 1;

                    // 处理地区费用数组中的数字字段
                    if (Array.isArray(data.areaFee)) {
                        data.areaFee = data.areaFee.map((item) => ({
                            ...item,
                            firstUnitAreaPrice: Number(item.firstUnitAreaPrice) || 0,
                            continueUnitAreaPrice: Number(item.continueUnitAreaPrice) || 0,
                        }));
                    }

                    this.formData = data;
                } else {
                    this.$notify.error({
                        title: this.$t('common.error'),
                        message: _result.description || '获取配送方式信息失败',
                    });
                }
            } catch (error) {
                this.$notify.error({
                    title: this.$t('common.error'),
                    message: '获取配送方式信息失败',
                });
            }
        }
    },
    methods: {
        chosedAreas(areaIds, row) {
            row.areas = areaIds;
        },
        handleAddAreaFee() {
            this.formData.areaFee.push({
                idx: this.formData.areaFee.length,
                id: 0,
                areas: [],
                firstUnitAreaPrice: 0,
                continueUnitAreaPrice: 0,
            });
        },
        handleDeleteAreaFee(idx) {
            const index = this.formData.areaFee.findIndex((v) => v.idx === idx);
            if (index !== -1) {
                this.formData.areaFee.splice(index, 1);
                // 重新计算索引
                this.formData.areaFee.forEach((item, index) => {
                    item.idx = index;
                });
            }
        },
        async getLogistics() {
            try {
                const _result = await this.$api.logistics.list({});
                if (_result.succeed === 1 && _result.code === 200) {
                    this.logistics = _result.data.list;
                } else {
                    this.$notify.error({
                        title: this.$t('common.error'),
                        message: _result.description || '获取物流公司列表失败',
                    });
                }
            } catch (error) {
                this.$notify.error({
                    title: this.$t('common.error'),
                    message: '获取物流公司列表失败',
                });
            }
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    const confirmMessage = this.isCreating
                        ? '确认新增配送方式？'
                        : '确认保存修改？';
                    this.$confirm(confirmMessage, this.$t('common.tip'), {}).then(async () => {
                        this.editLoading = true;
                        try {
                            const data = Object.assign({}, this.formData);
                            // 确保数字字段类型正确
                            data.firstUnitPrice = Number(data.firstUnitPrice) || 0;
                            data.continueUnitPrice = Number(data.continueUnitPrice) || 0;
                            data.goodsMoney = Number(data.goodsMoney) || 0;
                            data.sort = Number(data.sort) || 1;

                            // 处理地区费用数组中的数字字段
                            if (Array.isArray(data.areaFee)) {
                                data.areaFee = data.areaFee.map((item) => ({
                                    ...item,
                                    firstUnitAreaPrice: Number(item.firstUnitAreaPrice) || 0,
                                    continueUnitAreaPrice: Number(item.continueUnitAreaPrice) || 0,
                                }));
                            }

                            const _result = await this.$api.ship.save(data);
                            if (_result.succeed === 1 && _result.code === 200) {
                                this.$notify({
                                    title: this.$t('common.success'),
                                    message: _result.description,
                                    type: 'success',
                                });
                                this.$router.push({ path: '/preference/ship' });
                            } else {
                                this.$notify.error({
                                    title: this.$t('common.error'),
                                    message: _result.description,
                                });
                            }
                        } catch (error) {
                            this.$notify.error({
                                title: this.$t('common.error'),
                                message: '保存配送方式失败',
                            });
                        } finally {
                            this.editLoading = false;
                        }
                    });
                }
            });
        },

        resetForm(formName) {
            this.$refs[formName].resetFields();
            // 重置表单数据到初始状态
            this.formData = {
                id: 0,
                name: '',
                logiCode: '',
                freePostage: true,
                hasCod: false,
                isDef: false,
                state: true,
                firstUnit: '',
                continueUnit: '',
                firstUnitPrice: 0,
                continueUnitPrice: 0,
                sort: 1,
                goodsMoney: 0,
                type: 1,
                areaFee: [],
            };
        },
    },
};
</script>

<style scoped lang="scss">
.tip-info {
    margin-left: 10px;
    color: #909399;
}
</style>
