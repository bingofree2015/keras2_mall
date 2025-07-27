<template>
    <div>
        <ext-button :size="miniSize" label="选择商品" type="primary" @click="handlePickGoods">
            <i class="el-icon-ali-Newxuanzeshangpinxuanzhong"></i>
        </ext-button>
        <el-dialog
            v-model:visible="dialogVisible"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :size="miniSize"
            title="商品选择窗"
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
                <el-table-column
                    v-if="selectionType == 1"
                    align="center"
                    min-width="40"
                    type="selection"
                />
                <el-table-column
                    v-else-if="selectionType === 0"
                    align="center"
                    label="选择"
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
                    label="商品名称"
                    min-width="380"
                    property="name"
                    show-overflow-tooltip
                />
                <el-table-column label="价格" min-width="90" property="price" />
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
                        >取 消
                    </el-button>
                    <el-button :size="miniSize" round type="primary" @click="chosedGoods">
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
    name: 'PickGoods',
    components: {
        extButton,
    },
    props: {
        goodsIds: {
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
    emits: ['chosedGoods'],
    data() {
        return {
            miniSize: 'default',
            largeSize: 'large',
            loading: false,
            dialogVisible: false,

            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 8, count: 0 },
                list: [],
            },

            radio: '',
            selectGoods: [],
        };
    },
    mounted() {
        this.queryForPaginatedList();
        this.dialogVisible = true; // 测试弹窗是否能自动弹出
    },
    methods: {
        // 获取分页数据
        async queryForPaginatedList() {
            this.loading = true;

            const _result = await this.$api.goods.list(this.paginated.attrs);
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
        multipleChoiceChange(selectGoods) {
            console.log(selectGoods);
            this.selectGoods = selectGoods;
        },
        // 选择切换(单选)
        choiceChange(index, row) {
            this.radio = index;
            this.selectGoods = [row]; // 保持为数组
        },
        handlePickGoods() {
            console.log('点击了选择商品');
            this.dialogVisible = true;
        },
        chosedGoods() {
            this.$emit('chosedGoods', this.selectGoods);
            this.dialogVisible = false;
        },
    },
};
</script>
<style scoped lang="scss"></style>
