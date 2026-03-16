/**
 * 移动端车模相关接口
 * 包含：厂商管理、目录管理、车模车库管理、车模评论等功能
 */
const path = require('path');
const fs = require('mz/fs');
const Jimp = require('jimp');
const Router = require('@koa/router');
const logger = require('../../utils/logger');
const carModelManufacturerRepo = require('../../repository/car_model/manufacturer_repos');
const carModelCatalogRepo = require('../../repository/car_model/catalog_repos');
const carModelRepo = require('../../repository/car_model/index_repos');
const carModelCommentRepo = require('../../repository/car_model/comment_repos');
const carModelFavoriteRepo = require('../../repository/car_model/favorite_repos');
const userCarModelGarageRepo = require('../../repository/car_model/user_garage_repos');
const userCustomCategoryRepo = require('../../repository/car_model/user_custom_category_repos');
const qwenService = require('../../services/ai/qwen_service');
const carModelMatcher = require('../../services/ai/car_model_matcher');
const purchaseService = require('../../services/purchase/purchase_service');
const uploader = require('../../utils/uploader');
const userManufacturerSortRepo = require('../../repository/car_model/user_manufacturer_sort_repos');
const { getThumbnailFileName, getThumbnailConfigForScale } = require('../../utils/thumbnail_config');
const { Attachment, User, UserGarageVisitKey, CarModelManufacturer } = require('../../models');

const router = Router({ prefix: '/car-model' });

/**
 * 生成随机车库访问密钥
 * 由大小写字母与数字组成，长度12位，便于分享与输入
 */
const generateVisitKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 12;
    let key = '';
    for (let i = 0; i < length; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
};

/**
 * 车模厂商查询分页列表
 * @param {string} keyword - 搜索关键词（可选，用于搜索厂商名称）
 * @param {number} userId - 用户ID（可选，默认0，0表示平台管理，>0表示用户自定义）
 * @param {number|number[]} scaleIds - 车模比例ID（可选，可为单个数字或数组；传一个或多个比例ID，返回支持其中任意一个比例的厂商）
 * @param {number} page - 页码，从1开始，默认1
 * @param {number} size - 每页数量，默认10
 * @param {0|1|'0'|'1'} visible - 是否仅返回“未隐藏”厂商（可选，默认0=返回全部，1=仅返回未隐藏）
 */
router.post('/manufacturer/list', async (ctx) => {
    const {
        keyword,
        userId = 0,
        scaleIds,
        page = 1,
        size = 10,
        // visible: 0=返回全部（含隐藏），1=仅返回未隐藏
        visible = 0,
    } = ctx.request.body || {};

    const searchKey = {};
    if (keyword) {
        searchKey.name = keyword;
    }
    // userId 仅用于用户自定义排序
    searchKey.userId = userId;

    const options = {};
    // 统一使用 scaleIds：既支持数组，也支持单个数字
    let _scaleIds = scaleIds;
    if (!Array.isArray(_scaleIds) && _scaleIds != null && _scaleIds !== '') {
        _scaleIds = [_scaleIds];
    }
    if (Array.isArray(_scaleIds) && _scaleIds.length > 0) {
        options.scaleIds = _scaleIds.filter((id) => id != null && id !== '');
    }
    // visible: 0/1 简单开关，传递给仓储层
    options.visible = visible;

    // 规范化分页参数，防止出现 page<=0 或 size<=0 导致 SQL 中 LIMIT 为负数
    const pageNum = parseInt(page, 10) || 1;
    const sizeNum = parseInt(size, 10) || 10;
    const safePage = pageNum < 1 ? 1 : pageNum;
    const safeSize = sizeNum <= 0 ? 10 : sizeNum;

    const offset = (safePage - 1) * safeSize;
    const _result = await carModelManufacturerRepo.list(searchKey, offset, safeSize, options);
    ctx.body = _result;
});

/**
 * 我的车模厂商列表
 * 返回用户车库中车模所属的厂商，仅包含用户实际拥有的车模所关联的厂商
 * @param {number} userId - 用户ID（必填）
 * @param {string} keyword - 搜索关键词（可选，用于搜索厂商名称）
 * @param {number} page - 页码，从1开始，默认1
 * @param {number} size - 每页数量，默认10
 */
router.post('/manufacturer/my-list', async (ctx) => {
    const { userId, keyword, page = 1, size = 10 } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    const searchKey = {};
    if (keyword) {
        searchKey.keyword = keyword;
    }
    const offset = (page - 1) * size;
    const _result = await carModelManufacturerRepo.listByUserGarage(
        parseInt(userId, 10),
        searchKey,
        offset,
        parseInt(size, 10) || 10,
    );
    ctx.body = _result;
});

/**
 * 保存用户车模厂商排序
 * @param {number} userId - 用户ID（必填）
 * @param {Array<{manufacturerId:number, sort:number}>} items - 排序列表
 */
router.post('/manufacturer/sort/save', async (ctx) => {
    const { userId, items } = ctx.request.body || {};

    if (!userId || !Array.isArray(items) || items.length === 0) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 或 items 不能为空',
        };
        return;
    }

    const result = await userManufacturerSortRepo.saveSort(userId, items);
    ctx.body = result;
});

/**
 * 车模目录查询分页列表
 * @param {string} keyword - 搜索关键词（可选，用于搜索目录名称）
 * @param {number} manufacturerId - 厂商ID（可选，用于筛选特定厂商下的目录）
 * @param {number} parentId - 父目录ID（可选，0表示一级目录）
 * @param {number} page - 页码，从1开始，默认1
 * @param {number} size - 每页数量，默认10
 */
router.post('/catalog/list', async (ctx) => {
    const { keyword, manufacturerId, parentId, page = 1, size = 10 } = ctx.request.body;
    const searchKey = {};
    // 将 keyword 映射到 name 字段
    if (keyword) {
        searchKey.name = keyword;
    }
    if (manufacturerId) {
        searchKey.manufacturerId = manufacturerId;
    }
    if (parentId !== undefined) {
        searchKey.parentId = parentId;
    }
    const offset = (page - 1) * size;
    const _result = await carModelCatalogRepo.list(searchKey, offset, size);
    ctx.body = _result;
});

/**
 * 获取车模厂商目录树状结构
 * @param {number} manufacturerId - 厂商ID（必填，用于筛选特定厂商下的目录）
 * @param {number} [catalogId] - 可选，产品目录ID；如传入则仅返回该目录及其子目录组成的子树
 */
router.post('/catalog/tree', async (ctx) => {
    const { manufacturerId, catalogId } = ctx.request.body || {};

    if (!manufacturerId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：manufacturerId 不能为空',
        };
        return;
    }

    const result = await carModelCatalogRepo.getCatalogTree(
        manufacturerId,
        catalogId !== undefined && catalogId !== null && catalogId !== '' ? catalogId : null,
    );

    if (result.succeed !== 1 || !result.data) {
        ctx.body = result;
        return;
    }

    // 只保留接口需要的字段，并构建 children 树
    const mapNode = (node) => ({
        id             : node.id,
        manufacturerId : node.manufacturerId,
        parentId       : node.parentId,
        level          : node.level,
        name           : node.name,
        description    : node.description,
        sort           : node.sort,
        children       : Array.isArray(node.children) ? node.children.map(mapNode) : [],
    });

    const rawList = Array.isArray(result.data.list) ? result.data.list : [];

    ctx.body = {
        succeed     : 1,
        code        : 200,
        description : '成功',
        data        : {
            list: rawList.map(mapNode),
        },
    };
});

/**
 * 获取车模厂商根级产品目录（仅对三级目录结构有意义）
 * - 当厂商 catalogLevel >= 3 时，返回 parentId=0 的根级目录列表
 * - 否则返回空列表，并标记 isThreeLevel=false，便于前端判断
 *
 * @param {number} manufacturerId - 厂商ID（必填）
 */
router.post('/catalog/root-list', async (ctx) => {
    const { manufacturerId } = ctx.request.body || {};

    if (!manufacturerId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：manufacturerId 不能为空',
        };
        return;
    }

    const mid = parseInt(manufacturerId, 10);
    if (!Number.isFinite(mid) || mid <= 0) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：manufacturerId 非法',
        };
        return;
    }

    // 读取厂商配置，判断是否为三级目录结构
    const manufacturer = await CarModelManufacturer.findByPk(mid);
    if (!manufacturer) {
        ctx.body = {
            succeed     : 0,
            code        : 102,
            description : '厂商不存在',
        };
        return;
    }

    const catalogLevel = manufacturer.catalogLevel || 2;
    if (!catalogLevel || catalogLevel < 3) {
        ctx.body = {
            succeed     : 1,
            code        : 200,
            description : '成功（当前厂商未启用三级目录结构）',
            data        : {
                isThreeLevel : false,
                list         : [],
            },
        };
        return;
    }

    const result = await carModelCatalogRepo.getFirstLevelCatalogs(mid);

    if (result.succeed !== 1 || !result.data) {
        ctx.body = result;
        return;
    }

    const rawList = Array.isArray(result.data.list) ? result.data.list : [];
    const list = rawList.map((item) => ({
        id             : item.id,
        manufacturerId : item.manufacturerId,
        parentId       : item.parentId,
        level          : item.level,
        name           : item.name,
        description    : item.description,
        sort           : item.sort,
        attachment     : item.attachment || null,
    }));

    ctx.body = {
        succeed     : 1,
        code        : 200,
        description : '成功',
        data        : {
            isThreeLevel: true,
            list,
        },
    };
});

