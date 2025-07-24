<template>
    <div>
        <ext-button :size="miniSize" label="选择地区" type="primary" @click="handlePickArea()">
            <i class="el-icon-ali-Newxuanzeshangpinxuanzhong"></i>
        </ext-button>
        <el-dialog
            v-model:visible="dialogVisible"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            :size="largeSize"
            title="区域选择窗"
            width="40%"
        >
            <el-tree
                ref="areaTree"
                :default-checked-keys="areaIds"
                :load="loadNode"
                :props="props"
                lazy
                node-key="id"
                show-checkbox
            />
            <template #footer>
                <span class="dialog-footer">
                    <el-button :size="miniSize" round @click="dialogVisible = false">
                        取 消
                    </el-button>
                    <el-button :size="miniSize" round type="primary" @click="chosedAreas">
                        >确 定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash';
import extButton from '@/components/core/ext_button.vue';
export default {
    name: 'PickAreas',
    components: {
        extButton,
    },
    props: {
        areaIds: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    data() {
        return {
            miniSize: 'default',
            largeSize: 'large',
            loading: false,
            dialogVisible: false,
            props: {
                id: 'id',
                label: 'name',
                children: 'children',
                isLeaf: 'leaf',
            },
        };
    },
    mounted() {},
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
