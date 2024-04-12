import request from '../utils/reqRepInterceptors'

export function login(data) {
    console.log(data)
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}