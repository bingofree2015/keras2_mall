<template>
    <div class="page-container">
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
        </el-row>

        <!--表格内容栏-->
        <ext-table
            :columns="columns"
            :count="paginated.attrs.count"
            :data="paginated.list"
            :page-size="paginated.attrs.limit"
            :show-operation="false"
            @query-for-paginated-list="queryForPaginatedList"
        />
    </div>
</template>

<script>
import breadCrumb from '@/components/bread_crumb.vue';
import extTable from '@/components/core/ext_table.vue';
export default {
    components: {
        breadCrumb,
        extTable,
    },
    data() {
        return {
            normalSize: 'default',
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            formData: {
                id: 0,
                sms: true,
                message: true,
                wxTplMessage: true,
            },
        };
    },
    computed: {
        // 响应式的列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60, showOverflowTooltip: true },
                { prop: 'code', label: this.$t('messageCenter.code'), minWidth: 200, showOverflowTooltip: true },
                {
                    prop: 'sms',
                    label: this.$t('messageCenter.sms'),
                    minWidth: 100,
                    propType: 'bool',
                    clickFlag: true,
                    func: async (id, value) => {
                        this.editDialogVisible = true;
                        this.isCreating = false;
                        this.formData = Object.assign({}, { id, sms: value });
                        await this.save(this.formData);
                    },
                    align: 'center',
                    showOverflowTooltip: true,
                },
                {
                    prop: 'message',
                    label: this.$t('messageCenter.message'),
                    minWidth: 100,
                    propType: 'bool',
                    clickFlag: true,
                    func: async (id, value) => {
                        this.editDialogVisible = true;
                        this.isCreating = false;
                        this.formData = Object.assign({}, { id, message: value });
                        await this.save(this.formData);
                    },
                    align: 'center',
                    showOverflowTooltip: true,
                },
                {
                    prop: 'wxTplMessage',
                    label: this.$t('messageCenter.wxTplMessage'),
                    minWidth: 100,
                    propType: 'bool',
                    clickFlag: true,
                    func: async (id, value) => {
                        this.editDialogVisible = true;
                        this.isCreating = false;
                        this.formData = Object.assign({}, { id, wxTplMessage: value });
                        await this.save(this.formData);
                    },
                    align: 'center',
                    showOverflowTooltip: true,
                },
            ];
        },
    },
    methods: {
        // 获取分页数据
        async queryForPaginatedList(data) {
            if (data && data.attrs) {
                this.paginated.attrs = data.attrs;
            }
            this.paginated.attrs.searchKey = {};
            const _result = await this.$api.messageCenter.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 保存
        async save(data) {
            const _result = await this.$api.messageCenter.save(data);
            if (_result.succeed === 1 && _result.code === 200) {
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
        },
    },
};
</script>

<style scoped lang="scss"></style>
