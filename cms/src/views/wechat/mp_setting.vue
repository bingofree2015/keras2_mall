<template>
    <div class="page-container">
        <!--导航-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
        </el-row>
        <!--表单-->
        <el-form
            ref="formData"
            :model="formData"
            :rules="formDataRules"
            :size="normalSize"
            class="edit-dialog-container"
            label-width="150px"
        >
            <el-row>
                <el-col :span="16">
                    <el-form-item :label="$t('wechat.interfaceAddress')">
                        http://localhost:8085/wechat
                    </el-form-item>
                    <el-form-item :label="$t('wechat.officialAccountName')" prop="wx_official_name">
                        <el-col :span="12">
                            <el-input
                                v-model="formData.wx_official_name"
                                :placeholder="$t('wechat.inputOfficialName')"
                            />
                        </el-col>
                    </el-form-item>
                    <el-form-item :label="$t('wechat.wechatId')" prop="wx_official_id">
                        <el-col :span="12">
                            <el-input
                                v-model="formData.wx_official_id"
                                :placeholder="$t('wechat.inputWechatId')"
                            />
                        </el-col>
                    </el-form-item>
                    <el-form-item :label="$t('wechat.appId')" prop="wx_official_appid">
                        <el-col :span="12">
                            <el-input
                                v-model="formData.wx_official_appid"
                                :placeholder="$t('wechat.inputAppId')"
                            />
                        </el-col>
                    </el-form-item>
                    <el-form-item :label="$t('wechat.appSecret')" prop="wx_official_app_secret">
                        <el-col :span="12">
                            <el-input
                                v-model="formData.wx_official_app_secret"
                                :placeholder="$t('wechat.inputAppSecret')"
                            />
                        </el-col>
                    </el-form-item>
                    <el-form-item :label="$t('wechat.originalId')" prop="wx_official_source_id">
                        <el-col :span="12">
                            <el-input
                                v-model="formData.wx_official_source_id"
                                :placeholder="$t('wechat.inputOriginalId')"
                            />
                        </el-col>
                    </el-form-item>
                    <el-form-item :label="$t('wechat.verifyToken')" prop="wx_official_token">
                        <el-col :span="12">
                            <el-input
                                v-model="formData.wx_official_token"
                                :placeholder="$t('wechat.inputVerifyToken')"
                            />
                        </el-col>
                    </el-form-item>
                    <el-form-item
                        :label="$t('wechat.encodingAesKey')"
                        prop="wx_official_encodeaeskey"
                    >
                        <el-col :span="10">
                            <el-input
                                v-model="formData.wx_official_encodeaeskey"
                                :placeholder="$t('wechat.inputEncodingAesKey')"
                            />
                        </el-col>
                        <span class="tip-info">
                            <i class="el-icon-ali-tishi"></i>
                            {{ $t('wechat.encodingAesKeyTip') }}
                        </span>
                    </el-form-item>
                    <el-form-item :label="$t('wechat.officialType')" prop="wx_official_type">
                        <el-radio-group v-model="formData.wx_official_type">
                            <el-radio value="service">
                                {{ $t('wechat.serviceAccount') }}
                            </el-radio>
                            <el-radio value="subscribe">
                                {{ $t('wechat.subscriptionAccount') }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
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
        </el-form>
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
            // miniSize: 'default', // 删除 miniSize
            editLoading: false,
            // 编辑界面数据
            formData: {
                wx_official_name: '', // 公众号名称
                wx_official_id: '', // 微信号
                wx_official_appid: '', // AppId
                wx_official_app_secret: '', // AppSecret
                wx_official_source_id: '', // 公众号原始ID
                wx_official_token: '', // 微信验证TOKEN
                wx_official_encodeaeskey: '', // EncodingAESKey
                wx_official_type: 'formData', // 公众号类型
            },
            formDataRules: {
                wx_official_name: [
                    {
                        required: true,
                        message: this.$t('wechat.inputOfficialName'),
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    async mounted() {
        await this.getSettings();
    },
    methods: {
        // 提交表单
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

                        const _result = await this.$api.setting.save({
                            key: 'mp_setting',
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
                    });
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        async getSettings() {
            const _result = await this.$api.setting.get({ key: 'mp_setting' });
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
