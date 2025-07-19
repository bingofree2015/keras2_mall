const moment = require('moment');
const logger = require('tracer').colorConsole();
const {
    FormSubmit, Form, FormItem, FormSubmitDetail, User, sequelize,
} = require('../../models');


class FormSubmitRepos {
    constructor () {
    // 报表参数模板
        this._options = {
            title: {
                text: '报表',
            },
            tooltip : {},
            legend  : {
                data: [],
            },
            grid: {
                left         : '3%',
                right        : '4%',
                bottom       : '3%',
                containLabel : true,
            },
            toolbox: {
                feature: {
                    saveAsImage: [],
                },
            },
            xAxis: {
                type        : 'category',
                boundaryGap : false,
                data        : [],
            },
            yAxis: {
                type : 'value',
                name : '元',
            },
            series: [],
        };
        this._instance = null;
    }

    async create (formSubmit) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(formSubmit).forEach((field) => {
                if (!formSubmit[field] && formSubmit[field] != 0) {
                    delete formSubmit[field];
                }
            });
            if (formSubmit.name) {
                let _formSubmit = await FormSubmit.findOne({
                    where : { name: formSubmit.name },
                    raw   : true,
                });
                if (_formSubmit) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '名称重复',
                    };
                } else {
                    _formSubmit = await FormSubmit.create(formSubmit);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : {
                            ...formSubmit,
                            id: _formSubmit.id,
                        },
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> formSubmit:${JSON.stringify(formSubmit)}`,
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
                const _affectedCount = await FormSubmit.destroy({ where: { id: ids } });
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

    async update (id, formSubmit) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(formSubmit).forEach((field) => {
                if (!formSubmit[field] && formSubmit[field] != 0) {
                    delete formSubmit[field];
                }
            });
            if (id) {
                const _name = formSubmit.name;
                if (_name) {
                    let _formSubmit = await FormSubmit.findOne({
                        where: {
                            id,
                            name: _name,
                        },
                        raw: true,
                    });
                    if (_formSubmit) {
                        const _ret = await FormSubmit.update(formSubmit, { where: { id } });
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
                                    ...formSubmit,
                                    id,
                                },
                            };
                        }
                    } else {
                        _formSubmit = await FormSubmit.findOne({
                            where: {
                                name : _name,
                                id   : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_formSubmit) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `名称 [${_name}] 重复`,
                            };
                        } else {
                            const _ret = await FormSubmit.update(formSubmit, { where: { id } });
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
                                        ...formSubmit,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await FormSubmit.update(formSubmit, { where: { id } });
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
                                ...formSubmit,
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
            const _formSubmit = await FormSubmit.findOne({
                include: [
                    {
                        model      : User,
                        as         : 'user',
                        attributes : ['id', 'username'],
                        require    : false,
                    },
                    {
                        include: [
                            {
                                model      : FormItem,
                                as         : 'formItems',
                                attributes : FormItem.getAttributes(),
                                require    : false,
                            },
                        ],
                        model      : Form,
                        as         : 'form',
                        attributes : Form.getAttributes(),
                        require    : false,
                    },
                ],
                where: { id },
            });
            if (_formSubmit) {
                if (_formSubmit && _formSubmit.form && Array.isArray(_formSubmit.form.formItems)) {
                    for (const _formItem of _formSubmit.form.formItems) {
                        const _formItemId = _formItem.id;
                        const _formSubmitDetail = await FormSubmitDetail.findOne({
                            where: {
                                formId     : _formSubmit.form.id,
                                submitId   : id,
                                formItemId : _formItemId,
                            },
                        });
                        if (_formSubmitDetail) {
                            _formItem.setDataValue('formItemValue', _formSubmitDetail.formItemValue);
                        }
                    }
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _formSubmit,
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
            if ((offset == 0 || offset) && limit) {
                const _formSubmits = await FormSubmit.findAndCountAll({
                    include: [
                        {
                            model      : User,
                            as         : 'user',
                            attributes : ['id', 'username'],
                        },
                    ],
                    where: _where,
                    offset,
                    limit,
                });
                for (const _formSubmit of _formSubmits.rows) {
                    _datas.push(_formSubmit);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _formSubmits.count,
                    },
                };
            } else {
                const _formSubmits = await FormSubmit.findAll({
                    include: [
                        {
                            model      : User,
                            as         : 'user',
                            attributes : ['id', 'username'],
                        },
                    ],
                    where: _where,
                });
                for (const _formSubmit of _formSubmits) {
                    _datas.push(_formSubmit);
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

    /**
   *
   * @param {表单Id} formId
   * @param {最近几天内} days
   */
    async report (formId, days) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            const _data = {};
            const _totalCount = await FormSubmit.count({ where: { formId } });
            const _totalMoney = await FormSubmit.sum('money', { where: { formId } });

            _data.totalCount = _totalCount;
            _data.totalMoney = _totalMoney;

            const _startDate = moment().subtract('days', days).toDate();
            const _formSubmits = await FormSubmit.findAll({
                attributes: [
                    [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m-%d'), 'day'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'num'],
                ],
                group : [[sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m-%d')]],
                where : {
                    formId,
                    createdAt: { $gt: _startDate },
                },
            });
            const _days = {};
            for (const _formSubmit of _formSubmits) {
                _days[_formSubmit.day] = _formSubmit.num;
            }

            const _fullDays = {};
            for (let i = days; i > 0; i--) {
                const _key = moment().subtract('days', i).format('YYYY-MM-DD');
                _fullDays[_key] = _days[_key] ? _days[_key] : 0;
            }

            // 生成X轴数据
            this._options.title.text = '表单提交数据统计';
            this._options.legend.data = ['金额'];

            const _xAxisData = Object.keys(_fullDays);
            this._options.xAxis.data = _xAxisData;

            const _serie = {
                name : '金额',
                type : 'line',
                data : Object.values(_fullDays),
            };
            this._options.series.push(_serie);

            _data.list = this._options;

            _result = {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : _data,
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
            this._instance = new FormSubmitRepos();
        }
        return this._instance;
    }
}

module.exports = FormSubmitRepos.getInstance();
