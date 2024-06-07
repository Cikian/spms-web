import request from '../utils/reqRepInterceptors'

export function queryUserList(data, userDTO) {
    return request({
        url: '/user/list?page=' + data.page + '&size=' + data.size,
        method: 'post',
        data: userDTO
    })
}

export function sendEmailCode(data) {
    return request({
        url: '/user/sendEmailCode',
        method: 'post',
        data: data
    })
}

export function verifyEmail(data) {
    return request({
        url: '/user/verifyEmail',
        method: 'post',
        data: data
    })
}

export function updatePassword(data) {
    return request({
        url: '/user/updatePassword',
        method: 'post',
        data: data
    })
}

export function retrievePassword(data) {
    return request({
        url: '/user/retrievePassword',
        method: 'post',
        data: data
    })
}

export function addUser(data) {
    return request({
        url: '/user/add',
        method: 'post',
        data: data
    })
}

export function updateStatus(data) {
    return request({
        url: '/user/updateStatus',
        method: 'post',
        data: data
    })
}

export function deleteUsers(data) {
    return request({
        url: '/user/delete',
        method: 'post',
        data: data
    })
}

export function queryById(data) {
    return request({
        url: '/user/queryById/' + data,
        method: 'get',
    })
}

export function queryCurrentUser() {
    return request({
        url: '/user/queryCurrentUser',
        method: 'get',
    })
}

export function updateUserBaseInfo(data) {
    return request({
        url: '/user/updateUserBaseInfo',
        method: 'post',
        data
    })
}

export function updateUserAvatar(data) {
    return request({
        url: '/common/upload/avatar',
        method: 'post',
        data
    })
}

export function queryProjectTestMember(data) {
    return request({
        url: '/user/queryProjectMembers/' + data + '/4',
        method: 'get'
    })
}