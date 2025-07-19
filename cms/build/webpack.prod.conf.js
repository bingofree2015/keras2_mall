"use strict";
const path = require("path");
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const env =
    process.env.NODE_ENV === "testing"
        ? require("../config/test.env")
        : require("../config/prod.env");

const smp = new SpeedMeasurePlugin();

const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            //extract: true,  // 分离css
            usePostCSS: true
        })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
        path: config.build.assetsRoot,
        //filename: utils.assetsPath('js/[name].[chunkhash].js'),
        //chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
        filename: "[name].js"
    },
    mode: "production",
    optimization: {
        minimize: true,
        minimizer: [
            // 压缩js
            new TerserPlugin({
                cache: true, // 开启缓存
                parallel: true, // 开启多线程编译
                sourceMap: config.build.productionSourceMap, // 是否sourceMap
                terserOptions: {
                    // 丑化参数
                    comments: false,
                    warnings: false,
                    compress: {
                        unused: true,
                        dead_code: true,
                        collapse_vars: true,
                        reduce_vars: true
                    },
                    output: {
                        comments: false
                    }
                }
            })
        ],
        providedExports: true,
        usedExports: true,
        moduleIds:'hashed',
        chunkIds:'named',
        //识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
        //依赖于optimization.providedExports和optimization.usedExports
        sideEffects: true,
        //取代 new webpack.optimize.ModuleConcatenationPlugin()
        concatenateModules: true,
        //取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。
        noEmitOnErrors: true,
        splitChunks: {
            // async表示只从异步加载得模块（动态加载import()）里面进行拆分(会拆分出通过懒加载等方式异步加载的模块)
            // initial表示只从入口模块进行拆分（入口文件会包含node_modules中的react-dom等包,但是在blog.js中异步加载的marterial等插件就没有拆分出来 和业务代码打包成了一个包）
            // all表示以上两者都包括
            chunks: "all",
            minSize: 30000, // 大于30k会被webpack进行拆包
            minChunks: 1, // 被引用次数大于等于这个次数进行拆分
            // import()文件本身算一个
            // 只计算js，不算css
            // 如果同时有两个模块满足cacheGroup的规则要进行拆分，但是maxInitialRequests的值只能允许再拆分一个模块，那尺寸更大的模块会被拆分出来
            maxAsyncRequests: 5, // 最大的按需加载（异步）请求次数
            // 最大的初始化加载请求次数,为了对请求数做限制，不至于拆分出来过多模块
            // 入口文件算一个
            // 如果这个模块有异步加载的不算
            // 只算js，不算css
            // 通过runtimeChunk拆分出来的runtime不算在内
            // 如果同时又两个模块满足cacheGroup的规则要进行拆分，但是maxInitialRequests的值只能允许再拆分一个模块，那尺寸更大的模块会被拆分出来
            maxInitialRequests: 3,
            automaticNameDelimiter: "~", // 打包分隔符
            name: true,
            cacheGroups: {
                // 默认的配置
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                // 默认的配置，vendors规则不命中的话，就会命中这里
                default: {
                    minChunks: 2, // 引用超过两次的模块 -> default
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        runtimeChunk: {
            name: "manifest"
        }
    },
    plugins: [
        // 解决moment语言包问题
        new webpack.ContextReplacementPlugin(
            /moment[\\\/]locale$/,
            /^\.\/(zh-cn)$/
        ),
        // extract css into its own file
        new MiniCssExtractPlugin({
            ignoreOrder: true,
            filename: utils.assetsPath("css/[name].css"),
            // Setting the following option to `false` will not extract CSS from codesplit chunks.
            // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
            // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
            // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
            allChunks: true
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            // 4.0+ safe:true 5.0版本 Option safe was removed. Use parser: require("postcss-safe-parser
            //assetNameRegExp: /\.optimize\.css$/g, // 加上这个,parser可以不加
            cssProcessorOptions: config.build.productionSourceMap
                ? {
                      parser: require("postcss-safe-parser"),
                      discardComments: { removeAll: true },
                      map: { inline: false }
                  }
                : { parser: require("postcss-safe-parser") }
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename:
                env.NODE_ENV === "testing" ? "index.html" : config.build.index,
            template: "index.html",
            // title: '首页',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: "none"
        }),
        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        // copy custom static assets
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../static"),
                    to: config.build.assetsSubDirectory
                }
            ]
        }),
        new CleanWebpackPlugin()
    ]
});

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require("compression-webpack-plugin");

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: new RegExp(
                "\\.(" + config.build.productionGzipExtensions.join("|") + ")$"
            ),
            threshold: 10240, // 对超过 10k 的文件进行压缩
            minRatio: 0.8,
            //deleteOriginalAssets: true  // 删除源文件
        })
    );
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
        .BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = smp.wrap(webpackConfig);
