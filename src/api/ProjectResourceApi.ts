import request from '../utils/reqRepInterceptors'

export function getProjectMembers(data) {
    return request({
        url: '/projectResource/getMembersByProId',
        method: 'get',
        params: data
    })
}

export function getProjectDevices(data) {
    return request({
        url: '/projectResource/getDevicesByProId',
        method: 'get',
        params: data
    })
}