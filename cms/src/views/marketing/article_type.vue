<template>
    <div class="article-type-container">
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :size="largeSize">
                    <el-form-item>
                        <ext-button
                            :label="$t('action.add')"
                            icon="el-icon-ali-add"
                            perms="marketing:article_type:add"
                            type="primary"
                            @click="handleAdd"
                        />
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

        <!--表格树内容栏-->
        <el-table
            v-loading="loading"
            :data="articleTypeTreeData"
            element-loading-text="$t('action.loading')"
            :size="miniSize"
            stripe
            style="width: 100%"
        >
            <el-table-column align="center" label="ID" min-width="60" prop="id" />
            <table-tree-column
                label="名称"
                min-width="280"
                prop="typeName"
                tree-key="id"
                @send-tree-data="getTreeData"
            />
            <el-table-column label="上级分类" min-width="160" prop="parentName" />
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
            :title="!formData.id ? '新增' : '修改'"
            :model-value="dialogVisible"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="dataRule"
                :size="largeSize"
                label-width="80px"
                @keyup.enter="submitForm()"
            >
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="上级分类" prop="parentName">
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
                                placeholder="请选择上级分类"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排序" prop="sort">
                            <el-input-number
                                v-model="formData.sort"
                                :min="0"
                                controls-position="right"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="分类名称" prop="typeName">
                    <el-input v-model="formData.typeName" placeholder="请输入分类名称" />
                </el-form-item>
                <el-form-item label="分类描述" prop="description">
                    <el-input
                        v-model="formData.description"
                        placeholder="请输入分类描述"
                        type="textarea"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :size="miniSize" round @click="dialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button
                        :loading="submitLoading"
                        :size="miniSize"
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
    data() {
        return {
            largeSize: 'large',
            miniSize: 'default',
            loading: false,
            articleTypeTreeData: [],
            dialogVisible: false,
            formData: {
                id: 0,
                typeName: '',
                pid: 0,
                parentName: '',
            },
            dataRule: {
                typeName: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
            },
            popupTreeProps: {
                label: 'typeName',
                children: 'children',
            },
        };
    },
    computed: {
        popupTreeData() {
            const _data = this.articleTypeTreeData.filter((x) => x.pid === 0);
            const parent = {
                pid: 0,
                typeName: '顶级分类',
                children: _data,
            };
            return [parent];
        },
    },
    watch: {
        articleTypeTreeData: {
            // 深度监听，可监听到对象、数组的变化
            handler(val, oldVal) {
                console.log(
                    `articleTypeTreeData变化: ${oldVal ? oldVal.length : 0} -> ${
                        val ? val.length : 0
                    }`
                ); // 但是这两个值打印出来却都是一样的
            },
            deep: true,
        },
    },
    mounted() {
        this.getArticleTypeTree();
    },
    methods: {
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
            this.$confirm('确认删除选中记录吗？', '提示', {
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
                        title: '成功',
                        message: '删除成功',
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
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
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
                                title: '成功',
                                message: _result.description,
                                type: 'success',
                            });
                            this.$refs.formData.resetFields();
                            this.dialogVisible = false;
                        } else {
                            this.$notify({
                                title: '失败',
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
