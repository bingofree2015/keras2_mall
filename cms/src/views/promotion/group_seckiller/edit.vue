<template>
    <div class="page-container edit-dialog-container">
        <el-row>
            <el-col :span="24">
                <bread-crumb />
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="16">
                <!--新增编辑界面-->
                <el-form
                    ref="formData"
                    :model="formData"
                    :rules="formDataRules"
                    :size="normalSize"
                    label-width="100px"
                >
                    <el-divider content-position="left">
基本信息
</el-divider>
                    <el-form-item label="活动名称" prop="name">
                        <el-col :span="14">
                            <el-input v-model="formData.name" placeholder="请输入活动名称" />
                        </el-col>
                        <span class="tip-info">
                            <i class="el-icon-ali-tishi"></i>
                            团购名称会显示到前台，请合理输入此名称
                        </span>
                    </el-form-item>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="状态" prop="state">
                                <el-switch
                                    v-model="formData.state"
                                    active-text="启用"
                                    inactive-text="禁用"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="权重" prop="sort">
                                <el-input-number v-model="formData.sort" :max="10" :min="1" />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    数字越小，权重越大
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="类型" prop="type">
                                <el-radio-group v-model="formData.type">
                                    <el-radio :value="3">
团购
</el-radio>
                                    <el-radio :value="4">
秒杀
</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="起止时间" prop="rangeTime">
                                <el-date-picker
                                    v-model="formData.rangeTime"
                                    end-placeholder="结束日期"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    style="width: 360px"
                                    type="datetimerange"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="选择商品">
                        <el-col :span="16">
                            <el-input
                                v-model="formData.spTarget.pattern.name"
                                :size="normalSize"
                                readonly
                            >
                                <template #append>
                                    <pick-goods
                                        :selection-type="0"
                                        @chosed-goods="
                                            (goods) => {
                                                chosedGoods(goods, formData.spTarget);
                                            }
                                        "
                                    />
                                </template>
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="选择促销条件" prop="rule">
                        <el-select
                            v-model="formData.spRule.code"
                            :placeholder="$t('permission.pleaseSelect')"
                            @change="changeRuleType"
                        >
                            <el-option
                                v-for="(item, key, idx) in ruleTypes"
                                :key="idx"
                                :label="item.name"
                                :value="key"
                            />
                        </el-select>
                    </el-form-item>
                    <el-col
                        v-if="ruleTypes[formData.spRule.code]"
                        :span="12"
                        class="rules-container"
                    >
                        <div v-if="formData.spRule.code === 'GOODS_REDUCE'">
                            <!--指定商品减固定金额-->
                            <el-form-item label="条件">
