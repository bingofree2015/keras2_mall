<template>
    <div class="notice-panel">
        <div class="header">
            {{ $t('notice.header', { count: data.length }) }}
        </div>
        <div class="notice-content">
            <div v-for="item in data" :key="item.key" class="notice-item" @click="handleClick">
                <span class="notice-icon">
                    <i :class="item.icon"></i>
                </span>
                <span class="notice-content">
                    {{ $t(item.content) }}
                </span>
            </div>
        </div>
        <div class="notice-footer" @click="handleClick">
            {{ $t('notice.footer') }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'NoticePanel',
    props: {
        data: {
            type: Array,
            default: () => [
                {
                    key: '1',
                    icon: 'fa fa-envelope-o',
                    content: 'notice.content1',
                },
                {
                    key: '2',
                    icon: 'fa fa-music',
                    content: 'notice.content2',
                },
                {
                    key: '3',
                    icon: 'el-icon-ali-bianji',
                    content: 'notice.content3',
                },
                {
                    key: '4',
                    icon: 'el-icon-ali-bianji',
                    content: 'notice.content4',
                },
            ],
        },
    },
    emits: ['click'],
    data() {
        return {};
    },
    methods: {
        handleClick: function () {
            // 按钮操作处理函数
            this.$emit('click', {});
        },
    },
};
</script>

<style scoped lang="scss">
.notice-panel {
    font-size: 13px;
    width: 250px;
    margin: -12px;
}
.header {
    padding-left: 10px;
    font-size: 14px;
    padding-top: 6px;
    padding-bottom: 6px;
}
.notice-content {
    font-size: 13px;
}
.notice-item {
    border-color: rgba(180, 190, 190, 0.8);
    border-top-width: 1px;
    border-top-style: solid;
    padding-top: 10px;
    padding-bottom: 10px;
}
.notice-item:hover {
    cursor: pointer;
    background: #b1a6a61e;
}
.notice-icon {
    padding-left: 10px;
    padding-right: 5px;
}
.notice-footer {
    font-size: 14px;
    padding: 10px;
    border-color: rgba(180, 190, 190, 0.8);
    border-top-width: 1px;
    border-top-style: solid;
}
.notice-footer:hover {
    cursor: pointer;
    background: #b1a6a61e;
}
</style>
