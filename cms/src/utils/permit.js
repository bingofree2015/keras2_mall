import store from '@/store'
/**
 * 判断用户是否拥有操作权限
 * 根据传入的权限标识，查看是否存在用户权限标识集合
 * @param perms
 */
export function hasPermit (perms) {
    let _hasPermit = false
    const _permits = store.state.loginUser.perms
    for (let i = 0, len = _permits.length; i < len; i++) {
        if (_permits[i] === perms) {
            _hasPermit = true
            break
        }
    }
    return _hasPermit
}
