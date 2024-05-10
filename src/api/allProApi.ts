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

export function getProListByStatus(data) {
    return request({
        url: '/pro/getProjectByStatus/' + data,
        method: 'get',
    })
}

export function getAddMembers() {
    return request({
        url: '/user/queryCanAddToProject',
        method: 'get',
    })
}