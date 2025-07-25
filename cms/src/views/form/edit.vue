<template>
    <div class="page-container">
        <!--新增编辑界面-->
        <el-form
            ref="formData"
            :model="formData"
            :rules="formDataRules"
            :size="largeSize"
            class="edit-dialog-container"
            label-width="80px"
        >
            <el-row>
                <el-col :span="24">
                    <bread-crumb />
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="表单名称" prop="name">
                                <el-input v-model="formData.name" placeholder="请输入表单名称" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="表单类型" prop="type">
                                <el-select v-model="formData.type" placeholder="请选择表单类型">
                                    <el-option
                                        v-for="item in typeList"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="表头类型" prop="headType">
                        <el-radio-group v-model="formData.headType">
                            <el-radio
                                v-for="item in headTypeList"
                                v-for="item in headTypeList"
                                :key="item.key"
                                :label="item.key"
                            >
                                {{ item.value }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="headType-container">
                        <template v-if="formData.headType === 1">
                            <change-image-icon
                                :img-url="formData.headTypeValues[0].path"
                                @chosed-image-icon="chosedHeadImage"
                            />
                        </template>
                        <template v-if="formData.headType === 2">
                            <el-row>
                                <el-col :span="24">
                                    <draggable-image-list
                                        :items="formData.headTypeValues"
                                        :size="74"
                                        @chosed-image="chosedImage"
                                        @end="end"
                                        @on-remove="onRemove"
                                    />
                                </el-col>
                            </el-row>
                        </template>
                        <template v-if="formData.headType === 3">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-input
                                        v-model="formData.headTypeVideo"
                                        :size="largeSize"
                                        placeholder="请上传视频"
                                        readonly
                                    >
                                        <el-upload
                                            #append
                                            :action="'cms/upload?pathType=form'"
                                            :before-upload="beforeUpload"
                                            :headers="headers"
                                            :on-success="uploadSuccess"
                                            :show-file-list="false"
                                        >
                                            <el-button>
                                                <i class="el-icon-ali-camera_rec"></i>
                                            </el-button>
                                        </el-upload>
                                    </el-input>
                                </el-col>
                                <el-col :span="3">
                                    <change-image-icon
                                        :img-url="
                                            formData.headTypeValues[0]
                                                ? formData.headTypeValues[0].path
                                                : ''
                                        "
                                        :init-style="{
                                            height: '30px',
                                            width: '30px',
                                            border: '1px dashed #d9d9d9',
                                            borderRadius: '50%',
                                        }"
                                        @chosed-image-icon="chosedHeadImage"
                                    />
                                </el-col>
                            </el-row>
                        </template>
                    </div>
                    <el-form-item label="表单描述" prop="desc">
                        <el-input
                            v-model="formData.desc"
                            maxlength="30"
                            placeholder="请输入表单描述"
                            show-word-limit
                            type="textarea"
                        />
                    </el-form-item>
                    <el-form-item label="表单字段" prop="formItems">
                        <el-table
                            :data="formData.formItems"
                            :size="largeSize"
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column label="名称" min-width="140" prop="name">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.name"
                                        :size="largeSize"
                                        placeholder="请输入名称"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="类型" min-width="130" prop="type">
                                <template #default="scope">
                                    <el-select
                                        v-model="scope.row.type"
                                        :size="largeSize"
                                        placeholder="选择类型"
                                        @change="
                                            (val) => {
                                                changeItemType(val, scope.row);
                                            }
                                        "
                                    >
                                        <el-option
                                            v-for="itemType in itemTypeList"
                                            :key="itemType.key"
                                            :label="itemType.value"
                                            :value="itemType.key"
                                        />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="字段值" min-width="260" prop="value">
                                <template #default="scope">
                                    <el-input
                                        v-if="scope.row.type == 'goods'"
                                        v-model="scope.row.value"
                                        :size="largeSize"
                                        readonly
                                    >
                                        <pick-goods
                                            #append
                                            :selection-type="0"
                                            @chosed-goods="
                                                (goods) => {
                                                    chosedGoods(goods, scope.row);
                                                }
                                            "
                                        />
                                    </el-input>
                                    <el-input
                                        v-else
                                        v-model="scope.row.value"
                                        :size="largeSize"
                                        placeholder="空格分隔"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="默认值" min-width="120" prop="defaultValue">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.defaultValue"
                                        :size="largeSize"
                                        placeholder="空格分隔"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="验证类型" min-width="130" prop="validationType">
                                <template #default="scope">
                                    <el-select
                                        v-model="scope.row.validationType"
                                        :size="largeSize"
                                        placeholder="选择类型"
                                    >
                                        <el-option
                                            v-for="itemValidationType in validationTypeList"
                                            :key="itemValidationType.key"
                                            :label="itemValidationType.value"
                                            :value="itemValidationType.key"
                                        />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="必填" min-width="80" prop="required">
                                <template #default="scope">
                                    <el-switch v-model="scope.row.required" :size="largeSize" />
                                </template>
                            </el-table-column>
                            <el-table-column label="排序" min-width="90" prop="sort">
                                <template #default="scope">
                                    <el-input-number
                                        v-model="scope.row.sort"
                                        :size="largeSize"
                                        controls-position="right"
                                        style="width: 80px"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                min-width="60"
                                prop="operation"
                            >
                                <template #header>
                                    <ext-button
                                        :circle="true"
                                        icon="el-icon-ali-jia"
                                        perms="form:add"
                                        type="primary"
                                        @click="handleAddItem"
                                    />
                                </template>
                                <template #default="scope">
                                    <ext-button
                                        :circle="true"
                                        :size="largeSize"
                                        icon="el-icon-ali-delete1"
                                        perms="form:delete"
                                        type="danger"
                                        @click="handleDeleteItem(scope.row)"
                                    />
                                </template>
                            </el-table-column>
                            <template #append>
                                1. 类型是商品时：可不输入字段名，默认值为默认下单数量 2. 2.
                                类型是金额时，字段值可不填
                            </template>
                        </el-table>
                    </el-form-item>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="按钮名称" prop="buttonName">
                                <el-input
                                    v-model="formData.buttonName"
                                    placeholder="请输入按钮名称"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="按钮颜色" prop="buttonColor">
                                <el-input
                                    v-model="formData.buttonColor"
                                    placeholder="请输入按钮颜色"
                                    readonly
                                >
                                    <template #append>
                                        <el-color-picker v-model="formData.buttonColor" />
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="提示语" prop="returnMsg">
                        <el-input v-model="formData.returnMsg" placeholder="请输入提示语" />
                    </el-form-item>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="需要登录" prop="required">
                                <el-switch
                                    v-model="formData.required"
                                    active-text="是"
                                    inactive-text="否"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="排序" prop="sort">
                                <el-input-number v-model="formData.sort" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="到期时间" prop="endDate">
                                <el-date-picker
                                    v-model="formData.endDate"
                                    placeholder="选择日期"
                                    type="date"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" class="footer">
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
import Cookies from 'js-cookie';
import breadCrumb from '@/components/bread_crumb.vue';
import pickGoods from '@/components/pick_goods';
import draggableImageList from '@/components/draggable_image_list';
import changeImageIcon from '@/components/change_image_icon.vue';
import extButton from '@/components/core/ext_button.vue';