/**
 * 车模分页查询列表
 * @param {string} keyword - 搜索关键词（可选，用于搜索车模名称、型号）
 * @param {number} manufacturerId - 厂商ID（可选）
 * @param {number} catalogId - 目录ID（可选）
 * @param {number} scaleId - 比例ID（可选）
 * @param {number[]} userIds - 数据归属用户ID数组（可选，默认[0]）
 *   - [0]         = 仅平台
 *   - [123]       = 仅该用户上传
 *   - [0, 123]    = 平台 + 用户上传
 * @param {number} currentUserId - 当前登录用户ID（可选，用于标识是否添加到车库及是否已收藏）
 * @param {number} page - 页码，从1开始，默认1
 * @param {number} size - 每页数量，默认10
 */
router.post('/list', async (ctx) => {
    const {
        keyword,
        manufacturerId,
        catalogId,
        scaleId,
        userIds = [0],
        currentUserId,
        page = 1,
        size = 10,
    } = ctx.request.body;
    const searchKey = {};
    // 将 keyword 映射到 name 字段（repository 会使用 Op.like 进行模糊搜索）
    // 如果需要同时搜索 name 和 modelCode，需要在 repository 层处理
    if (keyword) {
        searchKey.name = keyword;
    }
    if (manufacturerId) {
        searchKey.manufacturerId = manufacturerId;
    }
    if (catalogId) {
        const leafIds = await carModelCatalogRepo.getLeafCatalogIdsUnder(parseInt(catalogId, 10));
        if (leafIds.length === 0) {
            ctx.body = {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : {
                    list  : [],
                    total : 0,
                },
            };
            return;
        }
        searchKey.catalogId = leafIds;
    }
    if (scaleId) {
        searchKey.scaleId = scaleId;
    }
    // 归属用户过滤：仅使用 userIds 数组；默认仅平台（[0]）
    searchKey.userId = Array.isArray(userIds) ? userIds : [userIds];
    // 如果提供了 currentUserId，传递给 repository 用于查询用户状态
    if (currentUserId) {
        searchKey.currentUserId = currentUserId;
    }
    // 移动端只显示已审核通过的车模（status=1），过滤掉待审核（status=3）和已拒绝（status=4）的记录
    searchKey.status = 1;
    // 只显示已上架的车模
    searchKey.marketable = 1;
    const offset = (page - 1) * size;
    const _result = await carModelRepo.list(searchKey, offset, size);
    ctx.body = _result;
});

/**
 * 车模分页查询列表（带厂商过滤范围控制，情形B）
 * 与 /car-model/list 接口返回结构保持一致，新增参数：
 * @param {string} manufacturerFilterMode - 厂商过滤模式（可选，默认 ALL）
 *   ALL       = 对全部记录按 manufacturerId 过滤（等同于原有行为）
 *   ONLY_USER0 = 仅对 userId = 0 的记录按 manufacturerId 过滤，userId != 0 不受影响
 */
router.post('/list-v2', async (ctx) => {
    const {
        keyword,
        manufacturerId,
        catalogId,
        scaleId,
        // 为了情形B能区分 userId=0 与 >0，这里不再按 userId 过滤记录集，统一交由仓储处理
        currentUserId,
        manufacturerFilterMode = 'ALL',
        page = 1,
        size = 10,
    } = ctx.request.body || {};

    const searchKey = {};
    if (keyword) {
        searchKey.name = keyword;
    }
    if (catalogId) {
        const leafIds = await carModelCatalogRepo.getLeafCatalogIdsUnder(parseInt(catalogId, 10));
        if (leafIds.length === 0) {
            ctx.body = {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : {
                    list  : [],
                    total : 0,
                },
            };
            return;
        }
        searchKey.catalogId = leafIds;
    }
    if (scaleId) {
        searchKey.scaleId = scaleId;
    }
    // 厂商ID 交由仓储结合 manufacturerFilterMode 进行情形B处理
    if (manufacturerId !== undefined && manufacturerId !== null && manufacturerId !== '') {
        searchKey.manufacturerId = manufacturerId;
    }
    if (currentUserId) {
        searchKey.currentUserId = currentUserId;
    }
    // 仅查询已审核通过且已上架的车模，与原 /list 接口保持一致
    searchKey.status = 1;
    searchKey.marketable = 1;

    const offset = (page - 1) * size;
    const mode = typeof manufacturerFilterMode === 'string' ? manufacturerFilterMode : 'ALL';
    const _result = await carModelRepo.listWithManufacturerScope(searchKey, offset, size, mode);
    ctx.body = _result;
});

/**
 * 车模详情
 * @param {number} carModelId - 车模ID
 */
router.post('/detail', async (ctx) => {
    const { carModelId } = ctx.request.body;

    if (!carModelId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelId 不能为空',
        };
        return;
    }

    const _result = await carModelRepo.get(carModelId);
    ctx.body = _result;
});

/**
 * 根据车模名称精确查询，返回单条车模信息（与 /detail 返回结构一致）
 * @param {string} name - 车模名称（必填，精确匹配）
 * @param {number} userId - 数据范围：0=仅平台车模（默认），>0=仅该用户创建的车模（可选）
 */
router.post('/find-by-name', async (ctx) => {
    const { name, userId } = ctx.request.body || {};

    if (!name || !String(name).trim()) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：name 不能为空',
        };
        return;
    }

    const options = {};
    if (userId !== undefined && userId !== null && userId !== '') {
        options.userId = parseInt(userId, 10);
    }
    const _result = await carModelRepo.getByName(String(name).trim(), options);
    ctx.body = _result;
});

/**
 * 车模评论列表
 * @param {number} carModelId - 车模ID（必填）
 * @param {number} page - 页码，从1开始，默认1
 * @param {number} size - 每页数量，默认10
 */
router.post('/comment/list', async (ctx) => {
    const { carModelId, page = 1, size = 10 } = ctx.request.body;

    if (!carModelId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelId 不能为空',
        };
        return;
    }

    const searchKey = {
        carModelId,
        display: 1, // 只显示已审核的评论
    };
    const offset = (page - 1) * size;
    const _result = await carModelCommentRepo.list(searchKey, offset, size);
    ctx.body = _result;
});

/**
 * 发表车模评论
 * @param {number} userId - 用户ID（必填）
 * @param {number} carModelId - 车模ID（必填）
 * @param {string} content - 评论内容（必填）
 * @param {number} score - 评分1-5星（可选，默认5）
 * @param {string} imgUrls - 评论图片URL，逗号分隔（可选）
 * @param {number} orderId - 订单ID（必填，如果用户未购买可传0）
 */
router.post('/comment/create', async (ctx) => {
    const { userId, carModelId, content, score = 5, imgUrls, orderId = 0 } = ctx.request.body;

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!carModelId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelId 不能为空',
        };
        return;
    }

    if (!content || !content.trim()) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：content 不能为空',
        };
        return;
    }

    // 验证评分范围
    if (score && (score < 1 || score > 5)) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：score 必须在 1-5 之间',
        };
        return;
    }

    const commentData = {
        userId,
        carModelId,
        content : content.trim(),
        score,
        orderId, // orderId 是必填字段，如果未购买可传0
        display : 1, // 默认显示
    };

    // 可选字段
    if (imgUrls) {
        commentData.imgUrls = imgUrls;
    }

    const _result = await carModelCommentRepo.create(commentData);
    ctx.body = _result;
});

/**
 * AI识别车模图片
 * @param {number} userId - 用户ID（必填）
 * @param {string} imageUrl - 车模图片URL（必填）
 * @param {string} lang - 语言（可选，默认zh-CN）
 * @param {string} model - AI模型名称（可选，不传则使用默认模型）
 */
router.post('/ai/recognize', async (ctx) => {
    const { userId, imageUrl, lang = 'zh-CN', model } = ctx.request.body || {};

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!imageUrl) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：imageUrl 不能为空',
        };
        return;
    }

    try {
        // 1. 调用AI服务识别图片（支持传入模型参数）
        const aiResult = await qwenService.recognizeCarModel(imageUrl, lang, model);

        if (aiResult.succeed !== 1) {
            ctx.body = aiResult;
            return;
        }

        // 2. 与本地数据库匹配（只关心 model 与 detail 字段，其他说明性字段会被忽略）
        const matched = await carModelMatcher.matchWithDB(aiResult.data);

        // 3. 整理说明性字段（保持向后兼容，同时为前端提供丰富文案）
        const explainSummary = aiResult.data.summary || '';
        const explainFeatures = aiResult.data.features || {};
        // 兼容下划线和驼峰两种命名
        const explainCollectionValue =
            aiResult.data.collectionValue || aiResult.data.collection_value || '';
        const explainSuggestion = aiResult.data.suggestion || '';
        // 新增字段：描述信息（20～30字）
        const explainDescription = aiResult.data.description || '';

        // 4. 返回结果
        ctx.body = {
            succeed     : 1,
            code        : 200,
            description : '识别成功',
            data        : {
                rawText         : aiResult.data.rawText || '',
                model           : aiResult.data.model || {},
                structured      : matched,
                description     : explainDescription,
                summary         : explainSummary,
                features        : explainFeatures,
                collectionValue : explainCollectionValue,
                suggestion      : explainSuggestion,
                aiModel         : model || qwenService.model || 'qwen3-vl-plus', // 当前使用的AI模型
            },
        };
    } catch (err) {
        ctx.body = {
            succeed     : 0,
            code        : 500,
            description : err.message || '识别失败，请稍后重试',
        };
    }
});

/**
 * 一键保存识别结果到数据库
 * @param {number} userId - 用户ID（必填）
 * @param {string} imageUrl - 图片URL（必填）
 * @param {number} attachmentId - 附件ID（可选）
 * @param {Object} recognitionData - AI识别结果（必填）
 * @param {Object} customData - 用户自定义数据（可选）
 */
