<template>
    <div class="article-type-container">
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :size="normalSize">
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

        <!--表格树内容栏-->
        <el-table
            v-loading="loading"
            :data="articleTypeTreeData"
            element-loading-text="$t('action.loading')"
            :size="normalSize"
            stripe
            style="width: 100%"
        >
            <el-table-column align="center" label="ID" min-width="60" prop="id" />
            <table-tree-column
                :label="$t('articleType.name')"
                min-width="280"
                prop="typeName"
                tree-key="id"
                @send-tree-data="getTreeData"
            />
            <el-table-column
                :label="$t('articleType.parentName')"
                min-width="160"
                prop="parentName"
            />
            <el-table-column :label="$t('action.operation')" fixed="right" min-width="200">
                <template #default="scope">
                    <ext-button
                        :label="$t('action.edit')"
                        icon="el-icon-ali-bianji"
                        perms="marketing:article_type:edit"
                        @click="handleEdit(scope.row)"
                    />
                    <ext-button
                        :label="$t('action.delete')"
                        icon="el-icon-ali-shanchu"
                        perms="marketing:article_type:delete"
                        type="danger"
                        @click="handleDelete(scope.row)"
                    />
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增修改界面 -->
        <el-dialog
            :close-on-click-modal="false"
            :title="!formData.id ? $t('action.add') : $t('action.edit')"
            :model-value="dialogVisible"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="dataRule"
                :size="normalSize"
                label-width="80px"
                @keyup.enter="submitForm()"
            >
                <el-row>
                    <el-col :span="16">
                        <el-form-item :label="$t('articleType.parentName')" prop="parentName">
                            <popup-tree-input
                                :current-change-handle="handleTreeSelectChange"
                                :data="popupTreeData"
                                :node-key="'' + formData.pid"
                                :prop="
                                    formData.parentName === null || formData.parentName === ''
                                        ? 'typeName'
                                        : 'typeName'
                                "
                                :props="defaultProps"
                                :placeholder="$t('articleType.selectParentCategory')"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('articleType.sort')" prop="sort">
                            <el-input-number
                                v-model="formData.sort"
                                :min="0"
                                controls-position="right"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="$t('articleType.name')" prop="typeName">
                    <el-input
                        v-model="formData.typeName"
                        :placeholder="$t('articleType.inputName')"
                    />
                </el-form-item>
                <el-form-item :label="$t('articleType.desc')" prop="description">
                    <el-input
                        v-model="formData.description"
                        :placeholder="$t('articleType.inputDesc')"
                        type="textarea"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :size="normalSize" round @click="dialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button
                        :loading="submitLoading"
                        :size="normalSize"
                        round
                        type="primary"
                        @click="submitForm()"
                    >
                        {{ $t('action.submit') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import tableTreeColumn from '@/components/core/table_tree_column.vue';
import popupTreeInput from '@/components/popup_tree_input.vue';
import breadCrumb from '@/components/bread_crumb.vue';
import extButton from '@/components/core/ext_button.vue';
/**
    id         主键
    pid        父id
    type_name  分类名称
    created_at 文章创建时间
    updated_at 修改时间
*/
export default {
    components: {
        popupTreeInput,
        tableTreeColumn,
        breadCrumb,
        extButton,
    },
    inject: ['reload'],
    data() {
        return {
            normalSize: 'default',

            loading: false,
            articleTypeTreeData: [],
            dialogVisible: false,
            formData: {
                id: 0,
                typeName: '',
                pid: 0,
                parentName: '',
            },
            popupTreeProps: {},
        };
    },
    computed: {
        // 响应式的表单验证规则
        dataRule() {
            return {
                typeName: [
                    {
                        required: true,
                        message: this.$t('articleType.nameRequired'),
                        trigger: 'blur',
                    },
                ],
            };
        },
        // 响应式的顶级类型名称
        topLevelTypeName() {
            return this.$t('articleType.topLevel');
        },
    },
    mounted() {
        this.getArticleTypeTree();
    },
    methods: {
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },
        getTreeData(data) {
            if (data) {
                this.articleTypeTreeData = data;
            } else {
                console.log('data 这空值');
            }
        },
        // 获取数据
        async getArticleTypeTree() {
            this.loading = true;
            const _result = await this.$api.articleType.getTree();
            if (_result.succeed === 1 && _result.code === 200) {
                this.articleTypeTreeData = _result.data.list;
                this.loading = false;
            }
        },
        // 显示新增界面
        handleAdd() {
            this.dialogVisible = true;
            this.formData = {
                id: 0,
                typeName: '',
                pid: 0,
                parentName: '',
            };
        },
        // 显示编辑界面
        handleEdit(row) {
            this.dialogVisible = true;
            Object.assign(this.formData, row);
        },
        // 删除
        handleDelete(row) {
            this.$confirm(this.$t('common.confirmDelete'), this.$t('common.tip'), {
                type: 'warning',
            }).then(async () => {
                const params = this.getDeleteIds([], row);
                const _result = await this.$api.articleType.destroy({ ids: params });
                if (_result.succeed === 1 && _result.code === 200) {
                    this.articleTypeTreeData = this.removeTreeItemsByIds(
                        this.articleTypeTreeData,
                        params
                    );
                    this.$notify({
                        title: this.$t('common.success'),
                        message: this.$t('articleType.deleteSuccess'),
                        type: 'success',
                    });
                }
            });
        },
        // 获取删除的包含子分类的id列表
        getDeleteIds(ids, row) {
            ids.push(row.id);
            if (row.children !== null) {
                for (let i = 0, len = row.children.length; i < len; i++) {
                    this.getDeleteIds(ids, row.children[i]);
                }
            }
            return ids;
        },
        // 分类树选中
        handleTreeSelectChange(data, node) {
            this.formData.pid = data.id;
            this.formData.parentName = data.typeName;
        },
        // 表单提交
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(
                        this.$t('permission.confirmSubmit'),
                        this.$t('common.tip'),
                        {}
                    ).then(async () => {
                        this.editLoading = true;
                        const params = Object.assign({}, this.formData);
                        const _result = await this.$api.articleType.save(params);

                        this.editLoading = false;
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _parentId = _result.data.pid;
                            const _parentTreeItem = this.getTreeItemById(
                                this.articleTypeTreeData,
                                _parentId
                            );

                            if (_parentTreeItem && Array.isArray(_parentTreeItem.children)) {
                                const _treeItem = _parentTreeItem.children.filter(
                                    (v) => v.id === _result.data.id
                                );
                                if (_treeItem.length === 0) {
                                    _result.data.level =
                                        _parentId === 0 ? 1 : _parentTreeItem.level + 1;
                                    _parentTreeItem.children.push(_result.data);
                                } else {
                                    Object.assign(_treeItem[0], _result.data);
                                }

                                if (_parentTreeItem._expanded) {
                                    if (_treeItem.length === 0) {
                                        const _preTreeItem =
                                            _parentTreeItem.children.length > 1
                                                ? _parentTreeItem.children[
                                                      _parentTreeItem.children.length - 2
                                                  ]
                                                : _parentTreeItem;
                                        this.articleTypeTreeData = this.articleTypeTreeData
                                            .splice(
                                                0,
                                                this.articleTypeTreeData.findIndex(
                                                    (v) => v.id === _preTreeItem.id
                                                ) + 1
                                            )
                                            .concat(_result.data)
                                            .concat(this.articleTypeTreeData);
                                    } else {
                                        const _filterItem = this.articleTypeTreeData.filter(
                                            (v) => v.id === _result.data.id
                                        );
                                        Object.assign(_filterItem[0], _result.data);
                                    }
                                }
                            } else {
                                const _treeItem = this.articleTypeTreeData.filter(
                                    (v) => v.id === _result.data.id
                                );
                                if (_treeItem.length === 0) {
                                    _result.data.level = 1;
                                    this.articleTypeTreeData.push(_result.data);
                                } else {
                                    Object.assign(_treeItem[0], _result.data);
                                }
                            }

                            console.log('保存后的 articleTypeTreeData: ', this.articleTypeTreeData);
                            this.$notify({
                                title: this.$t('common.success'),
                                message: _result.description,
                                type: 'success',
                            });
                            this.$refs.formData.resetFields();
                            this.dialogVisible = false;
                        } else {
                            this.$notify({
                                title: this.$t('common.fail'),
                                message: _result.description,
                                type: 'error',
                            });
                        }
                    });
                }
            });
        },
        // 根据ID获取树形数据中的项目
        getTreeItemById(treeDatas, id) {
            let childTreeItem, treeItem, i;
            for (i = treeDatas.length; i; ) {
                treeItem = treeDatas[--i];
                if (id === treeItem.id) return treeItem;
                if (treeItem.children) {
                    childTreeItem = this.getTreeItemById(treeItem.children, id);
                    if (childTreeItem) return childTreeItem;
                }
            }
        },
        // 根据ID数组移除树形数据中的项目
        removeTreeItemsByIds(treeDatas, ids) {
            const _treeItemDatas = treeDatas.filter((x) => !ids.includes(x.id));
            _treeItemDatas.forEach(
                (x) => x.children && (x.children = this.removeTreeItemsByIds(x.children, ids))
            );
            return _treeItemDatas;
        },
    },
};
</script>

<style scoped lang="scss">
.top-bar {
    display: flex;
    justify-content: flex-end;
}
</style>
