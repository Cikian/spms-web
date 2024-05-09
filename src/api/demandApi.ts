import request from '../utils/reqRepInterceptors'

export function queryDemandTypes() {
    return request({
        url: '/dictionaryData/queryByTypeId/1788120802536046593',
        method: 'get',
    })
}

export function queryDemandSource() {
    return request({
        url: '/dictionaryData/queryByTypeId/1788140939901153282',
        method: 'get',
    })
}

export function queryDemandMembers(proId) {
    return request({
        url: '/user/queryProjectMembers/' + proId + '/0',
        method: 'get',
    })
}