<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow" />
        </el-row>
        <el-row :gutter="20" class="media-message-container">
            <el-col :xs="24" :sm="24" :md="10" :lg="8" :xl="8">
                <el-table :data="mediaMessageItems" :size="miniSize" stripe class="media-table">
                    <el-table-column min-width="180" prop="title">
                        <template #header>
                            {{ $t('wechat.mediaMessage.imageTextList') }}
                            <el-button
                                round
                                :size="miniSize"
                                style="float: right"
                                type="primary"
                                @click="handleCreate()"
                            >
                                {{ $t('wechat.mediaMessage.add') }}
                            </el-button>
                        </template>
                        <template #default="scope">
                            <span style="margin-left: 10px">
                                <el-link underline="never" @click="handleEdit(scope.$index)">
                                    {{ scope.row.title }}
                                </el-link>
                                <el-button
                                    circle
                                    icon="el-icon-delete"
                                    size="small"
                                    style="float: right"
                                    type="danger"
                                    @click="handleDelete(scope.$index)"
                                />
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :xs="24" :sm="24" :md="14" :lg="12" :xl="12">
                <el-container v-if="formData" class="edit-dialog-container">
                    <el-header>{{ $t('wechat.mediaMessage.editImageTextMessage') }}</el-header>
                    <el-main>
                        <!-- 编辑图文消息界面 -->
                        <el-form
                            ref="formData"
                            :model="formData"
                            :rules="formDataRules"
                            :size="miniSize"
                            label-width="80px"
                        >
                            <el-row>
                                <el-col :span="16">
                                    <el-form-item
                                        :label="$t('wechat.mediaMessage.title')"
                                        prop="title"
                                    >
                                        <el-input v-model="formData.title" />
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('wechat.mediaMessage.author')"
                                        prop="author"
                                    >
                                        <el-input v-model="formData.author" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item
                                        :label="$t('wechat.mediaMessage.cover')"
                                        prop="attachment"
                                    >
                                        <change-image-icon
                                            :img-url="
                                                formData.attachment ? formData.attachment.path : ''
                                            "
                                            @chosed-image-icon="chosedIcon"
                                        />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item :label="$t('wechat.mediaMessage.summary')" prop="brief">
                                <el-input
                                    v-model="formData.brief"
                                    :autosize="{ minRows: 2, maxRows: 4 }"
                                    :placeholder="$t('permission.pleaseEnterContent')"
                                    type="textarea"
                                />
                            </el-form-item>
                            <el-form-item
                                :label="$t('wechat.mediaMessage.detailedContent')"
                                prop="content"
                            >
                                <tinyEditor v-model:content="formData.content" />
                            </el-form-item>
                            <el-form-item
                                :label="$t('wechat.mediaMessage.originalLink')"
                                prop="url"
                            >
                                <el-input v-model="formData.url" />
                            </el-form-item>
                        </el-form>
                    </el-main>
                    <el-footer class="footer">
                        <el-button
                            :loading="editLoading"
                            :size="miniSize"
                            round
                            type="primary"
                            @click="submitForm()"
                        >
                            {{ $t('action.submit') }}
                        </el-button>
                    </el-footer>
                </el-container>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import breadCrumb from '@/components/bread_crumb.vue';
import tinyEditor from '@/components/tiny_editor';
import changeImageIcon from '@/components/change_image_icon.vue';

