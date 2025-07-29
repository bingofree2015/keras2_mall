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
                            <el-tooltip content="新增" placement="top">
                                <el-button round @click="handleAdd">
                                    <i class="el-icon-ali-add"></i>
                                </el-button>
                            </el-tooltip>
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
            :title="isCreating ? '新增' : '编辑'"
            :model-value="editDialogVisible"
            width="60%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                :size="largeSize"
                label-width="80px"
            >
                <el-form-item label="类型名称" prop="name">
                    <el-input v-model="formData.name" />
                </el-form-item>
                <el-tabs v-model="activeName">
                    <el-tab-pane name="params">
                        <template #label>
                            <span>
                                <i class="el-icon-ali-shangpincanshu"></i>
                                商品参数
                            </span>
                        </template>
                        <el-table :data="formData.params" style="width: 100%">
                            <el-table-column label="参数名称" min-width="240" prop="name">
                                <template #default="scope">
                                    <el-autocomplete
                                        v-model="scope.row.name"
                                        :fetch-suggestions="queryParams"
                                        placeholder="请输入内容"
                                        @select="(item) => handleSelectParam(item, scope.row.idx)"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                label="参数类型"
                                min-width="120"
                                prop="type"
                            >
                                <template #default="scope">
                                    <el-select v-model="scope.row.type" placeholder="请选择">
                                        <el-option label="文本框" value="text" />
                                        <el-option label="单选" value="radio" />
                                        <el-option label="复选框" value="checkbox" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="参数选项" min-width="280" prop="values">
                                <template #default="scope">
                                    <el-input v-model="scope.row.values" placeholder="空格分隔" />
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                fixed="right"
                                label="操作"
                                min-width="80"
                            >
                                <template #header>
                                    <el-button
                                        round
                                        style="float: right"
                                        type="primary"
                                        @click.prevent="handleAddParam()"
                                    >
                                        添加
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
                                商品属性
                            </span>
                        </template>
                        <el-table :data="formData.specs" style="width: 100%">
                            <el-table-column label="属性名称" min-width="240" prop="name">
                                <template #default="scope">
                                    <el-autocomplete
                                        v-model="scope.row.name"
                                        :fetch-suggestions="querySpecs"
                                        placeholder="请输入内容"
                                        @select="(item) => handleSelectSpec(item, scope.row.idx)"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                label="排序"
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
                            <el-table-column label="属性值" min-width="280" prop="values">
                                <template #default="scope">
                                    <el-input v-model="scope.row.values" placeholder="空格分隔" />
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                fixed="right"
                                label="操作"
                                min-width="80"
                            >
                                <template #header>
                                    <el-button
                                        round
                                        style="float: right"
                                        type="primary"
                                        @click.prevent="handleAddSpec()"
                                    >
                                        添加
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
            props: [{ prop: 'name', label: '类型名称' }],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'name', label: '类型名称', minWidth: 80 },
                {
                    prop: 'specValues',
                    label: '属性(规格)',
                    minWidth: 120,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'paramValues',
                    label: '参数',
                    minWidth: 120,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'createdAt',
                    label: '创建时间',
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
                        this.$confirm('确认删除选中记录吗？', '提示', {
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
            formDataRules: {
                name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
            },
            activeName: 'params',
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
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
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
                name: `参数 ${this.formData.params.length}`,
                type: 'text',
                values: '',
            });
        },
        handleAddSpec() {
            this.formData.specs.push({
                idx: this.formData.specs.length,
                id: 0,
                name: `属性 ${this.formData.specs.length}`,
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
                        title: '错误',
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
                        title: '错误',
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
