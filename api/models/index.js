/**
 * Created by bingofree.
 */
const { readdirSync, statSync } = require('fs');
const { join } = require('path');
const Sequelize = require('sequelize');
const { DB } = require('config');
const operatorsAliases = require('../config/operators_aliases');

const sequelize = new Sequelize(DB.database, DB.username, DB.password, {
    ...DB,
    operators: operatorsAliases,
});
const db = {};

const _excludeFiles = ['index.js', 'base.js'];

readDirSync(__dirname);

Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

function readDirSync (dirname) {
    readdirSync(dirname)
        .filter((file) => file.indexOf('.') !== 0 && !_excludeFiles.includes(file))
        .forEach((file) => {
            const _path = join(dirname, file);
            const _fileInfo = statSync(_path);
            if (_fileInfo.isDirectory()) {
                readDirSync(_path);
            } else {
                const model = require(_path)(sequelize, Sequelize.DataTypes);
                db[model.name] = model;
            }
        });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
