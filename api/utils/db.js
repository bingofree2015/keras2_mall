const fs = require('fs');
const cmd = require('node-cmd');


class DB {
    constructor () {
        this._instance = null;
    }

    /**
   * 备份数据库
   * @param {*} options
   */
    async backup (options, backupPath) {
        const _promise = new Promise((resolve, reject) => {
            const _backCmd = `/Applications/MAMP/Library/bin/mysqldump -h ${options.host} -u ${options.username} -P ${options.port} -p'${options.password}' ${options.database}>${backupPath}`;
            // mysqldump -hlocalhost -uroot -P8889 -p'enky123!@#'  coupon_mall>./coupon_mall-data.sql
            // mysqldump -h192.168.1.100 -p 3306 -uroot -ppassword --database cmdb | gzip > /data/backup/cmdb.sql.gz
            cmd.get(_backCmd, (err, data, stderr) => {
                if (!err) {
                    resolve(`备份完成:${JSON.stringify(data)}`);
                } else {
                    reject(err);
                }
            });
        });
        return _promise;
    }

    /**
   * 数据库还原
   * @param {*} options
   */
    async restore (options, backupPath) {
        const _promise = new Promise((resolve, reject) => {
            let _restoreCmd;

            if (
                !options.username ||
        !options.host ||
        !backupPath ||
        !options.database ||
        !options.password
            ) {
                const error = new Error('Dump path doesn\'t exists');
                error.name = 'InvalidPath';
                reject(error);
            } else {
                fs.exists(backupPath, (exists) => {
                    if (!exists) {
                        reject('Dump sql path doesn\'t exists');
                    } else {
                        _restoreCmd = `/Applications/MAMP/Library/bin/mysql -h ${options.host} -P${options.port} -u ${options.username} -p'${options.password}' ${options.database} <${backupPath}`;
                        cmd.get(_restoreCmd, (err, data, stderr) => {
                            if (!err) {
                                resolve('Db dump file restored successfully');
                            } else {
                                reject(err);
                            }
                        });
                    }
                });
            }
        });
        return _promise;
    }

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new DB();
        }
        return this._instance;
    }
}

module.exports = DB.getInstance();