router.post('/ai/save', async (ctx) => {
    const { userId, imageUrl, fileUrl, attachmentId, recognitionData, customData = {} } = ctx.request.body || {};

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!recognitionData || !recognitionData.structured) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：recognitionData.structured 不能为空',
        };
        return;
    }

    try {
        let resolvedAttachmentId = attachmentId ? parseInt(attachmentId, 10) : null;

        // 当 attachmentId 为空但存在图片时，根据 fileUrl/imageUrl 创建附件记录
        // 原因：/upload 接口只保存文件到磁盘，不创建 attachment，前端拿不到 attachmentId
        // 这里会在保存阶段对车模图片做统一处理：
        // - 主图压缩为 900x600（等比裁剪填充）
        // - 生成用途类型为 2(车模图片) 的缩略图
        if (!resolvedAttachmentId && (fileUrl || imageUrl)) {
            const relPath = fileUrl || (() => {
                const s = String(imageUrl || '');
                const idx = s.indexOf('upload/');
                return idx >= 0 ? s.slice(idx + 7) : s.replace(/^\//, '');
            })();
            if (relPath && !relPath.startsWith('..') && !path.isAbsolute(relPath)) {
                const absPath = path.join(process.cwd(), 'upload', relPath);
                try {
                    const stat = await fs.stat(absPath);
                    const fileName = path.basename(relPath);

                    // 1) 主图压缩为 900x600（等比裁剪填充）
                    try {
                        const lenna = await Jimp.read(absPath);
                        lenna.cover(900, 600).quality(80);
                        let mime = Jimp.MIME_JPEG;
                        const ext = fileName.toLowerCase();
                        if (ext.endsWith('.png')) mime = Jimp.MIME_PNG;
                        else if (ext.endsWith('.gif')) mime = Jimp.MIME_GIF;
                        const buffer = await lenna.getBufferAsync(mime);
                        await fs.writeFile(absPath, buffer);
                        logger.debug('[ai/save] 已将主图压缩为 900x600: %s', absPath);
                    } catch (resizeErr) {
                        logger.warn('[ai/save] 主图压缩失败，将继续使用原图: %s', resizeErr.message);
                    }

                    // 重新获取文件大小（可能已被压缩）
                    const resizedStat = await fs.stat(absPath);
                    const sizeKb = (resizedStat.size / 1024).toFixed(2);

                    // 2) 生成 scale=2(车模图片) 的缩略图
                    let thumbnailRelPath = null;
                    try {
                        const thumbFileName = getThumbnailFileName(fileName);
                        if (thumbFileName) {
                            const dir = path.dirname(relPath);
                            const combined = dir && dir !== '.' ? path.join(dir, thumbFileName) : thumbFileName;
                            const normalizedRel = combined.replace(/\\/g, '/');
                            const thumbAbsPath = path.join(process.cwd(), 'upload', normalizedRel);

                            const thumbOptions = getThumbnailConfigForScale(2);
                            const generated = await uploader.generateThumbnail(
                                absPath,
                                thumbAbsPath,
                                thumbOptions,
                            );
                            if (generated) {
                                thumbnailRelPath = normalizedRel;
                                logger.debug(
                                    '[ai/save] 已生成 scale=2 缩略图: %s (width=%d,height=%d)',
                                    thumbnailRelPath,
                                    thumbOptions.width,
                                    thumbOptions.height,
                                );
                            } else {
                                logger.debug('[ai/save] 缩略图生成失败，将使用 thumbnailPath=null');
                            }
                        }
                    } catch (thumbErr) {
                        logger.debug(
                            '[ai/save] 缩略图生成失败或不可用，将使用 thumbnailPath=null: %s',
                            thumbErr.message,
                        );
                    }

                    const row = await Attachment.create({
                        attachGroupId : 3,
                        name          : fileName,
                        path          : relPath,
                        thumbnailPath : thumbnailRelPath,
                        type          : 'image',
                        size          : parseFloat(sizeKb),
                    });
                    resolvedAttachmentId = row.id;
                    logger.info(
                        '[ai/save] 根据 imageUrl/fileUrl 创建附件: id=%d path=%s thumbnail=%s',
                        row.id,
                        relPath,
                        row.thumbnailPath || '',
                    );
                } catch (e) {
                    logger.warn('[ai/save] 无法根据 imageUrl/fileUrl 创建附件: %s', e.message);
                }
            }
        }

        const { structured } = recognitionData;
        const { scale, manufacturer, catalog, detail } = structured;

        // 构建车模数据
        const carModelData = {
            userId: parseInt(userId),
            name:
                customData.name || detail?.name || `${manufacturer?.text || ''} ${catalog?.text || ''}`.trim() || '未命名车模',
            manufacturerId : manufacturer?.manufacturerId || 0,
            catalogId      : catalog?.catalogId || 0,
            scaleId        : scale?.scaleId || 0,
            color          : detail?.color || customData.color || null,
            material       : detail?.material || customData.material || null,
            description    : customData.description || detail?.notes || null,
            releasePrice   : customData.releasePrice || null,
            attachmentId   : resolvedAttachmentId,
            status         : 1,
            marketable     : 1,
        };

        // 移除空值
        Object.keys(carModelData).forEach((key) => {
            if (carModelData[key] === null || carModelData[key] === undefined || carModelData[key] === '') {
                delete carModelData[key];
            }
        });

        // 保存到数据库
        const result = await carModelRepo.create(carModelData);

        if (result.succeed !== 1) {
            ctx.body = result;
            return;
        }

        // 自动添加到用户车库，使车模出现在「我的车库」列表
        const garageResult = await userCarModelGarageRepo.create({
            userId       : parseInt(userId),
            carModelId   : result.data.id, // 这里必须使用数值主键，不能使用业务编号 carModelId
            carModelName : result.data.name,
            ownedQty     : 1,
        });
        if (garageResult.succeed !== 1) {
            logger.warn('[ai/save] 自动添加到车库失败: %s', garageResult.description);
        }

        ctx.body = {
            succeed     : 1,
            code        : 200,
            description : '保存成功',
            data        : {
                carModelId : result.data.id,
                carModel   : result.data,
            },
        };
    } catch (err) {
        ctx.body = {
            succeed     : 0,
            code        : 500,
            description : err.message || '保存失败，请稍后重试',
        };
    }
});

/**
 * 手动创建车模（自行上传）
 * @param {number} userId - 用户ID（必填）
 * @param {string} name - 车模名称（必填）
 * @param {number} manufacturerId - 厂商ID（可选，从平台厂商列表选择）
 * @param {number} catalogId - 目录ID（可选，与 catalogName 二选一）
 * @param {string} catalogName - 系列名称（可选，如果提供则根据名称查找目录，与 catalogId 二选一）
 * @param {number} scaleId - 比例ID（可选）
 * @param {number} attachmentId - 图片附件ID（可选）
 * @param {string} color - 颜色（可选）
 * @param {string} material - 材质（可选）
 * @param {string} description - 描述（可选）
 * @param {number} releasePrice - 发行价格（可选）
 * @param {string} releaseDate - 发售日期（可选，支持格式：YYYY-MM-DD 或 YYYY/MM，YYYY/MM 会自动转换为 YYYY-MM-01）
 * @param {string} modelCode - 车模编号/型号（可选）
 * @param {boolean} addToGarage - 是否同时添加到车库（可选，默认false）
 * @param {number} ownedQty - 拥有数量（可选，添加到车库时默认1）
 * @param {number} purchasePrice - 购入单价（可选）
 * @param {string} purchaseTime - 购入时间（可选，格式：YYYY-MM-DD HH:mm:ss）
 * @param {number} isHidden - 是否隐藏：0=普款 1=隐藏（可选，默认0）
 * @param {string} notes - 备注（可选）
 */
