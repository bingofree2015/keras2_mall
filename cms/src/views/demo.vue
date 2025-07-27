<template>
    <el-container>
        <el-header>组件测试界面</el-header>
        <el-main>
            <el-row>
                <el-col :span="6">
                    <el-card>
                        <template #header>
                            <div>
                                <pick-goods :selection-type="1" @chosed-goods="chosedGoods" />
                            </div>
                        </template>
                        {{ goods.map((v) => v.name) }}
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card>
                        <template #header>
                            <div>
                                <pick-article
                                    :selection-type="0"
                                    @chosed-articles="chosedArticles"
                                />
                            </div>
                        </template>
                        {{ articles.map((v) => v.title) }}
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card>
                        <template #header>
                            <div>
                                <el-input
                                    v-model="input3"
                                    class="input-with-select"
                                    placeholder="请输入内容"
                                >
                                    <template #append>
                                        <pick-articleType
                                            :selection-type="0"
                                            @chosed-article-types="chosedArticleTypes"
                                        />
                                    </template>
                                </el-input>
                            </div>
                        </template>
                        {{ articleTypes.map((v) => v.typeName) }}
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card>
                        <template #header>
                            <div>
                                <pick-form :selection-type="0" @chosed-forms="chosedForms" />
                            </div>
                        </template>
                        {{ forms.map((v) => v.name) }}
                    </el-card>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-card>
                        <template #header>
                            <div>
                                <pick-area :selection-type="0" @chosed-areas="chosedAreas" />
                            </div>
                        </template>
                        {{ areas.map((v) => v.name) }}
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-button @click="dialogVisible = true">弹窗测试</el-button>
                    <el-dialog v-model:visible="dialogVisible" title="测试弹窗">
                        <div>弹窗内容</div>
                    </el-dialog>
                </el-col>
                <el-col :span="6" />
                <el-col :span="6" />
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-divider />
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-button :size="largeSize" round type="primary" @click="handleClick">
                        上传视频
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <img src="/static/logo.png" style="width: 10%" />
                </el-col>
                <el-col :span="6">
                    <change-image-icon
                        :img-url="imgUrl"
                        :init-style="{
                            height: '160px',
                            width: '160px',
                            border: '1px dashed #d9d9d9',
                            borderRadius: '4px',
                        }"
                        @chosed-image-icon="chosedLogo"
                    />
                </el-col>
                <el-col :span="6">
                    <pick-video v-model="imgUrl2" />
                    {{ imgUrl2 }}
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-divider />
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <draggable-image-list
                        :items="imageItems"
                        @chosed-image="chosedImage"
                        @end="end"
                        @on-remove="onRemove"
                    />
                </el-col>
                <el-col :span="8">
                    <el-upload
                        :auto-upload="false"
                        :on-change="changeUpload"
                        :show-file-list="false"
                        action
                        drag
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">点击上传</div>
                        <div class="el-upload__tip">支持绝大多数图片格式，单张图片最大支持5MB</div>
                    </el-upload>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <tinyEditor v-model:content="content" />
                </el-col>
                <el-col :span="6">
                    <p v-html="content"></p>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-cascader
                        v-model="cascaderValue"
                        :options="cascaderOpts"
                        :show-all-levels="false"
                    />
                </el-col>
                <el-col :span="6">
                    {{ cascaderValue }}
                </el-col>
                <el-col :span="6" />
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="sf-image-grid-container">
                        <div :style="{ margin: -padding + 'px' }" class="sf-image-grid-list">
                            <div :style="{ padding: padding + 'px' }" class="sf-image-item">
                                class="sf-image-item" > bingofree1
                            </div>
                            <div class="sf-image-right">
                                <div class="sf-image-item">bingofree2</div>
                                <div class="sf-image-right-bottom">
                                    <div class="sf-image-item">bingofree3</div>
                                    <div class="sf-image-item">bingofree4</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-main>
        <!-- vueCropper 剪裁图片实现-->
        <el-dialog :model-value="cropDialogVisible" append-to-body title="图片剪裁">
            <el-form :inline="true" :size="largeSize">
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
                    <el-button :size="largeSize" round @click="cropDialogVisible = false">
                        取 消
                    </el-button>
                    <el-button
                        :loading="loading"
                        :size="largeSize"
                        round
                        type="primary"
                        @click="uploadCropData"
                    >
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <video-uploader :model-value="videoDialogVisible" />
    </el-container>
