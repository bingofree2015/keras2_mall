import axios from '@/api/axios';
/*
 * 注册用户模块
 */
// 保存
const save = (data) => {
    return axios({ url: '/cms/user/save', method: 'post', data });
};
// 删除
const destroy = (data) => {
    return axios({ url: '/cms/user/delete', method: 'post', data });
};
// 分页查询
const list = (data) => {
    return axios({ url: '/cms/user/list', method: 'post', data });
};

export default { save, destroy, list };