router.post('/create', async (ctx) => {
    const {
        userId,
        name,
        manufacturerId = 0,
        catalogId = 0,
        catalogName = null,
        scaleId = 0,
        attachmentId = null,
        color = null,
        material = null,
        description = null,
        releasePrice = null,
        releaseDate = null,
        modelCode = null,
        addToGarage = false,
        ownedQty = 1,
        purchasePrice = null,
        purchaseTime = null,
        isHidden = 0,
        notes = null,
    } = ctx.request.body || {};

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!name || !name.trim()) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：name 不能为空',
        };
        return;
    }

    const { sequelize, CarModel, UserCarModelGarage, CarModelCatalog } = require('../../models');
    let transaction = null;

    try {
        // 如果需要添加到车库，开启事务
        if (addToGarage) {
            transaction = await sequelize.transaction();
        }

        // 处理发售日期格式：支持 YYYY/MM 格式，自动转换为 YYYY-MM-01
        let processedReleaseDate = releaseDate;
        if (releaseDate) {
            // 支持 YYYY/MM 格式（如：2024/01）
            if (releaseDate.match(/^\d{4}\/\d{2}$/)) {
                processedReleaseDate = releaseDate.replace('/', '-') + '-01';
            }
            // 如果已经是 YYYY-MM-DD 格式，保持不变
            // 其他格式保持原样，由数据库验证
        }

        // 处理系列（目录）：如果提供了 catalogName，先查找目录
        let finalCatalogId = catalogId ? parseInt(catalogId) : 0;
        if (catalogName && catalogName.trim() && !catalogId) {
            const manufacturerIdForCatalog = manufacturerId ? parseInt(manufacturerId) : 0;
            // 查找指定厂商下的目录
            const existingCatalog = await CarModelCatalog.findOne({
                where: {
                    name           : catalogName.trim(),
                    manufacturerId : manufacturerIdForCatalog,
                    parentId       : 0, // 一级目录
                },
                transaction,
            });

            if (existingCatalog) {
                finalCatalogId = existingCatalog.id;
            } else {
                // 如果找不到目录，返回错误提示
                if (transaction) {
                    await transaction.rollback();
                }
                ctx.body = {
                    succeed     : 0,
                    code        : 102,
                    description : `未找到系列"${catalogName}"，请从列表中选择或联系管理员添加`,
                };
                return;
            }
        }

        // 构建车模数据
        // 状态说明：
        // 1 = 启用/审核通过（自行上传时直接启用）
        // 2 = 禁用
        // 3 = 待审核（上报补充时需要审核）
        // 4 = 审核拒绝
        const carModelData = {
            userId         : parseInt(userId),
            name           : name.trim(),
            manufacturerId : manufacturerId ? parseInt(manufacturerId) : 0,
            catalogId      : finalCatalogId,
            scaleId        : scaleId ? parseInt(scaleId) : 0,
            attachmentId   : attachmentId ? parseInt(attachmentId) : null,
            color          : color || null,
            material       : material || null,
            description    : description || null,
            releasePrice   : releasePrice ? parseFloat(releasePrice) : null,
            releaseDate    : processedReleaseDate || null,
            modelCode      : modelCode || null,
            // 自行上传（addToGarage=true）：直接启用（status=1）
            // 上报补充（addToGarage=false）：待审核（status=3）
            status         : addToGarage ? 1 : 3,
            // 待审核时先下架，审核通过后再上架
            marketable     : addToGarage ? 1 : 2,
        };

        // 移除空值
        Object.keys(carModelData).forEach((key) => {
            if (carModelData[key] === null || carModelData[key] === undefined || carModelData[key] === '') {
                delete carModelData[key];
            }
        });

        // 检查名称是否重复（在事务中检查）
        const existingCarModel = await CarModel.findOne({
            where: {
                name: carModelData.name,
            },
            transaction,
        });

        if (existingCarModel) {
            if (transaction) {
                await transaction.rollback();
            }
            ctx.body = {
                succeed     : 0,
                code        : 101,
                description : '名称重复',
            };
            return;
        }

        // 创建车模（在事务中创建）
        const carModel = await CarModel.create(carModelData, { transaction });
        // afterCreate hook 可能会补齐 carModelId，这里 reload 保证接口返回包含最新字段
        await carModel.reload({ transaction });

        const carModelId = carModel.id;
        const carModelName = carModel.name;
        let garageResult = null;

        // 如果需要添加到车库
        if (addToGarage) {
            // 检查是否已在车库中
            const existingGarage = await UserCarModelGarage.findOne({
                where: {
                    userId: parseInt(userId),
                    carModelId,
                },
                transaction,
            });

            let garageRecord;

            if (existingGarage) {
                // 已在车库中时更新拥有信息
                await existingGarage.update(
                    {
                        carModelName,
                        ownedQty      : ownedQty ? parseInt(ownedQty) : 1,
                        purchasePrice : purchasePrice ? parseFloat(purchasePrice) : null,
                        purchaseTime  : purchaseTime || null,
                        isHidden      : isHidden ? parseInt(isHidden) : 0,
                        notes         : notes || null,
                    },
                    { transaction },
                );
                garageRecord = existingGarage;
            } else {
                // 创建车库记录
                garageRecord = await UserCarModelGarage.create(
                    {
                        userId        : parseInt(userId),
                        carModelId,
                        carModelName,
                        ownedQty      : ownedQty ? parseInt(ownedQty) : 1,
                        purchasePrice : purchasePrice ? parseFloat(purchasePrice) : null,
                        purchaseTime  : purchaseTime || null,
                        isHidden      : isHidden ? parseInt(isHidden) : 0,
                        notes         : notes || null,
                    },
                    { transaction },
                );
            }

            garageResult = {
                succeed     : 1,
                code        : 200,
                description : existingGarage ? '车库信息已更新' : '添加到车库成功',
                data        : garageRecord,
            };

            // 提交事务
            await transaction.commit();
        }

        ctx.body = {
            succeed     : 1,
            code        : 200,
            description : addToGarage ? '创建成功并已添加到车库' : '上报成功，等待审核',
            data        : {
                carModelId,
                carModel    : carModel.toJSON(),
                garage      : garageResult ? garageResult.data : null,
                auditStatus : addToGarage ? 1 : 3, // 1=已通过 3=待审核
                message     : addToGarage ? '创建成功并已添加到车库' : '您的上报已提交，等待管理员审核',
            },
        };
    } catch (err) {
        if (transaction) {
            await transaction.rollback();
        }
        ctx.body = {
            succeed     : 0,
            code        : 500,
            description : err.message || '创建失败，请稍后重试',
        };
    }
});

/**
 * 修改自行上传的车模信息（仅允许修改 userId > 0 且归属当前用户的车模）
 * @param {number} userId - 用户ID（必填）
 * @param {number} carModelId - 车模ID（必填，car_model_garage 表主键 id）
 * @param {string} name - 车模名称（可选）
 * @param {number} manufacturerId - 厂商ID（可选）
 * @param {number} catalogId - 目录ID（可选，与 catalogName 二选一）
 * @param {string} catalogName - 系列名称（可选，与 catalogId 二选一，根据厂商下目录名称查找）
 * @param {number} scaleId - 比例ID（可选）
 * @param {number} attachmentId - 图片附件ID（可选）
 * @param {string} fileUrl - 上传接口返回的相对路径（可选，与 imageUrl 二选一，用于创建附件）
 * @param {string} imageUrl - 图片URL（可选，用于创建附件）
 * @param {string} color - 颜色（可选）
 * @param {string} material - 材质（可选）
 * @param {string} description - 描述（可选）
 * @param {number} releasePrice - 发行价格（可选）
 * @param {string} releaseDate - 发售日期（可选，支持 YYYY-MM-DD 或 YYYY/MM）
 * @param {string} modelCode - 车模编号/型号（可选）
 */
router.post('/update', async (ctx) => {
    const {
        userId,
        carModelId,
        name,
        manufacturerId,
        catalogId,
        catalogName,
        scaleId,
        attachmentId,
        fileUrl,
        imageUrl,
        color,
        material,
        description,
        releasePrice,
        releaseDate,
        modelCode,
    } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!carModelId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelId 不能为空',
        };
        return;
    }

    const uid = parseInt(userId, 10);
    const cmId = parseInt(carModelId, 10);

    try {
        const { CarModel, UserCarModelGarage, CarModelCatalog, Attachment } = require('../../models');
        const carModel = await CarModel.findByPk(cmId);

        if (!carModel) {
            ctx.body = {
                succeed     : 0,
                code        : 102,
                description : '车模不存在',
            };
            return;
        }

        // 仅允许修改自行上传的车模（userId > 0 且归属当前用户）
        if (carModel.userId === 0) {
            ctx.body = {
                succeed     : 0,
                code        : 103,
                description : '平台车模不可通过此接口修改',
            };
            return;
        }

        if (carModel.userId !== uid) {
            ctx.body = {
                succeed     : 0,
                code        : 103,
                description : '无权修改他人的车模',
            };
            return;
        }

        // 处理 fileUrl/imageUrl -> attachmentId
        let resolvedAttachmentId = attachmentId ? parseInt(attachmentId, 10) : null;
        if (!resolvedAttachmentId && (fileUrl || imageUrl)) {
            const relPath = fileUrl || (() => {
                const s = String(imageUrl || '');
                const idx = s.indexOf('upload/');
                return idx >= 0 ? s.slice(idx + 7) : s.replace(/^\//, '');
            })();
            if (relPath && !relPath.startsWith('..') && !path.isAbsolute(relPath)) {
                const absPath = path.join(process.cwd(), 'upload', relPath);
                try {
                    const stat = await fs.stat(absPath);
                    const fileName = path.basename(relPath);
                    const sizeKb = (stat.size / 1024).toFixed(2);

                    let thumbnailRelPath = null;
                    try {
                        const thumbFileName = getThumbnailFileName(fileName);
                        if (thumbFileName) {
                            const dir = path.dirname(relPath);
                            const combined = dir && dir !== '.' ? path.join(dir, thumbFileName) : thumbFileName;
                            const normalizedRel = combined.replace(/\\/g, '/');
                            const thumbAbsPath = path.join(process.cwd(), 'upload', normalizedRel);
                            await fs.stat(thumbAbsPath);
                            thumbnailRelPath = normalizedRel;
                        }
                    } catch (thumbErr) {
                        logger.debug('[car-model/update] 缩略图文件不存在: %s', thumbErr.message);
                    }

                    const row = await Attachment.create({
                        attachGroupId : 3,
                        name          : fileName,
                        path          : relPath,
                        thumbnailPath : thumbnailRelPath,
                        type          : 'image',
                        size          : parseFloat(sizeKb),
                    });
                    resolvedAttachmentId = row.id;
                } catch (e) {
                    logger.warn('[car-model/update] 无法根据 fileUrl/imageUrl 创建附件: %s', e.message);
                }
            }
        }

        // 处理 catalogName -> catalogId
        let finalCatalogId = catalogId != null && catalogId !== '' ? parseInt(catalogId) : undefined;
        if (catalogName != null && catalogName.trim() && (finalCatalogId === undefined || finalCatalogId === 0)) {
            const mfrId = manufacturerId != null && manufacturerId !== '' ? parseInt(manufacturerId) : carModel.manufacturerId;
            const existingCatalog = await CarModelCatalog.findOne({
                where: {
                    name           : catalogName.trim(),
                    manufacturerId : mfrId,
                    parentId       : 0,
                },
            });
            if (existingCatalog) {
                finalCatalogId = existingCatalog.id;
            }
        }

        // 处理发售日期格式
        let processedReleaseDate = releaseDate;
        if (releaseDate) {
            if (String(releaseDate).match(/^\d{4}\/\d{2}$/)) {
                processedReleaseDate = String(releaseDate).replace('/', '-') + '-01';
            }
        }

        // 构建更新数据（仅包含传入的字段）
        const updatePayload = {};
        if (name != null && name !== '') updatePayload.name = String(name).trim();
        if (manufacturerId != null && manufacturerId !== '') updatePayload.manufacturerId = parseInt(manufacturerId, 10);
        if (finalCatalogId !== undefined) updatePayload.catalogId = finalCatalogId;
        if (scaleId != null && scaleId !== '') updatePayload.scaleId = parseInt(scaleId, 10);
        if (resolvedAttachmentId != null) updatePayload.attachmentId = resolvedAttachmentId;
        if (color !== undefined) updatePayload.color = color || null;
        if (material !== undefined) updatePayload.material = material || null;
        if (description !== undefined) updatePayload.description = description || null;
        if (releasePrice !== undefined) updatePayload.releasePrice = releasePrice != null && releasePrice !== '' ? parseFloat(releasePrice) : null;
        if (processedReleaseDate !== undefined) updatePayload.releaseDate = processedReleaseDate || null;
        if (modelCode !== undefined) updatePayload.modelCode = modelCode || null;

        if (Object.keys(updatePayload).length === 0) {
            ctx.body = {
                succeed     : 0,
                code        : 100,
                description : '参数错误：未提供任何可更新字段',
            };
            return;
        }

        const updateResult = await carModelRepo.update(cmId, updatePayload);

        if (updateResult.succeed !== 1) {
            ctx.body = updateResult;
            return;
        }

        // 若名称变更，同步更新用户车库中该车模的 carModelName
        if (updatePayload.name) {
            await UserCarModelGarage.update(
                { carModelName: updatePayload.name },
                { where: { userId     : uid,
                    carModelId : cmId } },
            );
        }

        ctx.body = {
            succeed     : 1,
            code        : 200,
            description : '修改成功',
            data        : updateResult.data,
        };
    } catch (err) {
        logger.error('[car-model/update] 修改失败', err);
        ctx.body = {
            succeed     : 0,
            code        : 500,
            description : err.message || '修改失败，请稍后重试',
        };
    }
});

