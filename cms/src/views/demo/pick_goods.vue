<template>
    <el-container>
        <el-header>
            <h2 class="demo-title">商品选择</h2>
        </el-header>
        <el-main>
            <p class="demo-summery">通过弹出商品列表对话框，选择商品(支持多选)。</p>
            <el-row>
                <el-col :span="18">
                    <pick-goods :selection-type="1" @chosed-goods="chosedGoods" />
                </el-col>
            </el-row>
            <h5 class="demo-sub-title">
                <i>执行结果</i>
            </h5>
            <el-row>
                <el-col :span="18" class="demo-result">
                    {{ goods.length > 0 ? goods.map((v) => v.name) : '' }}
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
        &lt;pick-goods :selectionType=&quot;1&quot; @chosedGoods=&quot;chosedGoods&quot;&gt;&lt;/pick-goods&gt;
        &lt;p&gt;{{goods.map(v=&gt;v.name)}}&lt;/p&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import pickGoods from &quot;@/components/pick_goods&quot;;

export default {
    components: {
        pickGoods
    },
    computed: {},
    data() {
        return {
            goods: [],
        };
    },
    methods: {
        chosedGoods(goods) {
            this.goods = goods;
        },
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
import pickGoods from '@/components/pick_goods';

export default {
    components: {
        pickGoods,
    },
    data() {
        return {
            normalSize: 'default',
            goods: [],
        };
    },
    computed: {},
    methods: {
        chosedGoods(goods) {
            this.goods = goods;
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
