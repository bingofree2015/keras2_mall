<template>
    <!--个人中心界面-->
    <el-dialog
        :close-on-click-modal="false"
        :modal="false"
        class="edit-dialog-container"
        :title="$t('editUserInfo.dialogTitle')"
        v-bind="$attrs"
        width="40%"
        v-on="$attrs"
    >
        <el-form
            ref="formData"
            :model="formData"
            :rules="formDataRules"
            :size="size"
            label-width="80px"
        >
            <el-row>
                <el-col :span="14" class="top-bar">
                    <el-form-item :label="$t('editUserInfo.username')" prop="username">
                        {{ formData.username }}
                    </el-form-item>
                    <el-form-item :label="$t('editUserInfo.role')" prop="roles">
                        {{ formData.roles ? formData.roles.map((v) => v.remark).toString() : '' }}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item :label="$t('editUserInfo.avatar')" prop="attachment">
                        <change-image-icon
                            :img-url="formData.attachment ? formData.attachment.path : ''"
                            @chosed-image-icon="chosedIcon"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="$t('editUserInfo.email')" prop="email">
                        <el-input v-model="formData.email" auto-complete="off" type="email" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('editUserInfo.mobile')" prop="mobile">
                        <el-input v-model.number="formData.mobile" auto-complete="off" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button :size="size" round @click="$emit('update:modelValue', false)">
                    {{ $t('action.cancel') }}
                </el-button>
                <el-button
                    :loading="editLoading"
                    :size="size"
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
import { mapState, mapMutations } from 'vuex';
import changeImageIcon from '@/components/change_image_icon.vue';
export default {
    components: {
        changeImageIcon,
    },
    props: {
        size: {
            type: String,
            default: 'mini',
        },
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    data() {
        const checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error(this.$t('editUserInfo.mobileRequired')));
            } else {
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                console.log(value, reg.test(value));
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error(this.$t('editUserInfo.mobileFormatError')));
                }
            }
        };

        return {
            editLoading: false,
            formDataRules: {
                email: [
                    {
                        required: true,
                        message: this.$t('editUserInfo.emailRequired'),
                        trigger: 'blur',
                    },
                    { type: 'email', message: this.$t('editUserInfo.emailFormatError') },
                ],
                mobile: [
                    {
                        required: true,
                        message: this.$t('editUserInfo.mobileInputRequired'),
                        trigger: 'blur',
                    },
                    { required: true, validator: checkPhone, trigger: 'blur' },
                ],
            },
            formData: {
                id: 0,
                attachmentId: 0,
                attachment: {
                    id: 0,
                    path: '',
                },
                email: '',
                mobile: '',
            },
        };
    },
    computed: {
        ...mapState(['loginUser']),
    },
    mounted() {
        // 编辑界面数据
        this.formData = this.loginUser;
    },
    methods: {
        ...mapMutations(['setLoginUser']),
        chosedIcon(chosen) {
            this.formData.attachmentId = chosen.id;
            this.formData.attachment = chosen;
        },
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(this.$t('common.confirmSubmit'), this.$t('common.tip'), {}).then(
                        async () => {
                            this.editLoading = true;
                            const data = Object.assign(
                                {},
                                _.pick(
                                    this.formData,
                                    'id',
                                    'attachment',
                                    'attachmentId',
                                    'email',
                                    'mobile'
                                )
                            );

                            const _result = await this.$api.sysUser.save(data);
                            this.editLoading = false;
                            if (_result.succeed === 1 && _result.code === 200) {
                                this.$notify({
                                    title: this.$t('common.success'),
                                    message: _result.description,
                                    type: 'success',
                                });
                                this.setLoginUser(this.formData);
                                this.$emit('update:modelValue', false);
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

<style lang="scss">
.el-form-item__content {
    text-align: left;
}
.icon-avatar {
    width: 80px;
    height: 80px;
    border-radius: 90px;
}
.icon-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.icon-uploader .el-upload:hover {
    border-color: #409eff;
}
.upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    display: block;
}
</style>