/**
 * 根据AI识别结果查询自有平台商品
 * @param {Object} recognitionData - AI识别结果（必填）
 * @param {number} page - 页码（可选，默认1）
 * @param {number} size - 每页数量（可选，默认10）
 */
router.post('/ai/own-products', async (ctx) => {
    const { recognitionData, page = 1, size = 10 } = ctx.request.body || {};

    if (!recognitionData || !recognitionData.structured) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：recognitionData 不能为空',
        };
        return;
    }

    try {
        const { structured } = recognitionData;
        const searchKey = {
            // 忽略 userId 条件，查询所有用户的车库（包括平台与个人）
            _ignoreUserId : true,
            marketable    : 1, // 只查询上架的商品
            status        : 1, // 只查询启用的商品
        };

        // 根据AI识别结果构建精确条件（优先使用 ID）
        if (structured.manufacturer?.manufacturerId) {
            searchKey.manufacturerId = structured.manufacturer.manufacturerId;
        }
        if (structured.catalog?.catalogId) {
            searchKey.catalogId = structured.catalog.catalogId;
        }
        if (structured.scale?.scaleId) {
            searchKey.scaleId = structured.scale.scaleId;
        }

        // 如果识别了颜色，可以模糊匹配（可选）
        if (structured.detail?.color) {
            searchKey.color = structured.detail.color;
        }

        // 文本模糊匹配兜底逻辑：
        // 当 manufacturerId / catalogId 等精确 ID 信息缺失时，使用“车型名称”为主的关键词做模糊查询
        // 之前的实现会把“品牌 + 车型”拼成一个长字符串（例如：BBR 玛莎拉蒂 MC20），
        // LIKE '%BBR 玛莎拉蒂 MC20%' 过于严格，容易因为名称顺序不完全一致而查不到。
        const hasManufacturerId = !!structured.manufacturer?.manufacturerId;
        const hasCatalogId = !!structured.catalog?.catalogId;

        // 优先使用详细名称（通常与自有平台商品名称最接近）
        if (structured.detail?.name) {
            searchKey.name = structured.detail.name;
        } else if (!hasManufacturerId && structured.manufacturer?.text) {
            // 只有在没有 manufacturerId 且没有详细名称时，才退回到品牌名模糊匹配
            searchKey.name = structured.manufacturer.text;
        } else if (!hasManufacturerId && !hasCatalogId && structured.catalog?.text) {
            // 再退一步，用系列文本作为名称关键字
            searchKey.name = structured.catalog.text;
        }

        const offset = (page - 1) * size;
        const result = await carModelRepo.list(searchKey, offset, size);

        // 格式化返回数据，统一格式
        if (result.succeed === 1 && result.data?.list) {
            result.data.list = result.data.list.map((item) => {
                // 优先使用缩略图路径（列表已不再返回 attachment，使用顶层 thumbnailUrl/originalImageUrl）
                const imageUrl = item.thumbnailUrl || item.originalImageUrl || item.image || '';
                return {
                    id               : item.id,
                    carModelId       : item.carModelId,
                    name             : item.name,
                    modelCode        : item.modelCode,
                    price            : parseFloat(item.releasePrice || 0),
                    originalPrice    : null,
                    stock            : item.stock || 0,
                    imageUrl,
                    manufacturerName : item.manufacturer?.name || '',
                    catalogName      : item.catalog?.name || '',
                    scaleName        : item.scale?.name || '',
                    color            : item.color || '',
                    material         : item.material || '',
                    description      : item.description || '',
                    platform         : 'own', // 标识为自有平台
                    platformName     : '自有平台',
                    isOwnPlatform    : true, // 自有平台标识
                };
            });
        }

        ctx.body = result;
    } catch (err) {
        ctx.body = {
            succeed     : 0,
            code        : 500,
            description : err.message || '查询自有平台商品失败',
        };
    }
});

/**
 * 获取电商购买列表（实时调用第三方API + 自有平台商品）
 * @param {string} keyword - 搜索关键词（必填）
 * @param {string} platform - 平台代码（可选，单平台，与 platforms 二选一；不传则与 platforms 共同决定）
 * @param {string[]} platforms - 平台代码数组（可选，指定多平台，如 ["taobao","jd","pdd"]；不传 platform/platforms 则搜索所有平台）
 * @param {Object} recognitionData - AI识别结果（可选，用于查询自有平台商品）
 * @param {boolean} includeOwnPlatform - 是否包含自有平台商品（可选，默认true）
 * @param {number} page - 页码（可选，默认1）
 * @param {number} size - 每页数量（可选，默认10）
 */
router.post('/purchase/list', async (ctx) => {
    const {
        keyword,
        platform,
        platforms,
        recognitionData,
        includeOwnPlatform = true,
        page = 1,
        size = 10,
    } = ctx.request.body || {};

    if (!keyword || !keyword.trim()) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：keyword 不能为空',
        };
        return;
    }

    try {
        logger.info('[CarModel][purchase/list] 请求参数', {
            keyword,
            platform,
            platforms,
            includeOwnPlatform,
            page,
            size,
        });

        const results = {
            ownPlatform : [], // 自有平台商品
            thirdParty  : [], // 第三方平台商品
            total       : 0,
        };

        // 1. 查询自有平台商品（如果启用）
        if (includeOwnPlatform) {
            try {
                const searchKey = {
                    _ignoreUserId : true, // 忽略 userId 条件，查询所有用户的车库商品
                    marketable    : 1, // 已上架
                    status        : 1, // 启用状态
                };

                // 如果有 recognitionData，使用结构化查询
                if (recognitionData && recognitionData.structured) {
                    const { structured } = recognitionData;
                    if (structured?.manufacturer?.manufacturerId) {
                        searchKey.manufacturerId = structured.manufacturer.manufacturerId;
                    }
                    if (structured?.catalog?.catalogId) {
                        searchKey.catalogId = structured.catalog.catalogId;
                    }
                    if (structured?.scale?.scaleId) {
                        searchKey.scaleId = structured.scale.scaleId;
                    }
                    if (structured?.detail?.color) {
                        searchKey.color = structured.detail.color;
                    }
                } else {
                    // 如果没有 recognitionData，使用 keyword 进行模糊查询
                    // 对 name、modelCode、description 等字段进行模糊匹配
                    if (keyword && keyword.trim()) {
                        // 使用 name 字段进行模糊查询（carModelRepo.list 会自动处理字符串字段的模糊查询）
                        searchKey.name = keyword.trim();
                    }
                }

                const offset = (page - 1) * size;
                const ownResult = await carModelRepo.list(searchKey, offset, size);

                if (ownResult.succeed === 1 && ownResult.data?.list) {
                    results.ownPlatform = ownResult.data.list.map((item) => {
                        // 优先使用缩略图路径（列表已不再返回 attachment，使用顶层 thumbnailUrl/originalImageUrl）
                        const imageUrl = item.thumbnailUrl || item.originalImageUrl || item.image || '';
                        return {
                            id               : item.id,
                            carModelId       : item.carModelId,
                            name             : item.name,
                            modelCode        : item.modelCode,
                            price            : parseFloat(item.releasePrice || 0),
                            originalPrice    : null,
                            stock            : item.stock || 0,
                            imageUrl,
                            manufacturerName : item.manufacturer?.name || '',
                            catalogName      : item.catalog?.name || '',
                            scaleName        : item.scale?.name || '',
                            color            : item.color || '',
                            material         : item.material || '',
                            description      : item.description || '',
                            platform         : 'own',
                            platformName     : '自有平台',
                            isOwnPlatform    : true,
                        };
                    });
                }
            } catch (err) {
                logger.warn('查询自有平台商品失败:', err);
            }
        }

        // 2. 查询第三方平台商品（支持单 platform 或 platforms 数组）
        const thirdPartyResult = await purchaseService.searchProducts({
            keyword   : keyword.trim(),
            platform,
            platforms : Array.isArray(platforms) && platforms.length > 0 ? platforms : undefined,
            page      : parseInt(page),
            size      : parseInt(size),
        });

        if (thirdPartyResult && thirdPartyResult.list) {
            results.thirdParty = thirdPartyResult.list;
        }

        logger.info('[CarModel][purchase/list] 第三方平台搜索结果', {
            keyword       : keyword.trim(),
            platforms     : thirdPartyResult ? thirdPartyResult.platforms : null,
            total         : thirdPartyResult ? thirdPartyResult.total : null,
            listLength    : results.thirdParty.length,
            ownListLength : results.ownPlatform.length,
        });

        // 3. 合并结果
        results.total = results.ownPlatform.length + results.thirdParty.length;

        ctx.body = {
            succeed     : 1,
            code        : 200,
            description : '成功',
            data        : results,
        };
    } catch (err) {
        ctx.body = {
            succeed     : 0,
            code        : 500,
            description : err.message || '获取购买列表失败，请稍后重试',
        };
    }
});

