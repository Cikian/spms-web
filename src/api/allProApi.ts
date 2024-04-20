import request from '../utils/reqRepInterceptors'

export function addPro(data) {
    return request({
        url: '/pro',
        method: 'post',
        data
    })
}

export function getProList() {
    return request({
        url: '/pro',
        method: 'get',
    })
}