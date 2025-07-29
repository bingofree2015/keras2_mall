<template>
    <div>
        <ext-button
            :size="miniSize"
            label="选择文章类型"
            type="primary"
            @click="handlePickArticleType()"
        >
            <i class="el-icon-ali-Newxuanzeshangpinxuanzhong"></i>
        </ext-button>
        <el-dialog
            v-model:visible="dialogVisible"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            :size="normalSize"
            title="文章分类选择窗"
            width="40%"
        >
            <el-table
                v-loading="loading"
                :data="articleTypeData"
                :size="miniSize"
                element-loading-text="$t('action.loading')"
                stripe
                @selection-change="multipleChoiceChange"
            >
                <el-table-column v-if="selectionType == 1" min-width="80" type="selection" />
                <el-table-column
                    v-else-if="selectionType === 0"
                    align="center"
                    label="选择"
                    min-width="80"
                >
                    <template #default="scope">
                        <el-radio
                            v-model="radio"
                            :label="scope.$index"
                            @change.native="choiceChange(scope.$index, scope.row)"
                        >
                            &nbsp;
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column
                    label="分类名称"
                    min-width="210"
                    property="typeName"
                    show-overflow-tooltip
                />
                <el-table-column
                    label="创建时间"
                    min-width="130"
                    :formatter="env.formatDateTime"
                    property="createdAt"
                />
            </el-table>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :size="miniSize" round @click="dialogVisible = false">
                        >取 消
                    </el-button>
                    <el-button :size="miniSize" round type="primary" @click="chosedArticleTypes">
                        >确 定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import extButton from '@/components/core/ext_button.vue';
export default {
    name: 'PickArticleTypes',
    components: {
        extButton,
    },
    props: {
        articleTypes: {
            type: Array,
            default: () => {
                return [];
            },
        },
        selectionType: {
            type: Number,
            default: 1, // 1 多选; 0 单选
        },
    },
    data() {
        return {
            miniSize: 'default',
            normalSize: 'default',
            loading: false,
            dialogVisible: false,
            articleTypeData: [],

            radio: '',
            selectArticleTypes: [],
        };
    },
    mounted() {
        this.queryForPaginatedList();
    },
    methods: {
        // 获取分页数据
        async queryForPaginatedList() {
            this.loading = true;

            const _result = await this.$api.articleType.getTree();
            if (_result.succeed === 1 && _result.code === 200) {
                this.articleTypeData = _result.data.list;
            } else {
                this.$notify.error({
                    title: '错误',
                    message: _result.description,
                });
            }
            this.loading = false;
        },
        // 选择切换(多选)
        multipleChoiceChange(selectArticleTypes) {
            console.log(selectArticleTypes);
            this.selectArticleTypes = selectArticleTypes;
        },
        // 选择切换(单选)
        choiceChange(index, row) {
            this.radio = index;
            this.selectArticleTypes = [row];
        },
        handlePickArticleType() {
            this.dialogVisible = true;
        },
        chosedArticleTypes() {
            this.$emit('chosedArticleTypes', this.selectArticleTypes);
            this.dialogVisible = false;
        },
    },
};
</script>
<style scoped lang="scss"></style>
