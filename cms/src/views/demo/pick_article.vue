<template>
    <el-container>
        <el-header>
            <h2 class="demo-title">
                {{ $t('demo.articleSelection') }}
            </h2>
        </el-header>
        <el-main>
            <p class="demo-summery">
                {{ $t('demo.articleSelectionDesc') }}
            </p>
            <el-row>
                <el-col :span="18">
                    <pick-article :selection-type="0" @chosed-articles="chosedArticles" />
                </el-col>
            </el-row>
            <h5 class="demo-sub-title">
                <i>执行结果</i>
            </h5>
            <el-row>
                <el-col :span="18">
                    {{ articles.length > 0 ? articles.map((v) => v.title) : '' }}
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
        &lt;pick-article :selectionType=&quot;0&quot; @chosedArticles=&quot;chosedArticles&quot;&gt;&lt;/pick-article&gt;
        &lt;p&gt;{{articles.map(v=&gt;v.title)}}&lt;/p&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import pickArticle from &#x27;@/components/pick_article&#x27;

export default {
    components: {
        pickArticle
    },
    computed: {},
    data() {
        return {
            articles: [],
        };
    },
    methods: {
        chosedArticles (articles) {
            this.articles = articles
        }
    }
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
import pickArticle from '@/components/pick_article';

export default {
    components: {
        pickArticle,
    },
    data() {
        return {
            normalSize: 'default',
            articles: [],
        };
    },
    computed: {},
    methods: {
        chosedArticles(articles) {
            this.articles = articles;
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
