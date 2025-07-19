
const logger = require('tracer').colorConsole();
const { ArticleType } = require('../../models');


class ArticleTypeRepos {
    constructor () {
        this._instance = null;
    }

    /**
   *
   * @param {*} articleType
   */
    async create (articleType) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(articleType).forEach((field) => {
                if (!articleType[field] && articleType[field] != 0) {
                    delete articleType[field];
                }
            });
            if (Number.isInteger(articleType.pid) && articleType.typeName) {
                let _articleType = await ArticleType.findOne({
                    where: {
                        typeName : articleType.typeName,
                        pid      : articleType.pid,
                    },
                    raw: true,
                });
                if (_articleType) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '名称重复',
                    };
                } else {
                    _articleType = await ArticleType.create(articleType);
                    _articleType.setDataValue('children', []);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _articleType,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> articleType:${JSON.stringify(articleType)}`,
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
                const _affectedCount = await ArticleType.destroy({ where: { id: ids } });
                if (_affectedCount == 0) {
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

    /**
   *
   * @param {*} id
   * @param {*} articleType
   */
    async update (id, articleType) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(articleType).forEach((field) => {
                if (!articleType[field] && articleType[field] != 0) {
                    delete articleType[field];
                }
            });
            if (id) {
                const _typeName = articleType.typeName;
                if (_typeName) {
                    let _articleType = await ArticleType.findOne({
                        where: {
                            id,
                            typeName: _typeName,
                        },
                        raw: true,
                    });
                    if (_articleType) {
                        const _ret = await ArticleType.update(articleType, { where: { id } });
                        const _affectedCount = _ret[0];
                        if (_affectedCount == 0) {
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
                                    ...articleType,
                                    id,
                                },
                            };
                        }
                    } else {
                        _articleType = await ArticleType.findOne({
                            where: {
                                typeName : _typeName,
                                pid      : articleType.pid,
                                id       : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_articleType) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `名称 [${_typeName}] 重复`,
                            };
                        } else {
                            const _ret = await ArticleType.update(articleType, { where: { id } });
                            const _affectedCount = _ret[0];
                            if (_affectedCount == 0) {
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
                                        ...articleType,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await ArticleType.update(articleType, { where: { id } });
                    const _affectedCount = _ret[0];
                    if (_affectedCount == 0) {
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
                                ...articleType,
                                id,
                            },
                        };
                    }
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
            const _articleType = await ArticleType.findOne({
                where : { id },
                raw   : true,
            });
            if (_articleType) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _articleType,
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

    /**
   * @returns
   * @memberof ArticleType
   */
    async getTree () {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        const _where = {};
        const _datas = [];
        const _getSubTrees = (id, name, datas, level) => {
            const _articleTypes = [];
            ++level;
            for (const _data of datas) {
                if (_data.pid == id) {
                    _data.level = level;
                    _articleTypes.push({
                        ..._data,
                        ...{ parentName: name },
                    });
                }
            }
            for (const _articleType of _articleTypes) {
                const _subTrees = _getSubTrees(_articleType.id, _articleType.name, datas, level);
                if (_subTrees.length > 0) {
                    _articleType.children = _subTrees;
                }
            }
            return _articleTypes;
        };
        try {
            let _articleTypes = await ArticleType.findAll({
                where : _where,
                order : [['id', 'ASC']],
            });
            _articleTypes = _articleTypes.map((v) => v.dataValues);
            const _level = 1;
            for (const _articleType of _articleTypes) {
                if (_articleType.pid == 0) {
                    _articleType.level = _level;
                    _datas.push(_articleType);
                }
            }
            for (const _data of _datas) {
                const _subTrees = _getSubTrees(_data.id, _data.name, _articleTypes, _level);
                if (_subTrees.length > 0) {
                    _data.children = _subTrees;
                }
            }
            _result = {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : { list: _datas },
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
            this._instance = new ArticleTypeRepos();
        }
        return this._instance;
    }
}

module.exports = ArticleTypeRepos.getInstance();
