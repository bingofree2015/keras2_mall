<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow">
                <el-form :inline="true" :model="filters" :size="normalSize" class="search-form">
                    <el-form-item>
                        <el-input
                            v-model="filters.value"
                            :placeholder="$t('common.inputPlaceholder')"
                        >
                            <template #prepend>
                                <el-select
                                    v-model="filters.key"
                                    class="search-prepend"
                                    :placeholder="$t('common.selectPlaceholder')"
                                >
                                    <el-option
                                        v-for="item in searchProps"
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
                                    @click="handleRefresh"
                                >
                                    <i class="el-icon-ali-chazhaobiaodanliebiao"></i>
                                </ext-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip :content="$t('action.refresh')" placement="top">
                                <el-button round @click="handleRefresh">
                                    <i class="el-icon-ali-shuaxin"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="$t('action.export')" placement="top">
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
            :title="$t('goods.sellerReply')"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                :size="normalSize"
                label-width="80px"
            >
                <el-form-item :label="$t('goods.userComment')" prop="content">
                    {{ formData.content }}
                </el-form-item>
                <el-form-item :label="$t('goods.userScore')" prop="score">
                    {{ formData.score }}
                </el-form-item>
                <el-form-item :label="$t('goods.sellerReply')" prop="sellerContent">
                    <el-input
                        v-model="formData.sellerContent"
                        :rows="2"
                        :placeholder="$t('common.inputPlaceholder')"
                        type="textarea"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :size="normalSize" round @click="editDialogVisible = false">
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
    inject: ['reload'],
    data() {
        return {
            normalSize: 'default',
            filters: {
                key: 'name',
                value: '',
            },
            // 搜索属性配置
            searchProps: [
                { prop: 'name', label: this.$t('goodsComment.username') },
                { prop: 'content', label: this.$t('goodsComment.comment') },
                { prop: 'orderId', label: this.$t('goodsComment.orderNumber') },
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
                    size: this.normalSize, // 按钮大小
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
            isCreating: false, // 是否为创建模式
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
        };
    },
    computed: {
        // 表格列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60, showOverflowTooltip: true },
                {
                    prop: 'user.username',
                    label: this.$t('goodsComment.username'),
                    minWidth: 80,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'goods.name',
                    label: this.$t('goodsComment.productName'),
                    minWidth: 140,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'score',
                    label: this.$t('goodsComment.starRating'),
                    minWidth: 70,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'content',
                    label: this.$t('goodsComment.comment'),
                    minWidth: 180,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'orderId',
                    label: this.$t('goodsComment.orderNumber'),
                    minWidth: 140,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'display',
                    label: this.$t('goodsComment.display'),
                    minWidth: 80,
                    propType: 'bool',
                    clickFlag: true,
                    func: async (id, value) => {
                        const _data = { id, display: value };
                        const _result = await this.$api.goodsComment.save(_data);
                        this.$notify.info({
                            title: this.$t('common.message'),
                            message: _result.description,
                        });
                    },
                    align: 'center',
                    showOverflowTooltip: true,
                },
                {
                    prop: 'createdAt',
                    label: this.$t('goodsComment.commentTime'),
                    minWidth: 140,
                    formatter: this.env.formatDateTime,
                    showOverflowTooltip: true,
                },
            ];
        },
        // 响应式的表单验证规则
        formDataRules() {
            return {
                sellerContent: [
                    {
                        required: true,
                        message: this.$t('common.inputPlaceholder'),
                        trigger: 'blur',
                    },
                ],
            };
        },
        operationWidth: {
            get() {
                let _operationWidth = 0;
                if (Array.isArray(this.operations)) {
                    _operationWidth += this.operations.length * 120;
                }
                return _operationWidth;
            },
        },
    },
    methods: {
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },
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
                    this.$confirm(this.$t('common.confirmSubmit'), this.$t('common.tip'), {}).then(
                        async () => {
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
                            this.$refs.formData.resetFields();
                            this.editDialogVisible = false;
                        }
                    );
                }
            });
        },
    },
};
</script>

<style scoped lang="scss"></style>
