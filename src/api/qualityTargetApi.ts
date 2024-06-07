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
        url: '/qualityTarget/queryById/' + data,
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

export function queryProTarget(data) {
    return request({
        url: '/qualityTargetRequirement/byPro/' + data,
        method: 'get'
    })
}

export function addDemandTarget(data) {
    return request({
        url: '/qualityTargetRequirement/add',
        method: 'post',
        data
    })
}

export function deleteDemandTarget(data) {
    return request({
        url: '/qualityTargetRequirement/delete/' + data.demandId + '/' + data.targetId,
        method: 'post',
    })
}