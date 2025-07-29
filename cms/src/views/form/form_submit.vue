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
                                    perms="form:form_submit:view"
                                    type="primary"
                                    @click="queryForPaginatedList()"
                                />
                            </template>
                        </el-input>
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
            title="表单提交明细"
            width="50%"
        >
            <el-form :line="true" :size="normalSize">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="表单名称:" prop="formName">
                            <span>{{ formData.formName }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户:" prop="user.username">
                            <span>{{ formData.user.username }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="是否支付:" prop="payState">
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
                        <el-form-item label="支付金额:" prop="money">
                            <span>{{ formData.money }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="表单类型:" prop="form.type">
                            <span>
                                {{ env.columnFormatter(formData.form.type, 'form', 'type') }}
                            </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态:" prop="state">
                            <span>
                                {{ env.columnFormatter(formData.state, 'form_submit', 'state') }}
                            </span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="创建时间:" prop="createdAt">
                            <span>{{ formData.createdAt }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="更新时间:" prop="updatedAt">
                            <span>{{ formData.updatedAt }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="表单反馈:" prop="feedback">
                            {{ formData.feedback }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table :data="formData.formItems" stripe style="width: 100%">
                            <el-table-column label="字段名" min-width="120" prop="name" />
                            <el-table-column label="字段值" min-width="240" prop="formItemValue" />
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
            title="反馈表单"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                :size="normalSize"
                label-width="80px"
            >
                <el-form-item label="反馈" prop="feedback">
                    <el-input
                        v-model="formData.feedback"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        placeholder="请输入内容"
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
            normalSize: 'large',
            filters: {
                key: 'name',
                value: '',
            },
            props: [{ prop: 'name', label: '表单名称' }],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                {
                    prop: 'formName',
                    label: '表单名称',
                    minWidth: 150,
                    showOverflowTooltip: true,
                },
                { prop: 'user.username', label: '用户名', minWidth: 90 },
                { prop: 'ip', label: '用户IP', minWidth: 100 },
                {
                    prop: 'state',
                    label: '状态',
                    minWidth: 80,
                    formatter: this.env.columnFormatter,
                },
                { prop: 'feedback', label: '反馈', minWidth: 80, showOverflowTooltip: true },
                { prop: 'money', label: '支付金额', minWidth: 95 },
                {
                    prop: 'payState',
                    label: '支付状态',
                    minWidth: 95,
                    formatter: this.env.columnFormatter,
                },
                { prop: 'createdAt', label: '提交时间', minWidth: 135 },
                { prop: 'updatedAt', label: '更新时间', minWidth: 135 },
            ],
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
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
                        this.$confirm('确认删除选中记录吗？', '提示', {
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
            formDataRules: {
                feedback: [{ required: true, message: '请输入内容', trigger: 'blur' }],
            },
            viewDialogVisible: false,

            feedbackDialogVisible: false,
            editLoading: false,
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
            const _result = await this.$api.formSubmit.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 表单明细
        async getFormSubmitDetail(submitId) {
            const _result = await this.$api.formSubmit.get({ id: submitId });
            if (_result.succeed === 1 && _result.code === 200) {
                Object.assign(this.formData, _result.data);
            }
        },
        // 提交表单数据
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, _.pick(this.formData, ['id', 'feedback']));
                        const _result = await this.$api.formSubmit.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _formSubmit = this.paginated.list.find(
                                (v) => v.id === _result.data.id
                            );
                            if (!_formSubmit) {
                                this.paginated.list.unshift(_result.data);
                            } else {
                                Object.assign(_formSubmit, _result.data);
                            }
                            this.$notify({
                                title: '成功',
                                message: _result.description,
                                type: 'success',
                            });
                            this.feedbackDialogVisible = false;
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: _result.description,
                            });
                        }
                        this.editLoading = false;
                    });
                }
            });
        },
    },
};
</script>

<style scoped lang="scss"></style>
