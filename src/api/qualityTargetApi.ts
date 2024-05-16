import request from '../utils/reqRepInterceptors'

export function queryTargetList(data, condition) {
    return request({
        url: '/qualityTarget/list?page=' + data.page + '&size=' + data.size,
        method: 'post',
        data: condition
    })
}

export function addTarget(data) {
    return request({
        url: '/qualityTarget/add',
        method: 'post',
        data
    })
}

export function deleteTarget(data) {
    return request({
        url: '/qualityTarget/delete',
        method: 'post',
        data
    })
}

export function queryTarget(data) {
    return request({
        url: '/qualityTarget/queryById/'+data,
        method: 'get',
    })
}


export function updateTarget(data) {
    return request({
        url: '/qualityTarget/update',
        method: 'post',
        data
    })
}
