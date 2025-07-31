<template>
    <div>
        <ext-button
            :size="miniSize"
            :label="$t('pickNotice.button')"
            type="primary"
            @click="handlePickNotices()"
        >
            <i class="el-icon-ali-Newxuanzeshangpinxuanzhong"></i>
        </ext-button>
        <el-dialog
            v-model:visible="dialogVisible"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :size="miniSize"
            :title="$t('pickNotice.dialogTitle')"
            width="50%"
        >
            <el-table
                v-loading="loading"
                :data="paginated.list"
                :size="miniSize"
                element-loading-text="$t('action.loading')"
                stripe
                @selection-change="multipleChoiceChange"
            >
                <el-table-column v-if="selectionType == 1" min-width="40" type="selection" />
                <el-table-column
                    v-else-if="selectionType === 0"
                    align="center"
                    :label="$t('pickNotice.select')"
                    min-width="40"
                >
                    <template #default="scope">
                        <el-radio
                            v-model="radio"
                            :label="scope.$index"
                            @change="selectionType == 0 && choiceChange(scope.$index, scope.row)"
                        >
                            &nbsp;
                        </el-radio>
                    </template>
                </el-table-column>

                <el-table-column
                    :label="$t('pickNotice.title')"
                    min-width="310"
                    property="title"
                    show-overflow-tooltip
                />
                <el-table-column
                    :label="$t('pickNotice.time')"
                    min-width="120"
                    property="createdAt"
                    formatter="env.formatDateTime"
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
                    <el-button :size="miniSize" round @click="dialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button :size="miniSize" round type="primary" @click="chosedNotices">
                        {{ $t('action.comfirm') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'PickNotice',
    components: {},
    props: {
        NoticeIds: {
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
    emits: ['chosedNotices'],
    data() {
        return {
            miniSize: 'default',
            normalSize: 'default',
            loading: false,
            dialogVisible: false,

            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 8, count: 0 },
                list: [],
            },

            radio: '',
            selectNotices: [],
        };
    },
    mounted() {
        this.queryForPaginatedList();
    },
    methods: {
        // 获取分页数据
        async queryForPaginatedList() {
            this.loading = true;

            const _result = await this.$api.notice.list(this.paginated.attrs);
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
        multipleChoiceChange(selectNotices) {
            console.log(selectNotices);
            this.selectNotices = selectNotices;
        },
        // 选择切换(单选)
        choiceChange(index, row) {
            this.radio = index;
            this.selectNotices = [row];
        },
        handlePickNotices() {
            this.dialogVisible = true;
        },
        chosedNotices() {
            this.$emit('chosedNotices', this.selectNotices);
            this.dialogVisible = false;
        },
    },
};
</script>
<style scoped lang="scss"></style>
