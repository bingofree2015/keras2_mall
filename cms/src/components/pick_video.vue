<template>
    <div>
        <el-input :value="value" placeholder="请输入视频地址" readonly>
            <template #append>
                <el-button round @click="openVideoUploader">
                    <i class="el-icon-ali-camera_rec"></i>
                    上传视频
                </el-button>
            </template>
        </el-input>
        <video-uploader v-model:visible="videoDialogVisible" @chosed-video="chosedVideo" />
    </div>
</template>
<script>
import videoUploader from '@/components/video_uploader.vue';
export default {
    name: 'PickVideo',
    components: {
        videoUploader,
    },
    model: [
        {
            prop: 'value',
            event: 'input',
        },
    ],
    props: {
        value: {
            type: null,
            default: null,
        },
    },
    data() {
        return {
            smallSize: 'small',
            normalSize: 'default',
            videoDialogVisible: false,
        };
    },
    mounted() {},
    methods: {
        openVideoUploader() {
            this.videoDialogVisible = true;
        },
        chosedVideo(videoUrl) {
            this.$emit('input', videoUrl);
            this.videoDialogVisible = false;
        },
    },
};
</script>
<style scoped lang="scss"></style>
