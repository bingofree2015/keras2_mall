<template>
    <el-container>
        <el-header>
            <h2 class="demo-title">表单选择对话框</h2>
        </el-header>
        <el-main>
            <p class="demo-summery">
                通过弹出的表彰列表选择表单，通过传入参数selectionType支持单选与多选。
            </p>
            <el-row>
                <el-col :span="18">
                    <pick-form :selection-type="0" @chosed-forms="chosedForms" />
                </el-col>
            </el-row>
            <h5 class="demo-sub-title">
                <i>执行结果</i>
            </h5>
            <el-row>
                <el-col :span="18">
                    {{ forms.length > 0 ? forms.map((v) => v.name) : '' }}
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
        &lt;pick-form :selectionType=&quot;0&quot; @chosedForms=&quot;chosedForms&quot;&gt;&lt;/pick-form&gt;
        &lt;p&gt;{{forms.map(v=&gt;v.name)}}&lt;/p&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import pickForm from &#x27;@/components/pick_form&#x27;

export default {
    components: {
        pickForm,
    },
    computed: {},
    data() {
        return {
            forms: [],
        };
    },
    methods: {
        chosedForms (forms) {
            this.forms = forms
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
import pickForm from '@/components/pick_form';

export default {
    components: {
        pickForm,
    },
    data() {
        return {
            normalSize: 'default',
            smallSize: 'small',

            forms: [],
        };
    },
    computed: {},
    mounted() {},
    methods: {
        chosedForms(forms) {
            this.forms = forms;
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
