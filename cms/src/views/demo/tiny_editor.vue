<template>
    <el-container>
        <el-header>
            <h2 class="demo-title">富文本框</h2>
        </el-header>
        <el-main>
            <p class="demo-summery">
                基于tinymce,除了tinymce的基本功能，添加了图片与视频上传的功能。
            </p>
            <el-row>
                <el-col :span="18">
                    <tinyEditor v-model:content="content" />
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
        &lt;tinyEditor :content.sync=&quot;content&quot; url=&quot;/static/tinymce&quot;&gt;&lt;/tinyEditor&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import tinyEditor from &quot;@/components/tiny_editor&quot;;
export default {
    components: { tinyEditor },
    computed: {},
    data() {
        return {
            content: &quot;邮箱:nzb@yeah.net&quot;,
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
import tinyEditor from '@/components/tiny_editor';

export default {
    components: {
        tinyEditor,
    },
    data() {
        return {
            normalSize: 'default',
            smallSize: 'small',
            content: '邮箱:nzb@yeah.net',
        };
    },
    computed: {},
    mounted() {},
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
