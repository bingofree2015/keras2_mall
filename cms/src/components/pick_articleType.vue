<template>
    <div>
        <ext-button
            :size="normalSize"
            :label="$t('pickArticleType.button')"
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
            :title="$t('pickArticleType.dialogTitle')"
            width="40%"
        >
            <el-table
                v-loading="loading"
                :data="articleTypeData"
                :size="normalSize"
                element-loading-text="$t('action.loading')"
                stripe
                @selection-change="multipleChoiceChange"
            >
                <el-table-column v-if="selectionType == 1" min-width="80" type="selection" />
                <el-table-column
                    v-else-if="selectionType === 0"
                    align="center"
                    :label="$t('pickArticleType.select')"
                    min-width="80"
                >
                    <template #default="scope">
                        <el-radio
                            v-model="radio"
                            :label="scope.$index"
                            @change="choiceChange(scope.$index, scope.row)"
                        >
                            &nbsp;
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('pickArticleType.typeName')"
                    min-width="210"
                    property="typeName"
                    show-overflow-tooltip
                />
                <el-table-column
                    :label="$t('pickArticleType.createdAt')"
                    min-width="130"
                    :formatter="env.formatDateTime"
                    property="createdAt"
                />
            </el-table>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :size="normalSize" round @click="dialogVisible = false">
                        {{ $t('common.cancel') }}
                    </el-button>
                    <el-button :size="normalSize" round type="primary" @click="chosedArticleTypes">
                        {{ $t('common.confirm') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import extButton from '@/components/core/ext_button.vue';
export default {
    name: 'PickArticleType',
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
    emits: ['chosedArticleTypes'],
    data() {
        return {
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
                    title: this.$t('common.error'),
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