/**
 * 电商联盟调试：按关键字调用单个平台，返回原始请求参数与第三方接口原始响应
 * @param {string} keyword - 搜索关键词（必填）
 * @param {string} platform - 平台代码（必填）：taobao | jd | pdd
 * @param {number} page - 页码，默认1
 * @param {number} size - 每页数量，默认10
 */
router.post('/purchase/debug', async (ctx) => {
    const { keyword, platform, page = 1, size = 10 } = ctx.request.body || {};

    if (!keyword || !String(keyword).trim()) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：keyword 不能为空',
        };
        return;
    }
    if (!platform) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：platform 不能为空（taobao | jd | pdd）',
        };
        return;
    }

    try {
        const result = await purchaseService.searchProductsDebug({
            keyword : String(keyword).trim(),
            platform,
            page    : parseInt(page, 10) || 1,
            size    : parseInt(size, 10) || 10,
        });

        ctx.body = {
            succeed     : result.succeed,
            code        : result.succeed ? 200 : 500,
            description : result.description || (result.succeed ? '成功' : '失败'),
            data        : {
                platform     : result.platform,
                platformName : result.platformName,
                list         : result.list,
                total        : result.total,
                rawRequest   : result.rawRequest,
                rawResponse  : result.rawResponse,
            },
        };
    } catch (err) {
        ctx.body = {
            succeed     : 0,
            code        : 500,
            description : err.message || '调试请求失败',
        };
    }
});

/**
 * 获取支持的电商平台列表
 */
router.get('/purchase/platforms', async (ctx) => {
    try {
        const platforms = purchaseService.getPlatforms();

        ctx.body = {
            succeed     : 1,
            code        : 200,
            description : '成功',
            data        : {
                list: platforms,
            },
        };
    } catch (err) {
        ctx.body = {
            succeed     : 0,
            code        : 500,
            description : err.message || '获取平台列表失败',
        };
    }
});

/**
 * 添加收藏
 * @param {number} userId - 用户ID（必填）
 * @param {number} carModelId - 车模ID（必填）
 */
router.post('/favorite/add', async (ctx) => {
    const { userId, carModelId } = ctx.request.body || {};

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!carModelId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelId 不能为空',
        };
        return;
    }

    const _result = await carModelFavoriteRepo.create({
        userId,
        carModelId,
    });
    ctx.body = _result;
});


/**
 * 取消收藏
 * @param {number} userId - 用户ID（必填）
 * @param {number} carModelId - 车模ID（必填）
 */
router.post('/favorite/remove', async (ctx) => {
    const { userId, carModelId } = ctx.request.body;

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!carModelId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelId 不能为空',
        };
        return;
    }

    const _result = await carModelFavoriteRepo.remove(userId, carModelId);
    ctx.body = _result;
});

/**
 * 批量取消收藏
 * @param {number} userId - 用户ID（必填）
 * @param {Array} favoriteIds - 收藏ID数组（必填）
 */
router.post('/favorite/batch-remove', async (ctx) => {
    const { userId, favoriteIds } = ctx.request.body;

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!Array.isArray(favoriteIds) || favoriteIds.length === 0) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：favoriteIds 必须是非空数组',
        };
        return;
    }

    const _result = await carModelFavoriteRepo.delete(userId, favoriteIds);
    ctx.body = _result;
});

/**
 * 获取我的收藏列表
 * @param {number} userId - 用户ID（必填）
 * @param {string} keyword - 搜索关键词（可选，用于搜索车模名称）
 * @param {number} page - 页码，从1开始，默认1
 * @param {number} size - 每页数量，默认10
 */
router.post('/favorite/list', async (ctx) => {
    const { userId, keyword, page = 1, size = 10 } = ctx.request.body;

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    const searchKey = {
        userId,
    };

    if (keyword) {
        searchKey.keyword = keyword;
    }

    const offset = (page - 1) * size;
    const _result = await carModelFavoriteRepo.list(searchKey, offset, size);
    ctx.body = _result;
});

/**
 * 检查是否已收藏
 * @param {number} userId - 用户ID（必填）
 * @param {number} carModelId - 车模ID（必填）
 */
router.post('/favorite/check', async (ctx) => {
    const { userId, carModelId } = ctx.request.body;

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!carModelId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelId 不能为空',
        };
        return;
    }

    const _result = await carModelFavoriteRepo.check(userId, carModelId);
    ctx.body = _result;
});

/**
 * 获取收藏数量
 * @param {number} userId - 用户ID（必填）
 */
router.post('/favorite/count', async (ctx) => {
    const { userId } = ctx.request.body;

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    const _result = await carModelFavoriteRepo.count(userId);
    ctx.body = _result;
});

/**
 * ==================== 我的车库相关接口 ====================
 */

/**
 * 添加到我的车库（如果已在车库中则更新拥有信息）
 * @param {number} userId - 用户ID（必填）
 * @param {number} carModelId - 车模ID（必填）
 * @param {string} carModelName - 车模名称（可选，如果不传会自动从数据库获取）
 * @param {number} ownedQty - 拥有数量（可选，默认1）
 * @param {number} purchasePrice - 购入单价（可选）
 * @param {string} purchaseTime - 购入时间（可选，YYYY-MM-DD HH:mm:ss）
 * @param {number} isHidden - 是否隐藏：0=普款 1=隐藏（可选，默认0）
 * @param {string} notes - 备注（可选）
 */
router.post('/garage/add', async (ctx) => {
    const { userId, carModelId, carModelName, ownedQty, purchasePrice, purchaseTime, isHidden, notes } =
        ctx.request.body || {};

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!carModelId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelId 不能为空',
        };
        return;
    }

    // 如果没有传 carModelName，尝试从数据库获取
    let modelName = carModelName;
    if (!modelName) {
        const carModelResult = await carModelRepo.get(carModelId);
        if (carModelResult.succeed === 1 && carModelResult.data) {
            modelName = carModelResult.data.name;
        } else {
            ctx.body = {
                succeed     : 0,
                code        : 100,
                description : '参数错误：carModelName 不能为空，且车模不存在',
            };
            return;
        }
    }

    const _result = await userCarModelGarageRepo.create({
        userId,
        carModelId,
        carModelName: modelName,
        ownedQty,
        purchasePrice,
        purchaseTime,
        isHidden,
        notes,
    });
    ctx.body = _result;
});

/**
 * 更新车库拥有信息
 * @param {number} userId - 用户ID（必填）
 * @param {number} garageId - 车库记录ID（必填）
 * @param {number} ownedQty - 拥有数量（可选）
 * @param {number} purchasePrice - 购入单价（可选）
 * @param {string} purchaseTime - 购入时间（可选）
 * @param {number} isHidden - 是否隐藏：0=普款 1=隐藏（可选）
 * @param {string} notes - 备注（可选）
 */
router.post('/garage/update', async (ctx) => {
    const { userId, garageId, ownedQty, purchasePrice, purchaseTime, isHidden, notes } =
        ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!garageId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：garageId 不能为空',
        };
        return;
    }

    const payload = {
        ownedQty,
        purchasePrice,
        purchaseTime,
        isHidden,
        notes,
    };

    const _result = await userCarModelGarageRepo.updateInfo(userId, garageId, payload);
    ctx.body = _result;
});

/**
 * 从我的车库移除
 * @param {number} userId - 用户ID（必填）
 * @param {number} carModelId - 车模ID（必填）
 */
router.post('/garage/remove', async (ctx) => {
    const { userId, carModelId } = ctx.request.body;

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!carModelId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelId 不能为空',
        };
        return;
    }

    const _result = await userCarModelGarageRepo.remove(userId, carModelId);
    ctx.body = _result;
});

/**
 * 批量从车库移除
 * @param {number} userId - 用户ID（必填）
 * @param {Array} garageIds - 车库ID数组（必填）
 */
router.post('/garage/batch-remove', async (ctx) => {
    const { userId, garageIds } = ctx.request.body;

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!Array.isArray(garageIds) || garageIds.length === 0) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：garageIds 必须是非空数组',
        };
        return;
    }

    const _result = await userCarModelGarageRepo.delete(userId, garageIds);
    ctx.body = _result;
});

/**
 * 批量修改我的车库信息
 * 允许一次性修改多条“我的车库”记录的拥有信息以及对应车模图片
 * 可修改字段：
 * - 购入单价（purchasePrice）
 * - 购入时间（purchaseTime）
 * - 是否隐藏（isHidden）
 * - 拥有数量（ownedQty）
 * - 图片（通过 attachmentId 或 fileUrl/imageUrl 更新车模主图）
 *
 * @param {number} userId - 用户ID（必填）
 * @param {Array} items - 批量修改项（必填，非空数组）
 *   - garageId: 车库记录ID（必填）
 *   - ownedQty: 拥有数量（可选）
 *   - purchasePrice: 购入单价（可选）
 *   - purchaseTime: 购入时间（可选，YYYY-MM-DD HH:mm:ss）
 *   - isHidden: 是否隐藏：0=普款 1=隐藏（可选）
 *   - attachmentId: 图片附件ID（可选，优先级最高）
 *   - fileUrl: 上传接口返回的相对路径（如 "image/image/xxx.jpeg"，可选）
 *   - imageUrl: 图片URL（如 "/upload/image/image/xxx.jpeg" 或完整URL，可选，当未传 fileUrl 时用于推导相对路径）
 */