</template>
<script>
import { VueCropper } from 'vue-cropper';
import draggableImageList from '@/components/draggable_image_list.vue';
import pickGoods from '@/components/pick_goods.vue';
import pickArticle from '@/components/pick_article.vue';
import pickArticleType from '@/components/pick_articleType.vue';
import pickForm from '@/components/pick_form.vue';
import changeImageIcon from '@/components/change_image_icon.vue';
import tinyEditor from '@/components/tiny_editor.vue';
import videoUploader from '@/components/video_uploader.vue';
import pickVideo from '@/components/pick_video.vue';
import pickArea from '@/components/pick_area.vue';
import { ref } from 'vue'
const dialogVisible = ref(false)
export default {
    components: {
        draggableImageList,
        VueCropper,
        pickGoods,
        pickArticle,
        pickArticleType,
        pickForm,
        tinyEditor,
        videoUploader,
        pickVideo,
        changeImageIcon,
        pickArea,
    },
    props: {
        imgUrl: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            input3: '',
            padding: 3,
            cascaderOpts: [
                {
                    value: 'zhinan',
                    label: '指南',
                    children: [
                        {
                            value: 'shejiyuanze',
                            label: '设计原则',
                            children: [
                                {
                                    value: 'yizhi',
                                    label: '一致',
                                },
                                {
                                    value: 'fankui',
                                    label: '反馈',
                                },
                                {
                                    value: 'xiaolv',
                                    label: '效率',
                                },
                                {
                                    value: 'kekong',
                                    label: '可控',
                                },
                            ],
                        },
                    ],
                },
            ],

            cascaderValue: null,

            imgUrl2: 'http://www.baidu.com/',
            videoDialogVisible: false,

            attachGroupId: 1,
            attachId: 100,
            cropDialogVisible: false,
            loading: false,

            largeSize: 'large',
            smallSize: 'small',
            imageItems: [
                { id: 0, path: 'attachment/image/156691643755464.jpg' },
                { id: 1, path: 'attachment/image/156691644208066.png' },
                { id: 2, path: 'attachment/image/156691650779637.png' },
            ],

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

            content: 'bingofree...',

            goods: [],
            articles: [],
            articleTypes: [],
            forms: [],
            areas: [],
        };
    },
    computed: {},
    mounted() {},
    methods: {
        chosedLogo(logo) {
            this.$notify({
                title: '成功',
                message: logo,
                type: 'success',
            });
        },
        handleClick() {
            this.videoDialogVisible = true;
        },
        end(items) {
            this.imageItems = items;
        },
        chosedImage(chosen) {
            this.imageItems.push(chosen);
        },
        chosedGoods(goods) {
            this.goods = goods;
        },
        chosedArticles(articles) {
            this.articles = articles;
        },
        chosedArticleTypes(articleTypes) {
            this.articleTypes = articleTypes;
        },
        chosedAreas(areas) {
            this.areas = areas;
        },
        chosedForms(forms) {
            this.forms = forms;
        },
        onRemove(item) {},
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
                        this.cropDialogVisible = false;

                        const _attachment = {
                            id: this.attachId,
                            attachGroupId: this.attachGroupId,
                            path: result.data.fileUrl,
                            name: result.data.fileName,
                            type: result.data.fileType,
                            size: Number(blobData.size / 1024).toFixed(2),
                        };
                        result = await this.$api.attachment.save(_attachment);
                        if (result.succeed === 1 && result.code === 200) {
                            // const _newFileData = { ...result.data, url: this.env.getImgUrl(result.data.path) }
                            //           file = Object.assign(file, _newFileData)
                            this.$notify({
                                title: '成功',
                                message: result.description,
                                type: 'success',
                            });
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: result.description,
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        this.loading = false;
                    });
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
.sf-image-item {
    flex: 1;
}

.sf-image-grid-container {
    width: 100%;
    height: 400px;
    .sf-image-grid-list {
        height: 100%;
        display: flex;
        align-items: center;
        .sf-image-right {
            flex: 1;
            display: flex;
            align-content: center;
            flex-direction: column;
            .sf-image-right-bottom {
                flex: 1;
                display: flex;
                align-items: center;
                flex-direction: row;
            }
        }
    }
}

// 截图
.cropper-container {
    height: 360px;
}

.img-window-list :deep() {
    span.el-radio-button__inner {
        background: #f2f6fc;
        padding: 5px 10px;
        .el-image {
            width: 50px;
            height: 50px;
        }
        span {
            display: block;
            font-size: 14px;
            font-weight: 400;
        }
    }
}
</style>
