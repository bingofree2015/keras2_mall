<template>
    <div class="page-container">
        <!--新增编辑界面-->
        <el-form
            ref="formData"
            :model="formData"
            :rules="formDataRules"
            :size="normalSize"
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
                            <el-form-item :label="$t('formEdit.formName')" prop="name">
                                <el-input
                                    v-model="formData.name"
                                    :placeholder="$t('formEdit.formNamePlaceholder')"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('formEdit.formType')" prop="type">
                                <el-select
                                    v-model="formData.type"
                                    :placeholder="$t('formEdit.formTypePlaceholder')"
                                >
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
                    <el-form-item :label="$t('formEdit.headType')" prop="headType">
                        <el-radio-group v-model="formData.headType">
                            <el-radio
                                v-for="item in headTypeList"
                                :key="item.key"
                                :value="item.key"
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
                                        :size="normalSize"
                                        :placeholder="$t('formEdit.uploadVideo')"
                                        readonly
                                    >
                                        <template #append>
                                            <el-upload
                                                :action="'cms/upload?pathType=form'"
                                                :before-upload="beforeUpload"
                                                :headers="headers"
                                                :on-success="uploadSuccess"
                                                :show-file-list="false"
                                            >
                                                <template #default>
                                                    <el-button>
                                                        <i class="el-icon-ali-camera_rec"></i>
                                                    </el-button>
                                                </template>
                                            </el-upload>
                                        </template>
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
                    <el-form-item :label="$t('formEdit.desc')" prop="desc">
                        <el-input
                            v-model="formData.desc"
                            maxlength="30"
                            :placeholder="$t('formEdit.descPlaceholder')"
                            show-word-limit
                            type="textarea"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('formEdit.fields')" prop="formItems">
                        <el-table
                            :data="formData.formItems"
                            :size="normalSize"
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column
                                :label="$t('formEdit.fieldName')"
                                min-width="140"
                                prop="name"
                            >
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.name"
                                        :size="normalSize"
                                        :placeholder="$t('formEdit.namePlaceholder')"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                :label="$t('formEdit.fieldType')"
                                min-width="130"
                                prop="type"
                            >
                                <template #default="scope">
                                    <el-select
                                        v-model="scope.row.type"
                                        :size="normalSize"
                                        :placeholder="$t('formEdit.typePlaceholder')"
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
                            <el-table-column
                                :label="$t('formEdit.fieldValue')"
                                min-width="260"
                                prop="value"
                            >
                                <template #default="scope">
                                    <el-input
                                        v-if="scope.row.type == 'goods'"
                                        v-model="scope.row.value"
                                        :size="normalSize"
                                        readonly
                                    >
                                        <template #append>
                                            <pick-goods
                                                :selection-type="0"
                                                @chosed-goods="
                                                    (goods) => {
                                                        chosedGoods(goods, scope.row);
                                                    }
                                                "
                                            />
                                        </template>
                                    </el-input>
                                    <el-input
                                        v-else
                                        v-model="scope.row.value"
                                        :size="normalSize"
                                        :placeholder="$t('formEdit.valuePlaceholder')"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                :label="$t('formEdit.defaultValue')"
                                min-width="120"
                                prop="defaultValue"
                            >
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.defaultValue"
                                        :size="normalSize"
                                        :placeholder="$t('formEdit.defaultValuePlaceholder')"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                :label="$t('formEdit.validationType')"
                                min-width="130"
                                prop="validationType"
                            >
                                <template #default="scope">
                                    <el-select
                                        v-model="scope.row.validationType"
                                        :size="normalSize"
                                        :placeholder="$t('formEdit.typePlaceholder')"
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
                            <el-table-column
                                :label="$t('formEdit.required')"
                                min-width="80"
                                prop="required"
                            >
                                <template #default="scope">
                                    <el-switch v-model="scope.row.required" :size="normalSize" />
                                </template>
                            </el-table-column>
                            <el-table-column
                                :label="$t('formEdit.sort')"
                                min-width="90"
                                prop="sort"
                            >
                                <template #default="scope">
                                    <el-input-number
                                        v-model="scope.row.sort"
                                        :size="normalSize"
                                        controls-position="right"
                                        style="width: 80px"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                fixed="right"
                                :label="$t('formEdit.operation')"
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
                                        :size="normalSize"
                                        icon="el-icon-ali-delete1"
                                        perms="form:delete"
                                        type="danger"
                                        @click="handleDeleteItem(scope.row)"
                                    />
                                </template>
                            </el-table-column>
                            <template #append>
                                {{ $t('formEdit.fieldHint') }}
                            </template>
                        </el-table>
                    </el-form-item>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item :label="$t('formEdit.buttonName')" prop="buttonName">
                                <el-input
                                    v-model="formData.buttonName"
                                    :placeholder="$t('formEdit.buttonNamePlaceholder')"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item :label="$t('formEdit.buttonColor')" prop="buttonColor">
                                <el-input
                                    v-model="formData.buttonColor"
                                    :placeholder="$t('formEdit.buttonColorPlaceholder')"
                                    readonly
                                >
                                    <template #append>
                                        <el-color-picker v-model="formData.buttonColor" />
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item :label="$t('formEdit.tip')" prop="returnMsg">
                        <el-input
                            v-model="formData.returnMsg"
                            :placeholder="$t('formEdit.tipPlaceholder')"
                        />
                    </el-form-item>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item :label="$t('formEdit.needLogin')" prop="required">
                                <el-switch
                                    v-model="formData.required"
                                    :active-text="$t('formEdit.yes')"
                                    :inactive-text="$t('formEdit.no')"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="$t('formEdit.sort')" prop="sort">
                                <el-input-number v-model="formData.sort" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="$t('formEdit.expireTime')" prop="endDate">
                                <el-date-picker
                                    v-model="formData.endDate"
                                    :placeholder="$t('formEdit.selectDate')"
                                    type="date"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" class="footer">
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
            normalSize: 'default',
            focusing: false,
            imageDialogImageUrl: '',
            imageDialogVisible: false,


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
        };
    },
    computed: {
        // 响应式的字段类型配置
        typeList() {
            return [
                { key: 1, value: this.$t('formEdit.order') },
                { key: 2, value: this.$t('formEdit.paymentCode') },
                { key: 3, value: this.$t('formEdit.feedback') },
                { key: 4, value: this.$t('formEdit.feedback') },
                { key: 5, value: this.$t('formEdit.register') },
                { key: 6, value: this.$t('formEdit.survey') },
            ];
        },
        // 响应式的头部类型配置
        headTypeList() {
            return [
                { key: 1, value: this.$t('formEdit.image') },
                { key: 2, value: this.$t('formEdit.carousel') },
                { key: 3, value: this.$t('formEdit.video') },
            ];
        },
        // 响应式的验证类型配置
        validationTypeList() {
            return [
                { key: 'string', value: this.$t('formEdit.string') },
                { key: 'number', value: this.$t('formEdit.number') },
                { key: 'integer', value: this.$t('formEdit.integer') },
                { key: 'price', value: this.$t('formEdit.price') },
                { key: 'email', value: this.$t('formEdit.email') },
                { key: 'mobile', value: this.$t('formEdit.mobile') },
            ];
        },
        // 响应式的项目类型配置
        itemTypeList() {
            return [
                { key: 'radio', value: this.$t('formEdit.radio') },
                { key: 'checkbox', value: this.$t('formEdit.checkbox') },
                { key: 'text', value: this.$t('formEdit.text') },
                { key: 'textarea', value: this.$t('formEdit.textarea') },
                { key: 'date', value: this.$t('formEdit.date') },
                { key: 'time', value: this.$t('formEdit.time') },
                { key: 'goods', value: this.$t('formEdit.goods') },
                { key: 'money', value: this.$t('formEdit.money') },
                { key: 'password', value: this.$t('formEdit.password') },
                { key: 'area', value: this.$t('formEdit.area') },
                { key: 'image', value: this.$t('formEdit.image') },
                { key: 'coordinate', value: this.$t('formEdit.coordinate') },
            ];
        },
        // 响应式的表单验证规则
        formDataRules() {
            return {
                name: [
                    {
                        required: true,
                        message: this.$t('formEdit.formNamePlaceholder'),
                        trigger: 'blur',
                    },
                ],
            };
        },
    },
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
                name: this.$t('formEdit.fieldName') + this.formData.formItems.length, // 字段名称
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
                    title: this.$t('formEdit.error'),
                    message: this.$t('formEdit.uploadVideoErrorType'),
                });
            }
            if (!isLt20M) {
                this.$notify.error({
                    title: this.$t('formEdit.error'),
                    message: this.$t('formEdit.uploadVideoErrorSize'),
                });
            }
            return isVideo && isLt20M;
        },
        uploadSuccess(result, file) {
            if (result.succeed === 1 && result.code === 200 && result.data) {
                this.formData.headTypeVideo = result.data.fileUrl;
                this.$notify({
                    title: this.$t('formEdit.info'),
                    message: result.data,
                    type: 'info',
                });
            } else {
                this.$notify.error({
                    title: this.$t('formEdit.error'),
                    message: this.$t('formEdit.uploadVideoError'),
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
                    this.$confirm(
                        this.$t('formEdit.confirmSubmit'),
                        this.$t('formEdit.tip'),
                        {}
                    ).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, this.formData);
                        const _result = await this.$api.form.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            this.$notify({
                                title: this.$t('formEdit.success'),
                                message: _result.description,
                                type: 'success',
                            });
                        } else {
                            this.$notify.error({
                                title: this.$t('formEdit.error'),
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
