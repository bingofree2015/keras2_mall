<template>
    <el-container>
        <el-header>
            <h2 class="demo-title">图片裁剪</h2>
        </el-header>
        <el-main>
            <p class="demo-summery">
                通过上传图片，在本地实现对图片的放大、缩小、旋转、裁剪操作，迅速简便地实现简单的在线图片编辑效果。
            </p>
            <el-row>
                <el-col :span="18">
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
            <h5 class="demo-sub-title">
                <i>演示代码</i>
            </h5>
            <el-row>
                <el-col :span="18" class="demo-code">
                    <pre>
                        <code v-pre>
&lt;template&gt;
    &lt;div&gt;
        &lt;el-upload
            :auto-upload=&quot;false&quot;
            :on-change=&quot;changeUpload&quot;
            :show-file-list=&quot;false&quot;
            action
            drag
        &gt;
            &lt;i class=&quot;el-icon-upload&quot;&gt;&lt;/i&gt;
            &lt;div class=&quot;el-upload__text&quot;&gt;点击上传&lt;/div&gt;
            &lt;div class=&quot;el-upload__tip&quot;&gt;支持绝大多数图片格式，单张图片最大支持5MB&lt;/div&gt;
        &lt;/el-upload&gt;

        &lt;!-- vueCropper 剪裁图片实现--&gt;
        &lt;el-dialog :model-value=&quot;cropDialogVisible&quot; append-to-body title=&quot;图片剪裁&quot;&gt;
            &lt;el-form :inline=&quot;true&quot; :size=&quot;miniSize&quot;&gt;
                &lt;el-container&gt;
                    &lt;el-main class=&quot;cropper-container&quot;&gt;
                        &lt;VueCropper
                            :autoCrop=&quot;option.autoCrop&quot;
                            :canMove=&quot;option.canMove&quot;
                            :canMoveBox=&quot;option.canMoveBox&quot;
                            :centerBox=&quot;option.centerBox&quot;
                            :fixed=&quot;option.fixed&quot;
                            :fixedBox=&quot;option.fixedBox&quot;
                            :fixedNumber=&quot;option.fixedNumber&quot;
                            :full=&quot;option.full&quot;
                            :img=&quot;option.img&quot;
                            :info=&quot;true&quot;
                            :infoTrue=&quot;option.infoTrue&quot;
                            :original=&quot;option.original&quot;
                            :outputSize=&quot;option.size&quot;
                            :outputType=&quot;option.outputType&quot;
                            ref=&quot;cropper&quot;
                        &gt;&lt;/VueCropper&gt;
                    &lt;/el-main&gt;
                    &lt;el-footer&gt;
                        &lt;el-form-item&gt;
                            &lt;el-button-group&gt;
                                &lt;el-button
                                    @click=&quot;changeScale(1)&quot;
                                    icon=&quot;el-icon-ali-fangda&quot;
                                    round
                                    type=&quot;primary&quot;
                                &gt;&lt;/el-button&gt;
                                &lt;el-button
                                    @click=&quot;changeScale(-1)&quot;
                                    icon=&quot;el-icon-ali-suoxiao&quot;
                                    round
                                    type=&quot;primary&quot;
                                &gt;&lt;/el-button&gt;
                                &lt;el-button
                                    @click=&quot;rotateLeft&quot;
                                    icon=&quot;el-icon-ali-left&quot;
                                    round
                                    type=&quot;primary&quot;
                                &gt;&lt;/el-button&gt;
                                &lt;el-button
                                    @click=&quot;rotateRight&quot;
                                    icon=&quot;el-icon-ali-right&quot;
                                    round
                                    type=&quot;primary&quot;
                                &gt;&lt;/el-button&gt;
                            &lt;/el-button-group&gt;
                        &lt;/el-form-item&gt;
                    &lt;/el-footer&gt;
                &lt;/el-container&gt;
            &lt;/el-form&gt;
            &lt;div class=&quot;dialog-footer&quot; slot=&quot;footer&quot;&gt;
                &lt;el-button :size=&quot;normalSize&quot; @click=&quot;cropDialogVisible = false&quot; round&gt;取 消&lt;/el-button&gt;
                &lt;el-button
                    :loading=&quot;loading&quot;
                    :size=&quot;normalSize&quot;
                    @click=&quot;uploadCropData&quot;
                    round
                    type=&quot;primary&quot;
                &gt;确认&lt;/el-button&gt;
            &lt;/div&gt;
        &lt;/el-dialog&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import { VueCropper } from &quot;vue-cropper&quot;;
