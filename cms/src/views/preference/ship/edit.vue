<template>
    <div class="page-container">
        <!--新增编辑界面-->
        <el-form
            ref="formData"
            :model="formData"
            :rules="formDataRules"
            :size="largeSize"
            class="edit-dialog-container"
            label-width="100px"
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
                            <el-form-item label="配送方式:" prop="name">
                                <el-input
                                    v-model="formData.name"
                                    placeholder="请输入配送方式名称"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="物流公司:" prop="logiCode">
                                <el-select v-model="formData.logiCode" placeholder="请选择">
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
                            <el-form-item label="是否包邮:" prop="freePostage">
                                <el-switch
                                    v-model="formData.freePostage"
                                    active-text="是"
                                    inactive-text="否"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="货到付款:" prop="hasCod">
                                <el-switch
                                    v-model="formData.hasCod"
                                    active-text="是"
                                    inactive-text="否"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="是否默认:" prop="isDef">
                                <el-switch
                                    v-model="formData.isDef"
                                    active-text="是"
                                    inactive-text="否"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="是否启用:" prop="state">
                                <el-switch
                                    v-model="formData.state"
                                    active-text="是"
                                    inactive-text="否"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="重量设置:">
                        <el-col :span="8">
                            首重
                            <el-select v-model="formData.firstUnit" placeholder="请选择">
                                <el-option
                                    v-for="(val, key, index) in mapAlias.ship_unit"
                                    :key="index"
                                    :label="val"
                                    :value="key"
                                />
                            </el-select>
                        </el-col>
                        <el-col :span="8">
                            续重
                            <el-select v-model="formData.continueUnit" placeholder="请选择">
                                <el-option
                                    v-for="(val, key, index) in mapAlias.ship_unit"
                                    :key="index"
                                    :label="val"
                                    :value="key"
                                />
                            </el-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="配送费用:">
                        <el-col :span="6">
                            首重
                            <el-input-number
                                v-model="formData.firstunitPrice"
                                :max="10"
                                :min="1"
                                controls-position="right"
                                label="请输入首重配送费用"
                            />
                        </el-col>
                        <el-col :span="6">
                            续重
                            <el-input-number
                                v-model="formData.continueUnitPrice"
                                :max="10"
                                :min="1"
                                controls-position="right"
                                label="请输入续重配送费用"
                            />
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="排序:" prop="sort">
                                <el-input-number
                                    v-model="formData.sort"
                                    :max="100"
                                    :min="0"
                                    controls-position="right"
                                    label="请输入顺序码"
                                />
                            </el-form-item>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="商品满多少" prop="goodsMoney">
                        <el-input-number
                            v-model="formData.goodsMoney"
                            :max="99"
                            :min="0"
                            controls-position="right"
                            label="请输入数量"
                        />
                        <span class="tip-info">免运费（此项大于0时参与计算）</span>
                    </el-form-item>
                    <el-form-item label="地区类型:" prop="type">
                        <el-col :span="6">
                            <el-radio-group v-model="formData.type">
                                <el-radio :label="1">所有</el-radio>
                                <el-radio :label="2">部分</el-radio>
                            </el-radio-group>
                        </el-col>
                        <span class="tip-info">设置部分地区后，未配置地区采用默认配置</span>
                    </el-form-item>

                    <el-table
                        v-if="formData.type === 2"
                        :data="formData.areaFee"
                        style="width: 100%"
                    >
                        <el-table-column
                            label="地区列表"
                            min-width="280"
                            prop="areas"
                            show-overflow-tooltip
                        >
                            <template #default="scope">
                                {{ scope.row.areas.map((v) => v.name).join(',') }}
                            </template>
                        </el-table-column>
                        <el-table-column label="选择" min-width="130" prop="areas">
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
                        <el-table-column label="首重费用" min-width="130" prop="firstUnitAreaPrice">
                            <template #default="scope">
                                <el-input
                                    v-model="scope.row.firstUnitAreaPrice"
                                    :size="largeSize"
                                    placeholder="请输入首重费用"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="续重费用"
                            min-width="130"
                            prop="continueUnitAreaPrice"
                        >
                            <template #default="scope">
                                <el-input
                                    v-model="scope.row.continueUnitAreaPrice"
                                    :size="largeSize"
                                    placeholder="请输入续重费用"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column align="center" fixed="right" label="操作" min-width="80">
                            <template #header>
                                <el-button
                                    round
                                    size="mini"
                                    style="float: right"
                                    type="primary"
                                    @click.prevent="handleAddAreaFee()"
                                >
                                    添加
                                </el-button>
                            </template>
                            <template #default="scope">
                                <el-button
                                    circle
                                    icon="el-icon-delete"
                                    size="mini"
                                    type="danger"
                                    @click="handleDeleteAreaFee(scope.row.idx)"
                                />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16" class="footer">
                    <el-button :size="largeSize" round @click="resetForm('formData')">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button
                        :loading="editLoading"
                        :size="largeSize"
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
import { mapState, mapActions } from 'vuex';
import breadCrumb from '@/components/bread_crumb.vue';
import pickArea from '@/components/pick_area';
export default {
    components: {
        breadCrumb,
        pickArea,
    },
    computed: {
        ...mapState(['mapAlias']),
    },
    data() {
        let _self = this;
        const checkPrice = (rule, value, callback) => {
            var reg = /^-?\d{1,5}(?:\.\d{1,3})?$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('请输入大于零小于十万不超过三位小数的数字'));
            }
        };
        return {
            largeSize: 'large',
            miniSize: 'default',
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
                firstunitPrice: '', // 首重费用
                continueUnitPrice: '', // 续重费用

                sort: 1, // 排序
                goodsMoney: 0, // 商品满多少
                type: 1, // 地区类型
                areaFee: [], // 其它地区列表
            },
            formDataRules: {
                name: [{ required: true, message: '请输入配送方式名称', trigger: 'blur' }],
                price: [
                    { required: true, message: '请输入价格', trigger: 'blur' },
                    { validator: checkPrice, trigger: 'blur' },
                ],
            },
        };
    },
    async mounted() {
        this.isCreating = this.$route.query.isCreating;
        await this.getLogistics();

        const _id = this.$route.query.shipId;
        if (_id) {
            const _result = await this.$api.ship.get({ id: _id });
            if (_result.succeed === 1 && _result.code === 200) {
                this.formData = Object.assign({}, _result.data);
            }
        }
    },
    methods: {
        chosedAreas(areaIds, row) {
            row['areas'] = areaIds;
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
            }
        },
        async getLogistics() {
            const _result = await this.$api.logistics.list({});
            if (_result.succeed === 1 && _result.code === 200) {
                this.logistics = _result.data.list;
            }
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, this.formData);

                        const _result = await this.$api.ship.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            this.$notify({
                                title: '成功',
                                message: _result.description,
                                type: 'success',
                            });
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: _result.description,
                            });
                        }

                        this.editLoading = false;

                        this.$router.push({ path: '/preference/ship' });
                    });
                }
            });
        },

        resetForm(formName) {
            this.$refs[formName].resetFields();
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
