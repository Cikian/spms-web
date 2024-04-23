import request from '../utils/reqRepInterceptors'

export function queryRoleHasMenu(data) {
    return request({
        url: '/roleMenu/queryRoleHasMenu/' + data,
        method: 'get'
    })
}

export function assignPermissions(data) {
    return request({
        url: '/roleMenu/assignPermissions?roleId=' + data.roleId + '&menuIds=' + data.menuIds,
        method: 'post',
    })
}

export function queryAllMenus() {
    return request({
        url: '/menu/list',
        method: 'get'
    })
}

