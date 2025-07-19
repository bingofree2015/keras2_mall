const base = require('./base');

module.exports = (sequelize, DataTypes) => {
    const Task = base(
        sequelize,
        DataTypes,
        'Task',
        {
            // 属性对象
            name: {
                type      : DataTypes.STRING(200),
                allowNull : true,
                comment   : '任务名称',
            },
            message: {
                type      : DataTypes.STRING(255),
                allowNull : true,
                comment   : '任务消息',
            },
            fileType: {
                type         : DataTypes.STRING(20),
                field        : 'file_type',
                allowNull    : true,
                defaultValue : 'csv',
                comment      : '文件类型',
            },
            type: {
                type      : DataTypes.INTEGER(1),
                allowNull : true,
                comment   : '任务类型，1为导出，2为导入',
            },
            status: {
                type         : DataTypes.INTEGER(1).UNSIGNED,
                allowNull    : true,
                defaultValue : '0',
                comment:
          '任务状态，0为等待执行，1正在导出，2导出成功，3导出失败，4正在导入，5导入成功，6导入失败，7中断，8部分导入',
            },
            params: {
                type      : DataTypes.TEXT,
                allowNull : true,
                comment   : '相关参数',
            },
            fileName: {
                type      : DataTypes.STRING(255),
                field     : 'file_name',
                allowNull : true,
                comment   : '文件名称',
            },
            fileSize: {
                type      : DataTypes.STRING(200),
                field     : 'file_size',
                allowNull : true,
                comment   : '文件大小',
            },
            filePath: {
                type      : DataTypes.STRING(255),
                field     : 'file_path',
                allowNull : true,
                comment   : '文件路径',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '导入导出任务表',
        },
    );

    Task.associate = (models) => {};

    return Task;
};
