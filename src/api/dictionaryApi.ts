import request from '../utils/reqRepInterceptors'

export function queryDictionaryTypeList(data, queryCondition) {
    return request({
        url: '/dictionaryType/list?page=' + data.page + '&size=' + data.size,
        method: 'post',
        data: queryCondition
    })
}

export function queryDictionaryTypeById(data) {
    return request({
        url: '/dictionaryType/queryById/' + data,
        method: 'get',
    })
}

export function queryDictionaryDataByTypeId(data) {
    return request({
        url: '/dictionaryData/queryByTypeId/' + data,
        method: 'get',
    })
}

export function addDictionaryData(data) {
    return request({
        url: '/dictionaryData/add',
        method: 'post',
        data: data
    })
}

export function deleteDictionaryData(data) {
    return request({
        url: '/dictionaryData/delete/' + data,
        method: 'get',
    })
}