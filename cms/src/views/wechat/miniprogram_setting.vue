<template>
    <div class="page-container edit-dialog-container">
        <!--导航-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
        </el-row>

        <!--表单-->
        <el-row>
            <el-col :span="16">
                <el-form
                    ref="formData"
                    :model="formData"
                    :rules="formDataRules"
                    :size="normalSize"
                    label-width="200px"
                >
                    <el-form-item :label="$t('wechat.miniprogram.requestDomain')">
                        http://localhost:8085
                    </el-form-item>
                    <el-form-item :label="$t('wechat.miniprogram.socketDomain')">
                        http://localhost:8085
                    </el-form-item>
                    <el-form-item :label="$t('wechat.miniprogram.uploadFileDomain')">
                        http://localhost:8085
                    </el-form-item>
                    <el-form-item :label="$t('wechat.miniprogram.downloadFileDomain')">
                        http://localhost:8085
                    </el-form-item>
                    <el-form-item :label="$t('wechat.miniprogram.name')" prop="wx_nick_name">
                        <el-col :span="12">
                            <el-input
                                v-model="formData.wx_nick_name"
                                :placeholder="$t('wechat.miniprogram.inputName')"
                            />
                        </el-col>
                    </el-form-item>
                    <el-form-item :label="$t('wechat.miniprogram.appid')" prop="wx_appid">
                        <el-col :span="8">
                            <el-input
                                v-model="formData.wx_appid"
                                :placeholder="$t('wechat.miniprogram.inputAppid')"
                            />
                        </el-col>
                        <span class="tip-info">
                            <i class="el-icon-ali-tishi"></i>
                            {{ $t('wechat.miniprogram.copyTip') }}
                        </span>
                    </el-form-item>
                    <el-form-item :label="$t('wechat.miniprogram.appSecret')" prop="wx_app_secret">
                        <el-col :span="8">
                            <el-input
                                v-model="formData.wx_app_secret"
                                :placeholder="$t('wechat.miniprogram.inputAppSecret')"
                            />
                        </el-col>
                        <span class="tip-info">
                            <i class="el-icon-ali-tishi"></i>
                            {{ $t('wechat.miniprogram.copyTip') }}
                        </span>
                    </el-form-item>
                    <el-form-item :label="$t('wechat.miniprogram.originId')" prop="wx_user_name">
                        <el-col :span="8">
                            <el-input
                                v-model="formData.wx_user_name"
                                :placeholder="$t('wechat.miniprogram.inputOriginId')"
                            />
                        </el-col>
                        <span class="tip-info">
                            <i class="el-icon-ali-tishi"></i>
                            {{ $t('wechat.miniprogram.copyTip') }}
                        </span>
                    </el-form-item>
                    <el-form-item
                        :label="$t('wechat.miniprogram.principal')"
                        prop="wx_principal_name"
                    >
                        <el-col :span="8">
                            <el-input
                                v-model="formData.wx_principal_name"
                                :placeholder="$t('wechat.miniprogram.inputPrincipal')"
                            />
                        </el-col>
                        <span class="tip-info">
                            <i class="el-icon-ali-tishi"></i>
                            {{ $t('wechat.miniprogram.copyTip') }}
                        </span>
                    </el-form-item>
                    <el-form-item :label="$t('wechat.miniprogram.signature')" prop="wx_signature">
                        <el-input
                            v-model="formData.wx_signature"
                            :autosize="{ minRows: 4, maxRows: 8 }"
                            :placeholder="$t('wechat.miniprogram.inputSignature')"
                            type="textarea"
                        />
                    </el-form-item>
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
import breadCrumb from '@/components/bread_crumb.vue';
export default {
    components: {
        breadCrumb,
    },
    data() {
        return {
            normalSize: 'default',
            // miniSize: 'mini', // 删除 miniSize

            editLoading: false,
            // 编辑界面数据
            formData: {
                wx_nick_name: '', // 小程序名称
                wx_appid: '', // AppId
                wx_app_secret: '', // AppSecret
                wx_user_name: '', // 原始Id
                wx_principal_name: '', // 主体信息
                wx_signature: '', // 简介
            },
        };
    },
    computed: {
        // 响应式的 formDataRules 配置
        formDataRules() {
            return {
                wx_nick_name: [
                    {
                        required: true,
                        message: this.$t('wechat.miniprogram.inputName'),
                        trigger: 'blur',
                    },
                ],
                wx_appid: [
                    {
                        required: true,
                        message: this.$t('wechat.miniprogram.inputAppid'),
                        trigger: 'blur',
                    },
                ],
                wx_app_secret: [
                    {
                        required: true,
                        message: this.$t('wechat.miniprogram.inputAppSecret'),
                        trigger: 'blur',
                    },
                ],
            };
        },
    },
    async mounted() {
        await this.getSettings();
    },
    methods: {
        // 提交表单
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(this.$t('common.confirmSubmit'), this.$t('common.tip'), {}).then(
                        async () => {
                            this.editLoading = true;
                            const data = Object.assign({}, this.formData);

                            const _result = await this.$api.setting.save({
                                key: 'miniprogram_setting',
                                value: data,
                            });
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
                        }
                    );
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        async getSettings() {
            const _result = await this.$api.setting.get({ key: 'miniprogram_setting' });
            if (_result.succeed === 1 && _result.code === 200) {
                Object.assign(this.formData, _result.data);
                console.log(this.formData);
            }
        },
    },
};
</script>

<style scoped lang="scss">
.page-container {
    padding: 20px;
}

.edit-dialog-container {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.tip-info {
    margin-left: 10px;
    font-size: 12px;
    color: #909399;
    display: flex;
    align-items: center;

    i {
        margin-right: 4px;
    }
}

.footer {
    margin-top: 20px;
    text-align: right;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
}

// 响应式设计
@media (max-width: 768px) {
    .page-container {
        padding: 15px;
    }

    .edit-dialog-container {
        padding: 15px;
    }
}
</style>
