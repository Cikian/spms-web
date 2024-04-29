import request from '../utils/reqRepInterceptors'

export function queryResourceList(data, resourceQueryCondition) {
    return request({
        url: '/ratedTimeCost/list?page=' + data.page + '&size=' + data.size,
        method: 'post',
        data: resourceQueryCondition
    })
}

export function queryResourceCostById(data) {
    return request({
        url: '/ratedTimeCost/queryById/' + data,
        method: 'get',
    })
}

export function updateCost(data) {
    return request({
        url: '/ratedTimeCost/updateCost',
        method: 'post',
        data: data
    })
}