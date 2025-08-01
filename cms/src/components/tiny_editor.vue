<template>
    <div class="tiny-container">
        <textarea ref="editor"></textarea>
        <video-uploader v-model:visible="videoDialogVisible" @chosed-video="chosedVideo" />
        <multi-uploader v-model:visible="imageDialogVisible" @chosed-image="chosedImage" />
    </div>
</template>
<script>
import tinymce from 'tinymce';
import 'tinymce/icons/default';
import videoUploader from '@/components/video_uploader.vue';
import multiUploader from '@/components/multi_uploader.vue';

export default {
    name: 'TinyEditor',
    components: {
        videoUploader,
        multiUploader,
    },
    props: {
        // 父组件通过:content.sync同步富文本编辑器内容
        content: {
            type: String,
            required: true,
        },
        // 触发content同步更新的tinymce Editor Events，其他https://www.tiny.cloud/docs/advanced/events/
        updateEvent: {
            type: String,
            default: 'beforeaddundo undo redo keyup',
        },
        // tinymce依赖文件的cdn url
        url: {
            type: String,
            default: 'https://cdn.jsdelivr.net/npm/tinymce@~5',
        },
        // tinymce的init方法的config参数，本组件有默认设置，比如不要toolbar3，可以使用该组件时写上 :config="{toolbar2:''}"
        config: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    emits: ['update:content', 'content-change'],
    data() {
        return {
            editor: null,
            videoDialogVisible: false,
            imageDialogVisible: false,
            defaultConfig: {
                themes: 'modern',
                allow_script_urls: true,
                remove_script_host: false,
                convert_urls: false,
                relative_urls: false,
                // 暂时使用英文界面，避免语言包加载问题
                // language_url: '',
                // language: 'zh_CN',
                theme_url: `${this.url}/themes/silver/theme.min.js`,
                skin_url: `${this.url}/skins/ui/oxide`,
                branding: false,
                menubar: false,
                fontsize_formats: '12px 13px 14px 15px 16px 18px 20px 24px',
                external_plugins: {},
                plugins: 'code hr link advlist lists paste table image media preview autoresize',
                contextmenu: 'selectall copy paste inserttable',
                toolbar1:
                    'link unlink bold italic forecolor backcolor table alignleft aligncenter alignright alignjustify removeformat imageUpload videoUpload',
                setup: (editor) => {
                    const self = this;
                    editor.ui.registry.addButton('imageUpload', {
                        tooltip: this.$t('tinyEditor.insertImage'),
                        icon: 'image',
                        onAction: () => {
                            self.imageDialogVisible = true;
                        },
                    });
                    editor.ui.registry.addButton('videoUpload', {
                        tooltip: this.$t('tinyEditor.insertVideo'),
                        icon: 'upload',
                        onAction: () => {
                            self.videoDialogVisible = true;
                        },
                    });
                }, // 建立实例事件监听,editor为tinytmce实例
                autoresize_bottom_margin: 20,
                autoresize_max_height: 380,
                autoresize_min_height: 250,
                autoresize_overflow_padding: 10,
            },
        };
    },
    watch: {
        config: {
            handler(val) {
                // 用外部配置覆盖内部默认配置
                Object.assign(this.defaultConfig, val);
                // ============================================================================
                // 如果语言相关为默认英语，则修改默认配置为中文
                const enUS = 'en_US';
                // 暂时禁用中文语言包，使用英文界面
                // 如果语言没有配置，则默认配置为中文
                // if (!this.defaultConfig.language) {
                //     this.defaultConfig.language = zhCN;
                // }
                // 如果有配置语言，并且不是"en_US"，并且没有配置language_url，则使用本项目的语言包
                // if (
                //     Object.prototype.toString.call(this.defaultConfig.language) ===
                //         '[object String]' &&
                //     this.defaultConfig.language !== enUS &&
                //     Object.prototype.toString.call(this.defaultConfig.language_url) !==
                //         '[object String]'
                // ) {
                //     // 使用 TinyMCE 官方语言包
                //     this.defaultConfig.language_url = `${this.url}/langs/${this.defaultConfig.language}.js`;
                // }
                // 如果语言为中文，并且没有配置字体，则使用内部配置
                // if (
                //     this.defaultConfig.language === zhCN &&
                //     Object.prototype.toString.call(this.defaultConfig.font_formats) !==
                //         '[object String]'
                // ) {
                //     this.defaultConfig.font_formats = '微软雅黑="微软雅黑";幼圆="幼圆";Arial=arial';
                // }
                // 如果配置为默认英语，则删除语言相关配置节点
                if (this.defaultConfig.language === enUS) {
                    delete this.defaultConfig.language;
                    delete this.defaultConfig.language_url;
                }
                this.init();
            },
            immediate: true,
            deep: true,
        },
        content: {
            handler: 'setContent',
            immediate: true,
        },
    },
    beforeUnmount() {
        this.destroy();
    },
    created() {
        // 从指定url加载tinymce依赖文件
        tinymce.EditorManager.baseURL = this.url;
    },
    mounted() {
        this.$nextTick(function () {
            if (!this.editor) {
                this.init();
            }
        });
    },
    methods: {
        chosedImage(chosen) {
            const src = this.env.getImgUrl(chosen.path); // 图片地址
            tinymce.execCommand(
                'mceInsertContent',
                false,
                `<img src=${src} style="max-width:380px;">`
            );
            this.imageDialogVisible = false;
        },
        chosedVideo(videoFile) {
            const src = this.env.getImgUrl(videoFile); // 视频地址
            const dom = tinymce.activeEditor.dom;
            tinymce.execCommand(
                'mceInsertContent',
                false,
                dom.createHTML('video', {
                    src: src,
                    maxWidth: '380px',
                    controls: 'controls',
                })
            );
            this.videoDialogVisible = false;
        },
        // 插入图片至编辑器
        insertImage(res, file) {
            const src = ''; // 图片存储地址
            tinymce.execCommand('mceInsertContent', false, `<img src=${src}>`);
        },
        init() {
            // 编辑器实例初始化
            const refEditor = this.$refs.editor;
            if (refEditor) {
                this.destroy();
                this.defaultConfig.target = refEditor;
                this.defaultConfig.init_instance_callback = (editor) => {
                    if (this && this.$refs.editor) {
                        // 检查语言包是否加载成功
                        if (
                            this.defaultConfig.language === 'zh_CN' &&
                            editor.getLang &&
                            editor.getLang('Insert/edit link') === 'Insert/edit link'
                        ) {
                            // 语言包加载失败，回退到英文
                            console.warn(this.$t('tinyEditor.languagePackLoadFailed'));
                            delete this.defaultConfig.language;
                            delete this.defaultConfig.language_url;
                            // 重新初始化编辑器
                            this.$nextTick(() => {
                                this.init();
                            });
                            return;
                        }

                        if (
                            /^\[object [^F]*Function\]$/.test(
                                Object.prototype.toString.call(this.config.init_instance_callback)
                            )
                        ) {
                            this.config.init_instance_callback(editor);
                        }
                        this.editor = editor;
                        this.setContent();
                        editor.on(
                            this.updateEvent,
                            tinymce.util.Delay.debounce(() => {
                                this.contentChange();
                            }, 300)
                        );
                    }
                };

                tinymce.init(this.defaultConfig);
            }
        },
        destroy() {
            try {
                // 销毁
                if (this && this.$refs.editor && this.editor) {
                    tinymce.remove(this.editor);
                    this.editor.remove();
                    this.editor.destroy();
                    this.editor = null;
                }
            } catch (e) {
                // 忽略错误
            }
        },
        setContent() {
            this.$nextTick(function () {
                // 如果编辑器实例已经为真，并且编辑器内容和父组件传入的内容不一样
                if (
                    this &&
                    this.$refs.editor &&
                    this.editor &&
                    this.editor.getContent() !== this.content
                ) {
                    this.editor.setContent(this.content);
                }
            });
        },
        contentChange() {
            this.$nextTick(function () {
                // 同步到父组件
                if (this && this.$refs.editor && this.editor) {
                    const content = this.editor.getContent();
                    this.$emit('update:content', content);
                    this.$emit('content-change', content);
                }
            });
        },
    },
};
</script>
<style scoped lang="scss">
.tiny-container {
    border: 1px solid #c0ccda;
    border-radius: 6px;
}
</style>
