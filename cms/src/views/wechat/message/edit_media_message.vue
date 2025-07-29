<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow" />
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-table :data="mediaMessageItems" :size="miniSize" stripe style="width: 100%">
                    <el-table-column min-width="180" prop="title">
                        <template #header>
                            图文列表
                            <el-button
                                round
                                :size="miniSize"
                                style="float: right"
                                type="primary"
                                @click="handleCreate()"
                            >
                                新增
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
            <el-col :span="12">
                <el-container v-if="formData" class="edit-dialog-container">
                    <el-header>编辑图文消息</el-header>
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
                                    <el-form-item label="标题" prop="title">
                                        <el-input v-model="formData.title" />
                                    </el-form-item>
                                    <el-form-item label="作者" prop="author">
                                        <el-input v-model="formData.author" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="封面" prop="attachment">
                                        <change-image-icon
                                            :img-url="
                                                formData.attachment ? formData.attachment.path : ''
                                            "
                                            @chosed-image-icon="chosedIcon"
                                        />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="摘要" prop="brief">
                                <el-input
                                    v-model="formData.brief"
                                    :autosize="{ minRows: 2, maxRows: 4 }"
                                    placeholder="请输入内容"
                                    type="textarea"
                                />
                            </el-form-item>
                            <el-form-item label="详细内容" prop="content">
                                <tinyEditor v-model:content="formData.content" />
                            </el-form-item>
                            <el-form-item label="原文链接" prop="url">
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
import _ from 'lodash';
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
                            title: '成功',
                            message: _result.description,
                            type: 'success',
                        });
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: _result.description,
                        });
                    }
                }
            } else {
                this.$notify.error({
                    title: '错误',
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
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
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
                                        title: '成功',
                                        message: _result.description,
                                        type: 'success',
                                    });
                                } else {
                                    this.$notify.error({
                                        title: '错误',
                                        message: _result.description,
                                    });
                                }
                            }
                        } else {
                            this.$notify.error({
                                title: '错误',
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

<style scoped lang="scss"></style>