无需设置任何条件
</el-form-item>
                            <el-form-item label="金额">
                                <el-input-number
                                    v-model="formData.spRule.pattern.money"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    商品优惠的金额
                                </span>
                            </el-form-item>
                        </div>
                        <div v-else-if="formData.spRule.code === 'GOODS_DISCOUNT'">
                            <!--指定商品打X折-->
                            <el-form-item label="折扣">
                                <el-input-number
                                    v-model="formData.spRule.pattern.discount"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    大于0小于10的数字
                                </span>
                            </el-form-item>
                        </div>
                        <div v-else-if="formData.spRule.code === 'GOODS_ONE_PRICE'">
                            <!--指定商品一口价-->
                            <el-form-item label="金额">
                                <el-input-number
                                    v-model="formData.spRule.pattern.money"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    商品的固定价格
                                </span>
                            </el-form-item>
                        </div>
                        <div v-else-if="formData.spRule.code === 'ORDER_REDUCE'">
                            <!--订单减指定金额-->
                            <el-form-item label="金额">
                                <el-input-number
                                    v-model="formData.spRule.pattern.money"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    订单总价减XX钱
                                </span>
                            </el-form-item>
                        </div>
                        <div v-else-if="formData.spRule.code === 'ORDER_DISCOUNT'">
                            <!--订单打X折-->
                            <el-form-item label="折扣">
                                <el-input-number
                                    v-model="formData.spRule.pattern.discount"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    大于0小于10的数字
                                </span>
                            </el-form-item>
                        </div>
                        <div v-else-if="formData.spRule.code === 'GOODS_HALF_PRICE'">
                            <!--指定商品每第几件减指定金额-->
                            <el-form-item label="第几件">
                                <el-input-number
                                    v-model="formData.spRule.pattern.num"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    每第几件商品
                                </span>
                            </el-form-item>
                            <el-form-item label="优惠金额">
                                <el-input-number
                                    v-model="formData.spRule.pattern.money"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    减去的固定价格
                                </span>
                            </el-form-item>
                        </div>
                        <el-form-item>
                            <el-button
                                :size="normalSize"
                                round
                                style="float: right"
                                type="primary"
                                @click="addRule"
                            >
                                添加规则
                            </el-button>
                        </el-form-item>
                    </el-col>
                    <el-table :data="formData.spRules" :size="normalSize" stripe style="width: 100%">
                        <el-table-column label="结果代码" min-width="180" prop="code" />
                        <el-table-column label="结果名称" min-width="180" prop="name" />
                        <el-table-column label="参数" min-width="280" prop="pattern">
                            <template #default="scope">
                                <span>{{ scope.row.pattern }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" min-width="88" prop="operation">
                            <template #default="scope">
                                <ext-button
                                    :label="$t('action.delete')"
                                    :size="normalSize"
                                    icon="el-icon-ali-shanchu"
                                    type="danger"
                                    @click="deleteRule(scope.$index)"
                                />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="16" class="footer">
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
    </div>
</template>

<script>
import _ from 'lodash';
import breadCrumb from '@/components/bread_crumb.vue';
import pickGoods from '@/components/pick_goods';
import extButton from '@/components/core/ext_button.vue';
export default {
    components: {
        breadCrumb,
        pickGoods,
        extButton,
    },
    data() {
        return {
            normalSize: 'default',
            isCreating: false, // true:新增, false:编辑
            editLoading: false,
            ruleTypes: {}, // 结果类型
            // 新增编辑界面数据
            formData: {
                id: 0, // 商品ID
                name: '', // 促销名称
                state: true, // 启用状态 1:开启 2:关闭
                type: 3, // 类型 1:促销 2:优惠券 3:团购 4:秒杀
                sort: 0, // 排序
                params: null, // 其它参数
                rangeTime: [null, null], // 开始时间  -  结束时间
                spTarget: {
                    code: '',
                    name: '',
                    pattern: {}, // {"goods_id":"7","nums":"1"}
                },
                spTargets: [],
                spRule: {
                    code: '',
                    name: '',
                    pattern: {},
                }, // 选择的结果
                spRules: [],
            },
            formDataRules: {
                name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
            },
        };
    },
    async mounted() {
        this.isCreating = this.$route.query.isCreating;
        let _id = this.$route.query.id;
        if (_id && _id > 0) {
            let _result = await this.$api.promotion.get({ id: _id });
            if (_result.succeed == 1 && _result.code == 200) {
                this.formData = Object.assign(this.formData, _result.data);
                this.formData.spTarget =
                    Array.isArray(this.formData.spTargets) && this.formData.spTargets.length > 0
                        ? this.formData.spTargets[0]
                        : { code: '', pattern: {} };
                this.formData.spRule = {
                    code: '',
                    name: '',
                    pattern: {},
                };
            }
        }
        await this.getResultTypes();
    },
    methods: {
        chosedGoods(goods, spTarget) {
            spTarget['code'] = 'GOODS_IDS';
            spTarget['name'] = '指定某些商品满足条件';
            spTarget['pattern'] = { id: goods.id, name: goods.name };
            let _target = _.cloneDeep(this.formData.spTarget);
            let _findTarget = this.formData.spTargets.find((v) => v.code === _target.code);
            if (_findTarget) {
                Object.assign(_findTarget, _target);
            } else {
                this.formData.spTargets.unshift(_target);
            }
        },
        async getResultTypes() {
            const _result = await this.$api.spRule.getRuleTypes();
            if (_result.succeed === 1 && _result.code === 200) {
                this.ruleTypes = _result.data;
            }
        },
        changeRuleType(ruleType) {
            Object.assign(this.formData.spRule, { name: '', pattern: {} });
        },
        addRule() {
            let _rule = _.cloneDeep(this.formData.spRule);
            _rule.name = this.ruleTypes[_rule.code].name;
            let _findRule = this.formData.spRules.find((v) => v.code === _rule.code);
            if (_findRule) {
                Object.assign(_findRule, _rule);
            } else {
                this.formData.spRules.unshift(_rule);
            }
        },
        deleteRule(idx) {
            this.formData.spRules.splice(idx, 1);
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
                        this.editLoading = true;
                        const data = Object.assign({}, this.formData);
                        if (Array.isArray(data.rangeTime) && data.rangeTime.length == 2) {
                            data['startTime'] = data.rangeTime[0];
                            data['endTime'] = data.rangeTime[1];
                            delete data.rangeTime;
                        }
                        delete data.spTarget;
                        delete data.spRule;
                        const _result = await this.$api.promotion.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            this.$notify({
                                title: this.$t('common.success'),
                                message: _result.description,
                                type: 'success',
                            });
                        } else {
                            this.$notify.error({
                                title: this.$t('common.error'),
                                message: _result.description,
                            });
                        }
                        this.editLoading = false;
                        this.$router.push({ path: '/promotion/group_seckiller' });
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

<style lang="scss" scoped>
.rules-container {
    padding: 10px;
    border: 1px dashed #e4e7ed;
    border-radius: 4px;
}
.tip-info {
    margin-left: 10px;
    font-size: 12px;
    color: #909399;
}
</style>
