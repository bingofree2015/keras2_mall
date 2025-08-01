<template>
    <el-container>
        <el-header>
            <h2 class="demo-title">
                {{ $t('demo.areaSelection') }}
            </h2>
        </el-header>
        <el-main>
            <p class="demo-summery">
                {{ $t('demo.areaSelectionDesc') }}
            </p>
            <el-row>
                <el-col :span="18">
                    <pick-area :selection-type="0" @chosed-areas="chosedAreas" />
                </el-col>
            </el-row>
            <h5 class="demo-sub-title">
                <i>{{ $t('demo.executionResult') }}</i>
            </h5>
            <el-row>
                <el-col :span="18">
                    {{ areas.length > 0 ? areas.map((v) => v.name) : '' }}
                </el-col>
            </el-row>
            <h5 class="demo-sub-title">
                <i>{{ $t('demo.demoCode') }}</i>
            </h5>
            <el-row>
                <el-col :span="18" class="demo-code">
                    <pre>
                        <code v-pre>
&lt;template&gt;
    &lt;div&gt;
        &lt;pick-area :selectionType=&quot;0&quot; @chosedAreas=&quot;chosedAreas&quot;&gt;&lt;/pick-area&gt;
        &lt;p&gt;{{areas.map(v=&gt;v.name)}}&lt;/p&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import pickArea from &#x27;@/components/pick_area&#x27;

export default {
    components: {
        pickArea,
    },
    computed: {},
    data() {
        return {
            areas: [],
        };
    },
    methods: {
        chosedAreas (areas) {
            this.areas = areas
        }
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
import pickArea from '@/components/pick_area';

export default {
    components: {
        pickArea,
    },
    data() {
        return {
            normalSize: 'large',
            smallSize: 'small',

            areas: [],
        };
    },
    computed: {},
    methods: {
        chosedAreas(areas) {
            this.areas = areas;
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
