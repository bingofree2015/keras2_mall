<template>
    <div>
        <ext-button
            :size="normalSize"
            :label="$t('pickArea.button')"
            type="primary"
            @click="handlePickArea()"
        >
            <i class="el-icon-ali-Newxuanzeshangpinxuanzhong"></i>
        </ext-button>
        <Teleport to="body">
            <el-dialog
                v-model="dialogVisible"
                :close-on-click-modal="false"
                :modal-append-to-body="true"
                :size="normalSize"
                :title="$t('pickArea.dialogTitle')"
                width="40%"
            >
                <el-tree
                    ref="areaTree"
                    :default-checked-keys="areaIds"
                    :load="loadNode"
                    :props="treeProps"
                    lazy
                    node-key="id"
                    show-checkbox
                />
                <template #footer>
                    <span class="dialog-footer">
                        <el-button :size="normalSize" round @click="dialogVisible = false">
                            {{ $t('action.cancel') }}
                        </el-button>
                        <el-button :size="normalSize" round type="primary" @click="chosedAreas">
                            {{ $t('action.comfirm') }}
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </Teleport>
    </div>
</template>
<script>
export default {
    name: 'PickArea',
    components: {},
    props: {
        areaIds: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    emits: ['chosedAreas'],
    data() {
        return {
            normalSize: 'default',
            loading: false,
            dialogVisible: false,
            treeProps: {
                id: 'id',
                label: 'name',
                children: 'children',
                isLeaf: 'leaf',
            },
        };
    },
    methods: {
        /**
         * 地区列表
         */
        async getAreaList(parentId) {
            let _data = [];
            const _result = await this.$api.area.list({ searchKey: { parentId } });
            if (_result.succeed === 1 && _result.code === 200) {
                _data = _result.data.list;
            }
            return _data;
        },
        handlePickArea() {
            this.dialogVisible = true;
        },
        chosedAreas() {
            const checkedNodes = this.$refs.areaTree.getCheckedNodes().map((v) => {
                return { id: v.id, name: v.name };
            });
            this.$emit('chosedAreas', checkedNodes);
            this.dialogVisible = false;
        },
        loadNode(node, resolve) {
            if (node.level === 0) {
                this.getAreaList(0).then((data) => {
                    return resolve(data);
                });
            } else if (node.level > 0) {
                this.getAreaList(node.data.id).then((data) => {
                    return resolve(data);
                });
            }
        },
    },
};
</script>
<style scoped lang="scss"></style>
