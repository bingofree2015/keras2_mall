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
                                    icon="el-icon-ali-chazhaobiaodanliebiao"
                                    perms="wechat:message:view"
                                    type="primary"
                                    @click="queryForPaginatedList()"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <ext-button
                            :label="$t('action.add')"
                            icon="el-icon-ali-add"
                            perms="wechat:message:add"
                            type="primary"
                            @click="handleAdd"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip content="刷新" placement="top">
                                <el-button round @click="queryForPaginatedList()">
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
            alias-name="weixin_message"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--新增编辑界面-->
        <el-dialog
            :close-on-click-modal="false"
            :title="isCreating ? '新增' : '编辑'"
            :model-value="editDialogVisible"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                :size="largeSize"
                label-width="80px"
            >
                <el-form-item label="消息名称" prop="name">
                    <el-input v-model="formData.name" />
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="关注回复" prop="isAttention">
                            <el-switch
                                v-model="formData.isAttention"
                                active-text="开启"
                                inactive-text="关闭"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="默认回复" prop="isDefault">
                            <el-switch
                                v-model="formData.isDefault"
                                active-text="开启"
                                inactive-text="关闭"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="消息类型" prop="type">
                            <el-select v-model="formData.type" placeholder="请选择">
                                <el-option label="文字消息" value="1" />
                                <el-option label="图文消息" value="3" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="禁用" prop="enable">
                            <el-switch
                                v-model="formData.enable"
                                active-text="开启"
                                inactive-text="关闭"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item v-if="formData.type == 1" label="消息内容" prop="params">
                    <el-input
                        v-model="formData.params['content']"
                        :autosize="{ minRows: 4, maxRows: 8 }"
                        type="textarea"
                    />
                </el-form-item>
                <el-alert
                    v-else-if="formData.type == 3"
                    :closable="false"
                    title="请稍后进入图文编辑页面继续编辑，否则图文消息不生效"
                    type="info"
                />
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :size="miniSize" round @click="editDialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button
                        :loading="editLoading"
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
            smallSize: 'small',
            filters: {
                key: 'name',
                value: '',
            },
            props: [{ prop: 'name', label: '消息名称' }],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'name', label: '消息名称', minWidth: 220 },
                {
                    prop: 'type',
                    label: '消息类型',
                    minWidth: 92,
                    formatter: this.env.columnFormatter,
                },
                {
                    prop: 'isAttention',
                    label: '关注回复',
                    minWidth: 92,
                    align: 'center',
                    formatter: this.env.columnFormatter,
                },
                {
                    prop: 'isDefault',
                    label: '默认回复',
                    minWidth: 92,
                    align: 'center',
                    formatter: this.env.columnFormatter,
                },
                {
                    prop: 'enable',
                    label: '禁用',
                    minWidth: 70,
                    align: 'center',
                    formatter: this.env.columnFormatter,
                },
                {
                    prop: 'updatedAt',
                    label: '更新时间',
                    minWidth: 132,
                    formatter: this.env.formatDateTime,
                },
            ],
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.editMedia', // 按钮上显示的文字
                    icon: 'el-icon-ali-bianji', // 按钮文字前面的图标
                    perms: 'wechat:message:edit', // 权限标识
                    size: this.size, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        if (row.type == 3) {
                            this.$router.push({
                                path: '/wechat/message/edit_media_message',
                                query: { id: row.id },
                            });
                        } else {
                            this.$notify({
                                title: '成功',
                                message: '消息类型是为非图文格式',
                                type: 'info',
                            });
                        }
                    },
                },
                {
                    label: 'action.edit', // 按钮上显示的文字
                    icon: 'el-icon-ali-bianji', // 按钮文字前面的图标
                    perms: 'wechat:message:edit', // 权限标识
                    size: this.size, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.editDialogVisible = true;
                        this.isCreating = false;
                        this.formData = Object.assign(this.formData, row);
                        if (!this.formData.params) {
                            this.formData.params = {};
                        }
                    },
                },
                {
                    label: 'action.delete',
                    icon: 'el-icon-ali-shanchu',
                    perms: 'wechat:message:delete',
                    size: this.size,
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
            permsBatchDelete: 'wechat:message:delete',

            isCreating: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                id: 0,
                name: '',
                type: '',
                isAttention: false,
                isDefault: false,
                enable: false,
                params: {
                    content: '',
                },
            },
            formDataRules: {
                name: [{ required: true, message: '请输入消息名称', trigger: 'blur' }],
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
        chosedImage(chosen) {
            this.formData.attachmentId = chosen.id;
            this.formData.attachment = chosen;
            this.$refs.multiUploaderDialog.setUploaderDialogVisible(false);
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
            const _result = await this.$api.weixinMessage.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.weixinMessage.destroy({ ids });
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
                type: '',
                isAttention: false,
                isDefault: false,
                enable: false,
                params: {
                    content: '',
                },
            };
        },
        changeIcon() {
            this.$refs.multiUploaderDialog.setUploaderDialogVisible(true);
        },
        // 表单提交
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, this.formData);
                        const _result = await this.$api.weixinMessage.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _weiXinMessage = this.paginated.list.find(
                                (v) => v.id === _result.data.id
                            );
                            if (!_weiXinMessage) {
                                this.paginated.list.unshift(_result.data);
                            } else {
                                Object.assign(_weiXinMessage, _result.data);
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
