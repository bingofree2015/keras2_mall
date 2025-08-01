<template>
    <el-container>
        <el-header>
            <h2 class="demo-title">
                {{ $t('demo.videoUpload') }}
            </h2>
        </el-header>
        <el-main>
            <p class="demo-summery">
                {{ $t('demo.videoUploadDesc') }}
            </p>
            <el-row>
                <el-col :span="18">
                    <el-button :size="miniSize" round type="primary" @click="handleClick">
                        {{ $t('demo.uploadVideo') }}
                    </el-button>
                </el-col>
            </el-row>
            <h5 class="demo-sub-title">
                <i>演示代码</i>
            </h5>
            <el-row>
                <el-col :span="18" class="demo-code">
                    <pre>
                        <code v-pre>
&lt;template&gt;
    &lt;div&gt;
        &lt;el-button :size=&quot;miniSize&quot; @click=&quot;handleClick&quot; round type=&quot;primary&quot;&gt;上传视频&lt;/el-button&gt;
        &lt;video-uploader :model-value=&quot;videoDialogVisible&quot;&gt;&lt;/video-uploader&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import videoUploader from &quot;@/components/video_uploader&quot;;

export default {
    components: {
        videoUploader,
    },
    computed: {},
    data() {
        return {
            areas: [],
        };
    },
    methods: {
        handleClick() {
            this.videoDialogVisible = true;
        },
    },
};
&lt;/script&gt;
                        </code>
                    </pre>
                </el-col>
            </el-row>
        </el-main>
        <video-uploader :model-value="videoDialogVisible" />
    </el-container>
</template>
<script>
import videoUploader from '@/components/video_uploader';

export default {
    components: {
        videoUploader,
    },
    data() {
        return {
            normalSize: 'default',
            smallSize: 'small',

            videoDialogVisible: false,
        };
    },
    computed: {},
    methods: {
        handleClick() {
            this.videoDialogVisible = true;
        },
    },
};
</script>
<style scoped lang="scss">
.demo-title {
    font-weight: 400;
}
.demo-summery {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
    font-weight: 400;
    margin-bottom: 30px;
}
.demo-result {
    font-size: 12px;
    color: #606266;
}
.demo-sub-title {
    font-weight: 500;
    padding: 8px;
    border-radius: 2px;
    border-left: 5px solid #50bfff;
    margin: 30px 0 10px 0;
    color: #5e6d82;
    background-color: #ecf8ff;
    width: 73%;
}
.demo-code {
    background-color: #e5e9f2;
    padding: 0px 10px;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 2px 2px 2px 0 #c0c4cc;
}
</style>