export default {
    components: { VueCropper },
    computed: {},
    data() {
        return {
            attachGroupId: 1,
            attachId: 100,
            loading: false,
            cropDialogVisible: false,

            // 裁剪组件的基础配置option
            option: {
                img: this.imgUrl, // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 0.8, // 裁剪生成图片的质量
                outputType: &quot;png&quot;, // 裁剪生成图片的格式
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
    methods: {
        // 上传按钮,限制图片大小
        changeUpload(file, fileList) {
            const _isLt5M = file.size / 1024 / 1024 &lt; 5;
            if (!_isLt5M) {
                this.$notify.error({
                    title: &quot;错误&quot;,
                    message: &quot;上传文件大小不能超过 5MB!&quot;,
                });
                return false;
            }
            // 上传成功后将图片地址赋值给裁剪框显示图片
            this.$nextTick(() =&gt; {
                const _reader = new FileReader();
                _reader.readAsDataURL(file.raw);
                _reader.onload = (e) =&gt; {
                    let _data;
                    if (typeof e.target.result === &quot;object&quot;) {
                        // 把Array Buffer转化为blob 如果是base64不需要
                        _data = window.URL.createObjectURL(
                            new Blob([e.target.result])
                        );
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
            this.$refs.cropper.getCropBlob((blobData) =&gt; {
                this.loading = true;
                // data是裁剪后图片的blob对象
                _formData.append(&quot;file&quot;, blobData);
                _formData.append(&quot;pathType&quot;, &quot;attachment&quot;);
                this.$axios({
                    url: &quot;cms/upload&quot;,
                    method: &quot;post&quot;,
                    data: _formData,
                    headers: { &quot;Content-Type&quot;: &quot;multipart/form-data&quot; },
                })
                    .then(async (result) =&gt; {
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
                        if (result.succeed === 1 &amp;&amp; result.code === 200) {
                            // const _newFileData = { ...result.data, url: this.env.getImgUrl(result.data.path) }
                            //           file = Object.assign(file, _newFileData)
                            this.$notify({
                                title: &quot;成功&quot;,
                                message: result.description,
                                type: &quot;success&quot;,
                            });
                        } else {
                            this.$notify.error({
                                title: &quot;错误&quot;,
                                message: result.description,
                            });
                        }
                        this.loading = false;
                    })
                    .catch((err) =&gt; {
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
            this.$refs.cropper.setDragMode(&quot;crop&quot;);
        },
    },
};
&lt;/script&gt;
                        </code>
                    </pre>
                </el-col>
            </el-row>
        </el-main>
        <!-- vueCropper 剪裁图片实现-->
        <el-dialog :model-value="cropDialogVisible" append-to-body title="图片剪裁">
            <el-form :inline="true" :size="miniSize">
                <el-container>
                    <el-main class="cropper-container">
                        <VueCropper
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
                    <el-button :size="normalSize" round @click="cropDialogVisible = false">
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
</template>
<script>
import { VueCropper } from 'vue-cropper';
export default {
    components: { VueCropper },
    props: {
        imgUrl: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            normalSize: 'default',
            smallSize: 'small',

            attachGroupId: 1,
            attachId: 100,
            loading: false,
            cropDialogVisible: false,

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
    computed: {},
    methods: {
        // 上传按钮,限制图片大小
        changeUpload(file, fileList) {
            const _isLt5M = file.size / 1024 / 1024 < 5;
            if (!_isLt5M) {
                this.$notify.error({
                    title: this.$t('common.error'),
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
                                title: this.$t('common.success'),
                                message: result.description,
                                type: 'success',
                            });
                        } else {
                            this.$notify.error({
                                title: this.$t('common.error'),
                                message: result.description,
                            });
                        }
                        this.loading = false;
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
// 截图
.cropper-container {
    height: 360px;
}

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
