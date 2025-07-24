<template>
    <div>
        <el-link :underline="false" @click="handleOpenDialog">
            <el-image
                :src="env.getImgUrl(iconUrl, env.baseAssetsUrl)"
                :style="initStyle"
                fit="contain"
            >
                <template #error>
                    <div>
                        <i class="el-icon-ali-tupianshibai"></i>
                    </div>
                </template>
            </el-image>
        </el-link>
        <multi-uploader v-model:visible="imageDialogVisible" @chosed-image="chosedImage" />
    </div>
</template>
<script>
import multiUploader from '@/components/multi_uploader.vue';
export default {
    name: 'ChangeImageIcon',
    components: {
        multiUploader,
    },
    props: {
        imgUrl: {
            type: String,
            default: '',
        },
        initStyle: {
            type: Object,
            default() {
                return {
                    height: '80px',
                    width: '80px',
                    border: '1px dashed #d9d9d9',
                    borderRadius: '50%',
                };
            },
        },
    },
    data() {
        return {
            iconUrl: this.imgUrl,
            imageDialogVisible: false,
        };
    },
    watch: {
        imgUrl: function (val) {
            // 监听props中的属性
            this.iconUrl = val;
        },
    },
    methods: {
        handleOpenDialog() {
            this.imageDialogVisible = true;
        },
        chosedImage(chosed) {
            this.iconUrl = chosed.path;
            this.$emit('chosedImageIcon', chosed);
            this.imageDialogVisible = false;
        },
    },
};
</script>
<style scoped lang="scss"></style>
