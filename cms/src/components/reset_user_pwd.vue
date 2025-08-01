<template>
    <!--修改密码界面-->
    <el-dialog
        :close-on-click-modal="false"
        :modal="false"
        :title="$t('resetPassword.title')"
        v-bind="$attrs"
        width="30%"
    >
        <el-form
            ref="formData"
            :model="formData"
            :rules="formDataRules"
            :size="size"
            label-position="right"
            label-width="80px"
        >
            <el-form-item v-if="false" label="ID" prop="id">
                <el-input v-model="formData.id" :disabled="true" auto-complete="off" />
            </el-form-item>
            <el-form-item :label="$t('resetPassword.username')" prop="username">
                {{ formData.username }}
            </el-form-item>
            <el-form-item :label="$t('resetPassword.oldPassword')" prop="oldPwd">
                <el-input
                    v-model="formData.pwd"
                    :placeholder="$t('resetPassword.inputPassword')"
                    show-password
                    type="password"
                />
            </el-form-item>
            <el-form-item :label="$t('resetPassword.newPassword')" prop="newPwd">
                <el-input
                    v-model="formData.newPwd"
                    :placeholder="$t('resetPassword.inputNewPassword')"
                    show-password
                    type="password"
                />
            </el-form-item>
            <el-form-item :label="$t('resetPassword.confirmPassword')" prop="reNewPwd">
                <el-input
                    v-model="formData.reNewPwd"
                    :placeholder="$t('resetPassword.inputConfirmPassword')"
                    show-password
                    type="password"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button :size="size" round @click="$emit('update:visible', false)">
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
import { mapState } from 'vuex';
export default {
    props: {
        size: {
            type: String,
            default: 'mini',
        },
    },
    emits: ['update:visible'],
    data() {
        return {
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                pwd: '',
                newPwd: '',
                reNewPwd: '',
            },
        };
    },
    computed: {
        ...mapState(['loginUser']),
        formDataRules() {
            const validatePass = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('resetPassword.pleaseEnterNewPassword')));
                } else if (value.toString().length < 6 || value.toString().length > 18) {
                    callback(new Error(this.$t('resetPassword.passwordLengthLimit')));
                } else {
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('resetPassword.pleaseEnterPasswordAgain')));
                } else if (value !== this.formData.newPwd) {
                    callback(new Error(this.$t('resetPassword.passwordMismatch')));
                } else {
                    callback();
                }
            };

            return {
                pwd: [
                    {
                        required: true,
                        message: this.$t('resetPassword.pleaseEnterPassword'),
                        trigger: 'blur',
                    },
                ],
                newPwd: [
                    {
                        required: true,
                        message: this.$t('resetPassword.pleaseEnterNewPassword'),
                        trigger: 'blur',
                    },
                    { required: true, validator: validatePass, trigger: 'blur' },
                ],
                reNewPwd: [
                    {
                        required: true,
                        message: this.$t('resetPassword.pleaseEnterConfirmPassword'),
                        trigger: 'blur',
                    },
                    { required: true, validator: validatePass2, trigger: 'blur' },
                ],
            };
        },
    },
    mounted() {
        this.formData = _.pick(this.loginUser, 'id', 'username', 'pwd');
    },
    methods: {
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(this.$t('common.confirmSubmit'), this.$t('common.tip'), {}).then(
                        async () => {
                            this.editLoading = true;
                            const data = Object.assign(
                                {},
                                _.pick(this.formData, 'id', 'pwd', 'newPwd')
                            );

                            const _result = await this.$api.sysUser.resetPwd(data);
                            this.editLoading = false;
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

<style lang="scss">
.el-form-item__content {
    text-align: left;
}
</style>
