<template>
    <div class="page-container">
        <!--导航与工具栏-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :model="filters" :size="largeSize">
                    <el-form-item>
                        <el-input v-model="filters.value" placeholder="请输入内容">
                            <template #prepend>
                                <el-select
                                    v-model="filters.key"
                                    class="search-prepend"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in props"
                                        :key="item.prop"
                                        :label="item.label"
                                        :value="item.prop"
                                    />
                                </el-select>
                            </template>
                            <template #append>
                                <ext-button
                                    :label="$t('action.search')"
                                    perms="goods:goods_comment:view"
                                    type="primary"
                                    @click="queryForPaginatedList()"
                                >
                                    <i class="el-icon-ali-chazhaobiaodanliebiao"></i>
                                </ext-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip content="刷新" placement="top">
                                <el-button round @click="handleRefresh">
                                    <i class="el-icon-ali-shuaxin"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="导出" placement="top">
                                <el-button round>
                                    <i class="el-icon-ali-daochu"></i>
                                </el-button>
                            </el-tooltip>
                        </el-button-group>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <!--表格内容栏-->
        <ext-table
            :columns="columns"
            :count="paginated.attrs.count"
            :data="paginated.list"
            :operations="operations"
            :operation-width="operationWidth"
            :page-size="paginated.attrs.limit"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--编辑界面-->
        <el-dialog
            :close-on-click-modal="false"
            :model-value="editDialogVisible"
            title="商家回复"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                :size="largeSize"
                label-width="80px"
            >
                <el-form-item label="用户评价" prop="content">
                    {{ formData.content }}
                </el-form-item>
                <el-form-item label="用户评分" prop="score">
                    {{ formData.score }}
                </el-form-item>
                <el-form-item label="商家回复" prop="sellerContent">
                    <el-input
                        v-model="formData.sellerContent"
                        :rows="2"
                        placeholder="请输入内容"
                        type="textarea"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :size="largeSize" round @click="editDialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button
                        :loading="editLoading"
                        :size="largeSize"
                        round
                        type="primary"
                        @click="submitForm"
                    >
                        {{ $t('action.submit') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash';
import extTable from '@/components/core/ext_table.vue';
import breadCrumb from '@/components/bread_crumb.vue';
import extButton from '@/components/core/ext_button.vue';
export default {
    components: {
        extTable,
        breadCrumb,
        extButton,
    },
    data() {
        return {
            largeSize: 'large',
            filters: {
                key: 'name',
                value: '',
            },
            props: [{ prop: 'content', label: '评价内容' }],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'user.username', label: '用户名', minWidth: 80 },
                {
                    prop: 'goods.name',
                    label: '商品名称',
                    minWidth: 140,
                    showOverflowTooltip: true,
                },
                { prop: 'score', label: '星数', minWidth: 70 },
                { prop: 'content', label: '评价', minWidth: 180, showOverflowTooltip: true },
                { prop: 'orderId', label: '订单号', minWidth: 100 },
                {
                    prop: 'display',
                    label: '显示',
                    minWidth: 80,
                    propType: 'bool',
                    clickFlag: true,
                    func: async (id, value) => {
                        const _data = { id, display: value };
                        const _result = await this.$api.goodsComment.save(_data);
                        this.$notify.info({
                            title: '消息',
                            message: _result.description,
                        });
                    },
                    align: 'center',
                },
                {
                    prop: 'createdAt',
                    label: '评价时间',
                    minWidth: 140,
                    formatter: this.env.formatDateTime,
                },
            ],
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.edit', // 按钮上显示的文字
                    icon: 'el-icon-ali-huifupinglun', // 按钮文字前面的图标
                    perms: 'goods:goods_comment:edit', // 权限标识
                    size: this.largeSize, // 按钮大小
                    // type: 'primary',                  // 按钮类型
                    func: (row) => {
                        this.editDialogVisible = true;
                        this.isCreating = false;
                        this.formData = Object.assign({}, row);
                    },
                },
            ],

            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            // 编辑界面数据
            formData: {
                id: 0,
                commentId: 0,
                score: 5,
                userId: 0,
                user: {
                    id: 0,
                    username: '',
                },
                goodsId: 0,
                goods: {
                    id: 0,
                    name: '',
                },
                orderId: '',
                imgUrls: '',
                content: '',
                sellerContent: '',
                display: true,
            },
            formDataRules: {
                sellerContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
            },
        };
    },
    computed: {
        operationWidth: {
            get() {
                let _operationWidth = 0;
                if (Array.isArray(this.operations)) {
                    _operationWidth += this.operations.length * 100;
                }
                return _operationWidth;
            },
        },
    },
    mounted() {},
    methods: {
        // 获取分页数据
        async queryForPaginatedList(data) {
            if (data && data.attrs) {
                this.paginated.attrs = data.attrs;
            }
            this.paginated.attrs.searchKey = {};
            if (this.filters.key && this.filters.value) {
                this.paginated.attrs.searchKey[this.filters.key] = this.filters.value;
            }
            const _result = await this.$api.goodsComment.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 显示编辑界面
        handleEdit(data) {
            this.editDialogVisible = true;
            this.formData = Object.assign({}, data.row);
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign(
                            {},
                            _.pick(this.formData, ['id', 'sellerContent'])
                        );
                        const _result = await this.$api.goodsComment.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _goodsComment = this.paginated.list.find(
                                (v) => v.id === _result.data.id
                            );
                            if (!_goodsComment) {
                                this.paginated.list.unshift(_result.data);
                            } else {
                                Object.assign(_goodsComment, _result.data);
                            }
                            this.$notify({
                                title: '成功',
                                message: _result.description,
                                type: 'success',
                            });
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: _result.description,
                            });
                        }

                        this.editLoading = false;
                        this.$refs.formData.resetFields();
                        this.editDialogVisible = false;
                    });
                }
            });
        },
    },
};
</script>

<style scoped lang="scss"></style>
