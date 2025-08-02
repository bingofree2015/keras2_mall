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
                                    perms="wechat:message:view"
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
            alias-name="weixin_message"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--新增编辑界面-->
        <el-dialog
            :close-on-click-modal="false"
            :title="isCreating ? $t('action.add') : $t('action.edit')"
            :model-value="editDialogVisible"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                :size="normalSize"
                label-width="80px"
            >
                <el-form-item :label="$t('wechat.message.name')" prop="name">
                    <el-input v-model="formData.name" />
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            :label="$t('wechat.message.attentionReply')"
                            prop="isAttention"
                        >
                            <el-switch
                                v-model="formData.isAttention"
                                active-text="$t('common.enable')"
                                inactive-text="$t('common.disable')"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('wechat.message.defaultReply')" prop="isDefault">
                            <el-switch
                                v-model="formData.isDefault"
                                active-text="$t('common.enable')"
                                inactive-text="$t('common.disable')"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('wechat.message.type')" prop="type">
                            <el-select
                                v-model="formData.type"
                                :placeholder="$t('common.selectPlaceholder')"
                            >
                                <el-option :label="$t('wechat.message.text')" value="1" />
                                <el-option :label="$t('wechat.message.richText')" value="3" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('common.disable')" prop="enable">
                            <el-switch
                                v-model="formData.enable"
                                :active-text="$t('common.enable')"
                                :inactive-text="$t('common.disable')"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item
                    v-if="formData.type == 1"
                    :label="$t('wechat.message.content')"
                    prop="params"
                >
                    <el-input
                        v-model="formData.params['content']"
                        :autosize="{ minRows: 4, maxRows: 8 }"
                        type="textarea"
                    />
                </el-form-item>
                <el-alert
                    v-else-if="formData.type == 3"
                    :closable="false"
                    :title="$t('wechat.message.richTextTip')"
                    type="info"
                />
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
    inject: ['reload'],
    data() {
        return {
            normalSize: 'default',

            filters: {
                key: 'name',
                value: '',
            },
            props: [{ prop: 'name', label: this.$t('wechat.message.name') }],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'name', label: this.$t('wechat.message.name'), minWidth: 220 },
                {
                    prop: 'type',
                    label: this.$t('wechat.message.type'),
                    minWidth: 92,
                    formatter: this.env.columnFormatter,
                },
                {
                    prop: 'isAttention',
                    label: this.$t('wechat.message.attentionReply'),
                    minWidth: 92,
                    align: 'center',
                    formatter: this.env.columnFormatter,
                },
                {
                    prop: 'isDefault',
                    label: this.$t('wechat.message.defaultReply'),
                    minWidth: 92,
                    align: 'center',
                    formatter: this.env.columnFormatter,
                },
                {
                    prop: 'enable',
                    label: this.$t('common.disable'),
                    minWidth: 70,
                    align: 'center',
                    formatter: this.env.columnFormatter,
                },
                {
                    prop: 'updatedAt',
                    label: this.$t('common.updatedAt'),
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
                    size: this.normalSize, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        if (row.type == 3) {
                            this.$router.push({
                                path: '/wechat/message/edit_media_message',
                                query: { id: row.id },
                            });
                        } else {
                            this.$notify({
                                title: this.$t('common.success'),
                                message: this.$t('wechat.message.nonImageTextTip'),
                                type: 'info',
                            });
                        }
                    },
                },
                {
                    label: 'action.edit', // 按钮上显示的文字
                    icon: 'el-icon-ali-bianji', // 按钮文字前面的图标
                    perms: 'wechat:message:edit', // 权限标识
                    size: this.normalSize, // 按钮大小
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
                    size: this.normalSize,
                    type: 'danger',
                    func: (row) => {
                        this.$confirm(
                            this.$t('permission.confirmDeleteSelected'),
                            this.$t('common.tip'),
                            {
                                type: 'warning',
                            }
                        ).then(async () => {
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
                    this.$confirm(
                        this.$t('permission.confirmSubmit'),
                        this.$t('common.tip'),
                        {}
                    ).then(async () => {
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
                    });
                }
            });
        },
    },
};
</script>

<style scoped lang="scss"></style>
