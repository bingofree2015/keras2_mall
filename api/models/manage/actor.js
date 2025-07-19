const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Actor = base(
        sequelize,
        DataTypes,
        'Actor',
        {
            // 属性对象
            name: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '角色名称',
            },
        },
        { hideDefaultArribute: false, comment: '' },
    );

    Actor.associate = (models) => {};

    return Actor;
};
