<template>
    <div>
        <ext-button :size="normalSize" label="选择文章" type="primary" @click="handlePickArticle()">
            <i class="el-icon-ali-Newxuanzeshangpinxuanzhong"></i>
        </ext-button>
        <el-dialog
            v-model:visible="dialogVisible"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :size="normalSize"
            title="文章选择窗"
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
                    label="文章标题"
                    min-width="180"
                    property="title"
                    show-overflow-tooltip
                />
                <el-table-column label="类型" min-width="90" property="articleType.typeName" />
                <el-table-column label="状态" min-width="90" property="isPub" />
                <el-table-column label="创建时间" min-width="110" property="createdAt" />
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
                        >取 消
                    </el-button>
                    <el-button :size="normalSize" round type="primary" @click="chosedArticles">
                        确 定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import extButton from '@/components/core/ext_button.vue';
export default {
    name: 'PickArticles',
    components: {
        extButton,
    },
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
                    title: '错误',
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
