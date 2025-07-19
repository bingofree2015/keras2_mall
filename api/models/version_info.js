const base = require('./base');

module.exports = (sequelize, DataTypes) => {
    const VersionInfo = base(
        sequelize,
        DataTypes,
        'VersionInfo',
        {
            appName: {
                type: DataTypes.STRING(36),
                field: 'app_name',
                comment: '应用名称',
            },
            minVersion: {
                type: DataTypes.STRING(12),
                field: 'min_version',
                comment: '最低兼容版本',
            },
            currentVersion: {
                type: DataTypes.STRING(12),
                field: 'current_version',
                comment: '当前版本',
            },
            description: {
                type: DataTypes.STRING(1024),
                comment: '升级说明',
            },
            wgtUrl: {
                type: DataTypes.STRING(128),
                field: 'wgt_url',
                comment: 'wgt 包的下载地址，用于 wgt 方式更新',
            },
            pkgUrl: {
                type: DataTypes.STRING(128),
                field: 'pkg_url',
                comment: 'apk/ipa 包的下载地址或 AppStore 地址，用于整包升级的方式',
            },
        },
        { hideDefaultArribute: true, comment: 'app版本升级信息' },
    );

    return VersionInfo;
};