router.post('/garage/batch-update', async (ctx) => {
    const { userId, items } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!Array.isArray(items) || items.length === 0) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：items 必须是非空数组',
        };
        return;
    }

    const uid = parseInt(userId, 10);
    const { UserCarModelGarage } = require('../../models');

    let succeedCount = 0;
    let failedCount = 0;
    const itemResults = [];

    for (const rawItem of items) {
        const item = rawItem || {};
        const {
            garageId,
            ownedQty,
            purchasePrice,
            purchaseTime,
            isHidden,
            attachmentId,
            fileUrl,
            imageUrl,
        } = item;

        const resultItem = {
            garageId : garageId || null,
            succeed  : 1,
            code     : 200,
            message  : '成功',
        };

        if (!garageId) {
            resultItem.succeed = 0;
            resultItem.code = 100;
            resultItem.message = '参数错误：garageId 不能为空';
            failedCount += 1;
            itemResults.push(resultItem);
            continue;
        }

        try {
            // 1. 更新车库拥有信息
            const payload = {};
            if (ownedQty !== undefined) {
                payload.ownedQty = ownedQty;
            }
            if (purchasePrice !== undefined) {
                payload.purchasePrice = purchasePrice;
            }
            if (purchaseTime !== undefined) {
                payload.purchaseTime = purchaseTime;
            }
            if (isHidden !== undefined) {
                payload.isHidden = isHidden;
            }

            if (Object.keys(payload).length > 0) {
                const updateRes = await userCarModelGarageRepo.updateInfo(uid, garageId, payload);
                if (updateRes.succeed !== 1) {
                    resultItem.succeed = 0;
                    resultItem.code = updateRes.code || 500;
                    resultItem.message = updateRes.description || '更新车库信息失败';
                    failedCount += 1;
                    itemResults.push(resultItem);
                    continue;
                }
            }

            // 2. 如需更新图片，则更新关联车模的 attachmentId
            if (attachmentId || fileUrl || imageUrl) {
                const garage = await UserCarModelGarage.findOne({
                    where: {
                        id     : garageId,
                        userId : uid,
                    },
                });

                if (!garage || !garage.carModelId) {
                    resultItem.succeed = 0;
                    resultItem.code = 102;
                    resultItem.message = '车库记录不存在或未关联车模';
                    failedCount += 1;
                    itemResults.push(resultItem);
                    continue;
                }

                const { carModelId } = garage;
                let finalAttachmentId = attachmentId ? parseInt(attachmentId, 10) : null;

                // 如果未显式提供 attachmentId，但有 fileUrl/imageUrl，则根据图片创建附件记录
                if (!finalAttachmentId && (fileUrl || imageUrl)) {
                    const relPath = fileUrl || (() => {
                        const s = String(imageUrl || '');
                        const idx = s.indexOf('upload/');
                        return idx >= 0 ? s.slice(idx + 7) : s.replace(/^\//, '');
                    })();

                    if (relPath && !relPath.startsWith('..') && !path.isAbsolute(relPath)) {
                        const absPath = path.join(process.cwd(), 'upload', relPath);
                        try {
                            const stat = await fs.stat(absPath);
                            const fileName = path.basename(relPath);
                            const sizeKb = (stat.size / 1024).toFixed(2);

                            // 推导缩略图路径（如果存在）
                            let thumbnailRelPath = null;
                            try {
                                const thumbFileName = getThumbnailFileName(fileName);
                                if (thumbFileName) {
                                    const dir = path.dirname(relPath);
                                    const combined = dir && dir !== '.' ? path.join(dir, thumbFileName) : thumbFileName;
                                    const normalizedRel = combined.replace(/\\/g, '/');
                                    const thumbAbsPath = path.join(process.cwd(), 'upload', normalizedRel);
                                    await fs.stat(thumbAbsPath);
                                    thumbnailRelPath = normalizedRel;
                                }
                            } catch (thumbErr) {
                                logger.debug(
                                    '[garage/batch-update] 缩略图文件不存在或无法访问，将使用 thumbnailPath=null: %s',
                                    thumbErr.message,
                                );
                            }

                            const row = await Attachment.create({
                                attachGroupId : 3,
                                name          : fileName,
                                path          : relPath,
                                thumbnailPath : thumbnailRelPath,
                                type          : 'image',
                                size          : parseFloat(sizeKb),
                            });
                            finalAttachmentId = row.id;
                            logger.info(
                                '[garage/batch-update] 根据 imageUrl/fileUrl 创建附件: id=%d path=%s thumbnail=%s',
                                row.id,
                                relPath,
                                row.thumbnailPath || '',
                            );
                        } catch (e) {
                            logger.warn(
                                '[garage/batch-update] 无法根据 imageUrl/fileUrl 创建附件: %s',
                                e.message,
                            );
                        }
                    }
                }

                if (finalAttachmentId) {
                    const updateCarModelRes = await carModelRepo.update(carModelId, {
                        attachmentId: finalAttachmentId,
                    });
                    if (updateCarModelRes.succeed !== 1) {
                        resultItem.succeed = 0;
                        resultItem.code = updateCarModelRes.code || 500;
                        resultItem.message = updateCarModelRes.description || '更新车模图片失败';
                        failedCount += 1;
                        itemResults.push(resultItem);
                        continue;
                    }
                }
            }

            succeedCount += 1;
            itemResults.push(resultItem);
        } catch (err) {
            logger.error('[garage/batch-update] 批量修改单条记录失败', err);
            resultItem.succeed = 0;
            resultItem.code = 500;
            resultItem.message = err.message || '系统错误';
            failedCount += 1;
            itemResults.push(resultItem);
        }
    }

    ctx.body = {
        succeed     : 1,
        code        : 200,
        description : '成功',
        data        : {
            succeedCount,
            failedCount,
            items: itemResults,
        },
    };
});

/**
 * 获取我的车库统计数据（个人数据统计页）
 * @param {number} userId - 用户ID（必填）
 * @param {number} months - 统计最近多少个月（可选，默认12，范围1-24）
 */
router.post('/garage/statistics', async (ctx) => {
    const { userId, months } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    const _result = await userCarModelGarageRepo.getStatistics(parseInt(userId, 10), { months });
    ctx.body = _result;
});

/**
 * 获取我的车库列表
 * @param {number} userId - 用户ID（必填）
 * @param {string} keyword - 搜索关键词（可选，用于搜索车模名称）
 * @param {number} manufacturerId - 车模厂商ID（可选，用于筛选品牌）
 * @param {number} scaleId - 车模比例ID（可选，用于筛选比例）
 * @param {number} sortType - 排序方式（可选，默认1）
 *   1 = 最新添加（createdAt DESC，默认）
 *   2 = 购买单价降序（purchasePrice DESC）
 *   3 = 购买单价升序（purchasePrice ASC）
 *   4 = 购入时间正序（purchaseTime ASC）
 *   5 = 购入时间倒序（purchaseTime DESC）
 * @param {number} page - 页码，从1开始，默认1
 * @param {number} size - 每页数量，默认10
 */
router.post('/garage/list', async (ctx) => {
    const {
        userId,
        keyword,
        manufacturerId,
        scaleId,
        sortType = 1,
        page = 1,
        size = 10,
    } = ctx.request.body;

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    const searchKey = {
        userId,
        sortType,
    };

    if (keyword) {
        searchKey.keyword = keyword;
    }

    if (manufacturerId) {
        searchKey.manufacturerId = manufacturerId;
    }

    if (scaleId) {
        searchKey.scaleId = scaleId;
    }

    const offset = (page - 1) * size;
    const _result = await userCarModelGarageRepo.list(searchKey, offset, size);
    ctx.body = _result;
});

/**
 * 检查是否已在车库中
 * @param {number} userId - 用户ID（必填）
 * @param {number} carModelId - 车模ID（必填）
 */
router.post('/garage/check', async (ctx) => {
    const { userId, carModelId } = ctx.request.body;

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!carModelId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelId 不能为空',
        };
        return;
    }

    const _result = await userCarModelGarageRepo.check(userId, carModelId);
    ctx.body = _result;
});

/**
 * 获取车库数量
 * @param {number} userId - 用户ID（必填）
 */
router.post('/garage/count', async (ctx) => {
    const { userId } = ctx.request.body;

    // 参数验证
    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    const _result = await userCarModelGarageRepo.count(userId);
    ctx.body = _result;
});

/**
 * 获取我的车库访问密钥（不存在则自动创建）
 * @param {number} userId - 用户ID（必填）
 */
router.post('/garage/visit-key', async (ctx) => {
    const { userId } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    try {
        const uid = parseInt(userId, 10);
        let record = await UserGarageVisitKey.findOne({
            where: { userId: uid },
        });

        let isNew = false;
        if (!record) {
            const visitKey = generateVisitKey();
            record = await UserGarageVisitKey.create({
                userId: uid,
                visitKey,
            });
            isNew = true;
        }

        ctx.body = {
            succeed     : 1,
            code        : 200,
            description : '成功',
            data        : {
                visitKey: record.visitKey,
                isNew,
            },
        };
    } catch (err) {
        logger.error('[garage/visit-key] 获取密钥失败', err);
        ctx.body = {
            succeed     : 0,
            code        : 500,
            description : err.message || '获取车库密钥失败，请稍后重试',
        };
    }
});

/**
 * 刷新我的车库访问密钥（旧密钥立即失效）
 * @param {number} userId - 用户ID（必填）
 */
