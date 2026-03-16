const { Op } = require('sequelize');
const logger = require('../../utils/logger');
const { CarModelCatalog, CarModelManufacturer, Attachment } = require('../../models');
const { processListResult } = require('../../utils/thumbnail_helper');

class CarModelCatalogRepos {
    constructor () {
        this._instance = null;
    }

    async create (carModelCatalog) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(carModelCatalog).forEach((field) => {
                if (!carModelCatalog[field] && carModelCatalog[field] !== 0) {
                    delete carModelCatalog[field];
                }
            });
            // 目录层级自动推导：level = parent.level + 1（根节点为1）
            if (carModelCatalog.parentId === undefined || carModelCatalog.parentId === null) {
                carModelCatalog.parentId = 0;
            }
            if (carModelCatalog.parentId === 0) {
                carModelCatalog.level = 1;
            } else if (!carModelCatalog.level) {
                const parent = await CarModelCatalog.findByPk(carModelCatalog.parentId);
                if (parent) {
                    const parentLevel = parent.level || 1;
                    carModelCatalog.level = parentLevel + 1;
                } else {
                    carModelCatalog.level = 1;
                    carModelCatalog.parentId = 0;
                }
            }

            if (carModelCatalog.name && carModelCatalog.manufacturerId) {
                let _carModelCatalog = await CarModelCatalog.findOne({
                    where: {
                        name           : carModelCatalog.name,
                        manufacturerId : carModelCatalog.manufacturerId,
                        parentId       : carModelCatalog.parentId || 0,
                    },
                    raw: true,
                });
                if (_carModelCatalog) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '名称重复',
                    };
                } else {
                    _carModelCatalog = await CarModelCatalog.create(carModelCatalog);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _carModelCatalog,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> carModelCatalog:${JSON.stringify(carModelCatalog)}`,
                };
            }
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.message || err.stack || '系统错误',
            };
        }

        return _result;
    }

    async delete (ids) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            if (Array.isArray(ids) && ids.length > 0) {
                // 检查是否有子目录
                const children = await CarModelCatalog.findAll({
                    where: {
                        parentId: { [Op.in]: ids },
                    },
                });
                if (children.length > 0) {
                    _result = {
                        succeed     : 0,
                        code        : 103,
                        description : '存在子目录，无法删除',
                    };
                    return _result;
                }

                const _affectedCount = await CarModelCatalog.destroy({ where: { id: ids } });
                if (_affectedCount === 0) {
                    _result = {
                        succeed     : 0,
                        code        : 102,
                        description : '记录不存在',
                    };
                } else {
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : '参数错误',
                };
            }
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.message || err.stack || '系统错误',
            };
        }

        return _result;
    }

    async update (id, carModelCatalog) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(carModelCatalog).forEach((field) => {
                if (!carModelCatalog[field] && carModelCatalog[field] !== 0) {
                    delete carModelCatalog[field];
                }
            });
            // 如果更新了 parentId，需要根据父级自动更新 level
            if (carModelCatalog.parentId !== undefined) {
                if (carModelCatalog.parentId === 0) {
                    carModelCatalog.level = 1;
                } else if (!carModelCatalog.level) {
                    const parent = await CarModelCatalog.findByPk(carModelCatalog.parentId);
                    if (parent) {
                        const parentLevel = parent.level || 1;
                        carModelCatalog.level = parentLevel + 1;
                    } else {
                        carModelCatalog.level = 1;
                        carModelCatalog.parentId = 0;
                    }
                }
            }

            if (id) {
                const _ret = await CarModelCatalog.update(carModelCatalog, { where: { id } });
                const _affectedCount = _ret[0];
                if (_affectedCount === 0) {
                    _result = {
                        succeed     : 0,
                        code        : 102,
                        description : '记录不存在',
                    };
                } else {
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : {
                            ...carModelCatalog,
                            id,
                        },
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> id:${id}`,
                };
            }
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.message || err.stack || '系统错误',
            };
        }

        return _result;
    }

    async get (id) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            const _carModelCatalog = await CarModelCatalog.findOne({
                where   : { id },
                include : [
                    {
                        model      : CarModelCatalog,
                        as         : 'parent',
                        attributes : ['id', 'name'],
                        required   : false,
                    },
                    {
                        model      : CarModelManufacturer,
                        as         : 'manufacturer',
                        attributes : ['id', 'name'],
                        required   : false,
                    },
                ],
                raw: false,
            });
            if (_carModelCatalog) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _carModelCatalog.toJSON(),
                };
            } else {
                _result = {
                    succeed     : 0,
                    code        : 102,
                    description : '数据不存在',
                };
            }
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.message || err.stack || '系统错误',
            };
        }
        return _result;
    }

    async list (searchKey, offset, limit) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        const _where = {};
        const _excludeKeys = [];
        if (searchKey) {
            Object.keys(searchKey).forEach((field) => {
                if (!searchKey[field] && searchKey[field] !== 0) {
                    delete searchKey[field];
                }
            });
            for (const _key in searchKey) {
                // 将 keyword 映射到 name 字段
                if (_key === 'keyword' && typeof searchKey[_key] === 'string') {
                    _where.name = {
                        [Op.like]: `%${searchKey[_key]}%`,
                    };
                } else if (typeof searchKey[_key] === 'string' && !_excludeKeys.includes(_key)) {
                    _where[_key] = {
                        [Op.like]: `%${searchKey[_key]}%`,
                    };
                } else if (!_excludeKeys.includes(_key)) {
                    _where[_key] = searchKey[_key];
                }
            }
        }

        const _datas = [];
        try {
            if ((offset === 0 || offset) && limit) {
                const _carModelCatalog = await CarModelCatalog.findAndCountAll({
                    where    : _where,
                    offset,
                    limit,
                    distinct : true, // 确保 count 只计算主表记录，避免关联表导致计数不准确
                    order    : [
                        ['level', 'ASC'],
                        ['sort', 'ASC'],
                        ['id', 'ASC'],
                    ],
                    include: [
                        {
                            model      : CarModelManufacturer,
                            as         : 'manufacturer',
                            attributes : ['id', 'name'],
                            required   : false,
                        },
                        {
                            model      : CarModelCatalog,
                            as         : 'parent',
                            attributes : ['id', 'name'],
                            required   : false,
                        },
                        {
                            model      : Attachment,
                            as         : 'attachment',
                            attributes : ['id', 'path', 'thumbnailPath'],
                            required   : false,
                        },
                    ],
                });
                for (const _carModelCatalogItem of _carModelCatalog.rows) {
                    const item = _carModelCatalogItem.toJSON();
                    _datas.push(item);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _carModelCatalog.count,
                    },
                };
            } else {
                const _carModelCatalog = await CarModelCatalog.findAll({
                    where : _where,
                    order : [
                        ['level', 'ASC'],
                        ['sort', 'ASC'],
                        ['id', 'ASC'],
                    ],
                    include: [
                        {
                            model      : CarModelManufacturer,
                            as         : 'manufacturer',
                            attributes : ['id', 'name'],
                            required   : false,
                        },
                        {
                            model      : CarModelCatalog,
                            as         : 'parent',
                            attributes : ['id', 'name'],
                            required   : false,
                        },
                        {
                            model      : Attachment,
                            as         : 'attachment',
                            attributes : ['id', 'path', 'thumbnailPath'],
                            required   : false,
                        },
                    ],
                });
                for (const _carModelCatalogItem of _carModelCatalog) {
                    const item = _carModelCatalogItem.toJSON();
                    _datas.push(item);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : { list: _datas },
                };
            }
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err,
            };
        }

        return _result;
    }

    async getByManufacturer (manufacturerId, parentId = null) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            const where = { manufacturerId };
            if (parentId !== null) {
                where.parentId = parentId;
            }

            const _carModelCatalog = await CarModelCatalog.findAll({
                where,
                order: [
                    ['level', 'ASC'],
                    ['sort', 'ASC'],
                    ['id', 'ASC'],
                ],
                include: [
                    {
                        model      : CarModelCatalog,
                        as         : 'parent',
                        attributes : ['id', 'name'],
                        required   : false,
                    },
                    {
                        model      : Attachment,
                        as         : 'attachment',
                        attributes : ['id', 'path', 'thumbnailPath'],
                        required   : false,
                    },
                ],
            });

            // 转换为 JSON 格式
            const catalogList = _carModelCatalog.map((item) => item.toJSON());

            _result = {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : { list: catalogList },
            };
            return processListResult(_result);
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.message || err.stack || '系统错误',
            };
        }

        return _result;
    }

    /**
     * 获取一级目录列表
     */
    async getFirstLevelCatalogs (manufacturerId) {
        return this.getByManufacturer(manufacturerId, 0);
    }

    /**
     * 获取二级目录列表（根据父目录ID）
     */
    async getSecondLevelCatalogs (parentId) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            const _carModelCatalog = await CarModelCatalog.findAll({
                where: {
                    parentId,
                    level: 2,
                },
                order: [
                    ['sort', 'ASC'],
                    ['id', 'ASC'],
                ],
            });

            const catalogList = _carModelCatalog.map((item) => item.toJSON());

            _result = {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : { list: catalogList },
            };
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.message || err.stack || '系统错误',
            };
        }

        return _result;
    }

    /**
     * 获取指定目录下所有叶子目录的 ID 列表（含该目录自身若为叶子）
     * 用于按目录查车模时：车模只挂在叶子目录上，需查出该目录及其所有子目录中的叶子，再按 catalogId IN (叶子IDs) 查车模
     * @param {number} catalogId - 目录ID
     * @returns {Promise<number[]>} 叶子目录 ID 数组，若目录不存在或无叶子则返回 []
     */
    async getLeafCatalogIdsUnder (catalogId) {
        if (catalogId == null || catalogId === '' || !Number.isFinite(Number(catalogId))) {
            return [];
        }
        const id = parseInt(catalogId, 10);
        try {
            const catalog = await CarModelCatalog.findByPk(id, {
                attributes : ['id', 'manufacturerId'],
                raw        : true,
            });
            if (!catalog || !catalog.manufacturerId) {
                return [];
            }
            const all = await CarModelCatalog.findAll({
                where      : { manufacturerId: catalog.manufacturerId },
                attributes : ['id', 'parentId'],
                raw        : true,
            });
            // 从当前节点起收集所有后代 ID（含自身）
            const descendantIds = new Set([id]);
            let prev = 0;
            while (prev !== descendantIds.size) {
                prev = descendantIds.size;
                for (const row of all) {
                    if (descendantIds.has(row.parentId)) {
                        descendantIds.add(row.id);
                    }
                }
            }
            // 叶子 = 在 descendantIds 中且不是任意节点的 parent
            const parentIds = new Set(all.filter((r) => r.parentId != null && r.parentId !== 0).map((r) => r.parentId));
            const leafIds = [...descendantIds].filter((lid) => !parentIds.has(lid)).map((lid) => Number(lid));
            return leafIds;
        } catch (err) {
            logger.error('[CarModelCatalogRepos][getLeafCatalogIdsUnder]', err);
            return [];
        }
    }

    /**
     * 获取目录树（包含子目录）
     * @param {number} manufacturerId - 厂商ID
     * @param {number|null} rootCatalogId - 可选，指定某个目录ID作为根，仅返回该节点及其子树
     */
    async getCatalogTree (manufacturerId, rootCatalogId = null) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            const allCatalogs = await CarModelCatalog.findAll({
                where   : { manufacturerId },
                include : [
                    {
                        model    : CarModelCatalog,
                        as       : 'children',
                        required : false,
                        order    : [['sort', 'ASC']],
                    },
                    {
                        model      : Attachment,
                        as         : 'attachment',
                        attributes : ['id', 'path', 'thumbnailPath'],
                        required   : false,
                    },
                ],
                order: [
                    ['level', 'ASC'],
                    ['sort', 'ASC'],
                    ['id', 'ASC'],
                ],
            });

            // 构建树形结构
            const catalogMap = new Map();
            const rootCatalogs = [];

            // 第一遍：创建所有节点的映射
            allCatalogs.forEach((catalog) => {
                const catalogData = catalog.toJSON();
                catalogData.children = [];
                catalogMap.set(catalogData.id, catalogData);
            });

            // 第二遍：构建树形结构
            allCatalogs.forEach((catalog) => {
                const catalogData = catalogMap.get(catalog.id);
                if (catalogData.parentId === 0) {
                    rootCatalogs.push(catalogData);
                } else {
                    const parent = catalogMap.get(catalogData.parentId);
                    if (parent) {
                        parent.children.push(catalogData);
                    }
                }
            });

            // 如果指定了 rootCatalogId，则仅返回该节点及其子树
            let listToReturn = rootCatalogs;
            if (rootCatalogId !== null && rootCatalogId !== undefined) {
                const rootIdNum = parseInt(rootCatalogId, 10);
                if (Number.isFinite(rootIdNum) && catalogMap.has(rootIdNum)) {
                    listToReturn = [catalogMap.get(rootIdNum)];
                } else {
                    listToReturn = [];
                }
            }

            _result = {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : { list: listToReturn },
            };
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.message || err.stack || '系统错误',
            };
        }

        return _result;
    }

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new CarModelCatalogRepos();
        }
        return this._instance;
    }
}

module.exports = CarModelCatalogRepos.getInstance();

