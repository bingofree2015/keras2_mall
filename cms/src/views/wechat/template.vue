<template>
    <div class="page-container">
        <!--导航-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
        </el-row>

        <!--模板列表-->
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card class="template-container">
                    <template #header>
                        <div>
                            <span>简约模板</span>
                        </div>
                    </template>
                    <el-image :src="env.getImgUrl('template/simplicity.png', env.baseAssetsUrl)">
                        <template #error>
                            <div>
                                <i class="el-icon-ali-tupianshibai"></i>
                            </div>
                        </template>
                    </el-image>
                    <div class="footer">
                        名称：简约模板
                        <br />
                        版本：
                        <span>1.0</span>
                        <br />
                        描述：
                        <span>支持小程序、H5、公众号</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="template-container">
                    <template #header>
                        <div>
                            <span>标准模板</span>
                        </div>
                    </template>
                    <el-image :src="env.getImgUrl('template/standard.png', env.baseAssetsUrl)">
                        <template #error>
                            <div>
                                <i class="el-icon-ali-tupianshibai"></i>
                            </div>
                        </template>
                    </el-image>
                    <div class="footer">
                        名称：标准模板
                        <br />
                        版本：
                        <span>1.0</span>
                        <br />
                        描述：
                        <span>支持小程序、H5</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="template-container">
                    <template #header>
                        <div>
                            <span>食品鲜花模板</span>
                        </div>
                    </template>
                    <el-image :src="env.getImgUrl('template/flower.png', env.baseAssetsUrl)">
                        <template #error>
                            <div>
                                <i class="el-icon-ali-tupianshibai"></i>
                            </div>
                        </template>
                    </el-image>
                    <div class="footer">
                        名称：食品鲜花模板
                        <br />
                        版本：
                        <span>1.0</span>
                        <br />
                        描述：
                        <span>仅限小程序可用</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import breadCrumb from '@/components/bread_crumb.vue';
export default {
    components: {
        breadCrumb,
    },
    data() {
        return {
            normalSize: 'default',
        };
    },
    methods: {},
};
</script>

<style scoped lang="scss">
.template-container :deep() {
    .footer {
        padding: 5px;
        font-size: 13px;
        font-weight: 500;
        span {
            font-size: 12px;
            color: #909399;
        }
    }
}
</style>
