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
                                        v-for="item in searchFields"
                                        :key="item.prop"
                                        :label="item.label"
                                        :value="item.prop"
                                    />
                                </el-select>
                            </template>
                            <template #append>
                                <ext-button
                                    :label="$t('action.search')"
                                    icon="el-icon-ali-chazhaobiaodanliebiao"
                                    perms="goods:goods_type:view"
                                    type="primary"
                                    @click="handleRefresh"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip :content="$t('action.add')" placement="top">
                                <el-button round @click="handleAdd">
                                    <i class="el-icon-ali-add"></i>
                                </el-button>
                            </el-tooltip>
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
            :batch-delete="batchDelete"
            :columns="columns"
            :count="paginated.attrs.count"
            :data="paginated.list"
            :operations="operations"
            :operation-width="operationWidth"
            :page-size="paginated.attrs.limit"
            :perms-batch-delete="permsBatchDelete"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--新增编辑界面-->
        <el-dialog
            :close-on-click-modal="false"
            :title="isCreating ? $t('action.add') : $t('action.edit')"
            :model-value="editDialogVisible"
            width="60%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                :size="normalSize"
                label-width="80px"
            >
                <el-form-item :label="$t('goods.typeName')" prop="name">
                    <el-input v-model="formData.name" />
                </el-form-item>
                <el-tabs v-model="activeName">
                    <el-tab-pane name="params">
                        <template #label>
                            <span>
                                <i class="el-icon-ali-shangpincanshu"></i>
                                {{ $t('goods.param') }}
                            </span>
                        </template>
                        <el-table :data="formData.params" style="width: 100%">
                            <el-table-column
                                :label="$t('goods.paramName')"
                                min-width="240"
                                prop="name"
                            >
                                <template #default="scope">
                                    <el-autocomplete
                                        v-model="scope.row.name"
                                        :fetch-suggestions="queryParams"
                                        :placeholder="$t('common.inputPlaceholder')"
                                        @select="(item) => handleSelectParam(item, scope.row.idx)"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                :label="$t('goods.paramType')"
                                min-width="120"
                                prop="type"
                            >
                                <template #default="scope">
                                    <el-select
                                        v-model="scope.row.type"
                                        :placeholder="$t('common.selectPlaceholder')"
                                    >
                                        <el-option :label="$t('goods.textbox')" value="text" />
                                        <el-option :label="$t('goods.radio')" value="radio" />
                                        <el-option :label="$t('goods.checkbox')" value="checkbox" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                :label="$t('goods.paramOption')"
                                min-width="280"
                                prop="values"
                            >
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.values"
                                        :placeholder="$t('goods.spaceSeparated')"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                fixed="right"
                                :label="$t('action.operation')"
                                min-width="80"
                            >
                                <template #header>
                                    <el-button
                                        round
                                        style="float: right"
                                        type="primary"
                                        @click.prevent="handleAddParam()"
                                    >
                                        {{ $t('action.add') }}
                                    </el-button>
                                </template>
                                <template #default="scope">
                                    <el-button
                                        circle
                                        icon="el-icon-delete"
                                        type="danger"
                                        @click="handleDeleteParam(scope.row.idx)"
                                    />
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane name="specs">
                        <template #label>
                            <span>
                                <i class="el-icon-ali-guige"></i>
                                {{ $t('goods.spec') }}
                            </span>
                        </template>
                        <el-table :data="formData.specs" style="width: 100%">
                            <el-table-column
                                :label="$t('goods.specName')"
                                min-width="240"
                                prop="name"
                            >
                                <template #default="scope">
                                    <el-autocomplete
                                        v-model="scope.row.name"
                                        :fetch-suggestions="querySpecs"
                                        :placeholder="$t('common.inputPlaceholder')"
                                        @select="(item) => handleSelectSpec(item, scope.row.idx)"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                :label="$t('goods.sort')"
                                min-width="160"
                                prop="sort"
                            >
                                <template #default="scope">
                                    <el-input-number
                                        v-model="scope.row.sort"
                                        :max="99"
                                        :min="0"
                                        controls-position="right"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                :label="$t('goods.specValue')"
                                min-width="280"
                                prop="values"
                            >
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.values"
                                        :placeholder="$t('goods.spaceSeparated')"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                fixed="right"
                                :label="$t('action.operation')"
                                min-width="80"
                            >
                                <template #header>
                                    <el-button
                                        round
                                        style="float: right"
                                        type="primary"
                                        @click.prevent="handleAddSpec()"
                                    >
                                        {{ $t('action.add') }}
                                    </el-button>
                                </template>
                                <template #default="scope">
                                    <el-button
                                        circle
                                        icon="el-icon-delete"
                                        type="danger"
                                        @click="handleDeleteSpec(scope.row.idx)"
                                    />
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button round @click="editDialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button :loading="editLoading" round type="primary" @click="submitForm">
                        {{ $t('action.submit') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
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
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.edit', // 按钮上显示的文字
                    icon: 'el-icon-ali-bianji', // 按钮文字前面的图标
                    perms: 'goods:goods_type:edit', // 权限标识
                    size: this.normalSize, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.editDialogVisible = true;
                        this.isCreating = false;
                        this.formData = Object.assign({}, row);
                    },
                },
                {
                    label: 'action.delete',
                    icon: 'el-icon-ali-shanchu',
                    perms: 'goods:goods_type:delete',
                    size: this.normalSize,
                    type: 'danger',
                    func: (row) => {
                        this.$confirm(this.$t('common.confirmDelete'), this.$t('common.tip'), {
                            type: 'warning',
                        }).then(async () => {
                            await this.batchDelete([row.id]);
                        });
                    },
                },
            ],
            permsBatchDelete: 'goods:goods_type:delete',

            isCreating: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                id: 0,
                name: '',
                specs: [],
                params: [],
            },
            activeName: '',
        };
    },
    computed: {
        // 响应式的搜索字段配置
        searchFields() {
            return [{ prop: 'name', label: this.$t('goods.typeName') }];
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'name', label: this.$t('goods.typeName'), minWidth: 80 },
                {
                    prop: 'specValues',
                    label: this.$t('goods.attributeSpec'),
                    minWidth: 120,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'paramValues',
                    label: this.$t('goods.parameter'),
                    minWidth: 120,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'createdAt',
                    label: this.$t('common.createTime'),
                    minWidth: 140,
                    formatter: this.env.formatDateTime,
                },
            ];
        },
        operationWidth() {
            let _operationWidth = 0;
            if (Array.isArray(this.operations)) {
                _operationWidth += this.operations.length * 120;
            }
            return _operationWidth;
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
            const _result = await this.$api.goodsType.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.goodsType.destroy({ ids });
            if (_result.succeed === 1 && _result.code === 200) {
                for (const id of ids) {
                    const _index = this.paginated.list.findIndex((v) => v.id === id);
                    this.paginated.list.splice(_index, 1);
                }
            }
        },
        // 显示新增界面
        handleAdd() {
            this.editDialogVisible = true;
            this.isCreating = true;
            this.formData = {
                id: 0,
                name: '',
                specs: [],
                params: [],
            };
        },
        // 显示编辑界面
        handleEdit(data) {
            this.editDialogVisible = true;
            this.isCreating = false;
            this.formData = Object.assign({}, data.row);
            if (Array.isArray(this.formData.params)) {
                this.formData.params.forEach((v, idx) => {
                    v.idx = idx;
                });
            }
            if (Array.isArray(this.formData.specs)) {
                this.formData.specs.forEach((v, idx) => {
                    v.idx = idx;
                });
            }
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(this.$t('common.confirmSubmit'), this.$t('common.tip'), {}).then(
                        async () => {
                            this.editLoading = true;
                            const data = Object.assign({}, this.formData);
                            const _result = await this.$api.goodsType.save(data);
                            if (_result.succeed === 1 && _result.code === 200) {
                                const _goodsType = this.paginated.list.find(
                                    (v) => v.id === _result.data.id
                                );
                                if (!_goodsType) {
                                    this.paginated.list.unshift(_result.data);
                                } else {
                                    Object.assign(_goodsType, _result.data);
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
        handleDeleteParam(idx) {
            const index = this.formData.params.findIndex((v) => v.idx === idx);
            if (index !== -1) {
                this.formData.params.splice(index, 1);
            }
        },
        handleDeleteSpec(idx) {
            const index = this.formData.specs.findIndex((v) => v.idx === idx);
            if (index !== -1) {
                this.formData.specs.splice(index, 1);
            }
        },
        handleAddParam() {
            this.formData.params.push({
                idx: this.formData.params.length,
                id: 0,
                name: `${this.$t('goods.parameter')} ${this.formData.params.length}`,
                type: 'text',
                values: '',
            });
        },
        handleAddSpec() {
            this.formData.specs.push({
                idx: this.formData.specs.length,
                id: 0,
                name: `${this.$t('goods.attributeSpec')} ${this.formData.specs.length}`,
                sort: 0,
            });
        },
        queryParams(queryString, cb) {
            const _searchKey = queryString ? { name: queryString } : {};
            this.$api.goodsParam
                .list({ searchKey: _searchKey })
                .then((result) => {
                    if (result.succeed === 1 && result.code === 200) {
                        for (const param of result.data.list) {
                            param.value = param.name;
                        }
                    }
                    cb(result.data.list);
                })
                .catch((err) => {
                    this.$notify.error({
                        title: this.$t('common.error'),
                        message: err,
                    });
                });
        },
        handleSelectParam(item, idx) {
            const _param = this.formData.params.find((v) => v.idx === idx);
            if (_param) {
                Object.assign(_param, item);
            }
            console.log(_param);
        },
        querySpecs(queryString, cb) {
            const _searchKey = queryString ? { name: queryString } : {};
            this.$api.goodsSpec
                .list({ searchKey: _searchKey })
                .then((result) => {
                    if (result.succeed === 1 && result.code === 200) {
                        for (const param of result.data.list) {
                            param.value = param.name;
                        }
                    }
                    cb(result.data.list);
                })
                .catch((err) => {
                    this.$notify.error({
                        title: this.$t('common.error'),
                        message: err,
                    });
                });
        },
        handleSelectSpec(item, idx) {
            const _spec = this.formData.specs.find((v) => v.idx === idx);
            if (_spec) {
                if (item.values) {
                    item.values = item.values.replace(/\|/g, ' ');
                }
                Object.assign(_spec, item);
            }
        },
    },
};
</script>

<style scoped lang="scss"></style>
