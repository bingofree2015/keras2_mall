// eslint-disable-next-line no-unused-vars

const moment = require('moment');

module.exports = (sequelize, DataTypes, table, attributes, options) => {
    const Base = sequelize.define(
        table,
        {
            id: {
                // 自增ID
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            ...attributes,
            ...getDefaultAttributes(options, DataTypes),
        },
        {
            ...options,
        },
    );

    Base.getAttributes = () => {
        const _attributes = Object.keys(attributes);
        const _execKeys = ['createdAt', 'updatedAt', 'deletedAt'];
        for (const key of _execKeys) {
            if (_attributes[key]) {
                delete _attributes[key];
            }
        }
        /*
        if (options.getterMethods) {
            let _customAttributes = Object.keys(options.getterMethods);
            _attributes = [..._attributes, ..._customAttributes];
        } */
        _attributes.unshift('id');
        return _attributes;
    };
    return Base;
};

function getDefaultAttributes (options, DataTypes) {
    const { DATE } = DataTypes;

    const defaultAttributes = {
        createdAt: {
            type: DATE(),
            field: 'created_at',
            get () {
                const _createdAt = this.getDataValue('createdAt');
                const _formatDateTime = options.formatDateTime === undefined ? true : options.formatDateTime;
                return _createdAt && _formatDateTime
                    ? moment(_createdAt).format('YYYY-MM-DD HH:mm:ss')
                    : _createdAt;
            },
        },
        updatedAt: {
            type: DATE(),
            field: 'updated_at',
            get () {
                const _updatedAt = this.getDataValue('updatedAt');
                const _formatDateTime = options.formatDateTime === undefined ? true : options.formatDateTime;
                return _updatedAt && _formatDateTime
                    ? moment(_updatedAt).format('YYYY-MM-DD HH:mm:ss')
                    : _updatedAt;
            },
        },
    };

    return options.hideDefaultArribute == true ? {} : defaultAttributes || {};
}
