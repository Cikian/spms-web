import request from '../utils/reqRepInterceptors'

export function queryRoleList(data) {
    return request({
        url: '/role/list?page=' + data.page + '&size=' + data.size,
        method: 'get'
    })
}

export function queryUserHasRole(data) {
    return request({
        url: '/roleUser/queryUserHasRole/' + data,
        method: 'get'
    })
}

export function assignRole(data) {
    return request({
        url: '/roleUser/assignRole?userId=' + data.userId + '&roleIds=' + data.roleIds,
        method: 'post'
    })
}

export function updateStatus(data) {
    return request({
        url: '/role/updateStatus',
        method: 'post',
        data: data
    })
}

export function deleteRoles(data) {
    return request({
        url: '/role/delete',
        method: 'post',
        data: data
    })
}

export function addRole(data) {
    return request({
        url: '/role/add',
        method: 'post',
        data: data
    })
}

export function queryById(data) {
    return request({
        url: '/role/queryById/' + data,
        method: 'get',
    })
}

export function updateRoleInfo(data) {
    return request({
        url: '/role/updateRoleInfo',
        method: 'post',
        data
    })
}