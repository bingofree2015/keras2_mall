<template>
    <el-tooltip class="tooltip" effect="light" placement="top">
        <template #content>
            <div>
                <p>{{ $t('component.falconTooltip.recommendFontAwesome') }}</p>
                <p>{{ $t('component.falconTooltip.usageSteps') }}</p>
                <p>
                    {{ $t('component.falconTooltip.step1') }}
                    <a href="http://www.fontawesome.com.cn/faicons/" target="_blank">
                        Font Awesome
                    </a>
                    {{ $t('component.falconTooltip.step2') }}
                </p>
                <p>{{ $t('component.falconTooltip.step3') }}</p>
                <p>{{ $t('component.falconTooltip.step4') }}</p>
                <p>{{ $t('component.falconTooltip.example') }}</p>
            </div>
        </template>
        <span><i class="el-icon-warning"></i></span>
    </el-tooltip>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {},
};
</script>

<style scoped lang="scss">
.tooltip {
    padding: 10px;
}
</style>
