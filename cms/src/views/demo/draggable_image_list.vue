<template>
    <el-container>
        <el-header>
            <h2 class="demo-title">图片拖动排序</h2>
        </el-header>
        <el-main>
            <p class="demo-summery">通过添加图片至图片列表，实现列表中图片的拖拽式排序、删除、在线裁剪、旋转，迅速简便地对图片排序。</p>
            <el-row>
                <el-col :span="24">
                    <draggable-image-list
                        :items="imageItems"
                        @chosedImage="chosedImage"
                        @end="end"
                        @onRemove="onRemove"
                    ></draggable-image-list>
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
        &lt;el-row&gt;
            &lt;el-col :span=&quot;24&quot;&gt;
                &lt;draggable-image-list
                    :items=&quot;imageItems&quot;
                    @chosedImage=&quot;chosedImage&quot;
                    @end=&quot;end&quot;
                    @onRemove=&quot;onRemove&quot;
                &gt;&lt;/draggable-image-list&gt;
            &lt;/el-col&gt;
        &lt;/el-row&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import draggableImageList from &quot;@/components/draggable_image_list&quot;;

export default {
    components: {
        draggableImageList,
    },
    computed: {},
    data() {
        return {
            imageItems: [
                { id: 0, path: &quot;attachment/image/156691643755464.jpg&quot; },
                { id: 1, path: &quot;attachment/image/156691644208066.png&quot; },
                { id: 2, path: &quot;attachment/image/156691650779637.png&quot; },
            ],
        };
    },
    methods: {
        chosedImage(chosen) {
            this.imageItems.push(chosen);
        },
        end(items) {
            this.imageItems = items;
        },
        onRemove(id) {
            this.imageItems.splice(
                this.imageItems.findIndex((v) => v.id === id),
                1
            );
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
import draggableImageList from "@/components/draggable_image_list";

export default {
    components: {
        draggableImageList,
    },
    computed: {},
    data() {
        return {
            normalSize: "small",
            miniSize: "mini",

            imageItems: [
                { id: 0, path: "attachment/image/156691643755464.jpg" },
                { id: 1, path: "attachment/image/156691644208066.png" },
                { id: 2, path: "attachment/image/156691650779637.png" },
            ],
        };
    },
    methods: {
        chosedImage(chosen) {
            this.imageItems.push(chosen);
        },
        end(items) {
            this.imageItems = items;
        },
        onRemove(id) {
            this.imageItems.splice(
                this.imageItems.findIndex((v) => v.id === id),
                1
            );
        },
    },
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
