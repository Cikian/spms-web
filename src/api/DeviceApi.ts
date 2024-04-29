import request from '../utils/reqRepInterceptors'

export function queryDeviceList(data, deviceQueryCondition) {
    return request({
        url: '/device/list?page=' + data.page + '&size=' + data.size,
        method: 'post',
        data: deviceQueryCondition
    })
}

export function updateStatus(data) {
    return request({
        url: '/device/updateStatus',
        method: 'post',
        data: data
    })
}

export function addDevice(data) {
    return request({
        url: '/device/add',
        method: 'post',
        data: data
    })
}

export function queryDeviceById(data) {
    return request({
        url: '/device/queryById/' + data,
        method: 'get'
    })
}

export function updateDeviceInfo(data) {
    return request({
        url: '/device/updateInfo',
        method: 'post',
        data: data
    })
}