<template>
    <div>
        <ext-button
            :size="normalSize"
            :label="$t('pickArticle.button')"
            type="primary"
            @click="handlePickArticle()"
        >
            <i class="el-icon-ali-Newxuanzeshangpinxuanzhong"></i>
        </ext-button>
        <el-dialog
            v-model="dialogVisible"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :size="normalSize"
            :title="$t('pickArticle.dialogTitle')"
            width="50%"
        >
            <el-table
                v-loading="loading"
                :data="paginated.list"
                :size="normalSize"
                element-loading-text="$t('action.loading')"
                stripe
                @selection-change="multipleChoiceChange"
            >
                <el-table-column v-if="selectionType == 1" min-width="80" type="selection" />
                <el-table-column
                    v-else-if="selectionType === 0"
                    align="center"
                    :label="$t('pickArticle.select')"
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
                    :label="$t('pickArticle.title')"
                    min-width="180"
                    property="title"
                    show-overflow-tooltip
                />
                <el-table-column
                    :label="$t('pickArticle.type')"
                    min-width="90"
                    property="articleType.typeName"
                />
                <el-table-column
                    :label="$t('pickArticle.status')"
                    min-width="90"
                    property="isPub"
                />
                <el-table-column
                    :label="$t('pickArticle.createdAt')"
                    min-width="110"
                    property="createdAt"
                />
            </el-table>
            <div style="padding: 10px">
                <el-pagination
                    :current-page="paginated.attrs.currPage"
                    :page-size="paginated.attrs.limit"
                    :total="paginated.attrs.count"
                    layout="total, prev, pager, next, jumper"
                    style="float: right"
                    @current-change="handleCurrentChange"
                />
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :size="normalSize" round @click="dialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button :size="normalSize" round type="primary" @click="chosedArticles">
                        {{ $t('action.comfirm') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'PickArticle',
    components: {},
    props: {
        articles: {
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
    emits: ['chosedArticles'],
    data() {
        return {
            normalSize: 'default',
            loading: false,
            dialogVisible: false,

            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 8, count: 0 },
                list: [],
            },
            radio: '',
            selectArticles: [],
        };
    },
    mounted() {
        this.queryForPaginatedList();
    },
    methods: {
        // 获取分页数据
        async queryForPaginatedList() {
            this.loading = true;

            const _result = await this.$api.article.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            } else {
                this.$notify.error({
                    title: this.$t('common.error'),
                    message: _result.description,
                });
            }
            this.loading = false;
        },
        // 换页刷新
        handleCurrentChange(currPage) {
            this.paginated.attrs.currPage = currPage;
            this.paginated.attrs.offset = (currPage - 1) * this.paginated.attrs.limit;
            this.queryForPaginatedList();
        },
        // 选择切换(多选)
        multipleChoiceChange(selectArticles) {
            console.log(selectArticles);
            this.selectArticles = selectArticles;
        },
        // 选择切换(单选)
        choiceChange(index, row) {
            this.radio = index;
            this.selectArticles = [row];
        },
        handlePickArticle() {
            this.dialogVisible = true;
        },
        chosedArticles() {
            this.$emit('chosedArticles', this.selectArticles);
            this.dialogVisible = false;
        },
    },
};
</script>
<style scoped lang="scss"></style>
