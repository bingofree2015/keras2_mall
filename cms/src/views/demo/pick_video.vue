<template>
    <el-container>
        <el-header>
            <h2 class="demo-title">视频上传组合框</h2>
        </el-header>
        <el-main>
            <p class="demo-summery">
                通过弹出对话框选择本地视频文件上传至服务器，并返回视频路径自动填进输入框。
            </p>
            <el-row>
                <el-col :span="18">
                    <pick-video v-model="videoUrl" />
                </el-col>
            </el-row>
            <h5 class="demo-sub-title">
                <i>执行结果</i>
            </h5>
            <el-row>
                <el-col :span="18">
                    {{ videoUrl }}
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
        &lt;pick-video v-model=&quot;videoUrl&quot;&gt;&lt;/pick-video&gt;
        {{videoUrl}}
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import pickVideo from &quot;@/components/pick_video&quot;;

export default {
    components: {
        pickVideo,
    },
    computed: {},
    data() {
        return {
            videoUrl: &quot;http://www.baidu.com/&quot;,
        };
    },
    methods: {},
};
&lt;/script&gt;
                        </code>
                    </pre>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>
<script>
import pickVideo from '@/components/pick_video';

export default {
    components: {
        pickVideo,
    },
    data() {
        return {
            normalSize: 'default',
            videoUrl: 'http://www.baidu.com/',
        };
    },
    computed: {},
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
