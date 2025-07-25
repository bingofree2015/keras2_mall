<template>
    <el-dialog
        :close-on-click-modal="false"
        :modal="false"
        title="多文件上传"
        v-bind="$attrs"
        width="60%"
        @open="openDialog"
        v-on="$attrs"
    >
        <el-container style="border: 1px solid #eee">
            <el-aside width="200px">
                <el-table
                    ref="attachGroupTable"
                    :size="normalSize"
                    :cell-style="{ padding: '0px' }"
                    :data="attachGroups"
                    :row-style="{ height: '42px' }"
                    highlight-current-row
                    @cell-click="cellClick"
                    @cell-dblclick="cellDblClick"
                >
                    <el-table-column label="图片分组" prop="name">
                        <template #header="scope">
                            图片分组
                            <ext-button
                                :label="$t('action.add')"
                                :size="normalSize"
                                style="float: right"
                                type="primary"
                                @click="onCreateAttachGroup(scope)"
                            />
                        </template>
                        <template #default="scope">
                            <el-input
                                v-if="scope.row.id === editGroupItem.id"
                                v-model="scope.row.name"
                                :size="normalSize"
                                placeholder="请输入内容"
                                style="width: 100%"
                                @blur="onSaveAttachGroup(scope.row)"
                            />
                            <span v-else style="margin-left: 10px">
                                {{ scope.row.name }}
                                <el-button
                                    :size="normalSize"
                                    circle
                                    icon="el-icon-delete"
                                    style="float: right"
                                    type="danger"
                                    @click="onDeleteAttachGroup(scope.row)"
                                />
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-aside>
            <el-main>
                <el-tabs v-model="activeName">
                    <el-tab-pane name="local">
                        <template #label>
                            <span>
                                <i class="el-icon-ali-fuwuqi1"></i>
                                本地服务器
                            </span>
                        </template>
                        <el-upload
                            ref="imgUploader"
                            v-model:file-list="imageList"
                            :auto-upload="false"
                            :data="extData"
                            :headers="headers"
                            :on-change="changeUpload"
                            action
                            class="image-list"
                            list-type="picture-card"
                        >
                            <template #default>
                                <i class="el-icon-plus"></i>
                            </template>

                            <template #file="{ file }">
                                <div @click="selectImage(file)">
                                    <img
                                        :src="file.url"
                                        alt
                                        class="el-upload-list__item-thumbnail"
                                    />
                                    <span class="el-upload-list__item-actions">
                                        <span
                                            class="el-upload-list__item-preview"
                                            @click.stop="cropImage(file)"
                                        >
                                            <i class="el-icon-ali-xuanqujiancai"></i>
                                        </span>
                                        <span
                                            class="el-upload-list__item-delete"
                                            @click.stop="deleteImage(file)"
                                        >
                                            <i class="el-icon-delete"></i>
                                        </span>
                                    </span>
                                    <label
                                        v-if="chosen && chosen.id === file.id"
                                        class="list-item-check-label"
                                    >
                                        <i class="el-icon-upload-success el-icon-check"></i>
                                    </label>
                                </div>
                            </template>
                        </el-upload>
                        <el-pagination
                            :current-page="currPage"
                            :page-size="pageSize"
                            :total="count"
                            layout="total, prev, pager, next, jumper"
                            style="float: right"
                            @current-change="handleCurrentChange"
                        />
                    </el-tab-pane>
                    <el-tab-pane name="remote">
                        <template #label>
                            <span>
                                <i class="el-icon-ali-xiazai2"></i>
                                提取网络图片
                            </span>
                        </template>
                        <div style="padding: 0px 5px">
                            <el-input v-model="downloadImgUrl" placeholder="请粘进图片的Url地址">
                                <template #append>
                                    <el-button
                                        icon="el-icon-ali-xiazai"
                                        v-bind="{
                                            disabled: checkImgUrl(downloadImgUrl) ? false : true,
                                        }"
                                        @click="onDownloadImage()"
                                    >
                                        下载
                                    </el-button>
                                </template>
                            </el-input>
                            <el-image
                                :src="downloadImgUrl"
                                fit="scale-down"
                                style="border-radius: 30px; margin-top: 5px; max-height: 380px"
                            >
                                <template #error>
                                    <div class="image-slot">
                                        <i
                                            class="el-icon-ali-gaiyemianshanchuhuobucunzai"
                                            style="font-size: 180px; color: #f2f6fc"
                                        ></i>
                                    </div>
                                </template>
                            </el-image>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-main>

            <!-- vueCropper 剪裁图片实现-->
            <el-dialog
                v-model:visible="cropDialogVisible"
                :before-close="closeCropDialog"
                append-to-body
                title="图片剪裁"
            >
                <el-form :inline="true" :size="normalSize">
                    <el-container>
                        <el-main class="cropper-container">
                            <vueCropper
                                ref="cropper"
                                :auto-crop="option.autoCrop"
                                :can-move="option.canMove"
                                :can-move-box="option.canMoveBox"
                                :center-box="option.centerBox"
                                :fixed="option.fixed"
                                :fixed-box="option.fixedBox"
                                :fixed-number="option.fixedNumber"
                                :full="option.full"
                                :img="option.img"
                                :info="true"
                                :info-true="option.infoTrue"
                                :original="option.original"
                                :output-size="option.size"
                                :output-type="option.outputType"
                            />
                        </el-main>
                        <el-footer>
                            <el-form-item>
                                <el-button-group>
                                    <el-button
                                        icon="el-icon-ali-fangda"
                                        round
                                        type="primary"
                                        @click="changeScale(1)"
                                    />
                                    <el-button
                                        icon="el-icon-ali-suoxiao"
                                        round
                                        type="primary"
                                        @click="changeScale(-1)"
                                    />
                                    <el-button
                                        icon="el-icon-ali-left"
                                        round
                                        type="primary"
                                        @click="rotateLeft"
                                    />
                                    <el-button
                                        icon="el-icon-ali-right"
                                        round
                                        type="primary"
                                        @click="rotateRight"
                                    />
                                </el-button-group>
                            </el-form-item>
                        </el-footer>
                    </el-container>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button :size="normalSize" round @click="closeCropDialog">
                            取 消
                        </el-button>
                        <el-button
                            :loading="loading"
                            :size="normalSize"
                            round
                            type="primary"
                            @click="uploadCropData"
                        >
                            确认
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </el-container>
        <template #footer>
            <div class="dialog-footer">
                <el-button :size="normalSize" round @click.native="$emit('update:visible', false)">
                    {{ $t('action.cancel') }}
                </el-button>
                <el-button
                    :disabled="!chosen || (chosen && chosen.id === 0)"
                    :size="normalSize"
                    round
                    type="primary"
                    @click.native="chosedImage"
                >
                    {{ $t('action.submit') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { VueCropper } from 'vue-cropper';
import validator from 'validator';
import Cookies from 'js-cookie';
import extButton from '@/components/core/ext_button.vue';
export default {
    name: 'MultiUploader',
    components: {
        extButton,
        VueCropper,
    },
    data() {
        const token = Cookies.get('token');
        return {
            normalSize: 'large',
            // miniSize: 'default', // 删除 miniSize

            chosen: {
                //  选中的图片
                id: 0,
                path: '',
            },
            editGroupItem: {
                // 编辑的图片分组
                id: 0,
                name: '',
                remark: '',
            },
            activeName: 'local',
            extData: {
                // 上传图片时需要传递的参数
                pathType: 'attachment',
                width: 750,
                height: 960,
            },
            headers: { authorization: 'Bearer ' + token },
            downloadImgUrl: '',

            attachGroups: [],
            imageList: [],

            attachGroupId: 0,
            attachId: 0,

            currPage: 0,
            offset: 0,
            pageSize: 24,
            count: 0,

            cropDialogVisible: false,
            loading: false,

            // 裁剪组件的基础配置option
            option: {
                img: this.imgUrl, // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 0.8, // 裁剪生成图片的质量
                outputType: 'png', // 裁剪生成图片的格式
                canScale: true, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                fixedBox: false, // 固定截图框大小 不允许改变
                fixedNumber: [7, 5], // 截图框的宽高比例
                full: false, // 是否输出原图比例的截图
                canMoveBox: true, // 截图框能否拖动
                original: false, // 上传图片按照原始比例渲染
                centerBox: true, // 截图框是否被限制在图片里面
                infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            },

            cropper: null,
        };
    },
    computed: {
        checkImgUrl() {
            return (url) => {
                return validator.isURL(url);
            };
        },
    },
    async mounted() {
        await this.getAttachGroups();
        if (Array.isArray(this.attachGroups) && this.attachGroups.length > 0) {
            this.attachGroupId = this.attachGroups[0].id;
            await this.getAttachments(this.attachGroupId);
        }
    },
    methods: {
        // 换页刷新
        handleCurrentChange(currPage) {
            this.currPage = currPage;
            this.offset = (currPage - 1) * this.pageSize;
            this.getAttachments();
        },
        chosedImage() {
            this.$emit('chosedImage', this.chosen);
        },
        async cellClick(row) {
            this.attachGroupId = row.id;
            await this.getAttachments(this.attachGroupId);
            this.activeName = 'local';
        },
        // 显示分类新增界面
        onCreateAttachGroup() {
            this.attachGroups.push({
                id: 0,
                name: '新建分类',
                remark: '',
            });
        },
        // 显示编辑界面
        cellDblClick(row) {
            this.attachGroupId = row.id;
            Object.assign(this.editGroupItem, row);
        },
        async onSaveAttachGroup(row) {
            const data = Object.assign({}, row);
            const _result = await this.$api.attachGroup.save(data);
            if (_result.succeed === 1 && _result.code === 200) {
                const _attachGroup = this.attachGroups.filter((v) => v.id === _result.data.id);
                if (_attachGroup.length > 0) {
                    Object.assign(_attachGroup[0], _result.data);
                } else {
                    this.attachGroups.push(_result.data);
                    this.attachGroups = this.attachGroups.filter((v) => v.id !== 0);
                }
                this.attachGroupId = _result.data.id;

                Object.assign(this.editGroupItem, { id: 0, name: '', remark: '' });
            } else {
                this.$notify.error({
                    title: '错误',
                    message: _result.description,
                });
            }
        },
        onDeleteAttachGroup(row) {
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                type: 'warning',
            })
                .then(async () => {
                    const _result = await this.$api.attachGroup.destroy({ ids: [row.id] });
                    if (_result.succeed === 1 && _result.code === 200) {
                        this.attachGroups.splice(
                            this.attachGroups.findIndex((item) => item.id === _result.id),
                            1
                        );
                        this.attachGroupId = _result.data.id;
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: _result.description,
                        });
                    }
                })
                .catch((err) => {
                    this.$notify({
                        title: '错误',
                        message: err,
                        type: 'error',
                    });
                });
        },

        // 上传按钮,限制图片大小
        changeUpload(file, fileList) {
            const _isLt5M = file.size / 1024 / 1024 < 5;
            if (!_isLt5M) {
                this.$notify.error({
                    title: '错误',
                    message: '上传文件大小不能超过 5MB!',
                });
                return false;
            }
            // 上传成功后将图片地址赋值给裁剪框显示图片
            this.$nextTick(() => {
                const _reader = new FileReader();
                _reader.readAsDataURL(file.raw);
                _reader.onload = (e) => {
                    let _data;
                    if (typeof e.target.result === 'object') {
                        // 把Array Buffer转化为blob 如果是base64不需要
                        _data = window.URL.createObjectURL(new Blob([e.target.result]));
                    } else {
                        _data = e.target.result;
                    }
                    this.option.img = _data;
                    this.cropDialogVisible = true;
                    this.attachId = 0;
                };
            });
        },
        // 点击裁剪,这一步是可以拿到处理后的地址
        uploadCropData() {
            const _formData = new FormData();
            this.$refs.cropper.getCropBlob((blobData) => {
                this.loading = true;
                // data是裁剪后图片的blob对象
                _formData.append('file', blobData);
                _formData.append('pathType', 'attachment');
                this.$axios({
                    url: 'cms/upload',
                    method: 'post',
                    data: _formData,
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                    .then(async (result) => {
                        if (result.succeed === 1 && result.code === 200) {
                            const _attachment = {
                                id: this.attachId,
                                attachGroupId: this.attachGroupId,
                                path: result.data.fileUrl,
                                name: result.data.fileName,
                                type: result.data.fileType,
                                size: Number(blobData.size / 1024).toFixed(2),
                            };
                            const _result = await this.$api.attachment.save(_attachment);
                            if (_result.succeed === 1 && _result.code === 200) {
                                await this.getAttachments(this.attachGroupId);
                                this.loading = false;
                                this.cropDialogVisible = false;
                            } else {
                                this.$notify.error({
                                    title: '错误',
                                    message: _result.description,
                                });
                            }
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: '上传图片失败！',
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        this.loading = false;
                    });
            });
        },
        cropImage(file) {
            this.attachId = file.id;
            this.option.img = this.env.getImgUrl(file.path);
            this.cropDialogVisible = true;
        },
        async closeCropDialog() {
            await this.getAttachments(this.attachGroupId);
            this.cropDialogVisible = false;
        },
        deleteImage(file, fileList) {
            this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
                type: 'warning',
            }).then(async () => {
                const _result = await this.$api.attachment.destroy({ ids: [file.id] });
                if (_result.succeed === 1 && _result.code === 200) {
                    await this.getAttachments(this.attachGroupId);
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
            });
        },
        selectImage(file) {
            if (this.chosen.id === file.id) {
                this.chosen = { id: 0, path: '' };
            } else {
                this.chosen = { id: file.id, path: file.path };
            }
        },
        async onDownloadImage() {
            const _result = await this.$api.attachment.download({
                pathType: 'attachment',
                imgUrl: this.downloadImgUrl,
                attachGroupId: this.attachGroupId,
            });
            if (_result.succeed === 1 && _result.code === 200) {
                this.$notify({
                    title: '成功',
                    message: _result.description,
                    type: 'success',
                });
                this.downloadImgUrl = '';
                await this.getAttachments(this.attachGroupId);
                this.activeName = 'local';
            } else {
                this.$notify.error({
                    title: '错误',
                    message: _result.description,
                });
            }
        },
        async getAttachments(attachGroupId) {
            const _attrs = {
                searchKey: { attachGroupId },
                currPage: this.currPage,
                offset: this.offset,
                limit: this.pageSize,
            };
            const _result = await this.$api.attachment.list(_attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.count = _result.data.count;
                _result.data.list.map((item) => {
                    item.url = this.env.getImgUrl(item.path);
                });
                this.imageList = _result.data.list;
            }
        },
        async getAttachGroups() {
            const _result = await this.$api.attachGroup.list({});
            if (_result.succeed === 1 && _result.code === 200) {
                this.attachGroups = _result.data.list;
            }
        },
        openDialog() {
            const self = this;
            this.$nextTick(() => {
                if (self.$refs.attachGroupTable && self.attachGroups.length > 0) {
                    self.$refs.attachGroupTable.setCurrentRow(self.attachGroups[0]);
                }
            });
        },
        // 放大/缩小
        changeScale(num) {
            num = num || 1;
            this.$refs.cropper.changeScale(num);
        },
        // 左旋转
        rotateLeft() {
            this.$refs.cropper.rotateLeft();
        },
        // 右旋转
        rotateRight() {
            this.$refs.cropper.rotateRight();
        },
        setDragMode() {
            this.$refs.cropper.setDragMode('crop');
        },
    },
};
</script>

<style scoped lang="scss">
i {
    font-style: normal;
}
.list-item-check-label {
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
}

.list-item-check-label i {
    font-size: 12px;
    margin-top: 11px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
}

.el-main {
    margin: 0px 10px;
    padding: 0px;
}
.toolbar {
    padding-top: 10px;
    padding-left: 15px;
}
.right {
    float: right;
}
.left {
    float: left;
}

.thumb {
    width: 80px;
    height: 80px;
    border-radius: 90px;
}
.uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.uploader .el-upload:hover {
    border-color: #409eff;
}

.uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    display: block;
}

.preview {
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    display: block;
}
.el-upload-list__item-actions {
    cursor: pointer;
}

.image-list :deep(.el-upload--picture-card) {
    width: 80px;
    height: 80px;
    line-height: 80px;
    .el-icon-plus {
        height: 80px;
        line-height: 80px;
    }
}

.image-list :deep(.el-upload-list__item) {
    width: 80px;
    height: 80px;
}
// 截图
.cropper-container {
    height: 360px;
}
</style>
