const logger = require('tracer').colorConsole();
const { Article, ArticleType, Attachment } = require('../../models');


class ArticleRepos {
    constructor () {
        this._instance = null;
    }

    /**
   * @param {*} article
   */
    async create (article) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(article).forEach((field) => {
                if (!article[field] && article[field] != 0) {
                    delete article[field];
                }
            });
            if (Number.isInteger(article.typeId) && article.title) {
                let _article = await Article.findOne({
                    where: {
                        typeId : article.typeId,
                        title  : article.title,
                    },
                    raw: true,
                });
                if (_article) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '记录重复',
                    };
                } else {
                    _article = await Article.create(article);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _article,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> article:${JSON.stringify(article)}`,
                };
            }
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.article || err.stack || '系统错误',
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
                const _affectedCount = await Article.destroy({ where: { id: ids } });
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
                description : err.article || err.stack || '系统错误',
            };
        }

        return _result;
    }

    /**
   * @param {*} id
   * @param {*} article
   */
    async update (id, article) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(article).forEach((field) => {
                if (!article[field] && article[field] != 0) {
                    delete article[field];
                }
            });
            if (id) {
                const _typeId = article.typeId;
                const _title = article.title;

                if (Number.isInteger(_typeId) && _title) {
                    let _article = await Article.findOne({
                        where: {
                            id,
                            typeId : _typeId,
                            title  : _title,
                        },
                        raw: true,
                    });
                    if (_article) {
                        const _ret = await Article.update(article, { where: { id } });
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
                                    ...article,
                                    id,
                                },
                            };
                        }
                    } else {
                        _article = await Article.findOne({
                            where: {
                                typeId : _typeId,
                                title  : _title,
                                id     : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_article) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : '记录重复',
                            };
                        } else {
                            const _ret = await Article.update(article, { where: { id } });
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
                                        ...article,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await Article.update(article, { where: { id } });
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
                                ...article,
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
                description : err.article || err.stack || '系统错误',
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
            const _article = await Article.findOne({
                include: [
                    {
                        model      : ArticleType,
                        attributes : ArticleType.getAttributes(),
                        as         : 'articleType',
                        require    : false,
                    },
                    {
                        model      : Attachment,
                        attributes : Attachment.getAttributes(),
                        as         : 'attachment',
                        require    : false,
                    },
                ],
                where: { id },
            });
            if (_article) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _article,
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
                description : err.article || err.stack || '系统错误',
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
                if (!searchKey[field] && searchKey[field] != 0) {
                    delete searchKey[field];
                }
            });
            for (const _key in searchKey) {
                if (typeof searchKey[_key] === 'string' && !_excludeKeys.includes(_key)) {
                    _where[_key] = {
                        $like: `%${searchKey[_key]}%`,
                    };
                } else {
                    _where[_key] = searchKey[_key];
                }
            }
        }

        const _datas = [];
        try {
            if ((offset == 0 || offset) && limit) {
                const _articles = await Article.findAndCountAll({
                    include: [
                        {
                            model      : ArticleType,
                            attributes : ArticleType.getAttributes(),
                            as         : 'articleType',
                            require    : false,
                        },
                        {
                            model      : Attachment,
                            attributes : Attachment.getAttributes(),
                            as         : 'attachment',
                            require    : false,
                        },
                    ],
                    where: _where,
                    offset,
                    limit,
                });
                for (const _article of _articles.rows) {
                    _datas.push(_article);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _articles.count,
                    },
                };
            } else {
                const _articles = await Article.findAll({
                    include: [
                        {
                            model      : ArticleType,
                            attributes : ArticleType.getAttributes(),
                            as         : 'articleType',
                            require    : false,
                        },
                        {
                            model      : Attachment,
                            attributes : Attachment.getAttributes(),
                            as         : 'attachment',
                            require    : false,
                        },
                    ],
                    where: _where,
                });
                for (const _article of _articles) {
                    _datas.push(_article);
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

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new ArticleRepos();
        }
        return this._instance;
    }
}

module.exports = ArticleRepos.getInstance();