router.post('/garage/visit-key/refresh', async (ctx) => {
    const { userId } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    try {
        const uid = parseInt(userId, 10);
        const newKey = generateVisitKey();

        let record = await UserGarageVisitKey.findOne({
            where: { userId: uid },
        });

        if (record) {
            await record.update({ visitKey: newKey });
        } else {
            record = await UserGarageVisitKey.create({
                userId   : uid,
                visitKey : newKey,
            });
        }

        ctx.body = {
            succeed     : 1,
            code        : 200,
            description : '成功',
            data        : {
                visitKey : record.visitKey,
                isNew    : true,
            },
        };
    } catch (err) {
        logger.error('[garage/visit-key/refresh] 刷新密钥失败', err);
        ctx.body = {
            succeed     : 0,
            code        : 500,
            description : err.message || '刷新车库密钥失败，请稍后重试',
        };
    }
});

/**
 * 通过密钥访问他人车库（隐私字段脱敏）
 * @param {string} visitKey - 车库访问密钥（必填）
 * @param {string} keyword - 搜索关键词（可选）
 * @param {number} manufacturerId - 车模厂商ID（可选）
 * @param {number} scaleId - 车模比例ID（可选）
 * @param {number} sortType - 排序方式（可选，默认1，同 /garage/list）
 * @param {number} page - 页码（可选，默认1）
 * @param {number} size - 每页数量（可选，默认10）
 */
router.post('/garage/visit', async (ctx) => {
    const {
        visitorUserId, // 预留字段，当前仅用于审计扩展
        visitKey,
        keyword,
        manufacturerId,
        scaleId,
        sortType = 1,
        page = 1,
        size = 10,
    } = ctx.request.body || {};

    if (!visitKey || !String(visitKey).trim()) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：visitKey 不能为空',
        };
        return;
    }

    try {
        const record = await UserGarageVisitKey.findOne({
            where: { visitKey: String(visitKey).trim() },
        });

        if (!record) {
            ctx.body = {
                succeed     : 0,
                code        : 404,
                description : '密钥无效或已失效',
            };
            return;
        }

        const ownerUserId = record.userId;

        // 组装与 /garage/list 相同的查询条件，但 userId 固定为车库所有者
        const searchKey = {
            userId   : ownerUserId,
            sortType : sortType || 1,
        };

        if (keyword) {
            searchKey.keyword = keyword;
        }
        if (manufacturerId) {
            searchKey.manufacturerId = manufacturerId;
        }
        if (scaleId) {
            searchKey.scaleId = scaleId;
        }

        const offset = (page - 1) * size;
        const listResult = await userCarModelGarageRepo.list(searchKey, offset, size);

        if (listResult.succeed !== 1) {
            ctx.body = listResult;
            return;
        }

        const rawList = (listResult.data && listResult.data.list) || [];
        // 不再强制过滤隐藏款/脱敏字段，直接返回仓储层的原始列表数据
        const publicList = rawList;

        // 获取车库所有者的基础信息（昵称、头像）
        let owner = null;
        try {
            owner = await User.findByPk(ownerUserId, {
                attributes: ['id', 'username', 'nickname', 'avatar'],
            });
        } catch (err) {
            logger.warn('[garage/visit] 获取车库所有者信息失败', err);
        }

        ctx.body = {
            succeed     : 1,
            code        : 200,
            description : '成功',
            data        : {
                ownerUserId,
                ownerNickname : owner?.nickname || owner?.username || '',
                ownerAvatar   : owner?.avatar || null,
                list  : publicList,
                count : listResult.data?.count ?? publicList.length,
            },
        };
    } catch (err) {
        logger.error('[garage/visit] 访问他人车库失败', err);
        ctx.body = {
            succeed     : 0,
            code        : 500,
            description : err.message || '访问他人车库失败，请稍后重试',
        };
    }
});

/**
 * ==================== 用户自定义分类相关接口 ====================
 */

/**
 * 创建自定义分类
 * @param {number} userId - 用户ID（必填）
 * @param {string} name - 分类名称（必填）
 * @param {string} description - 分类描述（可选）
 * @param {string} color - 分类颜色（可选）
 * @param {string} icon - 分类图标（可选）
 * @param {number} sort - 排序（可选，默认0）
 */
router.post('/custom-category/create', async (ctx) => {
    const { userId, name, description, color, icon, sort } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    const _result = await userCustomCategoryRepo.create({
        userId,
        name,
        description,
        color,
        icon,
        sort,
    });
    ctx.body = _result;
});

/**
 * 更新自定义分类
 * @param {number} userId - 用户ID（必填）
 * @param {number} categoryId - 分类ID（必填）
 * @param {string} name - 分类名称（可选）
 * @param {string} description - 分类描述（可选）
 * @param {string} color - 分类颜色（可选）
 * @param {string} icon - 分类图标（可选）
 * @param {number} sort - 排序（可选）
 */
router.post('/custom-category/update', async (ctx) => {
    const { userId, categoryId, name, description, color, icon, sort } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!categoryId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：categoryId 不能为空',
        };
        return;
    }

    const _result = await userCustomCategoryRepo.update(userId, categoryId, {
        name,
        description,
        color,
        icon,
        sort,
    });
    ctx.body = _result;
});

/**
 * 删除自定义分类
 * @param {number} userId - 用户ID（必填）
 * @param {number} categoryId - 分类ID（必填）
 */
router.post('/custom-category/delete', async (ctx) => {
    const { userId, categoryId } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!categoryId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：categoryId 不能为空',
        };
        return;
    }

    const _result = await userCustomCategoryRepo.delete(userId, categoryId);
    ctx.body = _result;
});

/**
 * 批量删除自定义分类
 * @param {number} userId - 用户ID（必填）
 * @param {Array} categoryIds - 分类ID数组（必填）
 */
router.post('/custom-category/batch-delete', async (ctx) => {
    const { userId, categoryIds } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：categoryIds 必须是非空数组',
        };
        return;
    }

    const _result = await userCustomCategoryRepo.batchDelete(userId, categoryIds);
    ctx.body = _result;
});

/**
 * 获取自定义分类详情
 * @param {number} userId - 用户ID（必填）
 * @param {number} categoryId - 分类ID（必填）
 */
router.post('/custom-category/get', async (ctx) => {
    const { userId, categoryId } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!categoryId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：categoryId 不能为空',
        };
        return;
    }

    const _result = await userCustomCategoryRepo.get(userId, categoryId);
    ctx.body = _result;
});

/**
 * 获取用户的所有自定义分类列表
 * @param {number} userId - 用户ID（必填）
 * @param {boolean} includeCarModelCount - 是否包含车模数量（可选，默认false）
 */
router.post('/custom-category/list', async (ctx) => {
    const { userId, includeCarModelCount = false } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    const _result = await userCustomCategoryRepo.list(userId, {
        includeCarModelCount: includeCarModelCount === true || includeCarModelCount === 'true',
    });
    ctx.body = _result;
});

/**
 * 将车模添加到分类
 * @param {number} userId - 用户ID（必填）
 * @param {number} categoryId - 分类ID（必填）
 * @param {number} carModelId - 车模ID（必填）
 * @param {number} sort - 排序（可选，默认0）
 */
router.post('/custom-category/add-car-model', async (ctx) => {
    const { userId, categoryId, carModelId, sort } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!categoryId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：categoryId 不能为空',
        };
        return;
    }

    if (!carModelId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelId 不能为空',
        };
        return;
    }

    const _result = await userCustomCategoryRepo.addCarModel(userId, categoryId, carModelId, sort);
    ctx.body = _result;
});

/**
 * 从分类中移除车模
 * @param {number} userId - 用户ID（必填）
 * @param {number} categoryId - 分类ID（必填）
 * @param {number} carModelId - 车模ID（必填）
 */
router.post('/custom-category/remove-car-model', async (ctx) => {
    const { userId, categoryId, carModelId } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!categoryId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：categoryId 不能为空',
        };
        return;
    }

    if (!carModelId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelId 不能为空',
        };
        return;
    }

    const _result = await userCustomCategoryRepo.removeCarModel(userId, categoryId, carModelId);
    ctx.body = _result;
});

/**
 * 批量添加车模到分类
 * @param {number} userId - 用户ID（必填）
 * @param {number} categoryId - 分类ID（必填）
 * @param {Array} carModelIds - 车模ID数组（必填）
 */
router.post('/custom-category/batch-add-car-models', async (ctx) => {
    const { userId, categoryId, carModelIds } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!categoryId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：categoryId 不能为空',
        };
        return;
    }

    if (!Array.isArray(carModelIds) || carModelIds.length === 0) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelIds 必须是非空数组',
        };
        return;
    }

    const _result = await userCustomCategoryRepo.batchAddCarModels(userId, categoryId, carModelIds);
    ctx.body = _result;
});

/**
 * 批量从分类中移除车模
 * @param {number} userId - 用户ID（必填）
 * @param {number} categoryId - 分类ID（必填）
 * @param {Array} carModelIds - 车模ID数组（必填）
 */
router.post('/custom-category/batch-remove-car-models', async (ctx) => {
    const { userId, categoryId, carModelIds } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!categoryId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：categoryId 不能为空',
        };
        return;
    }

    if (!Array.isArray(carModelIds) || carModelIds.length === 0) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：carModelIds 必须是非空数组',
        };
        return;
    }

    const _result = await userCustomCategoryRepo.batchRemoveCarModels(userId, categoryId, carModelIds);
    ctx.body = _result;
});

/**
 * 获取分类下的车模列表
 * @param {number} userId - 用户ID（必填）
 * @param {number} categoryId - 分类ID（必填）
 * @param {number} page - 页码，从1开始，默认1
 * @param {number} size - 每页数量，默认10
 */
router.post('/custom-category/car-models', async (ctx) => {
    const { userId, categoryId, page = 1, size = 10 } = ctx.request.body || {};

    if (!userId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：userId 不能为空',
        };
        return;
    }

    if (!categoryId) {
        ctx.body = {
            succeed     : 0,
            code        : 100,
            description : '参数错误：categoryId 不能为空',
        };
        return;
    }

    const offset = (page - 1) * size;
    const _result = await userCustomCategoryRepo.getCarModels(userId, categoryId, offset, size);
    ctx.body = _result;
});

module.exports = router;
