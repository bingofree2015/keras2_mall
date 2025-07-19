const { join } = require('path');
const { unlinkSync, access } = require('mz/fs');
const logger = require('tracer').colorConsole();
const { Attachment } = require('../../models');


const SERVER_UPLOAD_DIR = join(process.cwd(), '/upload/');

class AttachmentRepos {
    constructor () {
        this._instance = null;
    }

    async create (attachment) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };
        try {
            Object.keys(attachment).forEach((field) => {
                if (!attachment[field] && attachment[field] != 0) {
                    delete attachment[field];
                }
            });
            if (attachment.path) {
                let _attachment = await Attachment.findOne({
                    where: {
                        attachGroupId : attachment.attachGroupId,
                        path          : attachment.path,
                    },
                    raw: true,
                });
                if (_attachment) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '路径重复',
                    };
                } else {
                    _attachment = await Attachment.create(attachment);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _attachment,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> log:${JSON.stringify(attachment)}`,
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

    async batchDelete (ids) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            if (Array.isArray(ids) && ids.length > 0) {
                const _filePaths = [];
                const _attachments = await Attachment.findAll({ where: { id: ids } });
                for (const _attachment of _attachments) {
                    _filePaths.push(_attachment.path);
                }
                const _affectedCount = await Attachment.destroy({ where: { id: ids } });
                if (_affectedCount === 0) {
                    _result = {
                        succeed     : 0,
                        code        : 102,
                        description : '记录不存在',
                    };
                } else {
                    for (let _filePath of _filePaths) {
                        _filePath = join(SERVER_UPLOAD_DIR, _filePath);
                        access(_filePath, (err) => {
                            if (!err) {
                                unlinkSync(_filePath); // 删除临时文件
                            } else {
                                logger.info(`${_filePath}  不存在...`);
                            }
                        });
                    }
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

    async update (id, attachment) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(attachment).forEach((field) => {
                if (!attachment[field] && attachment[field] != 0) {
                    delete attachment[field];
                }
            });
            if (id) {
                const _attachGroupId = attachment.attachGroupId;
                const _path = attachment.path;
                if (_path) {
                    let _attachment = await Attachment.findOne({
                        where: {
                            id,
                            attachGroupId : _attachGroupId,
                            path          : _path,
                        },
                        raw: true,
                    });
                    if (_attachment) {
                        const _ret = await Attachment.update(attachment, { where: { id } });
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
                                    ...attachment,
                                    id,
                                },
                            };
                        }
                    } else {
                        _attachment = await Attachment.findOne({
                            where: {
                                path : _path,
                                id   : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_attachment) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `路径 [${_path}] 重复`,
                            };
                        } else {
                            const _ret = await Attachment.update(attachment, { where: { id } });
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
                                        ...attachment,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await Attachment.update(attachment, { where: { id } });
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
                                ...attachment,
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
            const _attachment = await Attachment.findOne({
                where : { id },
                raw   : true,
            });
            if (_attachment) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _attachment,
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
            if ((offset === 0 || offset) && limit) {
                const _attachments = await Attachment.findAndCountAll({
                    where : _where,
                    offset,
                    limit,
                    raw   : true,
                });
                for (const _attachment of _attachments.rows) {
                    _datas.push(_attachment);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _attachments.count,
                    },
                };
            } else {
                const _attachments = await Attachment.findAll({
                    where : _where,
                    raw   : true,
                });
                for (const _attachment of _attachments) {
                    _datas.push(_attachment);
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
            this._instance = new AttachmentRepos();
        }
        return this._instance;
    }
}

module.exports = AttachmentRepos.getInstance();
