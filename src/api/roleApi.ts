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