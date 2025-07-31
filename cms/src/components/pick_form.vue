<template>
    <div>
        <ext-button
            :size="miniSize"
            :label="$t('pickForm.button')"
            type="primary"
            @click="handlePickForm()"
        >
            <i class="el-icon-ali-Newxuanzeshangpinxuanzhong"></i>
        </ext-button>
        <el-dialog
            v-model:visible="dialogVisible"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :size="normalSize"
            :title="$t('pickForm.dialogTitle')"
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
                <el-table-column v-if="selectionType == 1" min-width="80" type="selection" />
                <el-table-column
                    v-else-if="selectionType === 0"
                    align="center"
                    :label="$t('pickForm.select')"
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
                    :label="$t('pickForm.name')"
                    min-width="180"
                    property="name"
                    show-overflow-tooltip
                />
                <el-table-column :label="$t('pickForm.type')" min-width="90" property="type" />
                <el-table-column
                    :label="$t('pickForm.createdAt')"
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
                    <el-button :size="miniSize" round @click="dialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button :size="miniSize" round type="primary" @click="chosedForms">
                        {{ $t('action.comfirm') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'PickForm',
    components: {},
    props: {
        forms: {
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
    emits: ['chosedForms'],
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
            selectForms: [],
        };
    },
    mounted() {
        this.queryForPaginatedList();
    },
    methods: {
        // 获取分页数据
        async queryForPaginatedList() {
            this.loading = true;

            const _result = await this.$api.form.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            } else {
                this.$notify.error({
                    title: this.$t('pickForm.error'),
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
        multipleChoiceChange(selectForms) {
            console.log(selectForms);
            this.selectForms = selectForms;
        },
        // 选择切换(单选)
        choiceChange(index, row) {
            this.radio = index;
            this.selectForms = [row];
        },
        handlePickForm() {
            this.dialogVisible = true;
        },
        chosedForms() {
            this.$emit('chosedForms', this.selectForms);
            this.dialogVisible = false;
        },
    },
};
</script>
<style scoped lang="scss"></style>
