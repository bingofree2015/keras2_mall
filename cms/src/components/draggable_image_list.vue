<template>
    <div id="draggable-image-list">
        <transition-group id="draggable-list" class="draggable-list" name="draggable-list" tag="ul">
            <draggable key="drag" :list="items" v-bind="dragOptions" item-key="id" @end="end">
                <template #item="{ element, index }">
                    <li
                        :key="element.id"
                        class="draggable-list-item"
                        :style="{ width: size + 'px', height: size + 'px' }"
                    >
                        <slot :item="element">
                            <img
                                :id="'draggable_' + element.id"
                                :src="env.getImgUrl(element.path)"
                                alt
                                class="draggable-list-item-thumbnail"
                            />
                            <span class="draggable-list-item-actions">
                                <span
                                    class="draggable-list-item-preview"
                                    @click="onPreview('draggable_' + element.id)"
                                >
                                    <i class="el-icon-zoom-in"></i>
                                </span>
                                <span
                                    class="draggable-list-item-delete"
                                    @click="$emit('on-remove', index)"
                                >
                                    <i class="el-icon-delete"></i>
                                </span>
                            </span>
                        </slot>
                    </li>
                </template>
                <div
                    id="draggable-list-item-add"
                    :style="{ lineHeight: size + 'px', width: size + 'px', height: size + 'px' }"
                    class="draggable-list-item"
                    @click="uploadImage"
                >
                    <i class="el-icon-plus"></i>
                </div>
            </draggable>
        </transition-group>
        <multi-uploader v-model="imageDialogVisible" @chosed-image="chosedImage" />
    </div>
</template>

<script>
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import draggable from 'vuedraggable';
import multiUploader from '@/components/multi_uploader.vue';

export default {
    name: 'DraggableImageList',
    components: {
        draggable,
        multiUploader,
    },
    props: {
        items: {
            type: Array,
            default() {
                return [];
            },
        },
        size: {
            type: Number,
            default: 148,
        },
    },
    emits: ['on-remove', 'end', 'chosedImage'],
    data() {
        return {
            imageDialogVisible: false,
            focusing: false,
            draggableItems: [],
        };
    },
    computed: {
        dragOptions() {
            return {
                animation: 0,
                ghostClass: 'draggable-ghost', // 设置拖动元素的class的占位符的类名
            };
        },
    },
    methods: {
        end(evt) {
            this.$emit('end', this.items);
        },
        uploadImage() {
            this.imageDialogVisible = true;
        },
        chosedImage(chosen) {
            this.$emit('chosedImage', chosen);
            this.imageDialogVisible = false;
        },
        onPreview(idx) {
            const el = document.getElementById(idx);
            const viewer = new Viewer(el, {});
            viewer.destroy();
            viewer.show();
        },
    },
};
</script>

<style scoped lang="scss">
i {
    font-style: normal;
}
#draggable-list-item-add {
    //line-height: 148px;
    text-align: center;
    cursor: pointer;
    border: 1px dashed #c0ccda;
    i {
        font-size: 28px;
        color: #8c939d;
    }
}

.draggable-list {
    margin: 0;
    display: inline;
    vertical-align: top;
    padding: 0;
    list-style: none;
    .draggable-list-item {
        -webkit-transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
        transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
        font-size: 14px;
        color: #606266;
        line-height: 1.8;
        margin-top: 5px;
        position: relative;
        overflow: hidden;
        background-color: #fff;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        //width: 148px;
        //height: 148px;
        margin: 0 8px 8px 0;
        display: inline-block;

        :first-child {
            //margin-top: 10px;
        }
    }
    .draggable-list-item-thumbnail {
        width: 100%;
        height: 100%;
    }
    .draggable-list-item-actions {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-transition: opacity 0.3s;
        transition: opacity 0.3s;
        cursor: move;
        .draggable-list-item-delete {
            position: static;
            font-size: inherit;
            color: inherit;
            right: 10px;
            top: 0;
            display: none;
        }
        &:hover {
            opacity: 1;
            span {
                display: inline-block;
            }
        }
        &:after {
            display: inline-block;
            content: '';
            height: 100%;
            vertical-align: middle;
        }
        span {
            display: none;
            cursor: pointer;
        }
        span + span {
            margin-left: 10px;
        }
    }
    .draggable-ghost {
        opacity: 0.5;
        background: #000;
    }
}
</style>
