import request from '../utils/reqRepInterceptors'

export function queryTestPlanList(data, condition, type) {
    return request({
        url: '/testPlan/list?page=' + data.page + '&size=' + data.size + '&type=' + type,
        method: 'post',
        data: condition
    })
}

export function queryTestPlanById(data) {
    return request({
        url: '/testPlan/queryById/' + data,
        method: 'get',
    })
}

export function addTestPlan(data) {
    return request({
        url: '/testPlan/add',
        method: 'post',
        data
    })
}

export function addTestCase(data) {
    return request({
        url: '/testCase/add',
        method: 'post',
        data
    })
}

export function queryTestCaseByPlanId(data) {
    return request({
        url: '/testCase/list/' + data,
        method: 'get',
    })
}

export function updateTestPlan(data) {
    return request({
        url: '/testPlan/update',
        method: 'post',
        data
    })
}