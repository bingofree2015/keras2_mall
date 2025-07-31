<template>
    <div class="app-container">
        <el-form
            ref="formData"
            :model="formData"
            :rules="formDataRules"
            :size="normalSize"
            label-width="120px"
        >
            <el-divider content-position="left">
                {{ $t('advertisement.basicInfo') }}
            </el-divider>
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="$t('advertisement.name')" prop="name">
                        <el-input
                            v-model="formData.name"
                            :placeholder="$t('advertisement.inputName')"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('advertisement.position')" prop="positionId">
                        <el-select
                            v-model="formData.positionId"
                            :placeholder="$t('advertisement.selectPosition')"
                        >
                            <el-option
                                v-for="position in advertPositions"
                                :key="position.id"
                                :label="position.name"
                                :value="position.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="$t('advertisement.image')" prop="attachmentId">
                        <change-image-icon
                            :image="formData.attachment"
                            @chosed-image="chosedImage"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('advertisement.sort')" prop="sort">
                        <el-input-number
                            v-model="formData.sort"
                            :min="0"
                            :max="999"
                            controls-position="right"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-divider content-position="left">
                {{ $t('advertisement.linkInfo') }}
            </el-divider>
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="$t('advertisement.linkType')" prop="type">
                        <el-select
                            v-model="formData.type"
                            :placeholder="$t('advertisement.selectType')"
                        >
                            <el-option
                                v-for="type in linkTypes"
                                :key="type.key"
                                :label="type.value"
                                :value="type.key"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('advertisement.linkValue')" prop="val">
                        <el-input
                            v-model="formData.val"
                            :placeholder="$t('advertisement.inputLink')"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item :label="$t('advertisement.remark')" prop="memo">
                        <el-input
                            v-model="formData.memo"
                            :placeholder="$t('advertisement.inputRemark')"
                            type="textarea"
                            :rows="3"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item>
                <el-button
                    :loading="editLoading"
                    :size="normalSize"
                    round
                    type="primary"
                    @click="submitForm"
                >
                    {{ $t('action.submit') }}
                </el-button>
                <el-button :size="normalSize" round @click="resetForm('formData')">
                    {{ $t('action.reset') }}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'AdvertisementEdit',
    components: {},
    data() {
        return {
            normalSize: 'large',
            editLoading: false,
            isCreating: false,
            advertPositions: [],
            formData: {
                id: 0,
                name: '', // 广告名称
                positionId: '', // 广告位置
                attachmentId: 0, // 广告图片id
                attachment: {
                    id: 0,
                    path: '',
                },
                val: '', // 链接属性值
                sort: 0, // 从小到大 越小越靠前
                code: '', // 广告位置编码
                type: 1, // 类型(1 url 2 商品 3 文章)
                memo: '', // 备注
            },
            linkTypes: [
                { key: 1, value: 'URL链接' },
                { key: 2, value: '商品' },
                { key: 3, value: '文章' },
                { key: 4, value: '文章分类' },
                { key: 5, value: '智能表单' },
            ],
        };
    },
    computed: {
        // 响应式的 formDataRules 配置
        formDataRules() {
            return {
                name: [
                    {
                        required: true,
                        message: this.$t('advertisement.nameRequired'),
                        trigger: 'blur',
                    },
                ],
            };
        },
    },
    async mounted() {
        this.isCreating = this.$route.query.isCreating;
        const _id = this.$route.query.id;
        await this.getAdvertPositions();
        if (_id) {
            await this.getAdvertment(_id);
        }
    },
    methods: {
        chosedImage(chosen) {
            this.formData.attachmentId = chosen.id;
            this.formData.attachment = chosen;
        },
        chosedGoods(item, goods) {
            if (item && Array.isArray(goods) && goods.length > 0) {
                item.val = goods[0].id;
            }
        },
        chosedArticles(item, descColumn, articles, srcColumn) {
            if (item && Array.isArray(articles) && articles.length > 0) {
                item[descColumn] = articles[0][srcColumn];
            }
        },
        chosedArticleTypes(item, column, articleTypes) {
            if (item && Array.isArray(articleTypes) && articleTypes.length > 0) {
                item[column] = articleTypes[0].id;
            }
        },
        chosedForms(item, forms) {
            if (item && Array.isArray(forms) && forms.length > 0) {
                item.val = forms[0].id;
            }
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, this.formData);
                        if (Array.isArray(data.positionId) && data.positionId.length > 0) {
                            data.positionId = data.positionId.pop();
                        }
                        const _result = await this.$api.advertisement.save(data);
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

                        this.$router.push({ path: '/marketing/advertisement' });
                    });
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        async getAdvertPositions() {
            const _result = await this.$api.advertPosition.list();
            if (_result.succeed === 1 && _result.code === 200) {
                this.advertPositions = _result.data.list;
            }
        },
        async getAdvertment(id) {
            const _result = await this.$api.advertisement.get({ id });
            if (_result.succeed === 1 && _result.code === 200) {
                this.formData = Object.assign(this.formData, _result.data);
            }
        },
    },
};
</script>

<style scoped lang="scss"></style>
