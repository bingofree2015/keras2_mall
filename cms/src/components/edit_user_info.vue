<template>
    <!--个人中心界面-->
    <el-dialog
        :close-on-click-modal="false"
        :modal="false"
        class="edit-dialog-container"
        title="个人中心"
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
                    <el-form-item label="用户名" prop="username">
                        {{ formData.username }}
                    </el-form-item>
                    <el-form-item label="角色" prop="roles">
                        {{ formData.roles ? formData.roles.map((v) => v.remark).toString() : '' }}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="头像" prop="attachment">
                        <change-image-icon
                            :img-url="formData.attachment ? formData.attachment.path : ''"
                            @chosed-image-icon="chosedIcon"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="formData.email" auto-complete="off" type="email" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model.number="formData.mobile" auto-complete="off" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button :size="size" round @click.native="$emit('update:visible', false)">
                    {{ $t('action.cancel') }}
                </el-button>
                <el-button
                    :loading="editLoading"
                    :size="size"
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
    data() {
        const checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号不能为空'));
            } else {
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                console.log(value, reg.test(value));
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error('请输入正确的手机号'));
                }
            }
        };

        return {
            editLoading: false,
            formDataRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不合法' },
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
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
    methods: {
        ...mapMutations(['setLoginUser']),
        chosedIcon(chosen) {
            this.formData.attachmentId = chosen.id;
            this.formData.attachment = chosen;
        },
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
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
                                title: '成功',
                                message: _result.description,
                                type: 'success',
                            });
                            this.setLoginUser(this.formData);
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
    mounted() {
        // 编辑界面数据
        this.formData = this.loginUser;
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
