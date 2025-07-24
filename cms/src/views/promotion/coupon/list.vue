<template>
    <div class="page-container">
        <!--导航与工具栏-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :model="filters" :size="normalSize">
                    <el-form-item>
                        <el-input v-model="filters.value" placeholder="请输入内容">
                            <el-select
                                #prepend
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
                            <ext-button
                                #append
                                :label="$t('action.search')"
                                icon="el-icon-ali-chazhaobiaodanliebiao"
                                perms="promotion:coupon:view"
                                type="primary"
                                @click="queryForPaginatedList()"
                            />
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip content="刷新" placement="top">
                                <el-button
                                    icon="el-icon-ali-shuaxin"
                                    round
                                    @click="queryForPaginatedList()"
                                />
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
            alias-name="coupon"
            @query-for-paginated-list="queryForPaginatedList"
        />
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
            normalSize: 'default',
            smallSize: 'small',
            filters: {
                key: 'name',
                value: '',
            },
            props: [{ prop: 'name', label: '优惠券名称' }],
            promotionId: 0,
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                {
                    prop: 'promotion.name',
                    label: '优惠券名称',
                    minWidth: 150,
                    showOverflowTooltip: true,
                },
                { prop: 'couponCode', label: '优惠券号码', minWidth: 140 },
                { prop: 'recipients.username', label: '领取者', minWidth: 70 },
                {
                    prop: 'isUsed',
                    label: '是否使用',
                    minWidth: 70,
                    formatter: this.env.columnFormatter,
                },
                { prop: 'user.username', label: '使用者', minWidth: 100 },
                {
                    prop: 'createdAt',
                    label: '生成时间',
                    minWidth: 130,
                    formatter: this.env.formatDateTime,
                },
            ],
            operations: [
                {
                    label: 'action.delete',
                    icon: 'el-icon-ali-shanchu',
                    perms: 'promotion:coupon:delete',
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
            permsBatchDelete: 'promotion:coupon:delete',
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
    created() {
        let _promotionId = this.$route.query.promotionId;
        if (_promotionId) {
            this.promotionId = _promotionId;
        }
    },
    mounted() {},
    methods: {
        // 获取分页数据
        async queryForPaginatedList(data) {
            if (data && data.attrs) {
                this.paginated.attrs = data.attrs;
            }
            this.paginated.attrs.searchKey = { promotionId: this.promotionId };
            if (this.filters.key && this.filters.value) {
                this.paginated.attrs.searchKey[this.filters.key] = this.filters.value;
            }
            const _result = await this.$api.coupon.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.coupon.destroy({ ids });
            if (_result.succeed === 1 && _result.code === 200) {
                for (const id of ids) {
                    const _index = this.paginated.list.findIndex((v) => v.id === id);
                    this.paginated.list.splice(_index, 1);
                }
            }
        },
    },
};
</script>

<style scoped lang="scss"></style>
