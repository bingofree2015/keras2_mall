<template>
    <div class="page-container">
        <!--新增编辑界面-->
        <el-row>
            <el-col :span="24">
                <bread-crumb />
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="16">
                <el-form
                    ref="formData"
                    :model="formData"
                    :rules="formDataRules"
                    :size="normalSize"
                    label-width="80px"
                >
                    <el-row>
                        <el-col :span="16">
                            <el-form-item :label="$t('advertisement.name')" prop="name">
                                <el-input v-model="formData.name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('advertisement.position')" prop="positionId">
                                <el-select
                                    v-model="formData.positionId"
                                    :placeholder="$t('common.selectPlaceholder')"
                                >
                                    <el-option
                                        v-for="advertPosition in advertPositions"
                                        :key="advertPosition.id"
                                        :label="advertPosition.name"
                                        :value="advertPosition.id"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item :label="$t('advertisement.type')" prop="type">
                                <el-select
                                    v-model="formData.type"
                                    :placeholder="$t('common.selectPlaceholder')"
                                >
                                    <el-option
                                        v-for="linkType in linkTypes"
                                        :key="linkType.key"
                                        :label="linkType.value"
                                        :value="linkType.key"
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('advertisement.value')" prop="val">
                                <el-input
                                    v-model="formData.val"
                                    :placeholder="$t('advertisement.inputValue')"
                                >
                                    <template #append>
                                        <pick-goods
                                            v-if="formData.type === 2"
                                            :selection-type="0"
                                            @chosed-goods="
                                                (goods) => {
                                                    chosedGoods(formData, goods);
                                                }
                                            "
                                        />
                                        <pick-article
                                            v-else-if="formData.type === 3"
                                            :selection-type="0"
                                            @chosed-articles="
                                                (articles) => {
                                                    chosedArticles(formData, 'val', articles, 'id');
                                                }
                                            "
                                        />
                                        <pick-articleType
                                            v-else-if="formData.type === 4"
                                            :selection-type="0"
                                            @chosed-article-types="
                                                (articleTypes) => {
                                                    chosedArticleTypes(
                                                        formData,
                                                        'val',
                                                        articleTypes
                                                    );
                                                }
                                            "
                                        />
                                        <pick-form
                                            v-else-if="formData.type === 5"
                                            :selection-type="0"
                                            @chosed-forms="
                                                (forms) => {
                                                    chosedForms(formData, forms);
                                                }
                                            "
                                        />
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item :label="$t('advertisement.sort')" prop="sort">
                                <el-input-number
                                    v-model="formData.sort"
                                    :min="0"
                                    controls-position="right"
                                    label="排序"
                                    style="width: 100px"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('advertisement.image')" prop="attachment">
                                <change-image-icon
                                    :img-url="formData.attachment ? formData.attachment.path : ''"
                                    :init-style="{
                                        height: '180px',
                                        width: '180px',
                                        border: '1px dashed #d9d9d9',
                                        borderRadius: '4px',
                                    }"
                                    @chosed-image-icon="chosedImage"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24" class="footer">
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
            </el-col>
        </el-row>
    </div>
</template>

<script>
import breadCrumb from '@/components/bread_crumb.vue';

import pickGoods from '@/components/pick_goods.vue';
import pickArticle from '@/components/pick_article.vue';
import pickArticleType from '@/components/pick_articleType.vue';
import pickForm from '@/components/pick_form.vue';
import changeImageIcon from '@/components/change_image_icon.vue';

export default {
    components: {
        breadCrumb,
        pickGoods,
        pickArticle,
        pickArticleType,
        pickForm,
        changeImageIcon,
    },
    data() {
        return {
            normalSize: 'default',
            advertPositions: [],
            isCreating: false, // true:新增, false:编辑
            editLoading: false,

            // 新增编辑界面数据
            formData: {
                id: 0, // 广告ID
                positionId: '', // 广告位置id
                name: '', // 广告名称
                attachment: {
                    id: 0,
                    path: '',
                }, // 广告图片id
                val: '', // 链接属性值
                sort: 0, // 从小到大 越小越靠前
                code: '', // 广告位置编码
                type: 1, // 类型(1 url 2 商品 3 文章)
            },
            linkTypes: [
                { key: 1, value: 'URL链接' },
                { key: 2, value: '商品' },
                { key: 3, value: '文章' },
                { key: 4, value: '文章分类' },
                { key: 5, value: '智能表单' },
            ],
            formDataRules: {
                name: [
                    {
                        required: true,
                        message: this.$t('advertisement.nameRequired'),
                        trigger: 'blur',
                    },
                ],
            },
        };
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
