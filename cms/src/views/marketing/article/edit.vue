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
                {{ $t('article.basicInfo') }}
            </el-divider>
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="$t('article.title')" prop="title">
                        <el-input
                            v-model="formData.title"
                            :placeholder="$t('article.inputTitle')"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('article.type')" prop="typeId">
                        <el-select
                            v-model="formData.typeId"
                            :placeholder="$t('article.selectType')"
                        >
                            <el-option
                                v-for="type in articleTypeOpts"
                                :key="type.id"
                                :label="type.typeName"
                                :value="type.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="$t('article.cover')" prop="attachmentId">
                        <change-image-icon
                            :image="formData.attachment"
                            @chosed-image="chosedLogo"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('article.sort')" prop="sort">
                        <el-input-number
                            v-model="formData.sort"
                            :min="0"
                            :max="999"
                            controls-position="right"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item :label="$t('article.content')" prop="content">
                        <tiny-editor
                            v-model="formData.content"
                            :placeholder="$t('article.inputContent')"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="$t('article.status')" prop="isPub">
                        <el-radio-group v-model="formData.isPub">
                            <el-radio :value="1">
                                {{ $t('article.published') }}
                            </el-radio>
                            <el-radio :value="0">
                                {{ $t('article.unpublished') }}
                            </el-radio>
                        </el-radio-group>
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
    name: 'ArticleEdit',
    components: {},
    data() {
        return {
            normalSize: 'default',
            articleTypeOpts: [],
            isCreating: false, // true:新增, false:编辑
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                id: 0, // 文章ID
                title: '', // 文章标题
                attachment: {
                    id: 0,
                    path: '',
                },
                // 文章封面图
                content: '', // 文章内容
                typeId: 0, // 文章分类id
                articleType: {
                    id: 0,
                    typeName: '',
                },
                sort: 0, // 文章排序 从小到大
                isPub: 0, // 1 发布 2 不发布
            },
        };
    },
    computed: {
        // 响应式的 formDataRules 配置
        formDataRules() {
            return {
                title: [
                    { required: true, message: this.$t('article.titleRequired'), trigger: 'blur' },
                ],
            };
        },
    },
    async mounted() {
        this.isCreating = this.$route.query.isCreating;
        const _articleId = this.$route.query.id;

        await this.getArticleTypes();
        await this.getArticle(_articleId);
    },
    methods: {
        chosedLogo(chosen) {
            this.formData.attachmentId = chosen.id;
            this.formData.attachment = chosen;
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

                        if (Array.isArray(data.typeId) && data.typeId.length > 0) {
                            data.typeId = data.typeId.pop();
                        }
                        const _result = await this.$api.article.save(data);
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

                        this.$router.push({ path: '/marketing/article' });
                    });
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        async getArticleTypes() {
            const _result = await this.$api.articleType.getTree();
            if (_result.succeed === 1 && _result.code === 200) {
                this.articleTypeOpts = _result.data.list;
            }
        },
        async getArticle(articleId) {
            const _result = await this.$api.article.get({ id: articleId });
            if (_result.succeed === 1 && _result.code === 200) {
                this.formData = Object.assign({}, _result.data);
            }
        },
    },
};
</script>

<style scoped lang="scss"></style>
