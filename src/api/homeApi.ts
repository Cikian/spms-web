import request from '../utils/reqRepInterceptors'

export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}