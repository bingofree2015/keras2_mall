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
                                    perms="form:form_submit:view"
                                    type="primary"
                                    @click="handleRefresh"
                                />
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
            alias-name="form_submit"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <el-dialog
            :close-on-click-modal="false"
            :model-value="viewDialogVisible"
            class="dialog-container"
            :title="$t('formSubmit.detailTitle')"
            width="50%"
        >
            <el-form :line="true" :size="normalSize">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('formSubmit.formName') + ':'" prop="formName">
                            <span>{{ formData.formName }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('formSubmit.user') + ':'" prop="user.username">
                            <span>{{ formData.user.username }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('formSubmit.payState') + ':'" prop="payState">
                            <span>
                                {{
                                    env.columnFormatter(
                                        formData.payState,
                                        'form_submit',
                                        'payState'
                                    )
                                }}
                            </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('formSubmit.money') + ':'" prop="money">
                            <span>{{ formData.money }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('formSubmit.type') + ':'" prop="form.type">
                            <span>
                                {{ env.columnFormatter(formData.form.type, 'form', 'type') }}
                            </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('formSubmit.state') + ':'" prop="state">
                            <span>
                                {{ env.columnFormatter(formData.state, 'form_submit', 'state') }}
                            </span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('formSubmit.createdAt') + ':'" prop="createdAt">
                            <span>{{ formData.createdAt }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('formSubmit.updatedAt') + ':'" prop="updatedAt">
                            <span>{{ formData.updatedAt }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('formSubmit.feedback') + ':'" prop="feedback">
                            {{ formData.feedback }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table :data="formData.formItems" stripe style="width: 100%">
                            <el-table-column
                                :label="$t('formSubmit.fieldName')"
                                min-width="120"
                                prop="name"
                            />
                            <el-table-column
                                :label="$t('formSubmit.fieldValue')"
                                min-width="240"
                                prop="formItemValue"
                            />
                        </el-table>
                    </el-col>
                </el-row>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button
                        :size="normalSize"
                        round
                        type="primary"
                        @click="viewDialogVisible = false"
                    >
                        {{ $t('action.comfirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog
            :close-on-click-modal="false"
            :model-value="feedbackDialogVisible"
            :title="$t('formSubmit.feedbackTitle')"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                :size="normalSize"
                label-width="80px"
            >
                <el-form-item :label="$t('formSubmit.feedback')" prop="feedback">
                    <el-input
                        v-model="formData.feedback"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        :placeholder="$t('common.inputPlaceholder')"
                        type="textarea"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button
                        :size="normalSize"
                        round
                        type="danger"
                        @click="feedbackDialogVisible = false"
                    >
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button
                        :size="normalSize"
                        round
                        type="primary"
                        @click="submitForm"
                        @load="editLoading"
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
            normalSize: 'large',
            filters: {
                key: 'name',
                value: '',
            },
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            columns: [
                { prop: 'formName', label: this.$t('form.formName') },
                { prop: 'user.username', label: this.$t('formSubmit.user') },
                { prop: 'payState', label: this.$t('formSubmit.payState') },
                { prop: 'money', label: this.$t('formSubmit.money') },
                { prop: 'state', label: this.$t('formSubmit.state') },
                { prop: 'createdAt', label: this.$t('formSubmit.createdAt') },
                { prop: 'updatedAt', label: this.$t('formSubmit.updatedAt') },
            ],
            operations: [
                // 明细  formSubmitDetail
                {
                    label: 'action.detail', // 按钮上显示的文字
                    icon: 'el-icon-ali-mingxi', // 按钮文字前面的图标
                    perms: 'form:form_submit:view', // 权限标识
                    size: this.normalSize, // 按钮大小
                    // type: 'primary',                  // 按钮类型
                    func: (row) => {
                        // 明细窗口
                        this.viewDialogVisible = true;
                        this.$nextTick(async () => {
                            await this.getFormSubmitDetail(row.id);
                        });
                    },
                },
                // 反馈  editformSubmit
                {
                    label: 'action.feedback',
                    icon: 'el-icon-ali-feedback',
                    perms: 'form:form_submit:edit',
                    size: this.normalSize,
                    func: (row) => {
                        // 反馈
                        Object.assign(this.formData, row);
                        this.feedbackDialogVisible = true;
                    },
                },
                // 删除  delSubmit
                {
                    label: 'action.delete',
                    icon: 'el-icon-ali-shanchu',
                    perms: 'form:form_submit:delete',
                    size: this.normalSize,
                    func: (row) => {
                        this.$confirm(this.$t('common.confirmDelete'), this.$t('common.tip'), {
                            type: 'warning',
                        }).then(async () => {
                            await this.batchDelete([row.id]);
                        });
                    },
                },
            ],
            formData: {
                formName: '',
                payState: '',
                money: '',
                state: '',
                createdAt: '',
                updatedAt: '',
                feedback: '',
                user: {
                    username: '',
                },
                form: {
                    type: 1,
                },
                formItems: [],
            },
            viewDialogVisible: false,
            feedbackDialogVisible: false,
            operationWidth: 200,
            formDataRules: {
                feedback: [
                    { required: true, message: this.$t('common.required'), trigger: 'blur' },
                ],
            },
        };
    },
    computed: {
        // 响应式的搜索字段配置
        searchFields() {
            return [{ prop: 'name', label: this.$t('form.formName') }];
        },
    },
    mounted() {
        // 初始化数据
        this.$nextTick(() => {
            if (this.$el) {
                this.handleRefresh();
            }
        });
    },
    methods: {
        // 查询分页列表
        async queryForPaginatedList(params) {
            try {
                const result = await this.$api.formSubmit.list(params);
                // 检查组件是否仍然存在
                if (this.$el && result.succeed === 1 && result.code === 200) {
                    // 确保数据结构完整
                    this.paginated = {
                        attrs: {
                            ...this.paginated.attrs,
                            ...result.data.attrs,
                        },
                        list: result.data.list || [],
                    };
                }
                // 调用回调函数关闭loading状态
                if (params.cb) {
                    params.cb();
                }
            } catch (error) {
                console.error('查询分页列表失败:', error);
                // 检查组件是否仍然存在
                if (this.$el) {
                    // 保持原有结构，只清空列表
                    this.paginated.list = [];
                }
                // 即使出错也要调用回调函数关闭loading状态
                if (params.cb) {
                    params.cb();
                }
            }
        },

        // 刷新数据
        handleRefresh() {
            this.queryForPaginatedList(this.paginated.attrs);
        },

        // 获取表单提交详情
        async getFormSubmitDetail(id) {
            try {
                const result = await this.$api.formSubmit.get({ id });
                if (this.$el && result.succeed === 1 && result.code === 200) {
                    Object.assign(this.formData, result.data);
                }
            } catch (error) {
                console.error('获取详情失败:', error);
            }
        },

        // 批量删除
        async batchDelete(ids) {
            try {
                const result = await this.$api.formSubmit.destroy({ ids });
                if (this.$el && result.succeed === 1 && result.code === 200) {
                    this.$message.success(this.$t('common.deleteSuccess'));
                    this.handleRefresh();
                }
            } catch (error) {
                console.error('删除失败:', error);
                if (this.$el) {
                    this.$message.error(this.$t('common.deleteFailed'));
                }
            }
        },

        // 保存反馈
        async saveFeedback() {
            try {
                const result = await this.$api.formSubmit.save(this.formData);
                if (this.$el && result.succeed === 1 && result.code === 200) {
                    this.$message.success(this.$t('common.saveSuccess'));
                    this.feedbackDialogVisible = false;
                    this.handleRefresh();
                }
            } catch (error) {
                console.error('保存反馈失败:', error);
                if (this.$el) {
                    this.$message.error(this.$t('common.saveFailed'));
                }
            }
        },
    },
};
</script>

<style scoped lang="scss"></style>
