<template>
    <!--备份还原界面-->
    <el-dialog
        :close-on-click-modal="false"
        :modal="false"
        :title="$t('common.backupRestore')"
        v-bind="$attrs"
        width="40%"
        v-on="$attrs"
    >
        <el-divider />
        <el-table
            v-loading="loading"
            :data="paginatedData.list"
            :element-table-loading-text="$t('action.loading')"
            :size="normalSize"
            @selection-change="selectionChange"
        >
            <el-table-column min-width="40" type="selection" />
            <el-table-column
                :label="$t('database.path')"
                min-width="180"
                prop="path"
                show-overflow-tooltip
            />
            <el-table-column
                :formatter="env.formatDateTime"
                :label="$t('database.time')"
                min-width="140"
                prop="createdAt"
            />
            <el-table-column :label="$t('action.operation')" fixed="right" min-width="140">
                <template #default="scope">
                    <el-button
                        :size="miniSize"
                        round
                        type="primary"
                        @click="handleRestore(scope.row)"
                    >
                        {{ $t('common.restore') }}
                    </el-button>
                    <el-button
                        :size="miniSize"
                        round
                        type="danger"
                        @click="handleDelete(scope.row)"
                    >
                        {{ $t('action.delete') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页栏-->
        <div style="padding: 10px">
            <el-button
                :disabled="selections.length === 0"
                :size="miniSize"
                round
                style="float: left"
                type="danger"
                @click="handleBatchDelete"
            >
                {{ $t('action.batchDelete') }}
            </el-button>
            <el-pagination
                :current-page="paginatedAttr.currPage"
                :page-size="pageSize"
                :total="paginatedData.count"
                layout="total, prev, pager, next, jumper"
                style="float: right"
                @current-change="handleCurrentChange"
            />
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button round @click="$emit('update:visible', false)">
                    {{ $t('action.cancel') }}
                </el-button>
                <el-button round type="primary" @click="handleBackup">
                    {{ $t('common.backup') }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
export default {
    components: {},
    emits: ['update:visible'],
    data() {
        return {
            normalSize: 'large',
            miniSize: 'default',
            paginatedAttr: { searchKey: {}, currPage: 1, offset: 0, limit: 9 },
            paginatedData: { list: [], count: 0 },
            pageSize: 5,

            loading: false, // 表内容加载标识
            selections: [], // 列表选中列
        };
    },
    mounted() {
        this.queryForPaginatedList();
    },
    methods: {
        // 获取分页数据
        async queryForPaginatedList(data) {
            this.loading = true;
            if (data && data.paginatedAttr) {
                this.paginatedAttr = data.paginatedAttr;
            }
            this.paginatedAttr.searchKey = {};
            const _result = await this.$api.db.list(this.paginatedAttr);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginatedData = _result.data;
            } else {
                this.$notify.error({
                    title: this.$t('common.error'),
                    message: _result.description,
                });
            }
            this.loading = false;
        },

        // 换页刷新
        handleCurrentChange(currPage) {
            this.paginatedAttr.currPage = currPage;
            this.paginatedAttr.offset = (currPage - 1) * this.pageSize;
            this.queryForPaginatedList();
        },

        // 选择切换
        selectionChange(selections) {
            this.selections = selections;
        },

        // 删除
        async handleDelete(row) {
            this.loading = true;
            const _result = await this.$api.db.destroy({ ids: [row.id] });
            if (_result.succeed === 1 && _result.code === 200) {
                this.$notify({
                    title: this.$t('common.success'),
                    message: _result.description,
                    type: 'success',
                });
                this.queryForPaginatedList();
            } else {
                this.$notify.error({
                    title: this.$t('common.error'),
                    message: _result.description,
                });
            }
            this.loading = false;
        },

        // 批量删除
        async handleBatchDelete() {
            this.loading = true;
            const _ids = [];
            this.selections.map((item) => {
                _ids.push(item.id);
            });
            const _result = await this.$api.db.destroy({ ids: _ids });
            if (_result.succeed === 1 && _result.code === 200) {
                this.$notify({
                    title: this.$t('common.success'),
                    message: _result.description,
                    type: 'success',
                });
                this.queryForPaginatedList();
            } else {
                this.$notify.error({
                    title: this.$t('common.error'),
                    message: _result.description,
                });
            }
            this.loading = false;
        },

        // 数据备份
        async handleBackup() {
            this.loading = true;
            const _result = await this.$api.db.backup();
            if (_result.succeed === 1 && _result.code === 200) {
                this.$notify({
                    title: this.$t('common.success'),
                    message: this.$t('database.backupSuccess'),
                    type: 'success',
                });
                await this.queryForPaginatedList();
            } else {
                this.$notify.error({
                    title: this.$t('common.error'),
                    message: _result.description,
                });
            }
            this.loading = false;
        },

        // 数据还原
        async handleRestore(row) {
            this.loading = true;
            const _result = await this.$api.db.restore({ id: row.id });
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
            this.loading = false;
        },
    },
};
</script>

<style scoped lang="scss">
.el-dialog__body {
    padding: 5px 10px;
}
</style>
