<template>
    <div>
        <el-input :value="value" :placeholder="$t('pickVideo.inputVideoUrl')" readonly>
            <template #append>
                <el-button round @click="openVideoUploader">
                    <i class="el-icon-ali-camera_rec"></i>
                    {{ $t('pickVideo.uploadVideo') }}
                </el-button>
            </template>
        </el-input>
        <video-uploader v-model="videoDialogVisible" @chosed-video="chosedVideo" />
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
    emits: ['input'],
    data() {
        return {
            normalSize: 'default',
            videoDialogVisible: false,
        };
    },
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
