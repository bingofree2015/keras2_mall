<template>
    <div class="page-container">
        <!--导航-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
        </el-row>

        <!--模板列表-->
        <el-row :gutter="20" class="template-list">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <el-card class="template-container">
                    <template #header>
                        <div>
                            <span>{{ $t('wechat.template.simpleTemplate') }}</span>
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
                        {{ $t('wechat.template.name') }}：{{ $t('wechat.template.simpleTemplate') }}
                        <br />
                        {{ $t('wechat.template.version') }}：
                        <span>1.0</span>
                        <br />
                        {{ $t('wechat.template.description') }}：
                        <span>{{ $t('wechat.template.supportMiniprogramH5Official') }}</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <el-card class="template-container">
                    <template #header>
                        <div>
                            <span>{{ $t('wechat.template.standardTemplate') }}</span>
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
                        {{ $t('wechat.template.name') }}：{{
                            $t('wechat.template.standardTemplate')
                        }}
                        <br />
                        {{ $t('wechat.template.version') }}：
                        <span>1.0</span>
                        <br />
                        {{ $t('wechat.template.description') }}：
                        <span>{{ $t('wechat.template.supportMiniprogramH5') }}</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <el-card class="template-container">
                    <template #header>
                        <div>
                            <span>{{ $t('wechat.template.foodFlowerTemplate') }}</span>
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
                        {{ $t('wechat.template.name') }}：{{
                            $t('wechat.template.foodFlowerTemplate')
                        }}
                        <br />
                        {{ $t('wechat.template.version') }}：
                        <span>1.0</span>
                        <br />
                        {{ $t('wechat.template.description') }}：
                        <span>{{ $t('wechat.template.onlyMiniprogram') }}</span>
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
.template-list {
    margin-top: 20px;
}

.template-container {
    margin-bottom: 20px;
    transition: all 0.3s ease;
    border-radius: 8px;
    overflow: hidden;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    :deep(.el-card__header) {
        background-color: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;
        font-weight: 600;
    }

    :deep(.el-card__body) {
        padding: 0;
    }

    :deep(.el-image) {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .footer {
        padding: 15px;
        font-size: 13px;
        font-weight: 500;
        line-height: 1.6;
        background-color: #fafafa;
        border-top: 1px solid #e4e7ed;

        span {
            font-size: 12px;
            color: #909399;
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .template-container {
        margin-bottom: 15px;

        :deep(.el-image) {
            height: 150px;
        }
    }
}
</style>