export default {
    components: {
        breadCrumb,
        tinyEditor,
        changeImageIcon,
    },
    data() {
        return {
            normalSize: 'default',
            miniSize: 'default',

            messageId: 0,
            mediaMessageItems: [],

            editLoading: false,
            // 新增编辑界面数据
            formData: {
                title: '', // 标题
                author: '', // 作者
                brief: '', // 摘要
                attachmentId: 0,
                attachment: {
                    id: 0,
                    path: '',
                }, // 封面
                content: '', // 详细内容
                url: '', // 原文链接
            },
            formDataRules: {
                title: [{ required: true, message: '请输入标题名称', trigger: 'blur' }],
            },
        };
    },
    async mounted() {
        let _messageId = this.$route.query.id;
        if (_messageId > 0) {
            this.messageId = _messageId;
            await this.getMediaMessageList(_messageId);
        }
    },
    methods: {
        handleCreate() {
            this.formData = {
                title: `图文消息 ${this.mediaMessageItems.length}`, // 标题
                author: '', // 作者
                brief: '', // 摘要
                attachmentId: 0,
                attachment: {
                    id: 0,
                    path: '',
                }, // 封面
                content: '', // 详细内容
                url: '', // 原文链接
            };
            this.mediaMessageItems.push(this.formData);
        },
        async handleDelete(idx) {
            if (idx >= 0) {
                let _mediaMessage = this.mediaMessageItems.splice(idx, 1);
                if (_mediaMessage.length > 0 && _mediaMessage[0].id > 0) {
                    let _result = await this.$api.weixinMediaMessage.destroy({
                        ids: [_mediaMessage[0].id],
                    });
                    if (_result.succeed === 1 && _result.code === 200) {
                        this.$notify({
                            title: this.$t('common.success'),
                            message: _result.description,
                            type: 'success',
                        });
                    } else {
                        this.$notify.error({
                            title: this.$t('common.error'),
                            message: _result.description,
                        });
                    }
                }
            } else {
                this.$notify.error({
                    title: this.$t('common.error'),
                    message: `参数错误 idx:${idx}`,
                });
            }
        },
        handleEdit(idx) {
            this.formData = this.mediaMessageItems[idx];
        },
        chosedIcon(chosen) {
            this.formData.attachmentId = chosen.id;
            this.formData.attachment = chosen;
        },
        // 表单提交
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(
                        this.$t('permission.confirmSubmit'),
                        this.$t('common.tip'),
                        {}
                    ).then(async () => {
                        this.editLoading = true;
                        let data = Object.assign({}, this.formData);
                        let _result = await this.$api.weixinMediaMessage.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _mediaMessage = this.mediaMessageItems.find(
                                (v) => v.id === _result.data.id
                            );
                            if (!_mediaMessage) {
                                this.mediaMessageItems.unshift(_result.data);
                            } else {
                                Object.assign(_mediaMessage, _result.data);
                            }
                            // 更新 weixinMessage 表
                            if (this.messageId > 0) {
                                let _params = {
                                    media_id: this.mediaMessageItems.map((v) => {
                                        if (v.id > 0) {
                                            return v.id;
                                        }
                                    }),
                                };
                                _result = await this.$api.weixinMessage.save({
                                    id: this.messageId,
                                    params: _params,
                                });
                                if (_result.succeed == 1 && _result.code == 200) {
                                    this.$notify({
                                        title: this.$t('common.success'),
                                        message: _result.description,
                                        type: 'success',
                                    });
                                } else {
                                    this.$notify.error({
                                        title: this.$t('common.error'),
                                        message: _result.description,
                                    });
                                }
                            }
                        } else {
                            this.$notify.error({
                                title: this.$t('common.error'),
                                message: _result.description,
                            });
                        }
                        this.editLoading = false;
                    });
                }
            });
        },
        async getMediaMessageList(messageId) {
            let _result = await this.$api.weixinMessage.get({ id: messageId });
            if (_result.succeed == 1 && _result.code == 200) {
                let _params = _result.data.params;
                if (_params && Array.isArray(_params.media_id)) {
                    _result = await this.$api.weixinMediaMessage.list({
                        searchKey: { id: _params.media_id },
                    });
                    if (_result.succeed == 1 && _result.code == 200) {
                        this.mediaMessageItems = _result.data.list;
                    }
                }
            }
        },
    },
};
</script>

<style scoped lang="scss">
.media-message-container {
    margin-top: 20px;
}

.media-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.edit-dialog-container {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);

    .el-header {
        background-color: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;
        font-weight: 600;
        text-align: center;
        line-height: 60px;
    }

    .el-main {
        padding: 20px;
    }

    .el-footer {
        padding: 15px 20px;
        border-top: 1px solid #e4e7ed;
        background-color: #fafafa;
        text-align: right;
    }
}

// 响应式设计
@media (max-width: 768px) {
    .media-message-container {
        .el-col {
            margin-bottom: 20px;
        }
    }

    .edit-dialog-container {
        .el-main {
            padding: 15px;
        }

        .el-footer {
            padding: 10px 15px;
        }
    }
}
</style>
