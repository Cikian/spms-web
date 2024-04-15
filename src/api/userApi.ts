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

export function addUser(data) {
    return request({
        url: '/user/add',
        method: 'post',
        data: data
    })
}