<template>
    <el-container>
        <el-header>
            <h2 class="demo-title">分类组合输入框</h2>
        </el-header>
        <el-main>
            <p class="demo-summery">输入与分类选择组合框组件，迅速简便地在创建文章时选择分类。</p>
            <el-row>
                <el-col :span="18">
                    <el-input v-model="input3" class="input-with-select" placeholder="请输入内容">
                        <template #append>
                            <pick-articleType
                                :selection-type="0"
                                @chosed-article-types="chosedArticleTypes"
                            />
                        </template>
                    </el-input>
                </el-col>
            </el-row>
            <h5 class="demo-sub-title">
                <i>执行结果</i>
            </h5>
            <el-row>
                <el-col :span="18">
                    {{ articleTypes.length > 0 ? articleTypes.map((v) => v.typeName) : '' }}
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
        &lt;el-input class=&quot;input-with-select&quot; placeholder=&quot;请输入内容&quot; v-model=&quot;input3&quot;&gt;
            &lt;template #append&gt;
                &lt;pick-articleType
                    :selectionType=&quot;0&quot;
                    @chosedArticleTypes=&quot;chosedArticleTypes&quot;
                    slot=&quot;append&quot;
                &gt;&lt;/pick-articleType&gt;
            &lt;/template&gt;
        &lt;/el-input&gt;
        &lt;p&gt;{{articleTypes.map(v=&gt;v.typeName)}}&lt;/p&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import pickArticleType from &quot;@/components/pick_articleType&quot;;

export default {
    components: {
        pickArticleType,
    },
    computed: {},
    data() {
        return {
            articleTypes: [],
        };
    },
    methods: {
        chosedArticleTypes(articleTypes) {
            this.articleTypes = articleTypes;
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
import pickArticleType from '@/components/pick_articleType';

export default {
    components: {
        pickArticleType,
    },
    data() {
        return {
            normalSize: 'default',
            smallSize: 'small',

            articleTypes: [],
        };
    },
    computed: {},
    mounted() {},
    methods: {
        chosedArticleTypes(articleTypes) {
            this.articleTypes = articleTypes;
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