export default {
    components: {
        breadCrumb,
        pickGoods,
        draggableImageList,
        changeImageIcon,
        extButton,
    },
    data() {
        const token = Cookies.get('token');
        /*
        const checkPrice = (rule, value, callback) => {
            var reg = /^-?\d{1,5}(?:\.\d{1,3})?$/
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入大于零小于十万不超过三位小数的数字'))
            }
        }
        */
        return {
            focusing: false,
            imageDialogImageUrl: '',
            imageDialogVisible: false,

            largeSize: 'large',
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                id: 0, // 主键
                name: '', // 表单名称
                type: '', // 1订单、2留言、3反馈、4登记、5调研
                sort: 0, // 表单排序
                desc: '', // 表单描述
                headType: 1, // 1图片2轮播3视频s
                headTypeValues: [{ id: 0, path: '' }], // 表单头值
                headTypeVideo: '', // DEFAULT NULL
                buttonName: '', // 表单提交按钮名称
                buttonColor: '', // 表单按钮颜色
                isLogin: 1, // 是否需要登录1需要2不需要
                qrcode: '', // 二维码图片地址
                returnMsg: '', // 提交后提示语
                endDate: null, // 到期时间
                formItems: [
                    {
                        name: '', // 字段名称
                        type: '', // 字段类型
                        validationType: '', // 验证类型
                        value: '', // 表单值
                        defaultValue: '', // 默认值
                        required: 2, // 是否必填，1必填，2不必填
                        sort: 0, // 排序
                    },
                ],
            },
            currentFormItemRow: -1,
            headers: { authorization: 'Bearer ' + token },
            typeList: [
                {
                    key: 1,
                    value: '订单',
                },
                {
                    key: 2,
                    value: '付款码',
                },
                {
                    key: 3,
                    value: '留言',
                },
                {
                    key: 4,
                    value: '反馈',
                },
                {
                    key: 5,
                    value: '登记',
                },
                {
                    key: 6,
                    value: '调研',
                },
            ],
            headTypeList: [
                {
                    key: 1,
                    value: '图片',
                },
                {
                    key: 2,
                    value: '轮播',
                },
                {
                    key: 3,
                    value: '视频',
                },
            ],
            validationTypeList: [
                {
                    key: 'string',
                    value: '字符串',
                },
                {
                    key: 'number',
                    value: '数字',
                },
                {
                    key: 'integer',
                    value: '整数',
                },
                {
                    key: 'price',
                    value: '价格',
                },
                {
                    key: 'email',
                    value: '邮箱',
                },
                {
                    key: 'mobile',
                    value: '手机号',
                },
            ],
            itemTypeList: [
                {
                    key: 'radio',
                    value: '单选',
                },
                {
                    key: 'checkbox',
                    value: '复选',
                },
                {
                    key: 'text',
                    value: '文本框',
                },
                {
                    key: 'textarea',
                    value: '文本域',
                },
                {
                    key: 'date',
                    value: '日期',
                },
                {
                    key: 'time',
                    value: '时间',
                },
                {
                    key: 'goods',
                    value: '商品',
                },
                {
                    key: 'money',
                    value: '金额',
                },
                {
                    key: 'password',
                    value: '密码',
                },
                {
                    key: 'area',
                    value: '省市区',
                },
                {
                    key: 'image',
                    value: '图片',
                },
                {
                    key: 'coordinate',
                    value: '坐标',
                },
            ],
            formDataRules: {
                name: [{ required: true, message: '请输入表单名称', trigger: 'blur' }],
            },
        };
    },
    computed: {},
    mounted() {
        this.isCreating = this.$route.query.isCreating;
        const _formId = this.$route.query.id;
        if (_formId > 0) {
            this.getFormDetail(_formId);
        }
    },
    methods: {
        chosedGoods(goods, row) {
            row.value = goods.name;
        },
        end(items) {
            this.formData.headTypeValues = items;
        },
        chosedImage(chosen) {
            this.formData.headTypeValues.push(chosen);
        },
        onRemove(idx) {
            if (Number.isInteger(idx) && idx !== -1) {
                this.formData.headTypeValues.splice(idx, 1);
            }
        },
        chosedHeadImage(chosed) {
            this.formData.headTypeValues = [chosed];
        },
        handleAddItem() {
            this.formData.formItems.push({
                name: '字段' + this.formData.formItems.length, // 字段名称
                type: '', // 字段类型
                validationType: '', // 验证类型
                value: '', // 表单值
                defaultValue: '', // 默认值
                required: 2, // 是否必填，1必填，2不必填
                sort: 0, // 排序
            });
        },
        handleDeleteItem(item) {
            const _idx = this.formData.formItems.indexOf(item);
            if (_idx !== -1) {
                this.formData.formItems.splice(_idx, 1);
            }
        },
        beforeUpload(file) {
            const isVideo = file.type === 'video/mp4' || file.type === 'audio/mp4';
            const isLt20M = file.size / 1024 / 1024 < 20;

            if (!isVideo) {
                this.$notify.error({
                    title: '错误',
                    message: '上传文件只能是 video/mp4 或 audio/mp4 格式!',
                });
            }
            if (!isLt20M) {
                this.$notify.error({
                    title: '错误',
                    message: '上传头像图片大小不能超过 20MB!',
                });
            }
            return isVideo && isLt20M;
        },
        uploadSuccess(result, file) {
            if (result.succeed === 1 && result.code === 200 && result.data) {
                this.formData.headTypeVideo = result.data.fileUrl;
                this.$notify({
                    title: '信息',
                    message: result.data,
                    type: 'info',
                });
            } else {
                this.$notify.error({
                    title: '错误',
                    message: '上传视频失败！',
                });
            }
        },
        changeItemType(val, row) {
            row.value = '';
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, this.formData);
                        const _result = await this.$api.form.save(data);
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
                        this.$router.push({ path: '/form' });
                    });
                }
            });
        },
        removeFile(item) {
            const _index = this.formData.goodsAttachments.findIndex((v) => v.id === item.id);
            this.formData.goodsAttachments.splice(_index, 1);
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        async getFormDetail(id) {
            this.$api.form.get({ id }).then((result) => {
                if (result.succeed === 1 && result.code === 200) {
                    const _formDetail = result.data;
                    this.formData = Object.assign(this.formData, _formDetail);
                }
            });
        },
    },
};
</script>

<style scoped lang="scss">
.headType-container {
    text-align: left;
    border-radius: 4px;
    margin: 15px 80px;
    padding: 5px;
    width: 90%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .el-upload-list__item {
        height: 82px;
        width: 82px;
    }
}
:deep(.el-color-picker--small) {
    display: block;
    height: 30px;
    .el-color-picker__trigger {
        border: 0px;
        height: 30px;
    }
}
</style>
