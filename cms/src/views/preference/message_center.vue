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
            largeSize: 'large',
            smallSize: 'small',
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'code', label: '消息节点', minWidth: 200 },
                {
                    prop: 'sms',
                    label: '短信',
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
                },
                {
                    prop: 'message',
                    label: '站内消息',
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
                },
                {
                    prop: 'wxTplMessage',
                    label: '微信消息',
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
                },
            ],
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
    mounted() {},
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
        },
    },
};
</script>

<style scoped lang="scss"></style>
