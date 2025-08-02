<template>
    <el-container>
        <el-header>
            <h2 class="demo-title">图片上传</h2>
        </el-header>
        <el-main>
            <p class="demo-summery">
                通过弹出的图片上传对话框选择图片，并且支持在弹出的对话框中本地、远程上传图片，支持在线图片裁剪、旋转、删除等管理，迅速简便。
            </p>
            <el-row>
                <el-col :span="18">
                    <change-image-icon
                        :img-url="imgUrl"
                        :init-style="{
                            height: '160px',
                            width: '160px',
                            border: '1px dashed #d9d9d9',
                            borderRadius: '4px',
                        }"
                        @chosed-image-icon="chosedLogo"
                    />
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
        &lt;change-image-icon
            :imgUrl=&quot;imgUrl&quot;
            :initStyle=&quot;{height: &#x27;160px&#x27;, width: &#x27;160px&#x27;,border: &#x27;1px dashed #d9d9d9&#x27;, borderRadius: &#x27;4px&#x27;}&quot;
            @chosedImageIcon=&quot;chosedLogo&quot;
        &gt;&lt;/change-image-icon&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import changeImageIcon from &quot;@/components/change_image_icon&quot;;

export default {
    components: {
        changeImageIcon,
    },
    computed: {},
    data() {
        return {};
    },
    methods: {
        chosedLogo(logo) {
            this.$notify({
                title: &quot;成功&quot;,
                message: logo,
                type: &quot;success&quot;,
            });
        },
    },
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
import changeImageIcon from '@/components/change_image_icon.vue';

export default {
    components: {
        changeImageIcon,
    },
    data() {
        return {
            normalSize: 'default',
        };
    },
    computed: {},
    methods: {
        chosedLogo(logo) {
            this.$notify({
                title: this.$t('common.success'),
                message: logo,
                type: 'success',
            });
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
