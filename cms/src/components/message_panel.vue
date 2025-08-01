<template>
    <div class="message-panel">
        <div class="message-header">
            {{ $t('component.messagePanel.youHaveMessages', { count: messageData.length }) }}
        </div>
        <div class="message-content">
            <div v-for="item in messageData" :key="item.key" class="message-item">
                <div class="message-avatar">
                    <img class="avatar" :src="require('@/assets/user.png')" />
                </div>
                <span class="sender">
                    {{ item.sender }}
                </span>
                <span class="time">
                    <li class="fa fa-clock-o"></li>
                    {{ item.time }}
                </span>
                <div class="message-cotent">
                    {{ item.content }}
                </div>
            </div>
        </div>
        <div class="message-footer">
            {{ $t('component.messagePanel.viewAllMessages') }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'MessagePanel',
    props: {
        data: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['click'],
    data() {
        return {};
    },
    computed: {
        messageData() {
            return this.data.length > 0 ? this.data : this.defaultData;
        },
        defaultData() {
            return [
                {
                    key: '1',
                    avatar: '@/assets/user.png',
                    content: this.$t('component.messagePanel.passwordChanged'),
                    sender: this.$t('component.messagePanel.zhugeLiang'),
                    time: this.$t('component.messagePanel.fiveMinutesAgo'),
                },
                {
                    key: '2',
                    avatar: '@/assets/user.png',
                    content: this.$t('component.messagePanel.avatarChanged'),
                    sender: this.$t('component.messagePanel.wuZeTian'),
                    time: this.$t('component.messagePanel.twoHoursAgo'),
                },
                {
                    key: '3',
                    avatar: '@/assets/user.png',
                    content: this.$t('component.messagePanel.newMembersJoined'),
                    sender: this.$t('component.messagePanel.wangYuYan'),
                    time: this.$t('component.messagePanel.yesterday'),
                },
                {
                    key: '4',
                    avatar: '@/assets/user.png',
                    content: this.$t('component.messagePanel.newEssayPublished'),
                    sender: this.$t('component.messagePanel.cangJingKong'),
                    time: this.$t('component.messagePanel.yesterday'),
                },
                {
                    key: '5',
                    avatar: '@/assets/user.png',
                    content: this.$t('component.messagePanel.newEssayPublished'),
                    sender: this.$t('component.messagePanel.shangGuanWanEr'),
                    time: this.$t('component.messagePanel.dayBeforeYesterday'),
                },
            ];
        },
    },
};
</script>

<style scoped lang="scss">
.message-panel {
    font-size: 13px;
    width: 300px;
    margin: -12px;
}
.message-header {
    padding-left: 10px;
    font-size: 14px;
    padding-top: 6px;
    padding-bottom: 6px;
}
.message-content {
    font-size: 13px;
}
.message-item {
    border-color: rgba(180, 190, 190, 0.8);
    border-top-width: 1px;
    border-top-style: solid;
    padding-top: 10px;
    padding-bottom: 10px;
}
.message-item:hover {
    cursor: pointer;
    background: #b1a6a61e;
}
.message-avatar {
    padding-left: 10px;
}
.avatar {
    margin-right: 10px;
}
.sender {
    font-size: 15px;
    font-weight: bold;
}
.time {
    font-size: 12px;
    float: right;
    padding-right: 10px;
}
.message-footer {
    font-size: 14px;
    padding: 10px;
    border-color: rgba(180, 190, 190, 0.8);
    border-top-width: 1px;
    border-top-style: solid;
}
.message-footer:hover {
    cursor: pointer;
    background: #b1a6a61e;
}
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 90px;
    float: left;
}
</style>
