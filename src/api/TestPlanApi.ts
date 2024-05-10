import request from '../utils/reqRepInterceptors'

export function queryTestPlanList(data, condition, type) {
    return request({
        url: '/testPlan/list?page=' + data.page + '&size=' + data.size + '&type=' + type,
        method: 'post',
        data: condition
    })
}

export function addTestPlan(data) {
    return request({
        url: '/testPlan/add',
        method: 'post',
        data
    })
}